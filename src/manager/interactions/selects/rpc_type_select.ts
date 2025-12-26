import {
  ActionRowBuilder,
  AnySelectMenuInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { Manager } from "../../index";

const activityTypeSelect = {
  execute: async (
    manager: Manager,
    _selfbot: Selfbot,
    interaction: AnySelectMenuInteraction
  ) => {
    const type = interaction.values[0];
    const id = interaction.customId.split("-")[1];

    manager.cache.set(`rpc-${id}`, { ...manager.cache.get(`rpc-${id}`), type });

    if (type === "CUSTOM") {
      return;
    } else {
      const modal = new ModalBuilder()
        .setCustomId(`rpc_content_modal-${id}`)
        .setTitle(
          interaction.locale === "fr"
            ? "Contenu de la Rich Presence"
            : "Rich Presence Content"
        );

      const rpcTitleInput = new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Titre de la Rich Presence")
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const rpcDescInput = new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Description de la Rich Presence")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(rpcTitleInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(rpcDescInput)
      );

      await interaction.showModal(modal);
    }

    return;
  },
};

export default activityTypeSelect;
