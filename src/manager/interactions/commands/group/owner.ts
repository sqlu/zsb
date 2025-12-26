import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command owner
 * This command allows the selfbot user to set a new owner for the group
 */

const ownerCommand: SlashCommand = {
  name: "owner",
  description: "Allows you to set a new owner for the group.",
  description_localizations: {
    fr: "Permet de définir un nouvel propriétaire pour le groupe.",
  },
  options: [
    {
      name: "user",
      description: "The user to set the new owner of the group.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur à définir comme nouveau propriétaire du groupe.",
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
    let user = selfbot.users.cache.get(userId)!;

    if (!user) {
      user = await selfbot.users.fetch(userId);
    }
    const channelId = interaction.channelId;
    let channel = (await selfbot.channels.cache.get(channelId)?.fetch()) as any;

    if (channel!.type === "GROUP_DM") {
      await channel.setOwner(user).catch(() => {
        interaction.editReply({
          content:
            interaction.locale === "fr"
              ? `Vous devez être le propriétaire du groupe pour définir un nouveau propriétaire.`
              : `You must be the owner of the group to set a new owner.`,
        });
      });
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez défini le nouveau propriétaire du groupe en ${user}.`
            : `You have set the new owner of the group to ${user}.`,
      });
    } else {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un groupe pour utiliser cette commande.`
            : `You must be in a group to use this command.`,
      });
    }

    return;
  },
};

export default ownerCommand;
