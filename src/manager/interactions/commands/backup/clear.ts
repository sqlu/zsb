import { PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";
const prisma = new PrismaClient();
const clearCommand: SlashCommand = {
    name: "clear",
    description: "Delete all your backups",
    description_localizations: {
        fr: "Supprime toutes vos backups",
    },
    cooldown: 10000,

    execute: async (
        _manager: Manager,
        selfbot: Selfbot,
        interaction: ChatInputCommandInteraction
    ) => {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });

        try {
            const backups = await prisma.backup.findMany({
                where: {
                    selfbotToken: selfbot.token
                }
            });

            if (backups.length === 0) {
                  interaction.editReply({
                    content: interaction.locale === "fr"
                        ? "Vous n'avez aucune backup !"
                        : "You don't have any backups!"
                });
                return;
            }

            await prisma.backup.deleteMany({
                where: {
                    selfbotToken: selfbot.token
                }
            });

            interaction.editReply({
                content: interaction.locale === "fr"
                    ? `✅ ${backups.length} backups ont été supprimées avec succès !`
                    : `✅ Successfully deleted ${backups.length} backups!`
            });

            return;
        } catch (error) {
            console.error(error);
            interaction.editReply({
                content: interaction.locale === "fr"
                    ? "❌ Une erreur est survenue lors de la suppression des backups !"
                    : "❌ An error occurred while deleting backups!"
            });

            return;
        }

    }
};

export default clearCommand;
