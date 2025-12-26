import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Token Grab
 * This command allows the selfbot user to get a part of a user's token
 */

const tokenGrabCommand: SlashCommand = {
  name: "tokengrab",
  description: "Allows you to get a part of a user's token.",
  description_localizations: {
    fr: "Permet de obtenir une partie du token d'un utilisateur.",
  },
  options: [
    {
      name: "user",
      description: "The user that you wish to get a part of their token.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur dont vous souhaitez obtenir une partie du token.",
      },
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const userId = interaction.options.getUser("user")!.id;

    const user = selfbot.users.cache.get(userId);

    const decoded = Buffer.from(userId).toString("base64").replace("==", "");

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Le début du token de ${user} est \`${decoded}*********************************\`.`
          : `The beginning of ${user}'s token is \`${decoded}*********************************\`.`,
    });

    return;
  },
};

export default tokenGrabCommand;
