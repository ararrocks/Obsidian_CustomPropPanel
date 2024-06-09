// --- settings/displaySettings.ts ---

import { CustomPropPanelSettingTab } from '../settings';
import { Setting } from 'obsidian';

export function displaySettings(tab: CustomPropPanelSettingTab) {
  const { containerEl } = tab;
  containerEl.empty();
  containerEl.createEl('h2', { text: 'Custom Properties Panel Plugin Settings' });

  containerEl.createEl('p', { text: 'You can set custom properties per folder, tag, folder & tag. Add custom set of properties from a files frontmatter' });

  // --- Main Settings Page ---
  tab.plugin.settings.subSettings.forEach((subSetting, index) => {
    const subSettingDiv = containerEl.createDiv('sub-setting-item');

    new Setting(subSettingDiv)
    .setName(index)
    .addText((text: TextComponent) => {
      text.setValue(subSetting.tag || '')
        .setPlaceholder('Enter tag...')
        .onChange(async (value) => {
          tab.plugin.settings.subSettings[index].tag = value;
          await tab.plugin.saveSettings();
        });
    })
    .addText((text: TextComponent) => {
      text.setValue(subSetting.folder || '')
        .setPlaceholder('Enter folder...')
        .onChange(async (value) => {
          tab.plugin.settings.subSettings[index].folder = value;
          await tab.plugin.saveSettings();
        });
    })
    .addButton(button => button.setButtonText('Edit Properties Settings').onClick(() => {
      tab.openTagFolderSettings(index);
    }))
    .addButton(button => button.setButtonText('Delete').onClick(async () => {
      tab.plugin.settings.subSettings.splice(index, 1);
      await tab.plugin.saveSettings();
      tab.display();
    }));
});

new Setting(containerEl).addButton(button => button.setButtonText('Add New Sub-Setting').onClick(() => {
  tab.plugin.settings.subSettings.push({ tag: '', folder: '', fields: [] });
  tab.display();
}));
  // --- End of Settings Page ---
}