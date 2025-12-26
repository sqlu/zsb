import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Ghost Ping
 * This command allows the selfbot user to ghostping a user or a role (mentionnable things)
 * Moreover the command send "." after the ghostping to avoid message sniper
 */

const ghostPingCommand: SlashCommand = {
  name: "ghostping",
  description: "Allows you to ghostping a user or a role.",
  description_localizations: {
    fr: "Permet de ghostping un utilisateur ou un rôle.",
  },
  options: [
    {
      name: "mention",
      description: "The user or the role that you wish to ghost ping.",
      type: 9,
      description_localizations: {
        fr: "L'utilisateur ou le rôle que vous souhaitez ghostping.",
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

    const mention = interaction.options.getMentionable("mention")!;

    const channelId = interaction.channelId;
    let channel = (await selfbot.channels.cache.get(channelId)?.fetch()) as any;

    if (!channel) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous ne pouvez pas ghostping un utilisateur ou un rôle dans ce salon.`
            : `You cannot ghost ping a user or role in this channel.`,
      });
      return;
    }

    if (!channel.isText()) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un salon textuel pour ghostping un utilisateur ou un rôle.`
            : `You must be in a text channel to ghost ping a user or a role.`,
      });
      return;
    }

    const ping = await channel.send({
      content: `${mention}`,
    });

    await ping.delete();

    const antisnipe = await channel.send({
      content: `.`,
    });

    await antisnipe.delete();

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez ghostping ${mention} dans ${channel}.`
          : `You ghost pinged ${mention} in ${channel}.`,
    });

    return;
  },
};

export default ghostPingCommand;
