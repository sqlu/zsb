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
 * Command Info
 * This command allows the selfbot user to retrieve the server's informations
 */

const infoCommand: SlashCommand = {
  name: "info",
  description: "Allows you to retrieve the server's informations.",
  description_localizations: {
    fr: "Permet d'obtenir les informations d'un serveur.",
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

    const serverBanner = server.bannerURL({ size: 4096 });

    const name = server.name;
    const memberCount = server.memberCount;
    const owner = server.ownerId;
    const roleCount = server.roles.cache.size;
    const channelCount = server.channels.cache.size;
    const boostCount = server.premiumSubscriptionCount;
    const boostTier = server.premiumTier;
    const vanityURL = server.vanityURLCode;
    const stickerCount = server.stickers.cache.size;
    const emojiCount = server.emojis.cache.size;
    const systemchannel = server.systemChannel;
    const serverlang = server.preferredLocale;

    const creationDate = Math.floor(server.createdAt.getTime() / 1000);

    const frenchDescription =
      `> **Nom:** \`${name}\`\n` +
      `> **Date de création:** <t:${creationDate}:F>\n` +
      `> **Propriétaire:** <@${owner}>\n` +
      `> **Nombre de membres:** \`${memberCount}\`\n` +
      `> **Nombre de roles:** \`${roleCount}\`\n` +
      `> **Nombre de salons:** \`${channelCount}\`\n` +
      `> **Boost:** \`${
        boostTier === "NONE" ? "Aucun" : boostTier
      }\` (\`${boostCount}\`)\n` +
      `> **URL de l'invite:** \`${
        vanityURL ? `https://discord.gg/${vanityURL}` : "Aucune"
      }\`\n` +
      `> **Nombre de stickers:** \`${stickerCount}\`\n` +
      `> **Nombres d'emojis:** \`${emojiCount}\`\n` +
      `> **Salon de systeme:** ${systemchannel ?? "`Aucun`"}\n` +
      `> **Langue du serveur:** \`${serverlang}\``;

    const englishDescription =
      `> **Name:** \`${name}\`\n` +
      `> **Creation date:** <t:${creationDate}:F>\n` +
      `> **Owner:** <@${owner}>\n` +
      `> **Member count:** \`${memberCount}\`\n` +
      `> **Role Count:** \`${roleCount}\`\n` +
      `> **Channel Count:** ${channelCount}\n` +
      `> **Boost:** \`${
        boostTier === "NONE" ? "None" : boostTier
      }\` (\`${boostCount}\`)\n` +
      `> **Vanity URL: \`${
        vanityURL ? `https://discord.gg/${vanityURL}` : "None"
      }\`\n` +
      `> **Stickers Count:** \`${stickerCount}\`\n` +
      `> **Emojis Count:** \`${emojiCount}\`\n` +
      `> **System channel:** ${systemchannel ?? "`None`"}\n` +
      `> **Server language:** \`${serverlang}\``;

    const infoEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `${name} — Informations`,
        iconURL: server.iconURL({ size: 1024, dynamic: true })!,
      })
      .setDescription(
        interaction.locale === "fr" ? frenchDescription : englishDescription
      )
      .setThumbnail(server.iconURL({ size: 1024, dynamic: true }));

    const buttonAvatar = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("› Avatar")
      .setURL(server.iconURL({ size: 1024, dynamic: true })!);

    let buttonBanner;
    if (serverBanner) {
      infoEmbed.setImage(serverBanner);

      buttonBanner = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(interaction.locale === "fr" ? "› Bannière" : "› Banner")
        .setURL(serverBanner);
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      buttonAvatar,
      ...(buttonBanner ? [buttonBanner] : [])
    );

    await interaction.editReply({
      embeds: [infoEmbed],
      components: [row],
    });

    return;
  },
};

export default infoCommand;
