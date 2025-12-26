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
 * Command Ask
 * This command allows the selfbot user to ask a question to AI.
 */

const askCommand: SlashCommand = {
  name: "ask",
  description: "Allows you to ask AI.",
  description_localizations: {
    fr: "Permet de soumettre un prompt à l'IA.",
  },
  cooldown: 20000,
  options: [
    {
      name: "prompt",
      description: "The prompt that you want to ask AI.",
      type: 3,
      description_localizations: {
        fr: "Le prompt que vous souhaitez soumettre à l'IA.",
      },
      required: true,
    },
  ],

  execute: async (
    manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const prompt = interaction.options.getString("prompt")!;

    const language = interaction.locale === "fr" ? "French" : "English";

    let response = undefined;
    while (response === undefined) {
      response = await aiRequest(
        `You are a Discord Selfbot named ${manager.user.displayName}, you are currently answering to "${selfbot.user.displayName}". Always answer in ${language}. Do not use "\`"`,
        `${prompt}`
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
        name: "AI - Ask",
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

    const answerButton = new ButtonBuilder()
      .setLabel(interaction.locale === "fr" ? "› Répondre" : "› Answer")
      .setCustomId("answer-ai")
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      displayButton,
      answerButton
    );

    interaction.editReply({
      embeds: [responseEmbed],
      components: [row],
    });

    return;
  },
};

export default askCommand;
