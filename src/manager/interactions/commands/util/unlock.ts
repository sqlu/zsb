import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Unlock
 * This command allows the selfbot user to unlock a channel
 */

const unlockCommand: SlashCommand = {
  name: "unlock",
  description: "Allows you to unlock a channel.",
  description_localizations: {
    fr: "Permet déverrouiller un salon.",
  },
  options: [
    {
      name: "channel",
      description: "The channel that you wish to unlock.",
      type: 7,
      description_localizations: {
        fr: "Le salon que vous souhaitez déverrouiller.",
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
            ? `Le salon ${channel} a bien été déverrouillé.`
            : `The channel ${channel} has been successfully unlocked.`,
      });
    } catch (err) {
      console.log(err);
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour déverrouiller un salon !`
            : `You do not have the necessary permissions to unlock a channel!`,
      });
    }

    return;
  },
};

export default unlockCommand;
