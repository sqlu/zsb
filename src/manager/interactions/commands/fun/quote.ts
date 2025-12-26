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
 * Command Quote
 * This command allows the selfbot user to get a random quote
 */

const quoteCommand: SlashCommand = {
  name: "quote",
  description: "Allows you to get a random quote.",
  description_localizations: {
    fr: "Permet d'avoir une citation aléatoire.",
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
        `Please give me a quote from a famous person.`
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
        name: "Fun - Quote",
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

export default quoteCommand;
