import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { SlashCommand } from "../../../types/slashCommand";
import { Manager } from "../../index";
/*
 * Command Ping
 * This command return the latence the bot's and the selfbot user ping
 */

const pingCommand: SlashCommand = {
  name: "ping",
  description: "Shows your ping and the bot's ping.",
  description_localizations: {
    fr: "Affiche votre ping ainsi que celui du bot.",
  },

  execute: async (
    manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    const callback = await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const RESTPing = callback.createdTimestamp - interaction.createdTimestamp;
    const WSPing = selfbot.ws.ping;
    const RESTPingText =
      interaction.locale === "fr"
        ? `Cela correspond au temps de réponse du bot.`
        : `It corresponds to the bot's response time.`;
    const WSPingText =
      interaction.locale === "fr"
        ? `Cela correspond à votre temps de réponse.`
        : `It corresponds to your response time.`;

    const pingEmbed = new EmbedBuilder()
      .setColor("#2f3136")
      .setAuthor({
        name: "Pong! 🏓",
        iconURL: manager.user.avatarURL()!,
      })
      .setDescription(
        `> __**REST:**__ **\`${RESTPing}ms\`**\n-# ➜ ${RESTPingText}\n> __**WS:**__ **\`${WSPing}ms\`**\n-# ➜ ${WSPingText}`
      );

    interaction.editReply({
      embeds: [pingEmbed],
    });

    return;
  },
};

export default pingCommand;
