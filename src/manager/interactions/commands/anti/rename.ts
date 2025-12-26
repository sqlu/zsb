import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Rename
 * This command allows the selfbot user to enable or disable the antiRename system
 */

const renameCommand: SlashCommand = {
  name: "rename",
  description: "Allows you to enable or disable the antiRename system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiRename.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiRename system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiRename.",
      },
      choices: [
        {
          name: "› ✅ Enable",
          value: "enable",
        },
        {
          name: "› ❌ Disable",
          value: "disable",
        },
      ],
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const newValue = interaction.options.getString("value")!;
    const value = selfbot.antiSystems.get("antiRename") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiRename est déjà désactivé !`
            : `The antiRename system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiRename est déjà activé !`
            : `The antiRename system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiRename", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiRename",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiRename",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiRename est maintenant activé.`
            : `The antiRename system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiRename est maintenant désactivé.`
            : `The antiRename system is now disabled.`,
      });
    }

    return;
  },
};

export default renameCommand;
