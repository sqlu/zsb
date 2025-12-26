import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Send
 * This command allows the selfbot user to send a DM to a specified user
 * The command can only be ran within a discord server
 */

const sendCommand: SlashCommand = {
  name: "send",
  description: "Allows you to dm a user from a server.",
  description_localizations: {
    fr: "Permet d'envoyer un message privé à un utilisateur depuis un serveur.",
  },
  cooldown: 10000,
  options: [
    {
      name: "user",
      description: "The user that you wish to dm.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur à qui vous souhaitez envoyer un message privé.",
      },
      required: true,
    },
  ],

  execute: async (
    _manager: Manager,
    _selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {

    if (!interaction.inGuild()) {
      interaction.reply({
        content:
          interaction.locale === "fr"
            ? `Vous devez être dans un serveur pour utiliser cette commande !`
            : `You must be in a server to use this command!`,
            flags: 64,
      });
      return;
    }

    const userId = interaction.options.getUser("user")!.id;

    const modal = new ModalBuilder()
      .setCustomId("send_modal-" + userId)
      .setTitle(
        interaction.locale === "fr" ? "Envoyer un message" : "Send Message"
      );

    const reasonInput = new TextInputBuilder()
      .setCustomId(`message`)
      .setLabel("Message")
      .setPlaceholder(
        interaction.locale === "fr"
          ? "Votre message ici..."
          : "Your message here..."
      )
      .setMaxLength(512)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(reasonInput)
    );

    await interaction.showModal(modal);

    return;
  },
};

export default sendCommand;
