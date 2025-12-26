import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { GuildMember } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Deco All
 * This command allows the selfbot user to disconnect all users of a voice channel
 */

const decoallCommand: SlashCommand = {
  name: "decoall",
  description: "Allows you to disconnect all users of a voice channel.",
  description_localizations: {
    fr: "Permet de déconnecter tous les utilisateurs d'un salon vocal.",
  },
  cooldown: 15000,
  options: [
    {
      name: "channel",
      description: "The voice channel that you wish to disconnect users from.",
      description_localizations: {
        fr: "Le salon vocal depuis lequel vous souhaitez déconnecter les utilisateurs.",
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

    let disconnectedCount = 0;

    for (const [, member] of members) {
      try {
        await member.voice.setChannel(null);
        disconnectedCount++;
      } catch {}
    }

    await interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez déconnecté avec succès \`${disconnectedCount}\` membres.`
          : `You have successfully disconnected \`${disconnectedCount}\` members.`,
    });

    return;
  },
};

export default decoallCommand;
