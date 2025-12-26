import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Clear DMs
 * This command allows the selfbot user to clear all his DMs
 */

const cleardmCommand: SlashCommand = {
  name: "cleardms",
  description: "Allows you to clear all your DMs",
  description_localizations: {
    fr: "Permet de supprimer tous vos messages privés.",
  },
  cooldown: 120000,

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    selfbot.channels.cache
      .filter((channel) => channel.type === "DM")
      .forEach(async (dmChannel) => {
        await dmChannel.delete().catch(() => false);
      });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Tous vos messages privés ont été supprimés.`
          : `All your DMs have been cleared.`,
    });

    return;
  },
};

export default cleardmCommand;
