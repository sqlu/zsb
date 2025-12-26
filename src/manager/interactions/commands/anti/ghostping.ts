import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command GhostPing
 * This command allows the selfbot user to enable or disable the antiGhostPing system
 */

const ghostPingCommand: SlashCommand = {
  name: "ghostping",
  description: "Allows you to enable or disable the antiGhostPing system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiGhostPing.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiGhostPing system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiGhostPing.",
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
    const value = selfbot.antiSystems.get("antiGhostPing") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGhostPing est déjà désactivé !`
            : `The antiGhostPing system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGhostPing est déjà activé !`
            : `The antiGhostPing system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set(
      "antiGhostPing",
      newValue === "enable" ? true : false
    );

    await db.antiSystem.upsert({
      where: {
        name: "antiGhostPing",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiGhostPing",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGhostPing est maintenant activé.`
            : `The antiGhostPing system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGhostPing est maintenant désactivé.`
            : `The antiGhostPing system is now disabled.`,
      });
    }

    return;
  },
};

export default ghostPingCommand;
