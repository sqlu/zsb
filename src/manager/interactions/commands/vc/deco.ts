import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { VoiceChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Deco
 * This command allows the selfbot user to disconnect a user from a voice channel
 */

const decoCommand: SlashCommand = {
  name: "deco",
  description: "Allows you to disconnect a user from a voice channel",
  description_localizations: {
    fr: "Permet de déconnecter un utilisateur d'un salon vocal",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to disconnect.",
      description_localizations: {
        fr: "L'utilisateur que vous souhaitez déconnecter.",
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

    if (user!.voice.channel instanceof VoiceChannel) {
      try {
        await user.voice.disconnect();
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous avez déconnecté ${user!.user} de son salon vocal.`
              : `You have disconnected ${user!.user} from his voice channel.`,
        });
      } catch {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour déconnecter cette utilisateur !`
              : `You do not have the necessary permissions to disconnect this user!`,
        });
      }
    }

    return;
  },
};

export default decoCommand;
