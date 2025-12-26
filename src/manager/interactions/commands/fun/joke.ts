import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { aiRequest } from "../../../../utils/requests/ai";
import { Manager } from "../../../index";

/*
 * Command Joke
 * This command allows the selfbot user to make a joke
 */

const jokeCommand: SlashCommand = {
  name: "joke",
  description: "Allows you to make a joke.",
  description_localizations: {
    fr: "Permet de faire une blague.",
  },
  cooldown: 20000,

  execute: async (
    manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const language = interaction.locale === "fr" ? "French" : "English";

    let response = undefined;
    while (response === undefined) {
      response = await aiRequest(
        `Do not use "\`". Answer in ${language}:`,
        `Please make a joke`
      );
    }

    if (!response) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Une erreur est survenue, je vous conseille de réessayer plus tard.`
            : `An error occurred, I suggest you try again later.`,
      });
      return;
    }

    const responseEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: "Fun - Joke",
        iconURL: manager.user.displayAvatarURL(),
      })
      .setDescription(`\`\`\`${response}\`\`\``);

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
      embeds: [responseEmbed],
      components: [row],
    });

    return;
  },
};

export default jokeCommand;
