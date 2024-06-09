// --- main.ts ---

import { Plugin } from 'obsidian';
import { CustomPropPanelSettingTab } from './settings';
import { CustomPropPanel } from './panel/panelindex';
import { VIEW_TYPE_CUSTOM_PROP_PANEL } from './constants';
import { registerCommands } from './commands';
import { saveSettings, activateView, updateView, loadCSS } from './functions';

export default class CustomPropPanelPlugin extends Plugin {
  settings!: CustomPropPanelSettings;

  async onload() {
    console.log('Loading Custom Prop Panel Plugin');
    this.settings = Object.assign({}, { frontmatterFields: [], subSettings: [] }, await this.loadData());
    this.addSettingTab(new CustomPropPanelSettingTab(this.app, this));
    this.registerView(VIEW_TYPE_CUSTOM_PROP_PANEL, (leaf) => new CustomPropPanel(leaf, this));
    registerCommands(this);
    this.registerEvent(this.app.workspace.on('file-open', this.updateView.bind(this)));
    this.registerEvent(this.app.metadataCache.on('changed', this.updateView.bind(this)));
    this.activateView();

    // Load CSS
    this.loadCSS();
  }

  onunload() {
    console.log('Unloading Custom Prop Panel Plugin');
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_CUSTOM_PROP_PANEL);
  }

  async saveSettings() {
    await saveSettings(this);
  }

  async activateView() {
    await activateView(this);
  }

  updateView() {
    updateView(this);
  }

  loadCSS() {
    loadCSS(this);
  }
}