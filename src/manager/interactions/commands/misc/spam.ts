import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Spam
 * This command allows the selfbot user to spam a message
 */

const spamCommand: SlashCommand = {
  name: "spam",
  description: "Allows you to spam a message.",
  description_localizations: {
    fr: "Permet de spammer un message.",
  },
  cooldown: 15000,
  options: [
    {
      name: "time",
      description: "The number of times that you want to send the message.",
      type: 4,
      max_value: 30,
      min_value: 2,
      description_localizations: {
        fr: "Le nombre de fois que vous souhaitez envoyer le message.",
      },
      required: true,
    },
    {
      name: "message",
      description: "The message that you wish to spam.",
      type: 3,
      description_localizations: {
        fr: "Le message que vous souhaitez spammer.",
      },
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const time = interaction.options.getInteger("time")!;
    const message = interaction.options.getString("message")!;

    const channelId = interaction.channelId;
    const channel = (await selfbot.channels.cache
      .get(channelId)
      ?.fetch()) as any;

    if (!channel) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne pouvez pas spammer un message dans ce salon.`
            : `You cannot spam a message in this channel.`,
      });
      return;
    }

    if (!channel.isText()) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne pouvez pas spammer un message dans ce salon.`
            : `You cannot spam a message in this channel.`,
      });
      return;
    }

    await interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous êtes en train de spammer \`${time}\` fois le message...`
          : `You are spamming \`${time}\` times the message...`,
    });

    for (let i = 0; i < time; i++) {
      channel.send(message);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez spammer \`${time}\` fois le message.`
          : `You have spammed \`${time}\` times the message.`,
    });

    return;
  },
};

export default spamCommand;
