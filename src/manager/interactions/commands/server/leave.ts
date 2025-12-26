import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Leave
 * This command allows the selfbot user's to leave a server
 */

const avatarCommand: SlashCommand = {
  name: "leave",
  description: "Allows you to leave a server.",
  description_localizations: {
    fr: "Permet de quitter un serveur.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const serverId = interaction.guildId;

    const server = selfbot.guilds.cache.get(serverId!)!;

    server.leave();
    return;
  },
};

export default avatarCommand;
