import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Fake Token
 * This command allows the selfbot user to generate a fake token
 */

const fakeTokenCommand: SlashCommand = {
  name: "faketoken",
  description: "Allows you to generate a fake token.",
  description_localizations: {
    fr: "Permet de générer un faux token.",
  },

  execute: async (
    manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const token =
      Math.random().toString(36).substring(2, 50) +
      Math.random().toString(36).substring(2, 50) +
      Math.random().toString(36).substring(2, 50) +
      Math.random().toString(36).substring(2, 50) +
      Math.random().toString(36).substring(2, 50);

    const responseEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: "Fun - Fake T0ken",
        iconURL: manager.user.displayAvatarURL(),
      })
      .setDescription(`\`\`\`${token}\`\`\``);

    interaction.editReply({
      embeds: [responseEmbed],
    });

    return;
  },
};

export default fakeTokenCommand;
