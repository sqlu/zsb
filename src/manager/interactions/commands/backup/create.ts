import { PrismaClient } from "@prisma/client";
import * as backup from "backupie";
import {
    ChatInputCommandInteraction,
    MessageFlags
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";
const prisma = new PrismaClient();
const createCommand: SlashCommand = {
    name: "create",
    description: "Create a backup of the current server",
    description_localizations: {
        fr: "Créer une backup du serveur actuel",
    },
    cooldown: 15000,
    options: [
        {
            name: "name",
            description: "The name of the backup",
            description_localizations: {
                fr: "Le nom de la backup",
            },
            type: 3,
            required: true,
            max_length: 32,
            min_length: 3,
        },
    ],

    execute: async (
        _manager: Manager,
        selfbot: Selfbot,
        interaction: ChatInputCommandInteraction
    ) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const name = interaction.options.getString("name")!;

            const existingBackup = await prisma.backup.findFirst({
                where: {
                    name: name,
                    selfbotToken: selfbot.token,
                },
            });

            if (existingBackup) {
                await interaction.editReply({
                    content: interaction.locale === "fr"
                        ? `Une backup nommée \`${name}\` existe déjà!`
                        : `A backup named \`${name}\` already exists!`,
                });
                return;
            }

            const startTime = Date.now();


            const backupData = await backup.create(interaction.guild!, {
                maxMessagesPerChannel: 0,
                doNotBackup: ["messages"],
            });

            const uniqueID = Math.random().toString(36).substring(2, 15);

            await prisma.backup.create({
                data: {
                    name: name,
                    selfbotToken: selfbot.token,
                    data: JSON.parse(JSON.stringify(backupData)),
                    guildName: interaction.guild!.name,
                    date: new Date(),
                    id: uniqueID,
                    channelCount: backupData.channels.categories.reduce((acc, cat) =>
                        acc + cat.children.filter(ch => ch.type === 0 || ch.type === 2).length, 0),
                    roleCount: backupData.roles.length,
                    categoryCount: backupData.channels.categories.length
                },
            });

            const timeElapsed = Date.now() - startTime;
            await interaction.editReply({
                content: interaction.locale === "fr"
                    ? `✅ Backup \`${name}\` créée avec succès en ${timeElapsed}ms!`
                    : `✅ Successfully created backup \`${name}\` in ${timeElapsed}ms!`,
            });

        } catch (error) {
            await interaction.editReply({
                content: interaction.locale === "fr"
                    ? "❌ Une erreur est survenue lors de la création de la backup!"
                    : "❌ An error occurred while creating the backup!",
            });
        };
    }
}

export default createCommand;
