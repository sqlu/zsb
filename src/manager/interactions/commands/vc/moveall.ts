import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { GuildMember } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Move All
 * This command allows the selfbot user to move all users of a voice channel in his voice channel
 */

const moveallCommand: SlashCommand = {
  name: "moveall",
  description:
    "Allows you to move all users of a voice channel in your voice channel.",
  description_localizations: {
    fr: "Permet de déplacer tous les utilisateurs d'un salon vocal dans votre salon vocal.",
  },
  cooldown: 15000,
  options: [
    {
      name: "channel",
      description: "The voice channel that you wish to move users from.",
      description_localizations: {
        fr: "Le salon vocal depuis lequel vous souhaitez déplacer les utilisateurs.",
      },
      type: 7,
      channel_types: [2],
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (!interaction.inGuild()) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un serveur pour utiliser cette commande !`
            : `You must be in a server to use this command!`,
      });
      return;
    }

    const channelId = interaction.options.getChannel("channel")!.id;
    const guildId = interaction.guildId!;

    const guild = selfbot.guilds.cache.get(guildId)!;

    const selfbotMember = guild!.members.cache.get(selfbot.user.id);

    if (!selfbotMember?.voice.channel) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous n'êtes pas dans un salon vocal.`
            : `You are not in a voice channel.`,
      });
      return;
    }

    const members = guild.members.cache.filter(
      (member: GuildMember) => member.voice.channel?.id === channelId
    );

    let movedCount = 0;

    for (const [, member] of members) {
      try {
        await member.voice.setChannel(selfbotMember!.voice.channel!.id!);
        movedCount++;
      } catch {}
    }

    await interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez déplacé avec succès \`${movedCount}\` membres dans votre salon vocal.`
          : `You have successfully moved \`${movedCount}\` members in your voice channel.`,
    });

    return;
  },
};

export default moveallCommand;
