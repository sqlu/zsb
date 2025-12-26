import { Message } from "discord.js-selfbot-v13";
import { Selfbot } from "../../selfbot/index";
import { EventType } from "../../types/event";

const event: EventType = {
  name: "messageCreate",
  once: false,
  rate: {
    limit: 5,
    in: 5000,
    for: 30000,
  },

  async execute(client: Selfbot, message: Message) {
    if (!message.author) return;
    if (message.author.id === client.user.id) return;

    if (
      client.antiSystems?.get("antiPing") &&
      (message.content.includes(client.user.id))
    ) {
      await message.markRead();
    }

    if (
      client.antiSystems?.get("antiEveryone") &&
      (message.content.includes("@everyone") ||
      message.content.includes("@here"))
    ) {
      await message.markRead();
    }

    if (
      client.antiSystems?.get("antiPartnerPing") &&
      message.channel.type === "GUILD_TEXT"
    ) {
      const channelName = message.channel.name.toLowerCase();
      const isGiveawayChannel =
        channelName.includes("partner") ||
        channelName.includes("partenariat")

      if (
        isGiveawayChannel &&
        (message.content.includes(client.user.id) ||
          message.content.includes("@everyone") ||
          message.content.includes("@here"))
      ) {
        await message.markRead();
      }
    }

    if (
      client.antiSystems?.get("antiGiveawayPing") &&
      message.channel.type === "GUILD_TEXT"
    ) {
      const channelName = message.channel.name.toLowerCase();
      const isGiveawayChannel =
        channelName.includes("giveaway") ||
        channelName.includes("gw") ||
        channelName.includes("nitro") ||
        channelName.includes("🎉") ||
        channelName.includes("🎁") ||
        channelName.includes("event") ||
        channelName.includes("evenement");

      if (
        isGiveawayChannel &&
        (message.content.includes(client.user.id) ||
          message.content.includes("@everyone") ||
          message.content.includes("@here"))
      ) {
        await message.markRead();
      }
    }

    if (client.afkOptions?.value && message.content.includes(client.user.id)) {
      await message.markRead();
      await message.reply(client.afkOptions.message ?? "I am currently AFK.").catch(() => false);
    }

    if (message.channel.type === "DM") {
      if (client.antiSystems?.get("antiMp")) {
        await message.markRead();
        await message.channel.delete();
        return;
      }

      if (client.antiSystems?.get("antiBotMp") && message.author.bot) {
        if (message.interaction) return;
        await message.markRead();
        await message.channel.delete();
        return;
      }

      if (
        client.antiSystems?.get("antiPubMp") &&
        message.content.includes("discord.gg/")
      ) {
        await message.markRead();
        await message.channel.delete();
        return;
      }
    }
  },
};

export default event;
