import { VoiceState } from "discord.js-selfbot-v13";
import { Selfbot } from "../../selfbot/index";
import { EventType } from "../../types/event";

const event: EventType = {
  name: "voiceStateUpdate",
  once: false,
  rate: {
    limit: 500000000,
    in: 5000,
    for: 60000,
  },

  async execute(client: Selfbot, oldState: VoiceState, newState: VoiceState) {
    try {
      if (
        !client.antiSystems?.get("antiVcmute") &&
        !client.antiSystems?.get("antiVcmove")
      )
        return;

      if (!newState || !oldState) return;
      if (!newState.user || !oldState.user) return;
      if (oldState.user.bot) return;
      if (
        oldState.channel?.type !== "GUILD_VOICE" ||
        newState.channel?.type !== "GUILD_VOICE"
      )
        return;

      if (
        client.antiSystems?.get("antiVcmute") &&
        oldState.user.id === client.user.id &&
        !oldState.mute &&
        newState.mute
      ) {
        try {
          const member = newState.guild!.members.cache.get(client.user.id)!;
          await member.voice.setMute(false);
        } catch {
          return;
        }
      }

      if (
        client.antiSystems?.get("antiVcmove") &&
        oldState.user.id === client.user.id &&
        oldState.channelId &&
        newState.channelId &&
        oldState.channelId !== newState.channelId
      ) {
        try {
          await newState.member!.voice.setChannel(oldState.channelId);
        } catch {
          return;
        }
      }
    } catch {
      return;
    }
  },
};

export default event;
