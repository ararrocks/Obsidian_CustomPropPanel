// --- functions.ts ---

import { CustomPropPanelPlugin } from './main';
import { CustomPropPanel } from './panel/panelindex';
import { VIEW_TYPE_CUSTOM_PROP_PANEL } from './constants';
import css from './styles.css';  // Adjust this import based on your bundler setup

// Save plugin settings
export async function saveSettings(plugin: CustomPropPanelPlugin) {
  await plugin.saveData(plugin.settings);
}

// Activate the Custom Prop Panel view
export async function activateView(plugin: CustomPropPanelPlugin) {
  plugin.app.workspace.detachLeavesOfType(VIEW_TYPE_CUSTOM_PROP_PANEL);
  console.log(plugin);
  console.log(plugin.app);
  let leaf = plugin.app.workspace.getRightLeaf(false);
  if (!leaf) {
    leaf = plugin.app.workspace.createLeafBySplit(plugin.app.workspace.rootSplit, 'vertical');
  }
  if (leaf) {
    await leaf.setViewState({ type: VIEW_TYPE_CUSTOM_PROP_PANEL, active: true });
    plugin.app.workspace.revealLeaf(leaf);
  }
}

// Update the Custom Prop Panel view
export function updateView(plugin: CustomPropPanelPlugin) {
  const leaf = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_CUSTOM_PROP_PANEL)[0];
  if (leaf) (leaf.view as CustomPropPanel).updateContent();
}

// Load CSS for the plugin
export function loadCSS(plugin: CustomPropPanelPlugin) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}