import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  Message,
} from "discord.js";
import type { Manager } from "../index";

const pingCommand = {
  execute: async (_manager: Manager, message: Message) => {
    const embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle("› Login interface")
      .setDescription(
        "Please click on the button below to login.\n-# It is currently a BETA version so please be aware of any potential issues."
      );

    const button = new ButtonBuilder()
      .setURL("https://zsb.vercel.app/")
      .setLabel("› Login")
      .setStyle(ButtonStyle.Link);

    const button2 = new ButtonBuilder()
      .setURL("https://discord.gg/GKYyyG8NQA")
      .setLabel("› Need help?")
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      button,
      button2
    );

    if (message.channel.type !== ChannelType.GuildText) return;

    message.channel.send({
      embeds: [embed],
      components: [row],
    });

    return;
  },
};

export default pingCommand;
