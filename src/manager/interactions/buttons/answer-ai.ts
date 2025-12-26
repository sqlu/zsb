import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const answerAIButton = {
  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ButtonInteraction
  ) => {
    const modal = new ModalBuilder()
      .setTitle(
        interaction.locale === "fr" ? "› Répondre à l'IA" : "› Answer AI"
      )
      .setCustomId("answer_modal")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("answer")
            .setLabel("answer")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);

    return;
  },
};

export default answerAIButton;
