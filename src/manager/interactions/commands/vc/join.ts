import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  MessageFlags,
  StringSelectMenuBuilder,
} from "discord.js";
import { VoiceChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

const joinCommand: SlashCommand = {
  name: "join",
  description: "Allows you to join a voice channel with options.",
  description_localizations: {
    fr: "Permet de rejoindre un salon vocal avec des options.",
  },
  cooldown: 10000,
  options: [
    {
      name: "channel",
      description: "The voice channel that you wish to join.",
      description_localizations: {
        fr: "Le salon vocal que vous souhaitez rejoindre.",
      },
      type: 7,
      channel_types: [2],
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
        return undefined;
      })) as VoiceChannel | undefined;

    if (!channel) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour rejoindre ce salon vocal !`
            : `You do not have the necessary permissions to join this voice channel!`,
      });
      return;
    }

    if (!channel.joinable) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne possédez pas les permissions nécessaires pour rejoindre ce salon vocal !`
            : `You do not have the necessary permissions to join this voice channel!`,
      });
      return;
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`join_options_select-${channelId}`)
      .setPlaceholder(
        interaction.locale === "fr"
          ? "Sélectionnez vos options d'autoVc"
          : "Select your autoVc options"
      )
      .setMinValues(0)
      .setMaxValues(3)
      .addOptions([
        {
          label: interaction.locale === "fr" ? "› 🔇 Muet" : "› 🔇 Mute",
          value: "mute",
          description:
            interaction.locale === "fr"
              ? "Permet de rejoindre en étant muet"
              : "Allows you to join muted",
        },
        {
          label: interaction.locale === "fr" ? "› 🎧 Sourd" : "› 🎧 Deaf",
          value: "deaf",
          description:
            interaction.locale === "fr"
              ? "Permet de rejoindre en étant sourd"
              : "Allows you to join deaf",
        },
        {
          label: interaction.locale === "fr" ? "› 🎥 Caméra" : "› 🎥 Camera",
          value: "camera",
          description:
            interaction.locale === "fr"
              ? "Permet de rejoindre avec la caméra activée"
              : "Allows you to join with the camera activated",
        },
      ]);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu
    );

    await interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Sélectionnez les options pour rejoindre le salon ${channel} :`
          : `Select options to join the voice channel ${channel}:`,
      components: [row],
    });
  },
};

export default joinCommand;
