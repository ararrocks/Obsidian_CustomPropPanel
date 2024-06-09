// --- panel/CustomPropPanel.ts ---

import { ItemView, WorkspaceLeaf, TFile, setIcon } from 'obsidian';
import { CustomPropPanelPlugin } from '../main';
import { VIEW_TYPE_CUSTOM_PROP_PANEL } from '../constants';
import { displayFrontmatterInfo } from './displayFrontmatterInfo';

export class CustomPropPanel extends ItemView {
  plugin: CustomPropPanelPlugin;

  constructor(leaf: WorkspaceLeaf, plugin: CustomPropPanelPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() { return VIEW_TYPE_CUSTOM_PROP_PANEL; }
  getDisplayText() { return "Custom Prop Panel"; }

  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass('custom-prop-panel');
    this.addReloadButton();
    this.updateContent();
  }

  addReloadButton() {

    const reloadButton = this.containerEl.createEl('button', text: 'test');
    setIcon(reloadButton, "info");
    //reloadButton.classList.add('icon-refresh-cw','reload-button');

    reloadButton.onclick = () => this.updateContent();
    this.containerEl.appendChild(reloadButton);
  }

  async updateContent() {
    this.containerEl.empty();
    this.addReloadButton();

    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const content = await this.app.vault.read(activeFile);
      const frontmatter = this.app.metadataCache.getFileCache(activeFile)?.frontmatter;

      if (frontmatter) {
        const folderPath = activeFile.path.substring(0, activeFile.path.lastIndexOf('/'));
        const tags = frontmatter.tags ? (Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags]) : [];
        const subSetting = this.plugin.settings.subSettings.find(setting => 
          (setting.folder && folderPath.startsWith(setting.folder)) ||
          (setting.tag && tags.includes(setting.tag))
        );

        const fieldsToShow = subSetting ? subSetting.fields : Object.keys(frontmatter).map(key => ({
          name: key,
          displayName: key.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
          type: 'string' as 'string' | 'number' | 'boolean' | 'date' | 'url',
          enabled: true
        }));

        displayFrontmatterInfo(frontmatter, this.containerEl, fieldsToShow, activeFile.path, this.plugin, this.app);
      }
    }
  }
}

