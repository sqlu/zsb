import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Message } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Clear
 * This command allows the selfbot user to delete some messages from channel
 */

const clearCommand: SlashCommand = {
  name: "clear",
  description: "Allows you to delete a number of message.",
  description_localizations: {
    fr: "Permet de supprimer un nombre de messages.",
  },
  cooldown: 10000,
  options: [
    {
      name: "number",
      description: "The number of message that you want to delete.",
      type: 4,
      max_value: 100,
      min_value: 1,
      description_localizations: {
        fr: "Le nombre de message que vous souhaitez supprimer.",
      },
      required: true,
    },
    {
      name: "channel",
      description: "The channel where you want to clear.",
      type: 7,
      description_localizations: {
        fr: "Le salon où vous voulez clear.",
      },
      channel_types: [0, 2],
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const number = interaction.options.getInteger("number")!;
    let channelId = interaction.options.getChannel("channel")?.id;

    if (!channelId) {
      channelId = interaction.channelId;
    }

    const channel = (await selfbot.channels.cache
      .get(channelId)
      ?.fetch()
      ?.catch(() => {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour voir le channel !`
              : `You do not have the necessary permissions to see the channel !`,
        });
      })) as any;

    if (channel.id === channelId) {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous êtes en train supprimer \`${number}\` messages...`
            : `You are deleting \`${number}\` messages...`,
      });
    } else {
      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous êtes en train supprimer \`${number}\` messages dans ${channel}...`
            : `You are deleting \`${number}\` messages in ${channel}...`,
      });
    }

    const messages = await channel!.messages.fetch({ limit: number });
    await Promise.all(
      messages.map((message: Message) => message.delete().catch(() => false))
    );

    if (channel.id === channelId) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez supprimé \`${number}\` messages.`
            : `You have deleted \`${number}\` messages.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez supprimé \`${number}\` messages dans ${channel}.`
            : `You have deleted \`${number}\` messages in ${channel}.`,
      });
    }

    return;
  },
};

export default clearCommand;
