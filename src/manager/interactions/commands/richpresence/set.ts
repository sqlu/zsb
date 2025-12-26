import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();
/*
 * Command Set
 * This command allows the selfbot user to delete a rich presence
 */

const setCommand: SlashCommand = {
  name: "set",
  description: "Allows you to apply a rich presence",
  description_localizations: {
    fr: "Permet d'appliquer une rich presence",
  },
  cooldown: 60000,
  options: [
    {
      name: "name",
      description: "The name of the rich presence that you wish to apply",
      description_localizations: {
        fr: "Le nom de la rich presence que vous souhaitez appliquer",
      },
      type: 3,
      required: true,
      async autocomplete(_manager: Manager, selfbot: Selfbot) {
        return Array.from(selfbot.richPresences.keys())
          .map((name) => ({
            name: `› ${name}`,
            value: name,
          }))
          .concat({
            name: `› None`,
            value: "NONE",
          });
      },
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    selfbot.richPresence = interaction.options.getString("name")!;

    await db.selfbot.upsert({
      where: {
        token: selfbot.token,
      },
      update: {
        richPresence: interaction.options.getString("name")!,
      },
      create: {
        token: selfbot.token,
        richPresence: interaction.options.getString("name")!,
      },
    });

    selfbot.setRPC(interaction.options.getString("name")!);

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez appliqué la rich presence \`${interaction.options.getString(
              "name"
            )}\` avec succès !\n-# ➜ Cela peut prendre un certain temps pour être visible.`
          : `You have successfully applied the rich presence \`${interaction.options.getString(
              "name"
            )}\`! \n-# ➜ It may take some time to be visible.`,
    });

    return;
  },
};

export default setCommand;
