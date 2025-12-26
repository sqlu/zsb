import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalSubmitInteraction,
} from "discord.js";
import { Manager } from "../../index";
import { Selfbot } from "../../../selfbot/index";
import { aiRequest } from "../../../utils/requests/ai";

const answerModal = {
  execute: async (
    manager: Manager,
    selfbot: Selfbot,
    interaction: ModalSubmitInteraction
  ) => {
    const aiLastMessage = interaction.message!.embeds[0].description?.replace(
      "`",
      ""
    );

    interaction.deferUpdate();

    const answer = interaction.fields.getTextInputValue("answer");

    const language = interaction.locale === "fr" ? "French" : "English";

    let response = undefined;
    while (response === undefined) {
      response = await aiRequest(
        `You are a Discord Selfbot named ${manager.user.displayName}, you are currently answering to "${selfbot.user.displayName}". Always answer in ${language}. Do not use "\`"`,
        `${answer}`,
        `${aiLastMessage}`
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
  },
};

export default answerModal;
