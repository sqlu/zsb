import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command GiveawayPing
 * This command allows the selfbot user to enable or disable the antiGiveawayPing system
 */
const giveawayPingCommand: SlashCommand = {
  name: "giveawayping",
  description: "Allows you to enable or disable the antiGiveawayPing system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiGiveawayPing.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiGiveawayPing system.",
      type: 3,
      description_localizations: {
        fr: "La valeur que vous souhaitez définir pour le système d'antiGiveawayPing.",
      },
      choices: [
        {
          name: "✅ Enable",
          value: "enable",
        },
        {
          name: "❌ Disable",
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
    const value = selfbot.antiSystems.get("antiGiveawayPing") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGiveawayPing est déjà désactivé !`
            : `The antiGiveawayPing system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGiveawayPing est déjà activé !`
            : `The antiGiveawayPing system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set(
      "antiGiveawayPing",
      newValue === "enable" ? true : false
    );

    await db.antiSystem.upsert({
      where: {
        name: "giveawayping",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "giveawayping",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGiveawayPing est maintenant activé.`
            : `The antiGiveawayPing system is now enable.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiGiveawayPing est maintenant désactivé.`
            : `The antiGiveawayPing system is now disabled.`,
      });
    }

    return;
  },
};

export default giveawayPingCommand;
