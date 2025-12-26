import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Set
 * This command allows the selfbot user to enable or disable the afk
 */

const setCommand: SlashCommand = {
  name: "set",
  description: "Allows you to set yourself as AFK.",
  description_localizations: {
    fr: "Permet de définir votre état en AFK.",
  },
  options: [
    {
      name: "value",
      description: "The value that you wish to define for your AFK state.",
      type: 3,
      description_localizations: {
        fr: "La valeur que vous souhaitez définir pour votre état AFK.",
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

    if (!selfbot.afkOptions.message) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez d'abord définir une raison d'AFK via /afk message.`
            : `You must first set an AFK reason via /afk message`,
      });

      return;
    }

    const value = selfbot.afkOptions.value;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous n'êtes déjà pas afk !`
            : `You are not already AFK!`,
      });
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous êtes déjà afk !`
            : `You are already AFK!`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous êtes déjà afk !`
            : `You are already AFK!`,
      });
      return;
    }

    selfbot.afkOptions.value = newValue === "enable" ? true : false;

    await db.selfbot.update({
      where: {
        token: selfbot.token,
      },
      data: {
        afkOptions: {
          message: selfbot.afkOptions.message,
          value: newValue === "enable" ? true : false,
        },
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous êtes maintanent AFK.`
            : `You are now AFK.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous n'êtes maintanent plus AFK.`
            : `You are no longer AFK.`,
      });
    }

    return;
  },
};

export default setCommand;
