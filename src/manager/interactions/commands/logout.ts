import { PrismaClient } from "@prisma/client";
import {
  APIEmbed,
  ChatInputCommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { SlashCommand } from "../../../types/slashCommand";
import { Manager } from "../../index";

const db = new PrismaClient();

/*
 * Command Logout
 * This command allows the selfbot user to logout from the SB
 */

const logoutCommand: SlashCommand = {
  name: "logout",
  description: "Allows you to logout from ZSB.",
  description_localizations: {
    fr: "Permet de se déconnecter de ZSB.",
  },

  execute: async (
    manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    
    await selfbot._disconnect();
    manager.selfbots.delete(selfbot.user.id);
    await db.selfbot.delete({
      where: {
        token: selfbot.token,
      },
     
    });

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setTitle("› Disconnection")
      .setDescription(
        `**${selfbot.user.username}** is now disconnected from ZSB!`
      ) as APIEmbed;

    manager.sendWehbook(embed);

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez été déconnecté avec succès de ZSB.`
          : `You've been sucessfully disconnected from ZSB.`,
    });
  
    return;
  },
};

export default logoutCommand;
