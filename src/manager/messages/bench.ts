import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CollectedInteraction,
  EmbedBuilder,
  Message,
} from "discord.js";
import os from "os";
import type { Manager } from "../index";

const benchCommand = {
  execute: async (_manager: Manager, message: Message) => {
    if (!message.channel.isTextBased()) return;
    const arab = () => ({
      OS: {
        platform: os.platform(),
        type: os.type(),
        release: os.release(),
        arch: os.arch(),
      },
      CPU: {
        model: os.cpus()[0].model,
        cores: os.cpus().length,
        speed: `${os.cpus()[0].speed} MHz`,
        loadAvg: os.loadavg(),
      },
      Memory: {
        total: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        used: `${((os.totalmem() - os.freemem()) / 1024 / 1024 / 1024).toFixed(
          2
        )} GB`,
      },
      System: {
        uptime: `<t:${Math.floor(Date.now() / 1000 - os.uptime())}:R>`,
        hostname: os.hostname(),
        homedir: os.homedir(),
        tempdir: os.tmpdir(),
      },
    });

    const euhnegro = () => {
      const stats = arab();
      const embed = new EmbedBuilder()
        .setTitle("📊 Statistiques Système")
        .addFields(
          {
            name: "Système",
            value: `Platform: **\`${stats.OS.platform}\`**\nOS: **\`${stats.OS.type} ${stats.OS.release}\`**\nArchitecture: **\`${stats.OS.arch}\`**\nHostname: **\`${stats.System.hostname}\`**`,
          },
          {
            name: "CPU",
            value: `Modèle: **\`${stats.CPU.model}\`**\nCoeurs: **\`${stats.CPU.cores}\`**\nVitesse: **\`${stats.CPU.speed}\`**`,
          },
          {
            name: "Mémoire",
            value: `**\`${stats.Memory.used}/${stats.Memory.total}\`**`,
          },
          {
            name: "Système",
            value: `Uptime: ${stats.System.uptime}`,
          }
        );
      return embed;
    };

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("reload")
        .setEmoji("1265065477273554985")
        .setStyle(ButtonStyle.Primary)
    );

    const response = await message.reply({
      embeds: [euhnegro()],
      components: [row],
    });

    const filter: any = (i: CollectedInteraction) =>
      i.user.id === message.author.id;
    const collector = response.createMessageComponentCollector({
      filter,
      time: 60000,
    });

    collector.on("collect", async (i: CollectedInteraction) => {
      await i.deferUpdate();
      await i.editReply({ embeds: [euhnegro()] });
    });

    collector.on("end", () => {
      row.components.forEach((component) => component.setDisabled(true));
      response.edit({ components: [row] });
    });
  },
};

export default benchCommand;
