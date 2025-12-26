import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command BotMp
 * This command allows the selfbot user to enable or disable the antiBotMp system
 */

const botMpCommand: SlashCommand = {
  name: "botmp",
  description: "Allows you to enable or disable the antiBotMp system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiBotMp.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiBotMp system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiBotMp.",
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
    const value = selfbot.antiSystems.get("antiBotMp") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiBotMp est déjà désactivé !`
            : `The antiBotMp system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiBotMp est déjà activé !`
            : `The antiBotMp system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiBotMp", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiBotMp",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiBotMp",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiBotMp est maintenant activé.`
            : `The antiBotMp system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiBotMp est maintenant désactivé.`
            : `The antiBotMp system is now disabled.`,
      });
    }
    return;
  },
};

export default botMpCommand;
