import {
  ChannelType,
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { GuildTextBasedChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Create
 * This command allows the selfbot user to create a channel with specific options in a server
 */

const createCommand: SlashCommand = {
  name: "create",
  description: "Allows you to create a channel in a server.",
  description_localizations: {
    fr: "Permet de créer un salon dans un serveur.",
  },
  options: [
    {
      name: "type",
      description: "The type of the new channel.",
      type: 3,
      description_localizations: {
        fr: "Le type du nouveau salon.",
      },
      choices: [
        {
          name: "› 💬 - Text",
          value: "GUILD_TEXT",
        },
        {
          name: "› 🔊 - Voice",
          value: "GUILD_VOICE",
        },
      ],
      required: true,
    },
    {
      name: "name",
      description: "The name of the new channel.",
      type: 3,
      max_length: 30,
      description_localizations: {
        fr: "Le nom du nouveau salon.",
      },
      required: true,
    },
    {
      name: "category",
      description: "The category for the new channel.",
      type: 7,
      description_localizations: {
        fr: "La catégorie du nouveau salon.",
      },
      channel_types: [ChannelType.GuildCategory],
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

    const type = interaction.options.getString("type")! as "GUILD_TEXT";
    const name = interaction.options.getString("name")!;
    let category = interaction.options.getChannel("category")?.id;

    if (!category) {
      const channelId = interaction.channelId;
      const channel = selfbot.channels.cache.get(
        channelId
      ) as GuildTextBasedChannel;
      category = channel.parentId!;
    }

    const guildId = interaction.guildId;
    const guild = selfbot.guilds.cache.get(guildId);

    const newChannel = await guild!.channels
      .create(name, {
        type: type,
        parent: category,
      })
      .catch(() => {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous ne possédez pas les permissions nécessaires pour créer ce salon !`
              : `You do not have the necessary permissions to create this channel!`,
        });
      });

    if (!newChannel) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez créé le salon ${newChannel} avec succès !`
          : `You have successfully created the channel ${newChannel}!`,
    });

    return;
  },
};

export default createCommand;
