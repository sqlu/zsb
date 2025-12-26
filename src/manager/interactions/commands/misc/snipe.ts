import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
  userMention,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Snipe
 * This command allows the selfbot user to see the last deleted message in a channel.
 */

const snipeCommand: SlashCommand = {
  name: "snipe",
  description: "Allows you to see the last deleted message.",
  description_localizations: {
    fr: "Permet de voir le dernier message supprimer.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const channelId = interaction.channelId;

    const snipe = selfbot.snipes.get(channelId);

    if (!snipe) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Aucun message n'a été supprimé dans ce salon.`
            : `No messages have been deleted in this channel.`,
      });
      return;
    }

    const snipeEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `${snipe.author.displayName} — Snipe`,
        iconURL: snipe.author.displayAvatarURL(),
      })
      .setDescription(
        `> ${userMention(snipe.author!.id)} <t:${Math.floor(
          snipe.createdTimestamp / 1000
        )}:R>\n> \n> __**Contenu**__\n> \`\`\`${snipe.content}\`\`\``
      );

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

    await interaction.editReply({
      embeds: [snipeEmbed],
      components: [row],
    });

    return;
  },
};

export default snipeCommand;
