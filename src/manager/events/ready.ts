import { PrismaClient } from "@prisma/client";
import { ActivityType } from "discord.js";
import { Manager } from "../../manager/index";
import { EventType } from "../../types/event";

const db = new PrismaClient();

const readyEvent: EventType = {
  name: "ready",
  once: false,

  async execute(manager: Manager): Promise<void> {
    manager.loadCommands();
    manager.loadAPI();

    const selfbots = await db.selfbot.findMany({
      select: { token: true },
    });

    manager.initSelfbots(selfbots.map((user: { token: string }) => user.token));
    const setPresence = (nb: number) => {
      manager.user.setPresence({
        activities: [
          {
            name: `${nb} users! 👤`,
            type: ActivityType.Streaming,
            url: "https://twitch.tv/aquinasctf",
          },
        ],
        status: "idle",
      });
    };
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 1));

    setPresence(manager.selfbots.size);

    const guild = manager.guilds.cache.get("943628184124018708");
    const role = guild?.roles.cache.get("1355878818228732045");

    if (!guild || !role) return;

    const members = await guild.members.fetch();

    await Promise.all(
      [
        ...Array.from(manager.selfbots.values()).map((user) =>
          members
            .get(user.user.id)
            ?.roles.add(role, "Connected to ZSB")
            .catch(() => {})
        ),

        ...members.map((member) =>
          member.roles.cache.has(role.id) && !manager.selfbots.has(member.id)
            ? member.roles
                .remove(role, "No longer connected to ZSB")
                .catch(() => {})
            : null
        ),
      ].filter(Boolean)
    );

    setInterval(async () => {
      const userNb = manager.selfbots.size;
      setPresence(userNb);
    }, 1000 * 60 * 5);

    setInterval(async () => {
      const guild = manager.guilds.cache.get("943628184124018708");
      const role = guild?.roles.cache.get("1355878818228732045");

      if (!guild || !role) return;

      const members = await guild.members.fetch();

      await Promise.all(
        [
          ...Array.from(manager.selfbots.values()).map((user) =>
            members
              .get(user.user.id)
              ?.roles.add(role)
              .catch(() => {})
          ),

          ...members.map((member) =>
            member.roles.cache.has(role.id) && !manager.selfbots.has(member.id)
              ? member.roles.remove(role).catch(() => {})
              : null
          ),
        ].filter(Boolean)
      );
    }, 1000 * 60 * 30);
  },
};

export default readyEvent;
