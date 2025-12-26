import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Leave
 * This command allows the selfbot user to leave a group
 */

const leaveCommand: SlashCommand = {
  name: "leave",
  description: "Allows you to leave a group",
  description_localizations: {
    fr: "Permet de quitter un groupe",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const channelId = interaction.channelId;
    const channel = (await selfbot.channels.cache
      .get(channelId)
      ?.fetch()) as any;

    if (channel!.type === "GROUP_DM") {
      await channel.delete();
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un groupe pour utiliser cette commande.`
            : `You must be in a group to use this command.`,
      });
    }

    return;
  },
};

export default leaveCommand;
