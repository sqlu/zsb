import { Message } from "discord.js";
import type { Manager } from "../index";

const pingCommand = {
  execute: async (_manager: Manager, message: Message) => {
    const callback = await message.reply("Pinging...");

    const RESTPing = callback.createdTimestamp - message.createdTimestamp;
    const WSPing = _manager.ws.ping;

    callback.edit({
      content: `> __**REST:**__ **\`${RESTPing}ms\`**\n> __**WS:**__ **\`${WSPing}ms\`**`,
    });

    return;
  },
};

export default pingCommand;
