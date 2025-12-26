import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Group
 * This command allows the selfbot user to enable or disable the antiGroup system
 */

const groupCommand: SlashCommand = {
  name: "group",
  description: "Allows you to enable or disable the antiGroup system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiGroup.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiGroup system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiGroup.",
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
    const value = selfbot.antiSystems.get("antiGroup") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGroup est déjà désactivé !`
            : `The antigroup system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGroup est déjà activé !`
            : `The antigroup system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiGroup", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiGroup",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiGroup",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGroup est maintenant activé.`
            : `The antigroup system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGroup est maintenant désactivé.`
            : `The antigroup system is now disabled.`,
      });
    }

    return;
  },
};

export default groupCommand;
