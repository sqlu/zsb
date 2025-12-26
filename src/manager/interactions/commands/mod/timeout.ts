import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Timeout
 * This command allows the selfbot user to put a user in timeout in a server
 */

const timeoutCommand: SlashCommand = {
  name: "timeout",
  description: "Allows you to put a user in timeout in a server.",
  description_localizations: {
    fr: "Permet de mettre un utilisateur en timeout dans un serveur.",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to put in timeout.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur que vous souhaitez mettre en timeout.",
      },
      required: true,
    },
    {
      name: "duration",
      description: "The duration of the timeout in seconds.",
      type: 4,
      description_localizations: {
        fr: "La durée du timeout en secondes.",
      },
      required: true,
    },
    {
      name: "reason",
      description: "The reason for which you wish to timeout this user.",
      type: 3,
      description_localizations: {
        fr: "La raison pour laquelle vous souhaitez mettre cet utilisateur en timeout.",
      },
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

    const reason = interaction.options.getString("reason");
    const duration = interaction.options.getInteger("duration")!;
    const userId = interaction.options.getUser("user")!.id;

    const serverId = interaction.guildId;
    const server = selfbot.guilds.cache.get(serverId);
    const user = server!.members.cache.get(userId);

    if (!user) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `L'utilisateur spécifié n'est pas dans ce serveur !`
            : `The specified user is not in this server!`,
      });
      return;
    }

    try {
      await user.timeout(duration * 1000, reason ?? "No reason provided.");
    } catch {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour mettre cet utilisateur en timeout !`
            : `You do not have the necessary permissions to timeout this user!`,
      });
    }

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez timeout ${user} avec succès pendant ${duration} secondes !`
          : `You have successfully timeout ${user} for ${duration} seconds!`,
    });

    return;
  },
};

export default timeoutCommand;
