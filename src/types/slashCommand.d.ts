interface Choice {
  name: string;
  value: string;
}

interface Option {
  name: string;
  description: string;
  type: number;
  description_localizations: LocalizationMap;
  choices?: Choice[];
  required?: boolean;
  max_value?: number;
  min_value?: number;
  max_length?: number;
  min_length?: number;
  channel_types?: ChannelType[];
  autocomplete?(manager: Manager, selfbot: Selfbot): Promise<Choice[]>;
}

interface SlashCommand {
  name: string;
  description: string;
  description_localizations: LocalizationMap;
  cooldown?: number;
  options?: Option[];

  execute(
    manager: Manager,
    selfbot: Selfbot,
    interaction: CommandInteraction
  ): Promise<void>;
}

export { Option, SlashCommand };
