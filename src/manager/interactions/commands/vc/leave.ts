import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const db = new PrismaClient();

/*
 * Command Leave
 * This command allows the selfbot user to leave a voice channel
 */

const leaveCommand: SlashCommand = {
  name: "leave",
  description: "Allows you to leave a voice channel.",
  description_localizations: {
    fr: "Permet de quitter un salon vocal.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    selfbot.voice.connection?.disconnect();

    await db.selfbot.update({
      where: {
        token: selfbot.token,
      },
      data: {
        voiceOptions: {
          update: {
            voiceChannelId: null,
          }
        },
      },
    });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez quitté le salon vocal avec succès !`
          : `You successfully leaved the voice channel !`,
    });

    return;
  },
};

export default leaveCommand;
