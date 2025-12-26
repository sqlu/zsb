import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Move
 * This command allows the selfbot user to enable or disable the antiMove system
 */

const moveCommand: SlashCommand = {
  name: "move",
  description: "Allows you to enable or disable the antiMove system.",
  description_localizations: {
    fr: "Permet d'activé ou désactivé le système d'antiMove.",
  },
  options: [
    {
      name: "value",
      description: "The value that you wish to define for the antiMove system.",
      type: 3,
      description_localizations: {
        fr: "La valeur à laquelle vous souhaitez définir pour le système d'antiMove.",
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
    const value = selfbot.antiSystems.get("antiMove") || false;

    if (value === false && newValue === "disable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMove est déjà désactivé !`
            : `The antiMove system is already disabled !`,
      });
      return;
    }

    if (value === true && newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMove est déjà activé !`
            : `The antiMove system is already enabled !`,
      });
      return;
    }

    selfbot.antiSystems.set("antiMove", newValue === "enable" ? true : false);

    await db.antiSystem.upsert({
      where: {
        name: "antiMove",
        selfbotToken: selfbot.token,
      },
      update: {
        value: newValue === "enable" ? true : false,
      },
      create: {
        name: "antiMove",
        value: newValue === "enable" ? true : false,
        selfbotToken: selfbot.token,
      },
    });

    if (newValue === "enable") {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMove est maintenant activé.\n-# ➜ Vous devez avoir les permision de vous déplacer pour que cela fonctionne. __Vous devrez le désactiver pour pouvoir changer manuellement de salon vocal !__`
            : `The antiMove system is now enable.\n-# ➜ You must have the permission to move yourself for this to work. __You will need to disable it in order to manually switch voice channels!__`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le système d'antiMove est maintenant désactivé.`
            : `The antiMove system is now disabled.`,
      });
    }
    return;
  },
};

export default moveCommand;
