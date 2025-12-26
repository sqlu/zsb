import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { Manager } from "../../../index";

/*
 * Command Create
 * This command allows the selfbot user to create a group with up to 9 users.
 */

const createCommand: SlashCommand = {
  name: "create",
  description: "Allows you to create a group with up to 9 users.",
  description_localizations: {
    fr: "Permet de créer un groupe avec jusqu'à 9 utilisateurs.",
  },
  cooldown: 15000,
  options: [
    {
      type: 6,
      name: "user1",
      description: "The first user in the group.",
      description_localizations: {
        fr: "Le premier utilisateur dans le groupe.",
      },
      required: true,
    },
    {
      type: 6,
      name: "user2",
      description: "The second user in the group.",
      description_localizations: {
        fr: "Le deuxième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user3",
      description: "The third user in the group.",
      description_localizations: {
        fr: "Le troisième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user4",
      description: "The fourth user in the group.",
      description_localizations: {
        fr: "Le quatrième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user5",
      description: "The fifth user in the group.",
      description_localizations: {
        fr: "Le cinquième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user6",
      description: "The sixth user in the group.",
      description_localizations: {
        fr: "Le sixième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user7",
      description: "The seventh user in the group.",
      description_localizations: {
        fr: "Le septième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user8",
      description: "The eighth user in the group.",
      description_localizations: {
        fr: "Le huitième utilisateur dans le groupe.",
      },
      required: false,
    },
    {
      type: 6,
      name: "user9",
      description: "The ninth user in the group.",
      description_localizations: {
        fr: "Le neuvième utilisateur dans le groupe.",
      },
      required: false,
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const users = [
      interaction.options.getUser("user1"),
      interaction.options.getUser("user2"),
      interaction.options.getUser("user3"),
      interaction.options.getUser("user4"),
      interaction.options.getUser("user5"),
      interaction.options.getUser("user6"),
      interaction.options.getUser("user7"),
      interaction.options.getUser("user8"),
      interaction.options.getUser("user9"),
    ].filter((user) => user !== null);

    if (users.length < 2) {
      interaction.editReply({
        content:
          interaction.locale === "fr"
            ? `Vous devez sélectionner au moins deux utilisateurs pour créer un groupe.`
            : `You must select at least two users to create a group.`,
      });
      return;
    }

    await selfbot.channels.createGroupDM(users.map((user) => user.id));

    interaction.editReply({
      content:
        interaction.locale === "fr"
          ? `Vous avez créé le groupe avec succès !`
          : `You have successfully created the group!`,
    });

    return;
  },
};

export default createCommand;
