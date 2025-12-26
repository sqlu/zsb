import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Add
 * This command allows the selfbot user to add a user to a specific role in the server.
 */

const addCommand: SlashCommand = {
  name: "add",
  description: "Adds a user to a specific role in the server.",
  description_localizations: {
    fr: "Ajoute un utilisateur à un rôle spécifique dans le serveur.",
  },
  options: [
    {
      name: "role",
      description: "The role you want to add the user to.",
      description_localizations: {
        fr: "Le rôle auquel vous souhaitez ajouter l'utilisateur.",
      },
      type: 8,
      required: true,
    },
    {
      name: "user",
      description: "The user you want to add to the role.",
      description_localizations: {
        fr: "L'utilisateur que vous souhaitez ajouter au rôle.",
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

    const roleId = interaction.options.getRole("role")!.id;
    const userId = interaction.options.getUser("user")!.id;

    const guildId = interaction.guildId;
    const guild = selfbot.guilds.cache.get(guildId);

    const role = guild!.roles.cache.get(roleId);

    const member = await guild!.members.fetch(userId);
    if (member.roles.cache.has(roleId)) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `L'utilisateur ${member} est déjà dans le rôle ${role}.`
            : `User ${member} is already in the role ${role}.`,
      });
      return;
    }

    await member.roles.add(roleId).catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour ajouter ce rôle !`
            : `You do not have the necessary permissions to add this role!`,
      });
    });

    if (!member.roles.cache.has(roleId)) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez donné le rôle ${role} à ${member} avec succès !`
          : `You have successfully assigned the ${role} role to ${member}!`,
    });

    return;
  },
};

export default addCommand;
