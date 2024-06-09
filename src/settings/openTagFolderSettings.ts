// --- settings/openTagFolderSettings.ts ---

import { CustomPropPanelSettingTab } from '../settings';
import { Setting, TFile } from 'obsidian';

export function openTagFolderSettings(tab: CustomPropPanelSettingTab, index: number) {
  const { containerEl } = tab;
  containerEl.empty();
  containerEl.createEl('h2', { text: `Settings for Tag/Folder: ${tab.plugin.settings.subSettings[index].tag || tab.plugin.settings.subSettings[index].folder}` });

  // Use Obsidian's file selection methods
  new Setting(containerEl).setName('Load Frontmatter from File').addButton(button => {
    button.setButtonText('Select File').onClick(async () => {
      const files = tab.app.vault.getMarkdownFiles();
      const fileNames = files.map(file => file.path);

      const fileSelector = containerEl.createEl('select');
      fileNames.forEach(fileName => {
        const option = fileSelector.createEl('option');
        option.value = fileName;
        option.text = fileName;
      });

      const selectButton = containerEl.createEl('button', { text: 'Load' });
      selectButton.onclick = async () => {
        const selectedFile = tab.app.vault.getAbstractFileByPath(fileSelector.value) as TFile;
        if (selectedFile) {
          const fields = tab.parseFrontmatterFields(selectedFile, tab.plugin);
          tab.plugin.settings.subSettings[index].fields = fields;
          await tab.plugin.saveSettings();
          tab.openTagFolderSettings(index); // Re-render folder settings
        }
      };
    });
  });

  const renderFieldSettings = (fields: FrontmatterFieldSetting[], prefix = '') => {
    fields.forEach((field, fieldIndex) => {
      const fieldDiv = containerEl.createDiv('settings-item drag-handle');
      
      if (prefix) {fieldDiv.style.marginLeft = `${30}px`; }// Indent nested fields
      //fieldDiv.createEl('div', { cls: 'drag-handle', text: '☰' });

     const settings =  new Setting(fieldDiv)
        .setName ('☰     ' + field.name)
        .setClass('drag-handle1')
        .addText(text => text
          .setValue(field.displayName)
          .setPlaceholder('Title')
          .onChange(async (value) => {
          field.displayName = value;
          await tab.plugin.saveSettings();
        }));

        if (!field.nestedFields){
        settings.addDropdown(dropdown => dropdown
          
            .addOptions({ string: 'String', number: 'Number', boolean: 'Boolean', date: 'Date', url: 'URL', image: 'Image', header: 'Header'})
            .setValue(field.type)
            .onChange(async (value) => {
              field.type = value as 'string' | 'number' | 'boolean' | 'date' | 'url' | 'image' | 'header';
            await tab.plugin.saveSettings();
        }));}

        if(!prefix) {
        settings.addToggle(toggle => toggle
          .setTooltip('SHow Header')
          .setValue(field.showHeader)
          .onChange(async (value: boolean) => {
              field.showHeader = value;
              await tab.plugin.saveSettings();
        }));
      }

      if (field.nestedFields) {
        settings.addToggle(toggle => toggle
          .setTooltip('Show Table Headers')
          .setValue(field.showHeaderRow)
          .onChange(async (value: boolean) => {
              field.showHeaderRow = value;
              await tab.plugin.saveSettings();
        }));
        renderFieldSettings(field.nestedFields, `${prefix}.${field.name}`);
      }

      settings.addButton(button => button.setButtonText('Delete')
      .setTooltip('If clicked, the field will be deleted from this settings file. The actual frontmatter data will not be deleted!')
      .onClick(async () => {
        fields.splice(fieldIndex, 1);
        await tab.plugin.saveSettings();
        tab.openTagFolderSettings(index); // Re-render folder settings
      }))
      .addToggle(toggle => toggle
        .setTooltip('Show/Hide Property')
        .setValue(field.enabled).onChange(async (value) => {
        field.enabled = value;
        await tab.plugin.saveSettings();
      }));


      fieldDiv.draggable = true;
      fieldDiv.ondragstart = (e) => {
        e.dataTransfer?.setData('text/plain', fieldIndex.toString());
      };
      fieldDiv.ondragover = (e) => {
        e.preventDefault();
      };
      fieldDiv.ondrop = async (e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') || '', 10);
        const toIndex = fieldIndex;
        if (fromIndex !== toIndex) {
          const [movedField] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, movedField);
          await tab.plugin.saveSettings();
          tab.openTagFolderSettings(index); // Re-render folder settings
        }
      };
    });
  };

  renderFieldSettings(tab.plugin.settings.subSettings[index].fields);

  new Setting(containerEl).addButton(button => button.setButtonText('Back').onClick(() => {
    tab.display();
  }));
}