import { GroupDMChannel } from "discord.js-selfbot-v13";
import { Selfbot } from "../../selfbot/index";
import { EventType } from "../../types/event";

const event: EventType = {
  name: "channelCreate",
  once: false,
  rate: {
    limit: 5,
    in: 3000,
    for: 30000,
  },

  async execute(client: Selfbot, channel: GroupDMChannel) {
    if (channel.type === "GROUP_DM") {
      if (client.antiSystems?.get("antiGroup")) {
        await channel.send("-# ➜ AntiGroup");
        channel.delete();
      }
    }
  },
};

export default event;
