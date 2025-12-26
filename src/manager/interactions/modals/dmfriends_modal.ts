import { MessageFlags, ModalSubmitInteraction, userMention } from "discord.js";
import { Selfbot } from "../../../selfbot/index";
import { Manager } from "../../index";

const dmFriendsModal = {
  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ModalSubmitInteraction
  ) => {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      let successCount = 0;
      const totalFriends = selfbot.relationships.friendCache.size;
      const message = interaction.fields.getTextInputValue("message");

        await interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous êtes en train d'envoyer le message à \`${totalFriends}\` amis...`
              : `You are sending the message to \`${totalFriends}\` friends...`,
        });
      

      for (const [, value] of selfbot.relationships.friendCache) {
        if (value) {
          try {
            const dmChannel = await selfbot.users.createDM(value.id).catch(() => null);
            if (!dmChannel) continue;
            await dmChannel.send(
              message.replaceAll("{user}", userMention(value.id))
            );
            successCount++;
          } catch  {}
        }
        await selfbot.sleep(1337);
      }

        await interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous avez envoyé le message à \`${successCount}/${totalFriends}\` amis avec succès !`
              : `You successfully have sent the message to \`${successCount}/${totalFriends}\` friends!`,
        });
      
    
  },
};

export default dmFriendsModal;
