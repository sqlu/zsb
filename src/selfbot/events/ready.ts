import { PrismaClient } from "@prisma/client";
import { APIEmbed, EmbedBuilder } from "discord.js";
import { VoiceChannel } from "discord.js-selfbot-v13";
import { manager } from "../../main";
import { Selfbot } from "../../selfbot/index";
import { afkOptionsType } from "../../types/afkOptions";
import { EventType } from "../../types/event";
import { RichPresenceType } from "../../types/richPresence";
import { voiceOptionsType } from "../../types/voiceOptions";

const db = new PrismaClient();

const event: EventType = {
  name: "ready",
  once: true,

  async execute(client: Selfbot) {
    const selfbot = (await db.selfbot.findUnique({
      where: { token: client.token },
      select: {
        joinedAt: true || null,
      },
    })) as { joinedAt?: Date };

    if (!selfbot) {
      await db.selfbot.create({
        data: {
          token: client.token,
          voiceOptions: {
            voiceChannelId: null,
            selfMute: true,
            selfDeaf: true,
            selfCamera: false,
          },
          afkOptions: {
            value: false,
            message: null,
          },
        },
      });
    }

    const { joinedAt } = selfbot;

    if (
      joinedAt &&
      joinedAt !== null &&
      new Date().getTime() - joinedAt.getTime() < 60000
    ) {
      await Promise.all([
        await client
          .installUserApps(process.env.APPLICATION_ID!)
          .catch(() => false),
      ]);

      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("› New Connection")
        .setDescription(
          `**${client.user.username}** is now connected to ZSB!`
        ) as APIEmbed;

      await manager.sendWehbook(embed).catch(() => {
        null;
      });

      await manager
        .sendPrivateMessage(
          client.user.id,
          `Congratulations 🎉, you are now connected to ZSB! Thank you for joining us. If you encounter any issues, feel free to reach out to support. Please keep in mind that this is a BETA version.`
        )
        .catch(() => {
          null;
        });
    }

    const selfbotDbInfos = (await db.selfbot.findUnique({
      where: { token: client.token },
      select: {
        voiceOptions: true,
        afkOptions: true,
        richPresences: true,
        richPresence: true,
        antiSystems: true,
        automations: true,
      },
    })) as any;

    const {
      voiceOptions,
      afkOptions,
      richPresences,
      richPresence,
      antiSystems,
      automations,
    }: {
      voiceOptions: voiceOptionsType;
      afkOptions: afkOptionsType;
      richPresences: RichPresenceType[];
      richPresence: string;
      antiSystems: any;
      automations: any;
    } = selfbotDbInfos;

    for (const automation of automations) {
      client.automations.set(automation.name, automation.value);
    }

    for (const antiSystem of antiSystems) {
      client.antiSystems.set(antiSystem.name, antiSystem.value);
    }

    for (const richpresence of richPresences) {
      client.richPresences.set(richpresence.name, {
        name: richpresence.name,
        title: richpresence.title,
        description: richpresence.description,
        type: richpresence.type,
        imageURL: richpresence.imageURL,
      });
    }

    if (richPresence != "NONE") {
      client.richPresence = richPresence;
      client.setRPC(richPresence);
    }

    client.rollImage();

    if (voiceOptions.voiceChannelId !== null) {
      const channel = (await client.channels.cache
        .get(voiceOptions.voiceChannelId)
        ?.fetch()) as VoiceChannel;

      if (channel) {
        await client.voice
          .joinChannel(channel, {
            selfDeaf: voiceOptions.selfDeaf,
            selfMute: voiceOptions.selfMute,
            selfVideo: voiceOptions.selfCamera,
          })
          .catch(() => false);
        client.voiceOptions = voiceOptions;
      }
    }

    client.afkOptions = afkOptions;

    console.log(
      `${new Date().toLocaleString("fr")} | ${
        client.user.tag
      } is now connected.`
    );
  },
};

export default event;
