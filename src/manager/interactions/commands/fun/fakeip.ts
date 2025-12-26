import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Fake Ip
 * This command allows the selfbot user to generate a fake ip
 */

const fakeIpCommand: SlashCommand = {
  name: "fakeip",
  description: "Allows you to generate a fake ip.",
  description_localizations: {
    fr: "Permet de générer une fausse ip.",
  },

  execute: async (
    manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const ip =
      Math.floor(Math.random() * 256) +
      "." +
      Math.floor(Math.random() * 256) +
      "." +
      Math.floor(Math.random() * 256) +
      "." +
      Math.floor(Math.random() * 256);

    const responseEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: "Fun - Fake IP",
        iconURL: manager.user.displayAvatarURL(),
      })
      .setDescription(`\`\`\`${ip}\`\`\``);

    interaction.editReply({
      embeds: [responseEmbed],
    });

    return;
  },
};

export default fakeIpCommand;
