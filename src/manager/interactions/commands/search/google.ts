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
import { googleSearchRequest } from "../../../../utils/requests/google";
import { Manager } from "../../../index";

/*
 * Command google
 * This command allows the selfbot user to search something with google
 */

const googleCommand: SlashCommand = {
  name: "google",
  description: "Allows you to search something with Google.",
  description_localizations: {
    fr: "Permet de faire une recherche via Google.",
  },
  cooldown: 20000,
  options: [
    {
      name: "query",
      description: "The query to search for on Google.",
      type: 3,
      description_localizations: {
        fr: "La requête à rechercher sur Google.",
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

    const data = await googleSearchRequest(
      interaction.options.getString("query")!
    );

    if (!data || data.length === 0) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "Aucun résultat trouvé pour cette recherche."
            : "No results found for this search.",
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
            `> ${start + index + 1}. **[${result.title}](${result.link})**`
        )
        .join("\n");

      return new EmbedBuilder()
        .setColor("#2b2d31")
        .setAuthor({
          name: "Search - Google",
          iconURL: manager.user.displayAvatarURL(),
        })
        .setDescription(description)
        .setFooter({ text: `Page ${page + 1} sur ${totalPages}` });
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

export default googleCommand;
