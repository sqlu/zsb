
import { Message } from "discord.js";
import type { Manager } from "../index";


const usernbCommand = {
  execute: async (manager: Manager, message: Message) => {
    const callback = await message.reply("loading...");

    const userNb = manager.selfbots.size;

    callback.edit({
      content: `**\`${userNb}\`**`,
    });

    return;
  },
};

export default usernbCommand;
