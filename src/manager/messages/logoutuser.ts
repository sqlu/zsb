import { PrismaClient } from "@prisma/client";
import { Message } from "discord.js";
import type { Manager } from "../index";

const db = new PrismaClient();

const logoutuserCommand = {
  execute: async (manager: Manager, message: Message) => {
    const args = message.content.split(" ").slice(1);
    if (!args[0]) {
      return message.reply(
        "Veuillez fournir un ID d'utilisateur ou mentionner un utilisateur à déconnecter."
      );
    }

    const userId =
      message.mentions.users.first()?.id || args[0].replace(/[<@!>]/g, "");

    const callback = await message.reply("Déconnexion en cours...");

    try {
      const selfbot = manager.selfbots.get(userId);
      if (!selfbot?.token)
        return await callback.edit({
          content: `L'utilisateur n'est pas connecté.`,
        });
      if (selfbot.token) {
        await db.selfbot.delete({
          where: {
            token: selfbot.token,
          },
        });
        manager.stopSelfbot(userId);
        manager.selfbots.delete(userId);
      }

      await callback.edit({
        content: `L'utilisateur avec l'ID **\`${userId}\`** a été déconnecté avec succès.`,
      });
    } catch {
      await callback.edit({
        content: `L'utilisateur n'est pas connecté. (erreur)`,
      });
    }

    return;
  },
};

export default logoutuserCommand;
