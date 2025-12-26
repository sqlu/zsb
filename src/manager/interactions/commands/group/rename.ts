import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command rename
 * This command allows the selfbot user to rename a group
 */

const renameCommand: SlashCommand = {
  name: "rename",
  description: "Allows you to rename a group",
  description_localizations: {
    fr: "Permet de renommer un groupe",
  },
  options: [
    {
      name: "name",
      description: "The new name of the group.",
      type: 3,
      description_localizations: {
        fr: "Le nouveau nom du groupe.",
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
    const name = interaction.options.getString("name")!;
    const channelId = interaction.channelId;
    let channel = (await selfbot.channels.cache.get(channelId)?.fetch()) as any;

    if (channel!.type === "GROUP_DM") {
      await channel.setName(name);
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous avez renommé le groupe en ${name}.`
            : `You have renamed the group to ${name}.`,
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

export default renameCommand;
