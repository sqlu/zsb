import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Roll
 * This command simulates a dice roll with the specified number of faces
 */

const rollCommand: SlashCommand = {
  name: "roll",
  description: "Simulates a dice roll with a specified number of faces.",
  description_localizations: {
    fr: "Simule un lancer de dé avec un nombre de faces spécifié.",
  },
  options: [
    {
      name: "faces",
      description: "The number of faces on the dice.",
      type: 4,
      description_localizations: {
        fr: "Le nombre de faces du dé.",
      },
      required: true,
      min_value: 2,
      max_value: 100,
    },
  ],

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const faces = interaction.options.getInteger("faces")!;

    const rollResult = Math.floor(Math.random() * faces) + 1;

    interaction.editReply({
      content: `${rollResult} !`,
    });

    return;
  },
};

export default rollCommand;
