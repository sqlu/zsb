import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { ColorResolvable } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Create
 * This command allows the selfbot user to create a role with specific options in a server
 */

const createCommand: SlashCommand = {
  name: "create",
  description: "Allows you to create a role in a server.",
  description_localizations: {
    fr: "Permet de créer un rôle dans un serveur.",
  },
  options: [
    {
      name: "name",
      description: "The name of the new role.",
      type: 3,
      max_length: 100,
      description_localizations: {
        fr: "Le nom du nouveau rôle.",
      },
      required: true,
    },
    {
      name: "color",
      description: "The color of the new role.",
      type: 3,
      description_localizations: {
        fr: "La couleur du nouveau rôle.",
      },
      choices: [
        {
          name: "› 🔴 - Red",
          value: "#FF0000",
        },
        {
          name: "› 🔵 - Blue",
          value: "#0000FF",
        },
        {
          name: "› 🟢 - Green",
          value: "#00FF00",
        },
        {
          name: "› 🟡 - Yellow",
          value: "#FFFF00",
        },
        {
          name: "› 🟣 - Purple",
          value: "#800080",
        },
        {
          name: "› 🟠 - Orange",
          value: "#FFA500",
        },
        {
          name: "› ⚫ - Black",
          value: "#000000",
        },
        {
          name: "› ⚪ - White",
          value: "#FFFFFF",
        },
      ],
      required: true,
    },
    {
      name: "admin",
      description: "Whether or not the new role should have admin permissions.",
      type: 3,
      description_localizations: {
        fr: "Le nouveau rôle devrait-il avoir des permissions d'administrateur ?",
      },
      choices: [
        {
          name: "› ✅ - Yes",
          value: "true",
        },
        {
          name: "› ❌ - No",
          value: "false",
        },
      ],

      required: false,
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

    const name = interaction.options.getString("name")!;
    const color = interaction.options.getString("color")!;
    const isAdmin =
      interaction.options.getString("admin") === "true" ? true : false;

    const guildId = interaction.guildId;
    const guild = selfbot.guilds.cache.get(guildId);

    const newRole = await guild!.roles
      .create({
        name: name,
        color: color as ColorResolvable,
        permissions: isAdmin ? ["ADMINISTRATOR"] : [],
      })
      .catch(() => {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour créer ce rôle !`
              : `You do not have the necessary permissions to create this role!`,
        });
      });

    if (!newRole) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez créé le rôle ${newRole} avec succès !`
          : `You have successfully created the role ${newRole}!`,
    });

    return;
  },
};

export default createCommand;
