import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Everyone
 * This command allows the selfbot user to enable or disable the antiEveryone system
 */

const everyoneCommand: SlashCommand = {
  name: "everyone",
  description: "Allows you to enable or disable the antiEveryone system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiEveryone.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiEveryone system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiEveryone.",
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
    const value = selfbot.antiSystems.get("antiEveryone") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiEveryone est déjà désactivé !`
            : `The antiEveryone system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiEveryone est déjà activé !`
            : `The antiEveryone system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set(
      "antiEveryone",
      newValue === "enable" ? true : false
    );

    await db.antiSystem.upsert({
      where: {
        name: "antiEveryone",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiEveryone",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiEveryone est maintenant activé.`
            : `The antiEveryone system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiEveryone est maintenant désactivé.`
            : `The antiEveryone system is now disabled.`,
      });
    }

    return;
  },
};

export default everyoneCommand;
