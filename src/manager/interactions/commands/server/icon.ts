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
 * Command Icon
 * This command allows the selfbot user's to retrieve the server's icon
 */

const avatarCommand: SlashCommand = {
  name: "icon",
  description: "Allows you to retrieve server's icon.",
  description_localizations: {
    fr: "Permet d'obtenir l'icône d'un serveur.",
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

    const iconUrl = server.iconURL({ size: 1024, dynamic: true });

    if (!iconUrl) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "Ce serveur n'a pas d'icône."
            : "This server does not have an icon.",
      });
      return;
    }
    const avatarEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name:
          interaction.locale === "fr"
            ? `${server.name} — Avatar`
            : `${server.name} — Avatar`,
        iconURL: server.iconURL({ size: 1024, dynamic: true }) ?? undefined,
      })
      .setImage(iconUrl);

    const buttonAvatar = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel(interaction.locale === "fr" ? "› Icône" : "› Icon")
      .setURL(iconUrl);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      buttonAvatar
    );

    await interaction.editReply({
      embeds: [avatarEmbed],
      components: [row],
    });
    return;
  },
};

export default avatarCommand;
