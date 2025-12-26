import {
  ActionRowBuilder,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const loginButton = {
  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ButtonInteraction
  ) => {
    const modal = new ModalBuilder()
      .setTitle(interaction.locale === "fr" ? "› Connexion" : "› Login")
      .setCustomId("login_modal")
      .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
          new TextInputBuilder()
            .setCustomId("token")
            .setLabel("Token")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        )
      );

    await interaction.showModal(modal);
  },
};

export default loginButton;
