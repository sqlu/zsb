import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { StageChannel, VoiceChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Move
 * This command allows the selfbot user to move a user in his voice channel
 */

const moveCommand: SlashCommand = {
  name: "move",
  description: "Allows you to move a user in your voice channel.",
  description_localizations: {
    fr: "Permets de déplacer un utilisateur dans votre salon vocal.",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to move in your voice channel.",
      description_localizations: {
        fr: "L'utilisateur que vous souhaitez déplacer dans votre salon vocal.",
      },
      type: 6,
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

    const userId = interaction.options.getUser("user")!.id;
    const guildId = interaction.guildId!;

    const guild = selfbot.guilds.cache.get(guildId);
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

    const user = guild!.members.cache.get(userId);

    if (!user?.voice.channel) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `${user!.user} n'est pas dans un salon vocal.`
            : `${user!.user} is not in a voice channel.`,
      });
      return;
    }

    if (
      user!.voice.channel instanceof VoiceChannel ||
      user!.voice.channel instanceof StageChannel
    ) {
      try {
        await user.voice.setChannel(selfbotMember.voice.channel as any);
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous avez déplacé ${user!.user} dans votre salon vocal.`
              : `You have moved ${user!.user} to your voice channel.`,
        });
      } catch {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour déplacer cette utilisateur !`
              : `You do not have the necessary permissions to move this user!`,
        });
      }
    }

    return;
  },
};

export default moveCommand;
