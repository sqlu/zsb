import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command PartnerPing
 * This command allows the selfbot user to enable or disable the antiPartnerPing system
 */

const partnerPingCommand: SlashCommand = {
  name: "partnerping",
  description: "Allows you to enable or disable the antiPartnerPing system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiPartnerPing.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiPartnerPing system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiPartnerPing.",
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
    const value = selfbot.antiSystems.get("antiPartnerPing") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiPartnerPing est déjà désactivé !`
            : `The antiPartnerPing system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiPartnerPing est déjà activé !`
            : `The antiPartnerPing system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set(
      "antiPartnerPing",
      newValue === "enable" ? true : false
    );

    await db.antiSystem.upsert({
      where: {
        name: "antiPartnerPing",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiPartnerPing",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiPartnerPing est maintenant activé.`
            : `The antiPartnerPing system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiPartnerPing est maintenant désactivé.`
            : `The antiPartnerPing system is now disabled.`,
      });
    }

    return;
  },
};

export default partnerPingCommand;
