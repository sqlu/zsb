import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Random
 * This command allows the selfbot user to get a random number
 */

const randomCommand: SlashCommand = {
  name: "random",
  description: "Allows you to display a random number between two values.",
  description_localizations: {
    fr: "Permet d'afficher un nombre aléatoire entre deux valeurs.",
  },
  options: [
    {
      name: "min",
      type: 4,
      description: "The minimum of the random number.",
      description_localizations: {
        fr: "Le minimum du nombre aléatoire.",
      },
      min_value: 1,
      max_length: 99,
      required: true,
    },
    {
      name: "max",
      type: 4,
      description: "The maximum of the random number.",
      description_localizations: {
        fr: "Le maximum du nombre aléatoire.",
      },
      min_value: 2,
      max_length: 100,
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const min = interaction.options.getInteger("min")!;
    const max = interaction.options.getInteger("max")!;

    if (min >= max) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "La valeur min doit être inférieure à la valeur max. "
            : "The minimum value must be lower than the maximum value. ",
      });
      return;
    }

    const randomNb = Math.floor(Math.random() * (max - min + 1)) + min;

    const displayButton = new ButtonBuilder()
      .setLabel(
        interaction.locale === "fr"
          ? "› Afficher la reponse"
          : "› Display the answer"
      )
      .setCustomId("display-ai")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      displayButton
    );

    interaction.editReply({
      content: `${randomNb} !`,
      components: [row],
    });

    return;
  },
};

export default randomCommand;
