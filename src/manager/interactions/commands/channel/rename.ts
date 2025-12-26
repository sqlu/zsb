import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { TextChannel, VoiceChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";
/*
 * Command Rename
 * This command allows the selfbot user to rename a channel in a server
 */

const renameCommand: SlashCommand = {
  name: "rename",
  description: "Allows you to rename a channel in a server.",
  description_localizations: {
    fr: "Permet de renommer un salon dans un serveur.",
  },
  options: [
    {
      name: "name",
      description: "The new name of the channel.",
      type: 3,
      max_length: 30,
      description_localizations: {
        fr: "Le nouveau nom du salon.",
      },
      required: true,
    },
    {
      name: "channel",
      description: "The channel to rename.",
      type: 7,
      description_localizations: {
        fr: "Le salon à renommer.",
      },
      channel_types: [0, 2],
      required: false,
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
    const name = interaction.options.getString("name")!;

    if (!channelId) {
      channelId = interaction.channelId;
    }

    const channel = (await selfbot.channels.cache.get(channelId)?.fetch()) as
      | TextChannel
      | VoiceChannel;

    try {
      await channel.setName(name);
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez renommé le salon ${channel} en ${name} avec succès !`
            : `You have successfully renamed the channel ${channel} to ${name}!`,
      });
    } catch (error) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour renommer ce salon !`
            : `You do not have the necessary permissions to rename this channel!`,
      });
    }
  },
};

export default renameCommand;
