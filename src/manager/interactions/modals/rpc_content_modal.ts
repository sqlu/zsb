import { PrismaClient } from "@prisma/client";
import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const db = new PrismaClient();

const sendModal = {
  execute: async (
    manager: Manager,
    selfbot: Selfbot,
    interaction: ModalSubmitInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const id = interaction.customId.split("-")[1];

    const name = manager.cache.get(`rpc-${id}`)?.name;
    const image = manager.cache.get(`rpc-${id}`)?.image;
    const type = manager.cache.get(`rpc-${id}`)?.type;

    const title = interaction.fields.getTextInputValue("title");
    const description = interaction.fields.getTextInputValue("description");

    selfbot.richPresences.set(name, {
      name: name,
      title: title,
      description: description,
      type: type,
      imageURL: image === "" ? null : image,
    });

    await db.richPresence.create({
      data: {
        name: name,
        title: title,
        description: description,
        type: type,
        imageURL: image === "" ? null : image,
        selfbot: {
          connect: {
            token: selfbot.token
          }
        }
      },
    });

    await interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez créé la rich presence \`${name}\` avec succès !`
          : `You have successfully created the rich presence \`${name}\`!`,
    });

    return;
  },
};

export default sendModal;
