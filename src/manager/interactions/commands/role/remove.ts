import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Remove
 * This command allows the selfbot user to delete a role from a server
 */

const removeCommand: SlashCommand = {
  name: "remove",
  description: "Allows you to remove a role from a user.",
  description_localizations: {
    fr: "Permet de retirer un rôle d'un utilisateur.",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to remove the role.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur dont vous souhaitez retirer le rôle.",
      },
      required: true,
    },
    {
      name: "role",
      description: "The role that you wish to remove from the user.",
      type: 8,
      description_localizations: {
        fr: "Le rôle que vous souhaitez retirer de l'utilisateur.",
      },
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

    let roleId = interaction.options.getRole("role")?.id;
    if (!roleId) {
      return;
    }

    const userId = interaction.options.getUser("user")!.id;
    const guild = selfbot.guilds.cache.get(interaction.guildId!);
    const user = guild!.members.cache.get(userId);
    const role = guild!.roles.cache.get(roleId);

    if (!role) return;

    await user!.roles.remove(role).catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour retirer ce rôle a cette utilisateur !`
            : `You do not have the necessary permissions to remove this role from this user!`,
      });
    });

    if (user?.roles.cache.has(role.id)) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Le rôle ${role} a été retiré de l'utilisateur ${user} avec succès !`
          : `The role ${role} has been successfully removed from ${user}!`,
    });
  },
};

export default removeCommand;
