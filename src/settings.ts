// --- settings.ts ---

import { App, PluginSettingTab, Setting, TFile } from 'obsidian';
import { CustomPropPanelPlugin } from './main';
import { FrontmatterFieldSetting } from './types';
import { displaySettings } from './settings/displaySettings';
import { parseFrontmatterFields } from './settings/parseFrontmatterFields';
import { openTagFolderSettings } from './settings/openTagFolderSettings';

// Custom Prop Panel Settings Tab
export class CustomPropPanelSettingTab extends PluginSettingTab {
  plugin: CustomPropPanelPlugin;

  constructor(app: App, plugin: CustomPropPanelPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    displaySettings(this);
  }

  parseFrontmatterFields(file: TFile, plugin: CustomPropPanelPlugin): FrontmatterFieldSetting[] {
    return parseFrontmatterFields(file, plugin);
  }

  openTagFolderSettings(index: number): void {
    openTagFolderSettings(this, index);
  }
}