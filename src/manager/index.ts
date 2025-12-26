import { PrismaClient } from "@prisma/client";
import {
  APIEmbed,
  ApplicationCommandOptionType,
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  WebhookClient,
} from "discord.js";
import * as fs from "node:fs";
import * as path from "node:path";
import { Selfbot } from "../selfbot/index";
import type { Option, SlashCommand } from "../types/slashCommand";

const express = require("express");
const cors = require("cors");

const db = new PrismaClient();

class Manager extends Client<true> {
  public commands: Collection<string, SlashCommand> = new Collection();
  public cooldowns: Collection<string, number> = new Collection();
  public rest: REST;

  public tokens: string[] = [];
  public selfbots: Map<string, Selfbot> = new Map();

  public cache: Map<string, any> = new Map();

  private webhook: WebhookClient;

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
      ],
    });

    this.webhook = new WebhookClient({
      url: process.env.WEBHOOK_URL!,
    });

    this.rest = new REST({ version: "10" }).setToken(
      process.env.APPLICATION_TOKEN!
    );

    this._init(process.env.APPLICATION_TOKEN!);
    this.loadEvents();
  }

  async _init(token: string) {
    super.login(token).catch(async (error) => {
      console.error(error);
      process.exit(1);
    });
  }

  async loadEvents() {
    const events = fs
      .readdirSync("dist/manager/events")
      .filter((file: string) => file.endsWith(".js"));

    const promises = events.map(async (file) => {
      const { default: event } = await import(`./events/${file}`);
      return [event.name, (...args: any) => event.execute(this, ...args)];
    });

    for (const [name, handler] of await Promise.all(promises)) {
      this.on(name, handler);
    }
  }

  async loadCommands() {
    const commandsPath = path.join(__dirname, "interactions/commands");
    const commandsOrMainCommands = fs.readdirSync(commandsPath);
    const commandData: any[] = [];

    const commandPromises = commandsOrMainCommands.map(
      async (commandOrMainCommand) => {
        const commandPath = path.join(commandsPath, commandOrMainCommand);

        if (
          fs.statSync(commandPath).isFile() &&
          commandOrMainCommand.endsWith(".js")
        ) {
          const { default: command }: { default: SlashCommand } = await import(
            commandPath
          );
          if (command?.name && command?.description) {
            this.commands.set(command.name, command);
            return {
              name: command.name,
              description: command.description,
              description_localizations: command.description_localizations,
              integration_types: [1],
              contexts: [0, 1, 2],
              options: command.options
                ? command.options.map((option) => ({
                    ...option,
                    // Si l'option possède une méthode autocomplete, on renvoie true pour le flag
                    autocomplete: option.autocomplete ? true : undefined,
                  }))
                : [],
            };
          } else {
            console.warn(
              `[WARN] The file of command ${commandOrMainCommand} does not have the properties "name" and/or "description".`
            );
          }
        } else if (fs.statSync(commandPath).isDirectory()) {
          const subCommands = fs.readdirSync(commandPath);
          const mainCommand: any = {
            name: commandOrMainCommand,
            description: `${commandOrMainCommand}`,
            integration_types: [1],
            contexts: [0, 1, 2],
            options: [] as Option[],
          };

          for (const subCommandFile of subCommands) {
            if (!subCommandFile.endsWith(".js")) continue;

            const subCommandPath = path.join(commandPath, subCommandFile);
            const { default: subCommand }: { default: SlashCommand } =
              await import(subCommandPath);

            if (subCommand?.name && subCommand?.description) {
              const subCommandData: any = {
                name: subCommand.name,
                description: subCommand.description,
                description_localizations: subCommand.description_localizations,
                type: ApplicationCommandOptionType.Subcommand,
                options: subCommand.options
                  ? subCommand.options.map((option) => ({
                      ...option,
                      autocomplete: option.autocomplete ? true : undefined,
                    }))
                  : [],
              };

              mainCommand.options.push(subCommandData);
              this.commands.set(
                `${commandOrMainCommand}:${subCommand.name}`,
                subCommand
              );
            } else {
              console.warn(
                `[WARN] The file ${subCommandFile} in the folder ${commandOrMainCommand} is missing required properties.`
              );
            }
          }
          return mainCommand;
        }
      }
    );

    for (const command of await Promise.all(commandPromises)) {
      if (command) {
        commandData.push(command);
      }
    }

    try {
      await this.rest.put(
        Routes.applicationCommands(process.env.APPLICATION_ID!),
        { body: commandData }
      );
      console.log(
        `All commands have been reloaded (total: ${this.commands.size})`
      );
    } catch (error) {
      console.error(error);
    }
  }

  async initSelfbots(tokens: string[]): Promise<void> {
    this.tokens = tokens;
    await Promise.all(this.tokens.map((token) => this.startSelfbot(token)));
  }

  async startSelfbot(token: string): Promise<Selfbot | null> {
    const selfbot = new Selfbot();
    try {
      const callback = await selfbot._connect(token);
      if (!callback) {
        this.tokens = this.tokens.filter((t) => t !== token);
        await db.selfbot.delete({ where: { token } }).catch(() => false);
        return null;
      }
      if (callback.user) {
        this.selfbots.set(callback.user.id, selfbot);
      }
      return selfbot;
    } catch (error) {
      console.error("Erreur lors de la connexion du selfbot :", error);
      return null;
    }
  }

  async stopSelfbot(id: string): Promise<void> {
    const selfbot = this.selfbots.get(id);
    if (selfbot) {
      await selfbot._disconnect();
      this.selfbots.delete(id);
    }
  }

  async restartSelfbot(id: string): Promise<void> {
    const selfbot = this.selfbots.get(id);
    if (selfbot && selfbot.token) {
      const token = selfbot.token;
      await selfbot._disconnect();
      await selfbot._connect(token);
    }
  }

  async restartAllSelfbots(): Promise<void> {
    await Promise.all(
      Array.from(this.selfbots.values()).map(async (selfbot) => {
        if (selfbot.token) {
          const token = selfbot.token;
          await selfbot._disconnect();
          await selfbot._connect(token);
        }
      })
    );
  }

  async sendPrivateMessage(id: string, message: string): Promise<void> {
    const selfbot = this.selfbots.get(id);
    if (selfbot) {
      await selfbot.user.send(message).catch(() => null);
    }
  }

  async sendWehbook(embed: APIEmbed): Promise<void> {
    await this.webhook.send({
      avatarURL:
        "https://cdn.discordapp.com/attachments/1334562420668108944/1344346705684074597/0cdcd5d2fd57e05a.jpg?ex=67c093ef&is=67bf426f&hm=4d18f25af185696ee13bb808263b67a19b76a18715505a3d47227ab27a073918&",
      embeds: [embed],
      username: "ZSB LOGS",
    });
  }

  async loadAPI(): Promise<void> {
    const app = express();
    const port = process.env.API_PORT || 50000;

    app.use(cors());

    app.use(express.json());

    app.get("/", (_req: any, res: any) => {
      res.send("Hello World!");
    });

    app.post("/api/login", async (req: any, res: any) => {
      const { token } = req.body;

      const connected = this.tokens.includes(token);

      if (connected) {
        return res.json({ type: "already_logged", token });
      }

      const sb = await this.startSelfbot(token);

      if (sb) {
        return res.json({ type: "success_login", token });
      }

      if (!sb) {
        return res.json({ type: "invalid_token", token });
      }
    });

    app.listen(port, () => {
      console.log(`API listening at http://localhost:${port}`);
    });
  }
}

export { Manager };
