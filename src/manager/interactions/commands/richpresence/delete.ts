import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Delete
 * This command allows the selfbot user to delete a rich presence
 */

const deleteCommand: SlashCommand = {
  name: "delete",
  description: "Allows you to delete a rich presence",
  description_localizations: {
    fr: "Permet de supprimer une rich presence",
  },
  cooldown: 15000,
  options: [
    {
      name: "name",
      description: "The name of the rich presence that you wish to delete",
      description_localizations: {
        fr: "Le nom de la rich presence que vous souhaitez supprimer",
      },
      type: 3,
      required: true,
      async autocomplete(_manager: Manager, selfbot: Selfbot) {
        return Array.from(selfbot.richPresences.keys()).map((name) => ({
          name: `› ${name}`,
          value: name,
        }));
      },
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    selfbot.richPresences.delete(interaction.options.getString("name")!);

    await db.richPresence.delete({
      where: {
        name: interaction.options.getString("name")!,
        selfbotToken: selfbot.token,
      },
    });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez supprimée la rich presence \`${interaction.options.getString(
              "name"
            )}\`avec succès !`
          : `You have successfully deleted the rich presence \`${interaction.options.getString(
              "name"
            )}\`!`,
    });

    return;
  },
};

export default deleteCommand;
