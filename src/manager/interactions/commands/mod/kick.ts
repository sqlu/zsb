import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command kick
 * This command allows the selfbot user to kick a user from a server
 */

const kickCommand: SlashCommand = {
  name: "kick",
  description: "Allows you to kick a user from a server.",
  description_localizations: {
    fr: "Permet de expulser un utilisateur d'un serveur.",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to kick.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur que vous souhaitez expulser.",
      },
      required: true,
    },
    {
      name: "reason",
      description: "The reason for which you wish to kick this user.",
      type: 3,
      description_localizations: {
        fr: "La raison pour laquelle vous souhaitez expulser cet utilisateur.",
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

    const userId = interaction.options.getUser("user")!.id;
    const serverId = interaction.guildId;

    const server = selfbot.guilds.cache.get(serverId);
    const user = server!.members.cache.get(userId);

    try {
      await user?.kick(reason ?? "No reason provided.");
    } catch {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour expulser cet utilisateur !`
            : `You do not have the necessary permissions to kick this user!`,
      });
    }

    if (server!.members.cache.get(userId)) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez expulsé l'utilisateur avec succès !`
          : `You have successfully kicked the user !`,
    });

    return;
  },
};

export default kickCommand;
