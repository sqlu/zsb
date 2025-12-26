import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { VoiceChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command DDOS
 * This command allows the selfbot user to DDOS a voice channel
 */

const ddosCommand: SlashCommand = {
  name: "ddos",
  description: "Allows you to DDOS a voice channel.",
  description_localizations: {
    fr: "Permet de DDOS un salon vocal.",
  },
  cooldown: 15000,
  options: [
    {
      name: "channel",
      description: "The voice channel that you wish to DDOS.",
      description_localizations: {
        fr: "Le salon vocal que vous souhaitez DDOS.",
      },
      type: 7,
      channel_types: [2],
      required: true,
    },
    {
      name: "time",
      description: "The time that you wish to DDOS the voice channel.",
      description_localizations: {
        fr: "Le temps pour lequel vous voulez DDOS le salon vocal.",
      },
      max_value: 15,
      min_value: 1,
      type: 4,
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const channelId = interaction.options.getChannel("channel")!.id;
    const time = interaction.options.getInteger("time")!;

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
      })) as VoiceChannel;

    const originalRegion = channel.rtcRegion;

    const regions = [
      "brazil",
      "hongkong",
      "india",
      "japan",
      "rotterdam",
      "russia",
      "singapore",
      "south-korea",
      "southafrica",
      "sydney",
      "us-central",
      "us-east",
      "us-south",
      "us-west",
    ];

    await channel.setRTCRegion("hongkong").catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour DDOS un salon vocal !`
            : `You do not have the necessary permissions to DDOS a voice channel!`,
      });
    });

    if (channel.rtcRegion === originalRegion) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous etes en train de DDOS le salon vocal ${channel.name}...`
          : `You are currently DDOSing the voice channel ${channel}...`,
    });

    for (let i = 0; i < time; i++) {
      try {
        const newRandom = Math.floor(Math.random() * regions.length);
        await channel.setRTCRegion(regions[newRandom]);
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    await channel.setRTCRegion(originalRegion);

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez DDOS le salon vocal ${channel} avec succès !`
          : `You successfully DDOSed the voice channel ${channel}!`,
    });

    return;
  },
};

export default ddosCommand;
