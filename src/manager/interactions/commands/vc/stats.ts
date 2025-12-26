import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Stats
 * This command allows the selfbot user's to retrieve the server's icon
 */

const statsCommand: SlashCommand = {
  name: "stats",
  description: "Allows you to retrieve server's stats.",
  description_localizations: {
    fr: "Permet d'obtenir les statistiques d'un serveur.",
  },

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const serverId = interaction.guildId;

    if (!interaction.inGuild()) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un serveur pour utiliser cette commande !`
            : `You must be in a server to use this command!`,
      });
      return;
    }

    const server = selfbot.guilds.cache.get(serverId!)!;

    let voiceCount = 0;
    let mutedCount = 0;
    let deafCount = 0;
    let streamingCount = 0;
    let camCount = 0;
    server.channels.cache.forEach((channel) => {
      if (channel.type === "GUILD_VOICE") {
        channel.members.forEach((member) => {
          voiceCount++;
          if (member.voice.mute) mutedCount++;
          if (member.voice.deaf) deafCount++;
          if (member.voice.streaming) streamingCount++;
          if (member.voice.selfVideo) camCount++;
        });
      }
    });

    const vanityUses = server?.vanityURLUses ?? "";
    const vanityText = vanityUses
      ? interaction.locale === "fr"
        ? `\n> \`✨\` - Utilisations du lien personnalisé: ${vanityUses}`
        : `\n> \`✨\` - Vanity URL uses: ${vanityUses}`
      : "";
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${server.name} — Voice Stats`,
        iconURL: server!.iconURL()!,
      })
      .setDescription(
        interaction.locale === "fr"
          ? `> \`🎤\` - En vocal: \`${voiceCount}/${server.members.cache.size}\`\n > \`🔇\` - Muets: \`${mutedCount}\`\n > \`🎧\` - Casque désactivé: \`${deafCount}\`\n > \`🎥\` - En streaming: \`${streamingCount}\`\n> \`🙍\` - Caméra activée: \`${camCount}\`${vanityText}`
          : `> \`🎤\` - In voice: \`${voiceCount}/${server.members.cache.size}\`\n > \`🔇\` - Muted: \`${mutedCount}\`\n > \`🎧\` - Deafened: \`${deafCount}\`\n > \`🎥\` - Streaming: \`${streamingCount}\`\n> \`🙍\` - Cam enabled: \`${camCount}\`${vanityText}`
      )
      .setColor("#2b2d31")
      .setThumbnail(server?.iconURL({ size: 4096 }) || null);

    await interaction.editReply({
      embeds: [embed],
    });
    return;
  },
};

export default statsCommand;
