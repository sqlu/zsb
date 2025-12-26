import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command derank
 * This command allows the selfbot user to remove all roles from a user in a server
 */

const derankCommand: SlashCommand = {
  name: "derank",
  description: "Allows you to remove all roles from a user in a server.",
  description_localizations: {
    fr: "Permet de retirer tous les rôles d'un utilisateur d'un serveur.",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to derank.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur dont vous souhaitez retirer tous les rôles.",
      },
      required: true,
    },
    {
      name: "reason",
      description: "The reason for which you wish to derank this user.",
      type: 3,
      description_localizations: {
        fr: "La raison pour laquelle vous souhaitez retirer tous les rôles de cet utilisateur.",
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
      user?.roles.cache.forEach(async (role) => {
        await user?.roles
          .remove(role, reason ?? "No reason provided.")
          .catch(() => false);
      });
    } catch {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous n'avez pas assez de permissions pour retirer tous les rôles de cet utilisateur.`
            : `You don't have enough permissions to remove all roles from this user.`,
      });
    }
    if (user?.roles?.cache.size === 0) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez retiré tous les rôles de ${user} avec succès !.`
            : `You have successfully removed all roles from ${user}!`,
      });
      return;
    }
    return;
  },
};
export default derankCommand;
