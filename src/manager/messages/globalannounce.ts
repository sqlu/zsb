import { Message } from "discord.js";
import { Client } from "discord.js-selfbot-v13";
import type { Manager } from "../index";

const globalannounceCommand = {
  execute: async (manager: Manager, message: Message) => {
    const args = message.content.split(" ").slice(1);
    if (args.length === 0) {
      await message.reply("Veuillez fournir un message à envoyer.");
      return;
    }

    const announcement = args.join(" ");
    const users = Array.from(manager.selfbots.values()) as Client[];
    let successCount = 0;
    let failCount = 0;

    for (const user of users) {
      try {
        const member = await manager.users.fetch(user.user!.id);

        if (!member) {
          failCount++;
          continue;
        }
        
        await member.send(announcement)
        successCount++;
      } catch {
        failCount++;
      }
    }

    await message.reply(
      `Annonce envoyée à ${successCount} utilisateurs. ${failCount} échecs.`
    );
  },
};

export default globalannounceCommand;
