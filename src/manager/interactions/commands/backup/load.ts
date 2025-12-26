import { PrismaClient } from "@prisma/client";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    EmbedBuilder,
    MessageFlags,
    StringSelectMenuBuilder
} from "discord.js";
import { Guild } from "discord.js-selfbot-v13";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";
import { JsonObject } from "@prisma/client/runtime/library";

const translations: any = {
    en: {
        roles: "Roles",
        channels: "Channels",
        bans: "Bans",
        emojis: "Emojis"
    },
    fr: {
        roles: "Rôles",
        channels: "Salons",
        bans: "Bannissements",
        emojis: "Emojis"
    }
};
const prisma = new PrismaClient();
const loadCommand: SlashCommand = {
    name: "load",
    description: "Load a server backup",
    description_localizations: {
        fr: "Charger une backup de serveur",
    },
    cooldown: 30000,
    options: [
        {
            name: "backup",
            description: "The backup to load",
            description_localizations: {
                fr: "La backup à charger",
            },
            type: 3,
            required: true,
            async autocomplete(_manager: Manager, selfbot: Selfbot) {
                if (!selfbot?.token) return [];
                const backups = await prisma.backup.findMany({
                    where: {
                        selfbotToken: selfbot.token,
                    },
                });
                return backups
                    .map((backup) => ({
                        name: `› ${backup.name}`,
                        value: backup.name,
                    }))

            },
        },
    ],

    execute: async (
        manager: Manager,
        selfbot: Selfbot,
        interaction: ChatInputCommandInteraction
    ) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        const backupName = interaction.options.getString("backup")!;

        const backupData = await prisma.backup.findFirst({
            where: {
                name: backupName,
                selfbotToken: selfbot!.token,
            },
            select: {
                data: true,
                guildName: true,
                date: true,
                channelCount: true,
                roleCount: true,
                categoryCount: true
            }
        });

        if (!backupData) {
            await interaction.editReply({
                content: interaction.locale === "fr"
                    ? "❌ Cette backup n'existe pas!"
                    : "❌ This backup doesn't exist!",
            });
            return;
        }

        const defaultOptions = {
            emojis: false,
            roles: true,
            bans: false,
            channels: true,
        };

        const formattedDate = new Date(backupData.date).toLocaleDateString();

        const embed = new EmbedBuilder()
            .setColor("#2f3136")
            .setTitle(interaction.locale === "fr" ? "🔄 Chargement de backup" : "🔄 Loading backup")
            .setDescription(
                interaction.locale === "fr"
                    ? `**__Informations de la backup:__**\n\`\`\`\nDate: ${formattedDate}\nSalons: ${backupData.channelCount}\nCatégories: ${backupData.categoryCount}\nRôles: ${backupData.roleCount}\`\`\``
                    : `**__Backup Information:__**\n\`\`\`\nDate: ${formattedDate}\nChannels: ${backupData.channelCount}\nCategories: ${backupData.categoryCount}\nRoles: ${backupData.roleCount}\`\`\``
            );

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId("backup_load_options")
            .setMinValues(1)
            .setMaxValues(4)
            .setPlaceholder(interaction.locale === "fr" ? "Sélectionnez les éléments..." : "Select elements...")
            .addOptions([
                {
                    label: interaction.locale === "fr" ? "Rôles" : "Roles",
                    value: "roles",
                    emoji: "🎭",
                    default: defaultOptions.roles
                },
                {
                    label: interaction.locale === "fr" ? "Salons" : "Channels",
                    value: "channels",
                    emoji: "📚",
                    default: defaultOptions.channels
                },
                {
                    label: interaction.locale === "fr" ? "Bannissements" : "Bans",
                    value: "bans",
                    emoji: "⛔",
                    default: defaultOptions.bans
                },
                {
                    label: interaction.locale === "fr" ? "Emojis" : "Emojis",
                    value: "emojis",
                    emoji: "😀",
                    default: defaultOptions.emojis
                },
            ]);

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("backup_load_start")
                    .setLabel(interaction.locale === "fr" ? "Démarrer" : "Start")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("backup_load_cancel")
                    .setLabel(interaction.locale === "fr" ? "Annuler" : "Cancel")
                    .setStyle(ButtonStyle.Danger)
            );

        const components = [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu),
            buttons,
        ];

        const reply = await interaction.editReply({
            embeds: [embed],
            components,
        });

        const collector = reply.createMessageComponentCollector({
            time: 300000,
        });

        let selectedOptions: string[] = ["roles", "channels"];
        const guild = await selfbot.guilds.fetch(interaction.guildId!);
        collector.on("collect", async (i) => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({
                    content: interaction.locale === "fr"
                        ? "❌ Vous ne pouvez pas utiliser cette interaction!"
                        : "❌ You cannot use this interaction!",
                    ephemeral: true,
                });
                return;
            }

            if (i.customId === "backup_load_options") {
                // @ts-ignore
                selectedOptions = i.values;

                selectedOptions.map(opt =>
                    interaction.locale === "fr"
                        ? translations.fr[opt]
                        : translations.en[opt]
                ).join(" / ")
            }

            if (i.customId === "backup_load_start" && selectedOptions.length > 0) {
                try {
                    await i.update({
                        content: interaction.locale === "fr"
                            ? "🔄 Chargement en cours..."
                            : "🔄 Loading in progress...",
                        components: [],
                        embeds: [],
                    });

                    const loadOptions = {
                        roles: selectedOptions.includes("roles"),
                        channels: selectedOptions.includes("channels"),
                        bans: selectedOptions.includes("bans"),
                        emojis: selectedOptions.includes("emojis"),
                        maxMessagesPerChannel: 0,
                        clearGuildBeforeRestore: true
                    };

                    await loadBackup(backupData.data as JsonObject, guild, loadOptions);

                    await manager.sendPrivateMessage(
                        interaction.user.id,
                        interaction.locale === "fr"
                            ? "✅ Backup chargée avec succès!"
                            : "✅ Backup loaded successfully!"
                    );
                } catch (error) {
                    console.error(error);
                    await i.update({
                        content: interaction.locale === "fr"
                            ? "❌ Une erreur est survenue lors du chargement de la backup!"
                            : "❌ An error occurred while loading the backup!",
                        components: [],
                        embeds: [],
                    });
                    await manager.sendPrivateMessage(
                        interaction.user.id,
                        interaction.locale === "fr"
                            ? "❌ Une erreur est survenue lors du chargement de la backup!"
                            : "❌ An error occurred while loading the backup!"
                    );
                    return;

                }
                collector.stop();
            }

            if (i.customId === "backup_load_cancel") {
                await i.update({
                    content: interaction.locale === "fr"
                        ? "❌ Chargement annulé!"
                        : "❌ Loading cancelled!",
                    components: [],
                    embeds: [],
                });
                collector.stop();
            }
        });

        collector.on("end", (_, reason) => {
            if (reason === "time") {
                interaction.editReply({
                    content: interaction.locale === "fr"
                        ? "❌ Temps écoulé!"
                        : "❌ Time's up!",
                    components: [],
                    embeds: [],
                });
            }
        });
    },
};

export default loadCommand;

async function loadBackup(data: JsonObject, guild: Guild, options: {
    roles: boolean,
    channels: boolean,
    bans: boolean,
    emojis: boolean
}) {
    try {
        if (options.channels) {
            await Promise.all(guild.channels.cache.map(channel => channel.delete()));
        }
        if (options.roles) {
            await Promise.all(guild.roles.cache
                .filter(role => role.editable && !role.managed)
                .map(role => role.delete()));
        }
        if (options.emojis) {
            await Promise.all(guild.emojis.cache.map(emoji => emoji.delete()));
        }
        if (options.bans) {
            const bans = await guild.bans.fetch();
            await Promise.all(bans.map(ban => guild.bans.remove(ban.user)));
        }

        if (options.roles) {
            for (const roleData of [...(data.roles as any[])].reverse()) {
                await guild.roles.create({
                    name: roleData.name,
                    color: roleData.color,
                    hoist: roleData.hoist,
                    position: roleData.position,
                    permissions: roleData.permissions,
                    mentionable: roleData.mentionable
                });
            }
        }

        if (options.channels) {
            const channels = Array.isArray((data.channels as any[])) ? (data.channels as any[]) : [];
            for (const channelData of channels.filter((c: any) => c.type === 4)) {
                await guild.channels.create(channelData.name, {
                    type: channelData.type,
                    position: channelData.position,
                    permissionOverwrites: channelData.permissionOverwrites
                });
            }

            for (const channelData of channels.filter((c: any) => c.type !== 4)) {
                await guild.channels.create(channelData.name, {
                    type: channelData.type,
                    position: channelData.position,
                    topic: channelData.topic,
                    nsfw: channelData.nsfw,
                    bitrate: channelData.bitrate,
                    userLimit: channelData.userLimit,
                    rateLimitPerUser: channelData.rateLimitPerUser,
                    parent: channelData.parentId,
                    permissionOverwrites: channelData.permissionOverwrites
                });
            }
        }

        if (options.emojis) {
            for (const emojiData of (data.emojis as any[])) {
                await guild.emojis.create(emojiData.name, emojiData.url);
            }
        }

        if (options.bans) {
            for (const banData of (data.bans as any[])) {
                await guild.bans.create(banData.userId, {
                    reason: banData.reason
                });
            }
        }

        return true;
    } catch (error) {
        console.error('Erreur lors du chargement de la backup:', error);
        return false;
    }
}
