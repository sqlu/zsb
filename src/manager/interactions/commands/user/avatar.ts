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
 * Command Avatar
 * This command allows the selfbot user to retrieve user's avatar
 */

const avatarCommand: SlashCommand = {
  name: "avatar",
  description: "Allows you to retrieve user's avatar.",
  description_localizations: {
    fr: "Permet d'obtenir l'avatar d'un utilisateur.",
  },
  options: [
    {
      name: "user",
      description: "The user on which you want to retrieve the avatar.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur sur lequel vous voulez obtenir l'avatar.",
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

    const avatarEmbed = new EmbedBuilder()
      .setColor("#2b2d31")
      .setAuthor({
        name: `${user.displayName} — Avatar`,
        iconURL: user.displayAvatarURL(),
      })
      .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }));

    const buttonAvatar = new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("› Avatar")
      .setURL(user.displayAvatarURL({ size: 1024, dynamic: true }));

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
