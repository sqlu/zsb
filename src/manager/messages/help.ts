import { Message } from "discord.js";
import { Manager } from "../../manager/index";

const helpCommand = {
  execute: async (_manager: Manager, message: Message) => {
    const callback = await message.reply("loading...");

    const response =
      "### ❓ Help Menu\n" +
      "> ping\n" +
      "> restart\n" +
      "> usernb\n" +
      "> userlist\n" +
      "> loginuser <USER_TOKEN>\n" +
      "> logoutuser <USER_ID>\n" +
      "> restartuser <USER_ID>\n" +
      "> bench \n" +
      "> globalannounce <MESSAGE> \n" +
      "> sendloginform\n";

    callback.edit({
      content: response,
    });

    return;
  },
};

export default helpCommand;
