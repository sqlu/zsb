interface EventType {
  name: `${ConstantsEvents[keyof ConstantsEvents]}`;
  once: boolean;
  rate?: {
    limit: number;
    in: number;
    for: number;
  };

  execute: (selfbot: Selfbot, ...args: any) => void;
}

export { EventType };
