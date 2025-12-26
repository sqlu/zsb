import { PrismaClient } from "@prisma/client";
import { StringSelectMenuInteraction } from "discord.js";
import { VoiceChannel } from "discord.js-selfbot-v13";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const db = new PrismaClient();

const joinOptionsSelect = {
  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: StringSelectMenuInteraction
  ) => {
    await interaction.deferUpdate();

    const channelId = interaction.customId.split("-")[1];

    const channel = (await selfbot.channels.cache
      .get(channelId)
      ?.fetch()) as VoiceChannel;

    const selectedOptions = interaction.values;

    const voiceOptions = {
      selfMute: selectedOptions.includes("mute"),
      selfDeaf: selectedOptions.includes("deaf"),
      selfVideo: selectedOptions.includes("camera"),
    };

    await selfbot.voice.joinChannel(channel, voiceOptions);

    await db.selfbot.update({
      where: {
        token: selfbot.token,
      },
      data: {
        voiceOptions: {
          ...voiceOptions,
          voiceChannelId: channelId,
        },
      },
    });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez rejoint le salon vocal ${channel} avec succès !`
          : `You successfully joined the voice channel ${channel}!`,
      components: [],
    });

    return;
  },
};

export default joinOptionsSelect;
