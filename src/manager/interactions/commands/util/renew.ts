import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Renew
 * This command allows the selfbot user to renew a channel
 */

const renewCommand: SlashCommand = {
  name: "renew",
  description: "Allows you to renew a channel.",
  description_localizations: {
    fr: "Permet renouveler un salon.",
  },
  options: [
    {
      name: "channel",
      description: "The channel that you wish to renew.",
      type: 7,
      description_localizations: {
        fr: "Le salon que vous souhaitez renouveler.",
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
      const newChannel = await channel.clone().catch(() => {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour renouveler un salon !`
              : `You do not have the necessary permissions to renew a channel!`,
        });
      });

      if (!newChannel) return;

      await channel.delete();
    } else {
      const newChannel = await channel.clone().catch(() => {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour renouveler un salon !`
              : `You do not have the necessary permissions to renew a channel!`,
        });
      });

      if (!newChannel) return;

      await channel.delete();

      const message = await newChannel.send(".");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await message.delete();

      await interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Le salon ${newChannel} a bien été renouvelé.`
            : `The channel ${newChannel} has been successfully renewed.`,
      });
    }

    return;
  },
};

export default renewCommand;
