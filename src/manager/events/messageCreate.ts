import { Message } from "discord.js-selfbot-v13";
import { Manager } from "../../manager/index";
import { EventType } from "../../types/event";

const messageCreateEvent: EventType = {
  name: "messageCreate",
  once: false,

  async execute(_manager: Manager, message: Message): Promise<any> {
    if (!process.env.APPLICATION_OWNERS!.includes(message.author.id)) return;
    if (!message.content.startsWith(process.env.APPLICATION_PREFIX!)) return;

    const commandName = message.content
      .split(" ")[0]
      .slice(process.env.APPLICATION_PREFIX!.length);

    if (commandName) {
      try {
        const command = await import(`../messages/${commandName}.js`);
        await command.default.execute(_manager, message);
      } catch {}
    }
  },
};

export default messageCreateEvent;
