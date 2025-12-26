import { ButtonInteraction } from "discord.js";
import { Manager } from "../../../manager/index";
import { Selfbot } from "../../../selfbot/index";

const displayAIButton = {
  execute: async (
    _manager: Manager,
    selfbot: Selfbot,
    interaction: ButtonInteraction
  ) => {
    const channelId = interaction.channelId;
    const channel = (await selfbot.channels.cache
      .get(channelId)
      ?.fetch()) as any;

    if (!channel) return;
    if (!interaction.message) return;

    let text = interaction.message.embeds[0]?.description;

    if (!text) {
      text = interaction.message.content;
    }

    channel.send({
      content: `${text}`,
    });

    interaction.deferUpdate();

    return;
  },
};

export default displayAIButton;
