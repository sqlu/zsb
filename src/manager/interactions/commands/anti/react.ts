import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command React
 * This command allows the selfbot user to enable or disable the antiReact system
 */

const reactCommand: SlashCommand = {
  name: "react",
  description: "Allows you to enable or disable the antiReact system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiReact.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiReact system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiReact.",
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
    const value = selfbot.antiSystems.get("antiReact") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiReact est déjà désactivé !`
            : `The antiReact system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiReact est déjà activé !`
            : `The antiReact system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiReact", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiReact",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiReact",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiReact est maintenant activé.`
            : `The antiReact system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiReact est maintenant désactivé.`
            : `The antiReact system is now disabled.`,
      });
    }

    return;
  },
};

export default reactCommand;
