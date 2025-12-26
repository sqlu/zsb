import { PrismaClient } from "@prisma/client";
import { Message, userMention } from "discord.js";
import { Selfbot } from "../../selfbot";
import type { Manager } from "../index";

const db = new PrismaClient();

const loginuserCommand = {
  execute: async (manager: Manager, message: Message) => {
    const args = message.content.split(" ").slice(1);
    if (!args[0]) {
      return message.reply(
        "Veuillez fournir un t0ken d'un utilisateur à connecter."
      );
    }

    const msg = await message.reply("Connection en cours...");

    try {
      const selfbot = new Selfbot();
      await selfbot._connect(args[0]).then(async (callback: Selfbot | null) => {
        if (!callback) {
          return msg.edit({
            content: `T0ken invalid.`,
          });
        }

        if (callback && callback.user) {
          manager.selfbots.set(callback.user.id, selfbot);

          await db.selfbot.create({
            data: {
              token: args[0],
            voiceOptions: {
              voiceChannelId: null,
              selfMute: true,
              selfDeaf: true,
              selfCamera: true,
            },
            afkOptions: {
              value: false,
              message: null,
            },
            },
          });
          await msg.edit({
            content: `${userMention(
              callback.user.id
            )} est désormais connecté au ZSB.`,
          });
        }
      });
    } catch (error) {
      await msg.edit({
        content: `Une erreur est survenue regarde la console fdp.`,
      });
    }

    return;
  },
};

export default loginuserCommand;
