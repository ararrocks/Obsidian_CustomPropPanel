// --- commands.ts ---

import { CustomPropPanelPlugin } from './main';

// Register commands
export function registerCommands(plugin: CustomPropPanelPlugin) {
  plugin.addCommand({
    id: 'show-custom-prop-panel',
    name: 'Show Custom Prop Panel',
    callback: () => plugin.activateView()
  });
}