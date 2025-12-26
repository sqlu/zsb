import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { SlashCommand } from "../../../types/slashCommand";
import { Manager } from "../../index";

/*
 * Command Token
 * This command allows the selfbot user to see their token.
 */

const pingCommand: SlashCommand = {
  name: "token",
  description: "Shows your discord token.",
  description_localizations: {
    fr: "Affiche votre token discord.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Votre token est: ||${selfbot.token}||\n-# ➜ Nous vous conseillons de ne pas le partager publiquement.`
          : `Your token is: ||${selfbot.token}||\n-# ➜ We advise you not to share it publicly.`,
    });

    return;
  },
};

export default pingCommand;
