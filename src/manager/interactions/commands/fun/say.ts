import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Say
 * This command allows the selfbot user to speak with the bot
 */

const sayCommand: SlashCommand = {
  name: "say",
  description: "Allows you to speak with the bot.",
  description_localizations: {
    fr: "Permet de parler avec le bot.",
  },
  options: [
    {
      name: "text",
      description: "The text that you want to say with the bot.",
      type: 3,
      description_localizations: {
        fr: "Le texte que vous souhaitez dire avec le bot.",
      },
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply();

    const text = interaction.options.getString("text")!;

    interaction
      .editReply({
        content: text,
      })
      .catch(() => {
        interaction.followUp({
          content:
            interaction.locale === "fr"
              ? `Je ne peux pas envoyer de message dans ce salon.`
              : `I can't send a message in this channel.`,
          flags: MessageFlags.Ephemeral,
        });
      });

    return;
  },
};

export default sayCommand;
