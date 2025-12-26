import { APIEmbed, EmbedBuilder } from "discord.js";
import { Manager } from "./manager";

export const manager = new Manager();

const sendErrorToChannel = async (message: string) => {
  const embed = new EmbedBuilder()
    .setDescription(`\`\`\`\n${message}\n\`\`\``)
    .setColor("Red")
    .setTitle("› Error") as APIEmbed;

  manager.sendWehbook(embed);
};

const errorHandler = (error: any) => {
  console.error(error);
  sendErrorToChannel(error?.stack ?? error?.message ?? String(error));
};

process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);
process.on("rejectionHandled", errorHandler);
process.on("warning", errorHandler);
manager.on("error", errorHandler);
