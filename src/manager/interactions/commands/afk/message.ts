import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Message
 * This command allows the selfbot user to set up their AFK message.
 */

const messageCommand: SlashCommand = {
  name: "message",
  description: "Allows you to set up your AFK message.",
  description_localizations: {
    fr: "Permet de configurer votre message d'AFK.",
  },

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    const modal = new ModalBuilder()
      .setCustomId("afk_modal")
      .setTitle(interaction.locale === "fr" ? "Message d'AFK" : "AFK Message");

    const reasonInput = new TextInputBuilder()
      .setCustomId("message")
      .setLabel("Message")
      .setPlaceholder(
        interaction.locale === "fr"
          ? "Votre message ici..."
          : "Your message here..."
      )
      .setMaxLength(512)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
    );

    await interaction.showModal(modal);

    return;
  },
};

export default messageCommand;
