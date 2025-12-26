import { PrismaClient } from "@prisma/client";
import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const db = new PrismaClient();

const afkModal = {
  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ModalSubmitInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const reason = interaction.fields.getTextInputValue("message");

    selfbot.afkOptions.message = reason;

    await db.selfbot.update({
      where: {
        token: selfbot.token,
      },
      data: {
        afkOptions: { message: reason, value: selfbot.afkOptions.value },
      },
    });

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Votre message d'AFK a été mises à jour avec succès !`
          : `Your AFK message has been successfully updated!`,
    });
  },
};

export default afkModal;
