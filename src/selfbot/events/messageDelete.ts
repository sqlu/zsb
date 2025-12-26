import { Message } from "discord.js-selfbot-v13";
import { manager } from "../../main";
import { Selfbot } from "../../selfbot/index";
import { EventType } from "../../types/event";

const event: EventType = {
  name: "messageDelete",
  once: false,
  rate: {
    limit: 5,
    in: 1000,
    for: 5000,
  },

  execute(client: Selfbot, message: Message) {
    if (!message.author) return;
    if (message.author.bot) return;
    if (message.author.id === client.user.id) return;

    client.snipes.set(message.channel.id, message);

    if (client.antiSystems?.get("antiGhostPing")) {
      if (message.content.includes(client.user.id)) {
        message.markRead();
        manager.sendPrivateMessage(
          client.user.id,
          `You were ghost pinged in ${message.channel} by ${message.author}`
        );
      }
    }

    return;
  },
};

export default event;
