import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  CollectedInteraction,
  EmbedBuilder,
  MessageFlags,
} from "discord.js";
import { Selfbot } from "../../../../selfbot/index";
import { SlashCommand } from "../../../../types/slashCommand";
import { prevnamesRequest } from "../../../../utils/requests/prevnames";
import { Manager } from "../../../index";
interface Prevname {
  name: string;
  date: number;
  source: string;
}

/*
 * Command Prevnames
 * This command allows the selfbot user to retrieve the user's prevnames
 */

const prevnamesCommand: SlashCommand = {
  name: "prevnames",
  description: "Allows you to retrieve user's previous names.",
  description_localizations: {
    fr: "Permet d'obtenir les anciens noms d'un utilisateur.",
  },
  options: [
    {
      name: "type",
      description: "The type of prevname you want to have.",
      type: 3,
      description_localizations: {
        fr: "Le type de prevname laquelle vous voulez.",
      },
      choices: [
        {
          name: "› Username",
          value: "username",
        },
        {
          name: "› Displayname",
          value: "display",
        },
      ],
      required: true,
    },
    {
      name: "user",
      description:
        "The user on which that you wish to retrieve the previous names.",
      type: 6,
      description_localizations: {
        fr: "L'utilisateur sur lequel vous souhaitez obtenir les anciens noms.",
      },
    },
  ],

  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ChatInputCommandInteraction
  ) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    let userId = interaction.options.getUser("user")?.id;
    const type = interaction.options.getString("type");

    if (!userId) {
      userId = selfbot.user.id;
    }
    const prevnames: Prevname[] = await prevnamesRequest(userId);

    let user = selfbot.users.cache.get(userId)!;

    if (!user) {
      user = await selfbot.users.fetch(userId);
    }

    const itemsPerPage = 10;
    let currentPage = 0;

    const generateEmbed = (page: number, names: Prevname[], title: string) => {
      const start = page * itemsPerPage;
      const end = start + itemsPerPage;
      const namesList = names.slice(start, end);
      const totalPages = Math.ceil(names.length / itemsPerPage);

      return new EmbedBuilder()
        .setColor("#2b2d31")
        .setAuthor({
          name: title,
          iconURL: user.displayAvatarURL(),
        })
        .setDescription(
          namesList.length > 0
            ? namesList
                .map(
                  (name: Prevname, index: number) =>
                    `> ${start + index + 1}. **\`${
                      name.name
                    }\`** — <t:${Math.floor(
                      new Date(name.date * 1000).getTime() / 1000
                    )}:R>`
                )
                .join("\n")
            : interaction.locale === "fr"
            ? `Aucun résultat trouvé`
            : `No results found`
        )
        .setFooter({
          text: `Page ${page + 1}/${totalPages}`,
        });
    };

    let names: Prevname[];
    let embedTitle: string;
    switch (type) {
      case "username":
        names = prevnames.filter(
          (name: Prevname) =>
            name.name != "" && name.name && name.source === "names" && name.date
        );

        embedTitle =
          interaction.locale === "fr"
            ? `${user.displayName} — Noms d'utilisateur précédents`
            : `${user.displayName} — Previous Usernames`;
        break;
      case "display":
      default:
        names = prevnames.filter(
          (name: Prevname) =>
            name.name != "" &&
            name.name &&
            name.source === "display" &&
            name.date
        );
        embedTitle =
          interaction.locale === "fr"
            ? `${user.displayName} — Noms d'affichage précédents`
            : `${user.displayName} — Previous Display Names`;
        break;
    }

    names.sort((a: Prevname, b: Prevname) => b.date - a.date);

    const totalPages = Math.ceil(names.length / itemsPerPage);
    let embed = generateEmbed(currentPage, names, embedTitle);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel(interaction.locale === "fr" ? "› Arrière" : "› Previous")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(currentPage === 0),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel(interaction.locale === "fr" ? "› Prochain" : "› Next")
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(totalPages <= 1 || currentPage === totalPages - 1)
    );

    const msg = await interaction.editReply({
      embeds: [embed],
      components: totalPages > 1 ? [row] : [],
    });

    if (totalPages > 1) {
      const filter: any = (i: CollectedInteraction) =>
        i.user.id === interaction.user.id;
      const collector = msg.createMessageComponentCollector({
        filter,
        time: 60000,
      });

      collector.on("collect", async (i) => {
        if (i.customId === "previous") {
          currentPage--;
        } else if (i.customId === "next") {
          currentPage++;
        }

        embed = generateEmbed(currentPage, names, embedTitle);

        const newRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId("previous")
            .setLabel(interaction.locale === "fr" ? "› Arrière" : "› Previous")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel(interaction.locale === "fr" ? "› Prochain" : "› Next")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(currentPage === totalPages - 1)
        );

        await i.update({ embeds: [embed], components: [newRow] });
      });

      collector.on("end", async () => {
        if (msg.components) {
          msg.components.forEach((row) => {
            row.components.forEach((component) => {
              // @ts-ignore
              component.data.disabled = true;
            });
          });
          await msg.edit({ components: msg.components }).catch(() => {});
        }
        return;
      });
    }

    return;
  },
};

export default prevnamesCommand;
