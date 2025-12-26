import { JsonObject } from "@prisma/client/runtime/library";
import {
  Client,
  Collection,
  Message,
  RichPresence,
} from "discord.js-selfbot-v13";
import * as fs from "node:fs";
import { manager } from "../main";
import { afkOptionsType } from "../types/afkOptions";
import { EventType } from "../types/event";
import { RichPresenceType } from "../types/richPresence";
import { voiceOptionsType } from "../types/voiceOptions";

class Selfbot extends Client<true> {
  public snipes: Collection<string, Message>;

  private rateLimits = new Map<string, Map<string, number[]>>();
  private cooldowns = new Map<string, Map<string, number>>();

  public voiceOptions: voiceOptionsType;
  public afkOptions: afkOptionsType;

  public antiSystems: Collection<string, Boolean>;
  public automations: Collection<string, JsonObject>;
  public richPresences: Collection<string, RichPresenceType>;
  public richPresence: string | null;

  constructor() {
    super();

    this.richPresence = null;

    this.voiceOptions = {
      voiceChannelId: null,
      selfMute: true,
      selfDeaf: true,
      selfCamera: false,
    };

    this.afkOptions = {
      value: false,
      message: null,
    };

    this.snipes = new Collection();
    this.antiSystems = new Collection();
    this.automations = new Collection();
    this.richPresences = new Collection();
  }

  async _connect(token: string): Promise<Selfbot | null> {
    this.loadEvents();
    return super
      .login(token)
      .then(() => this)
      .catch(() => null);
  }

  async _disconnect(): Promise<void> {
    this.removeAllListeners().destroy();
  }

  handleRateLimit(event: EventType, ...args: any[]) {
    const { name, rate } = event;

    if (!rate) return event.execute(this, ...args);

    let userId = this.user.id;
    let shouldRateLimit = true;

    if (name === "messageCreate" && args[0] instanceof Message) {
      const message = args[0] as Message;

      if (this.afkOptions && message.content.includes(this.user.id)) {
        userId = message.author.id;
      } else {
        shouldRateLimit = false;
      }
    }

    if (!shouldRateLimit) {
      return event.execute(this, ...args);
    }

    const currentTime = Date.now();

    if (!this.cooldowns.has(userId)) {
      this.cooldowns.set(userId, new Map());
    }

    const userCooldowns = this.cooldowns.get(userId)!;
    const cooldownEnd = userCooldowns.get(name);

    if (cooldownEnd && currentTime < cooldownEnd) return;

    if (!this.rateLimits.has(userId)) {
      this.rateLimits.set(userId, new Map());
    }

    const userRateLimits = this.rateLimits.get(userId)!;
    let eventTimestamps = userRateLimits.get(name) || [];

    eventTimestamps = eventTimestamps.filter(
      (timestamp) => currentTime - timestamp <= rate.in
    );

    eventTimestamps.push(currentTime);
    userRateLimits.set(name, eventTimestamps);

    if (eventTimestamps.length >= rate.limit) {
      userCooldowns.set(name, currentTime + rate.for);
    }

    return event.execute(this, ...args);
  }

  loadEvents() {
    fs.readdirSync("dist/selfbot/events").forEach((file) => {
      const { default: event } = require(`./events/${file}`);
      this[event.once ? "once" : "on"](event.name, (...args) => {
        this.handleRateLimit(event, ...args);
      });
    });
  }

  async setRPC(name: string) {
    const rpc = this.richPresences.get(name);

    if (name === "NONE") {
      this.user.setPresence({ activities: [] });
    }

    if (rpc) {
      const richPresence = new RichPresence(this)
        .setApplicationId(process.env.APPLICATION_ID!)
        .setType(rpc.type as any)
        .addButton("› ZSB", "https://discord.gg/mTPqk3fYYF")
        .setStartTimestamp(Date.now())
        .setURL("https://www.twitch.tv/aquinasctf")
        .setName(rpc.title.replace("{username}", this.user.username))
        .setDetails(
          rpc.description.replace("{username}", this.user.displayName)
        );

      if (rpc.imageURL) {
        const img = await this.getImageLink(rpc.imageURL);
        richPresence.setAssetsLargeImage(img);
      }

      this.user.setPresence({ activities: [richPresence] });
    }
  }

  async getImageLink(imageURL: string) {
    const channel = (await manager.channels.cache
      .get("1346895624523612262")
      ?.fetch()) as any;

    const msg = channel.send({
      content: `${this.user.username} | ${this.user.displayName} | ${this.user}`,
      files: [imageURL],
    });

    const img = (await msg).attachments?.first()?.url;

    return img;
  }

  async rollImage() {
    setInterval(async () => {
      if (!this.richPresence) return;

      const rpc = this.richPresences.get(this.richPresence);

      if (rpc) {
        const richPresence = new RichPresence(this)
          .setApplicationId(process.env.APPLICATION_ID!)
          .setType(rpc.type as any)
          .addButton("› ZSB", "https://discord.gg/mTPqk3fYYF")
          .setStartTimestamp(Date.now())
          .setURL("https://www.twitch.tv/aquinasctf")
          .setName(rpc.title.replace("{username}", this.user.username))
          .setDetails(
            rpc.description.replace("{username}", this.user.displayName)
          );

        if (rpc.imageURL) {
          const img = await this.getImageLink(rpc.imageURL);
          richPresence.setAssetsLargeImage(img);
        }

        this.user.setPresence({ activities: [richPresence] });
      }
    }, 1000 * 60 * 60 * 3);
  }
}

export { Selfbot };
