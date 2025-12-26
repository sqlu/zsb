import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";
import type { Manager } from "../index";

const db = new PrismaClient();

const restartusersCommand = {
  execute: async (manager: Manager, message: Message) => {
    const callback = await message.reply("Restart en cours...");

    manager.restartAllSelfbots();
    const userNb = await db.selfbot.count();

    await callback.edit({
      content: `\`${userNb}\` users ont bien restart.`,
    });

    return;
  },
};

export default restartusersCommand;
