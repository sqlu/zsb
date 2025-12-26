import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command unhide
 * This command allows the selfbot user to unhide a channel
 */

const unhideCommand: SlashCommand = {
  name: "unhide",
  description: "Allows you to unhide a channel.",
  description_localizations: {
    fr: "Permet de démasquer un salon.",
  },
  options: [
    {
      name: "channel",
      description: "The channel that you wish to unhide.",
      type: 7,
      description_localizations: {
        fr: "Le salon que vous souhaitez démasquer.",
      },
      channel_types: [0],
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (!interaction.inGuild()) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un serveur pour utiliser cette commande !`
            : `You must be in a server to use this command!`,
      });
      return;
    }

    let channelId = interaction.options.getChannel("channel")?.id;

    if (!channelId) {
      channelId = interaction.channelId;
    }

    let channel = (await selfbot.channels.cache
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

    try {
      await channel.permissionOverwrites.edit(interaction.guildId, {
        SEND_MESSAGES: false,
      });

      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le salon ${channel} a bien été masqué.`
            : `The channel ${channel} has been successfully unhidden.`,
      });
    } catch (err) {
      console.log(err);
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour démasquer un salon !`
            : `You do not have the necessary permissions to unhide a channel!`,
      });
    }

    return;
  },
};

export default unhideCommand;
