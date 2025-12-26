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
 * This command allows the selfbot user to retrieve the user's banner
 */

const bannerCommand: SlashCommand = {
  name: "banner",
  description: "Allows you to retrieve user's banner.",
  description_localizations: {
    fr: "Permet d'obtenir la bannière d'un utilisateur.",
  },
  options: [
    {
      name: "user",
      description: "The user on which you want to retrieve the banner.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur sur lequel vous voulez obtenir la bannière.",
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

    const bannerUrl = await user
      .fetch()
      .then((u) => u.bannerURL({ size: 1024, dynamic: true })!);

    if (!bannerUrl) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? "Cette utilisateur n'a pas de bannière."
            : "This user does not have a banner.",
      });
      return;
    }
    const bannerEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name:
          interaction.locale === "fr"
            ? `${user.displayName} — Bannière`
            : `${user.displayName} — Banner`,
        iconURL: user.displayAvatarURL(),
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
