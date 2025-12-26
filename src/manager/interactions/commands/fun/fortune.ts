import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { aiRequest } from "../../../../utils/requests/ai";
import { Manager } from "../../../index";

/*
 * Command Fortune
 * This command allows the selfbot user to get a random fortune.
 */

const fortuneCommand: SlashCommand = {
  name: "fortune",
  description: "Allows you to get a random fortune.",
  description_localizations: {
    fr: "Permet d'avoir une fortune aléatoire.",
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
        `Please provide a random fortune or motivational quote.`
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
        name: "Fun - Fortune",
        iconURL: manager.user.displayAvatarURL(),
      })
      .setDescription(`\`\`\`${response}\`\`\``);

    interaction.editReply({
      embeds: [responseEmbed],
    });

    return;
  },
};

export default fortuneCommand;
