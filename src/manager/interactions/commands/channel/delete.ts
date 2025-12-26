import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Delete
 * This command allows the selfbot user to delete a channel from a server
 */

const deleteCommand: SlashCommand = {
  name: "delete",
  description: "Allows you to delete a channel from server.",
  description_localizations: {
    fr: "Permet de supprimer le salon d'un serveur.",
  },
  options: [
    {
      name: "channel",
      description: "The channel that you wish to delete.",
      type: 7,
      description_localizations: {
        fr: "Le salon que vous souhaitez supprimer.",
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

    let channelId = interaction.options.getChannel("channel")?.id;

    if (!channelId) {
      channelId = interaction.channelId;
    }

    let channel = (await selfbot.channels.cache.get(channelId)?.fetch()) as any;

    const channelName = channel!.name;

    await channel!.delete().catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour supprimer ce salon !`
            : `You do not have the necessary permissions to delete this channel!`,
      });
    });

    if (channel) return;

    interaction
      .editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez supprimé le salon \`${channelName}\` avec succès !`
            : `You have successfully deleted the channel \`${channelName}\`!`,
      })
      .catch(() => false);

    return;
  },
};

export default deleteCommand;
