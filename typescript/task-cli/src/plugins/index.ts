export type CommandHandler = (args?: any) => Promise<void> | void;

export interface PluginHooks {
  onInit?: () => void;
  beforeCommand?: (cmd: string) => void;
}

export interface PluginCommand {
  name: string;
  description: string;
  handler: CommandHandler;
}

export interface TaskPlugin {
  name: string;
  version: string;
  commands?: PluginCommand[];
  hooks?: PluginHooks;
}
