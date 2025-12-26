import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";
const db = new PrismaClient();
/*
 * Command Mp
 * This command allows the selfbot user to enable or disable the antiMp system
 */

const mpCommand: SlashCommand = {
  name: "mp",
  description: "Allows you to enable or disable the antiMp system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiMp.",
  },
  options: [
    {
      name: "value",
      description: "The value that you wish to define for the antiMp system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiMp.",
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
    const value = selfbot.antiSystems.get("antiMp") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMp est déjà désactivé !`
            : `The antiMp system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMp est déjà activé !`
            : `The antiMp system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiMp", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiMp",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiMp",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMp est maintenant activé.`
            : `The antiMp system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMp est maintenant désactivé.`
            : `The antiMp system is now disabled.`,
      });
    }

    return;
  },
};

export default mpCommand;
