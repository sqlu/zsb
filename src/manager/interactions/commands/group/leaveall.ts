import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command LeaveAll
 * This command allows the selfbot user to leave all his groups
 */

const leaveCommand: SlashCommand = {
  name: "leaveall",
  description: "Allows you to leave all your groups",
  description_localizations: {
    fr: "Permet de quitter tous vos groupes",
  },
  cooldown: 120000,

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    selfbot.channels.cache
      .filter((channel) => channel.type === "GROUP_DM")
      .forEach(async (dmChannel) => {
        await dmChannel.delete().catch(() => false);
      });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez quitté tous vos groupes.`
          : `You have left all your groups.`,
    });

    return;
  },
};

export default leaveCommand;
