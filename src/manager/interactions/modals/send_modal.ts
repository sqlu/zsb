import { MessageFlags, ModalSubmitInteraction } from "discord.js";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const sendModal = {
  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ModalSubmitInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const message = interaction.fields.getTextInputValue("message");
    const userId = interaction.customId.split("-")[1];

    const user = await selfbot.users.cache.get(userId)?.fetch();

    const dmChannel = await user!.createDM().catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Cette utilisateur n'accepte que les messages de ses amis.`
            : `This user only accepts messages from their friends.`,
      });
    });

    if (!dmChannel) return;

    const dm = await dmChannel.send({ content: message }).catch(() => {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Cette utilisateur n'accepte que les messages de ses amis.`
            : `This user only accepts messages from their friends.`,
      });
    });

    if (!dm) return;

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Votre message a bien été envoyé à ${user}.`
          : `Your message has been successfully sent to ${user}.`,
    });

    return;
  },
};

export default sendModal;
