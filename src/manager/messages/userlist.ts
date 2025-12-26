import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CollectedInteraction,
  EmbedBuilder,
  Message,
  userMention,
} from "discord.js";
import { Client } from "discord.js-selfbot-v13";
import type { Manager } from "../index";

const userlistCommand = {
  execute: async (manager: Manager, message: Message) => {
    const users = [] as Client[];
    const selfbot = Array.from(manager.selfbots.values());

    for (let i = 0; i < manager.selfbots.size; i++) {
      users.push(selfbot[i]);
    }

    const itemsPerPage = 15;
    let currentPage = 0;
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const generateEmbed = (page: number) => {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const userList = users.slice(start, end);

      return new EmbedBuilder()
        .setAuthor({
          name: `${manager.user.displayName} — Liste des utilisateurs`,
          iconURL: manager.user.avatarURL({ size: 1024 })!,
        })
        .setDescription(
          userList
            .map(
              (selfbot: Client, i: number) =>
                `> ${start + i + 1}. ${selfbot.user!.username} | ${
                  selfbot.user!.displayName
                }** | **${userMention(selfbot.user!.id)}** (\`${
                  selfbot.user!.id
                }\`)`
            )
            .join("\n")
        )
        .setColor("#2b2d31")
        .setFooter({ text: `Page ${page + 1} sur ${totalPages}` });
    };

    const embed = generateEmbed(currentPage);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel("› Previous")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel("› Next")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === totalPages - 1)
    );

    const msg = await message.reply({
      embeds: [embed],
      components: [row],
    });

    const filter: any = (i: CollectedInteraction) =>
      i.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "previous") {
        currentPage--;
      } else if (i.customId === "next") {
        currentPage++;
      }

      const newEmbed = generateEmbed(currentPage);
      const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("previous")
          .setLabel("› Previous")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(currentPage === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("› Next")
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(currentPage === totalPages - 1)
      );

      await i.update({ embeds: [newEmbed], components: [newRow] });
    });

    collector.on("end", async () => {
      if (message.channel) {
        if (msg.components) {
          msg.components.forEach((row) => {
            row.components.forEach((component) => {
              // @ts-ignore
              component.data.disabled = true;
            });
          });
          await msg.edit({ components: msg.components }).catch(() => {});
        }
      }
      return;
    });
  },
};

export default userlistCommand;
