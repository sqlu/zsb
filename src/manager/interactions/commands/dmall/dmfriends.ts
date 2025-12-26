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
 * Command Friends
 * This command allows the selfbot user to dm all their friends.
 */

const friendsCommand: SlashCommand = {
  name: "friends",
  description: "Allow you to send a message to all your friends",
  description_localizations: {
    fr: "Permet d'envooer un message à tous vos amis.",
  },
  cooldown: 10 * 60000,

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    const modal = new ModalBuilder()
      .setTitle(interaction.locale === "fr" ? "› DM amis" : "› DM friends")
      .setCustomId("dmfriends_modal");

    const messageInput = new TextInputBuilder()
      .setCustomId("message")
      .setLabel(
        interaction.locale === "fr"
          ? "Message DMALL Amis"
          : "DMALL Friends Message"
      )
      .setRequired(true)
      .setMaxLength(512)
      .setPlaceholder(
        interaction.locale === "fr"
          ? "{user} pour mentionner votre ami"
          : "{user} to mention your friend"
      )
      .setStyle(TextInputStyle.Paragraph);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
      messageInput
    );

    modal.addComponents(row);

    await interaction.showModal(modal);

    return;
  },
};

export default friendsCommand;
