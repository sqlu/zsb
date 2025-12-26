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
 * This command allows the selfbot user to retrieve user information
 */

const infoCommand: SlashCommand = {
  name: "info",
  description: "Allows you to retrieve user information.",
  description_localizations: {
    fr: "Permet d'obtenir les informations d'un utilisateur.",
  },
  options: [
    {
      name: "user",
      description: "The user on which you want to retrieve information.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur sur lequel vous voulez obtenir les informations.",
      },
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let userId = interaction.options.getUser("user")?.id;

    if (!userId) {
      userId = selfbot.user.id;
    }

    let user = selfbot.users.cache.get(userId)!;

    if (!user) {
      user = await selfbot.users.fetch(userId);
    }

    const mutuals = await fetch(
      `https://discord.com/api/v9/users/${user.id}/profile?with_mutual_guilds=true&with_mutual_friends=true&with_mutual_friends_count=false`,
      {
        method: "GET",
        headers: {
          Authorization: selfbot.token,
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .catch(() => false);

    const userBanner = await user
      .fetch()
      .then((u) => u.bannerURL({ size: 4096 }));

    const userNitro =
      mutuals.premium_type === 3
        ? "`Nitro Basic`"
        : mutuals.premium_type === 2
        ? "`Nitro Boost`"
        : "`❌`";

    const userPremiumSinceTimestamp =
      mutuals.premium_type >= 2
        ? `<t:${Math.floor(
            new Date(mutuals.premium_since).getTime() / 1000
          )}:F>`
        : interaction.locale === "fr"
        ? "`Aucun`"
        : "`None`";

    const pronouns =
      //@ts-ignore
      user.pronouns || interaction.locale === "fr" ? "`Aucun`" : "`None`";
    const flags = user.flags?.toArray() ?? [];
    const badges =
      flags.length > 0
        ? flags
            .map((flag: string) => {
              switch (flag) {
                case "Staff":
                  return "`Discord Employee`";
                case "Partner":
                  return "`Discord Partner`";
                case "Hypesquad":
                  return "`HypeSquad Events`";
                case "BugHunterLevel1":
                  return "`Bug Hunter Level 1`";
                case "HypeSquadOnlineHouse1":
                  return "`HypeSquad Bravery`";
                case "HypeSquadOnlineHouse2":
                  return "`HypeSquad Brilliance`";
                case "HypeSquadOnlineHouse3":
                  return "`HypeSquad Balance`";
                case "PremiumEarlySupporter":
                  return "`Early Supporter`";
                case "TeamPseudoUser":
                  return "`Team User`";
                case "BugHunterLevel2":
                  return "`Bug Hunter Level 2`";
                case "VerifiedBot":
                  return "`Verified Bot`";
                case "VerifiedDeveloper":
                  return "`Early Verified Bot Developer`";
                case "CertifiedModerator":
                  return "`Discord Certified Moderator`";
                case "BotHTTPInteractions":
                  return "`HTTP Interactions Bot`";
                  
                case "ActiveDeveloper":
                  return "`Active Developer`";
                default:
                  return `\`${flag}\``;
              }
            })
            .join(", ")
        : interaction.locale === "fr"
        ? "`Aucun`"
        : "`None`";
    const username = user.username;
    const mutualGuilds = mutuals.mutual_guilds.length;
    const mutualFriends = mutuals.mutual_friends.length;
    const creationDate = Math.floor(user.createdAt.getTime() / 1000);
    const mutualsInfos =
      interaction.locale === "fr"
        ? `> **Serveurs en  communs:** \`${mutualGuilds}\`\n> **Amis en communs:** \`${mutualFriends}\`\n`
        : `> **Mutual servers:** \`${mutualGuilds}\`\n> **Mutual friends:** \`${mutualFriends}\`\n`;

    const frenchDescription =
      `> **Nom d'utilisateur:** \`${username}\`\n` +
      (userId != selfbot.user.id ? mutualsInfos : "") +
      `> **Date de création du compte:** <t:${creationDate}:F>\n` +
      `> **Badges:** ${badges}\n` +
      `> **Pronoms:** \`${pronouns}\`\n` +
      `> **Nitro:** ${userNitro}\n` +
      `> **Nitro depuis:** ${userPremiumSinceTimestamp}\n`;

    const englishDescription =
      `> **Username:** \`${username}\`\n` +
      (userId != selfbot.user.id ? mutualsInfos : "") +
      `> **Account creation date:** <t:${creationDate}:F>\n` +
      `> **Badges:** ${badges}\n` +
      `> **Pronouns:** \`${pronouns}\`\n` +
      `> **Nitro:** ${userNitro}\n` +
      `> **Nitro since:** ${userPremiumSinceTimestamp}\n`;

    const infoEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `${user.displayName} — Informations`,
        iconURL: user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setDescription(
        interaction.locale === "fr" ? frenchDescription : englishDescription
      )
      .setThumbnail(user.displayAvatarURL({ size: 1024, dynamic: true }));

    const buttonAvatar = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("› Avatar")
      .setURL(user.displayAvatarURL({ size: 1024, dynamic: true }));

    let buttonBanner;
    if (userBanner) {
      infoEmbed.setImage(userBanner);

      buttonBanner = new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(interaction.locale === "fr" ? "› Bannière" : "› Banner")
        .setURL(userBanner);
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
