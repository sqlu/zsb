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
 * Command Coin Flip
 * This command allows the selfbot user to flip a coin
 */

const coinFlipCommand: SlashCommand = {
  name: "coinflip",
  description: "Allows you to flip a coin.",
  description_localizations: {
    fr: "Permet de lancer une pièce.",
  },

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const index = Math.floor(Math.random() * 2);

    const englishWords = ["Heads", "Tails"];
    const frenchWords = ["Face", "Pile"];

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
      content:
        interaction.locale === "fr"
          ? frenchWords[index] + " !"
          : englishWords[index] + "!",
      components: [row],
    });

    return;
  },
};

export default coinFlipCommand;
