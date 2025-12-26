import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Delete
 * This command allows the selfbot user to delete a role from a server
 */

const deleteCommand: SlashCommand = {
  name: "delete",
  description: "Allows you to delete a role from server.",
  description_localizations: {
    fr: "Permet de supprimer un rôle d'un serveur.",
  },
  options: [
    {
      name: "role",
      description: "The role that you wish to delete.",
      type: 8,
      description_localizations: {
        fr: "Le rôle que vous souhaitez supprimer.",
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
    let roleId = interaction.options.getRole("role")?.id;
    if (!roleId) {
      return;
    }

    const guild = selfbot.guilds.cache.get(interaction.guildId!);
    const role = guild!.roles.cache.get(roleId);

    const roleName = role!.name;

    await role!.delete().catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour supprimer ce rôle !`
            : `You do not have the necessary permissions to delete this role!`,
      });
    });

    if (!role) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez supprimé le role \`${roleName}\` avec succès !`
          : `You have successfully deleted the role \`${roleName}\`!`,
    });

    return;
  },
};

export default deleteCommand;
