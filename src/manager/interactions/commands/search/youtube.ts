import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  CollectedInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { youtubeSearchRequest } from "../../../../utils/requests/youtube";
import { Manager } from "../../../index";

/*
 * Command YouTube
 * Allows the selfbot user to search for YouTube videos.
 */

const youtubeCommand: SlashCommand = {
  name: "youtube",
  description: "Allows you to search for videos on YouTube.",
  description_localizations: {
    fr: "Permet de rechercher des vidéos sur YouTube.",
  },
  cooldown: 20000,
  options: [
    {
      name: "query",
      description: "The query to search for on YouTube.",
      type: 3,
      description_localizations: {
        fr: "La requête à rechercher sur YouTube.",
      },
      required: true,
    },
  ],

  execute: async (
    manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const data = await youtubeSearchRequest(
      interaction.options.getString("query")!
    );

    if (!data || data.length === 0) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "Aucune vidéo trouvée pour cette recherche."
            : "No videos found for this search.",
      });
      return;
    }

    const searchResults = data;
    const itemsPerPage = 5;
    let currentPage = 0;
    const totalPages = Math.ceil(searchResults.length / itemsPerPage);

    const generateEmbed = (page: number) => {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const pageResults = searchResults.slice(start, end);

      const description = pageResults
        .map(
          (result: any, index: number) =>
            `> ${start + index + 1}. **[${result.title}](${result.url})**`
        )
        .join("\n");

      const embed = new EmbedBuilder()
        .setColor("#2b2d31")
        .setAuthor({
          name: "Search - Youtube",
          iconURL: manager.user.displayAvatarURL(),
        })
        .setDescription(description)
        .setFooter({ text: `Page ${page + 1} sur ${totalPages}` });

      // Ajoute une miniature si disponible
      if (pageResults[0]?.thumbnail) {
        embed.setThumbnail(pageResults[0].thumbnail);
      }

      return embed;
    };

    const embed = generateEmbed(currentPage);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel(interaction.locale === "fr" ? "› Arrière" : "› Previous")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel(interaction.locale === "fr" ? "› Prochain" : "› Next")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages - 1)
    );

    const msg = await interaction.editReply({
      embeds: [embed],
      components: [row],
    });

    const filter: any = (i: CollectedInteraction) =>
      i.user.id === interaction.user.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "previous") {
        currentPage--;
      } else if (i.customId === "next") {
        currentPage++;
      }

      const newEmbed = generateEmbed(currentPage);
      const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel(interaction.locale === "fr" ? "› Arrière" : "› Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel(interaction.locale === "fr" ? "› Prochain" : "› Next")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(currentPage === totalPages - 1)
      );

      await i.update({ embeds: [newEmbed], components: [newRow] });
    });

    collector.on("end", async () => {
      if (msg.components) {
        msg.components.forEach((row) => {
          row.components.forEach((component) => {
            // @ts-ignore
            component.data.disabled = true;
          });
        });
        await msg.edit({ components: msg.components }).catch(() => {});
      }
    });

    return;
  },
};

export default youtubeCommand;
