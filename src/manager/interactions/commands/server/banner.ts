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
import { Manager } from "../../../index";

/*
 * Command Banner
 * This command allows the selfbot user's to retrieve the server banner
 */

const bannerCommand: SlashCommand = {
  name: "banner",
  description: "Allows you to retrieve server's banner.",
  description_localizations: {
    fr: "Permet d'obtenir la bannière d'un serveur.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const serverId = interaction.guildId;

    if (!interaction.inGuild()) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un serveur pour utiliser cette commande !`
            : `You must be in a server to use this command!`,
      });
      return;
    }

    const server = selfbot.guilds.cache.get(serverId!)!;

    const bannerUrl = server.bannerURL({ size: 4096 });

    if (!bannerUrl) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "Ce serveur n'a pas de bannière."
            : "This server does not have a banner.",
      });
      return;
    }
    const bannerEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name:
          interaction.locale === "fr"
            ? `${server.name} — Bannière`
            : `${server.name} — Banner`,
        iconURL: server.iconURL() ?? undefined,
      })
      .setImage(bannerUrl);

    const buttonBanner = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(interaction.locale === "fr" ? "› Bannière" : "› Banner")
      .setURL(bannerUrl);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      buttonBanner
    );

    await interaction.editReply({
      embeds: [bannerEmbed],
      components: [row],
    });
    return;
  },
};

export default bannerCommand;
