import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command VcMute
 * This command allows the selfbot user to enable or disable the antiVcmute system
 */

const vcMuteCommand: SlashCommand = {
  name: "vcmute",
  description: "Allows you to enable or disable the antiVcmute system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiVcmute.",
  },
  options: [
    {
      name: "value",
      description:
        "The value that you wish to define for the antiVcmute system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiVcmute.",
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
    const value = selfbot.antiSystems.get("antiVcmute") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiVcmute est déjà désactivé !`
            : `The antiVcmute system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiVcmute est déjà activé !`
            : `The antiVcmute system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiVcmute", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiVcmute",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiVcmute",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiVcmute est maintenant activé.\n-# ➜ Vous devez avoir les permision de vous rendre muet pour que cela fonctionne.`
            : `The antiVcmute system is now enable.\n-# ➜ You must have the permission to mute yourself for this to work.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiVcmute est maintenant désactivé.`
            : `The antiVcmute system is now disabled.`,
      });
    }

    return;
  },
};

export default vcMuteCommand;
