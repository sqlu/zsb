import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  StringSelectMenuBuilder,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Create
 * This command allows the selfbot user to create a rich presence
 */

const createCommand: SlashCommand = {
  name: "create",
  description: "Allows you to create a rich presence",
  description_localizations: {
    fr: "Permet de créer une rich presence",
  },
  cooldown: 15000,
  options: [
    {
      name: "name",
      description: "The name of the rich presence",
      description_localizations: {
        fr: "Le nom de la rich presence",
      },
      max_length: 32,
      min_length: 3,
      type: 3,
      required: true,
    },
    {
      name: "image",
      description: "The image of the rich presence",
      description_localizations: {
        fr: "L'image de la rich presence",
      },
      type: 11,
      required: false,
    },
  ],

  execute: async (
    manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (selfbot.richPresences.size >= 5) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "Vous ne pouvez pas avoir plus de 5 RichPresence !"
            : "You can't have more than 5 RichPresence!",
      });
      return;
    }

    const name = interaction.options.getString("name")!;

    if (selfbot.richPresences.has(name)) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `La rich presence \`${name}\` existe déjà!`
            : `The RichPresence \`${name}\` already exists!`,
      });
      return;
    }

    const image = interaction.options.getAttachment("image");

    if (
      image &&
      !["png", "jpeg", "jpg", "gif"].includes(image.contentType?.split("/")[1]!)
    ) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "L'image doit être au format PNG, JPEG, GIF ou JPG !"
            : "The image must be in PNG, JPEG, GIF or JPG format!",
      });

      return;
    }

    const id = Math.floor(Math.random() * 10000).toString();

    manager.cache.set(`rpc-${id}`, { name, image: image?.url ?? "" });

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`rpc_type_select-${id}`)
      .setPlaceholder(
        interaction.locale === "fr"
          ? "Sélectionnez le type de Rich Presence"
          : "Select the type of Rich Presence"
      )
      .addOptions([
        {
          label:
            interaction.locale === "fr"
              ? "› 🎮 Entrain de jouer"
              : "› 🎮 Playing",
          value: "PLAYING",
          description:
            interaction.locale === "fr"
              ? "Permet d'apparaître comme en train de jouer"
              : "Allows you to appear as playing",
        },
        {
          label:
            interaction.locale === "fr"
              ? "› 🎧 Entrain de écouter"
              : "› 🎧 Listening",
          value: "LISTENING",
          description:
            interaction.locale === "fr"
              ? "Permet d'apparaître comme en train de écouter"
              : "Allows you to appear as listening",
        },
        {
          label:
            interaction.locale === "fr"
              ? "› 👀 Entrain de regarder"
              : "› 👀 Watching",
          value: "WATCHING",
          description:
            interaction.locale === "fr"
              ? "Permet d'apparaître comme en train de regarder"
              : "Allows you to appear as watching",
        },
        {
          label:
            interaction.locale === "fr"
              ? "› 🏆 Entrain de participer"
              : "› 🏆 Competing",
          value: "COMPETING",
          description:
            interaction.locale === "fr"
              ? "Permet d'apparaître comme en train de participer"
              : "Allows you to appear as competing",
        },
        {
          label:
            interaction.locale === "fr"
              ? "› 🎥 Entrain de streamer"
              : "› 🎥 Streaming",
          value: "STREAMING",
          description:
            interaction.locale === "fr"
              ? "Permet d'apparaître comme en train de streamer"
              : "Allows you to appear as streamING",
        },
        /*{
          label:
            interaction.locale === "fr" ? "› ⚡ Personnalisé" : "› ⚡ Custom",
          value: "CUSTOM",
          description:
            interaction.locale === "fr"
              ? "Permet d'apparaître avec une activité personnalisée"
              : "Allows you to appear with a custom Rich Presence type",
        },*/
      ]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu
    );

    await interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Sélectionnez le type d'activité pour votre Rich Presence :`
          : `Select the type of activity for your Rich Presence:`,
      components: [row],
    });
  },
};

export default createCommand;
