import { Message } from "discord.js";
import type { Manager } from "../index";

const usernbCommand = {
  execute: async (_manager: Manager, message: Message) => {
    await message.reply("The bot and selfbots are restarting...");

    process.exit(0);
  },
};

export default usernbCommand;
