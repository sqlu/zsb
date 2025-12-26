import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { SlashCommand } from "../../../types/slashCommand";
import { Manager } from "../../index";

/*
 * Command Dashboard
 * This command allows the selfbot user to got to the dashboard
 */

const dashboardCommand: SlashCommand = {
  name: "dashboard",
  description: "Allows you to go to the dashboard.",
  description_localizations: {
    fr: "Permet d'accéder au Dashboard.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const dashboardButton = new ButtonBuilder()
      .setLabel("› Dashboard")
      .setURL("https://zsb.vercel.app" + "/dashboard/" + selfbot.token)
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      dashboardButton
    );

    interaction.editReply({
      components: [row]
    });

    return;
  },
};

export default dashboardCommand;
