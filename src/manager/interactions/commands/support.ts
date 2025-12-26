import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { SlashCommand } from "../../../types/slashCommand";
import { Manager } from "../../index";

/*
 * Command Support
 * This command allows the selfbot user to join the support server
 */

const supportCommand: SlashCommand = {
  name: "support",
  description: "Allows you to join the support server",
  description_localizations: {
    fr: "Permet de rejoindre le serveur support.",
  },

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const supportButton = new ButtonBuilder()
      .setLabel("› Support")
      .setURL(process.env.SUPPORT_URL!)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      supportButton
    );

    interaction.editReply({
      components: [row],
    });

    return;
  },
};

export default supportCommand;
