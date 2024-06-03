"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/styles.css
var require_styles = __commonJS({
  "src/styles.css"() {
    "use strict";
    (function() {
      if (!document.getElementById("80c38d8812bdff312032b21643ac220c42c5e7a8bbedb23148cd97f802206f97")) {
        var e = document.createElement("style");
        e.id = "80c38d8812bdff312032b21643ac220c42c5e7a8bbedb23148cd97f802206f97";
        e.textContent = `/* CSS classes for settings elements */

.drag-handle {
 border: 0px solid #968e8e;
 padding: 6px;
 padding-bottom: 0px;
 background-color: #efefef;
 border-radius: 8px;
 margin-bottom: 4px;
}





/* View panel style */

.custom-prop-panel {
  padding: 10px;
  overflow-y: auto;
  max-height: 100%;

}

.custom-prop-panel table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}

.custom-prop-panel th,
.custom-prop-panel td {
  border: 1px solid #ddd;
  padding: 0.5em;
}

.custom-prop-panel th {
  background-color: #f2f2f2;
  text-align: left;
  font-size: 10px;
}

.custom-prop-panel td {
  background-color: #fff;
}

.nested-field {
  margin-left: 1em;
}

.custom-prop-panel img {
  width: 150px;
  border-radius: 50%;
  text-align: center;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.custom-prop-panel h2 {
  font-size: 10px;
  margin: 2px;
}

.custom-prop-panel p {
  padding: 0px;
  margin: 0px;
  margin-bottom: 4px;
  font-size: 13px;
}`;
        document.head.appendChild(e);
      }
    })();
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => CustomPropPanelPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian6 = require("obsidian");

// src/settings.ts
var import_obsidian3 = require("obsidian");

// src/settings/displaySettings.ts
var import_obsidian = require("obsidian");
function displaySettings(tab) {
  const { containerEl } = tab;
  containerEl.empty();
  containerEl.createEl("h2", { text: "Custom Properties Panel Plugin Settings" });
  containerEl.createEl("p", { text: "You can set custom properties per folder, tag, folder & tag. Add custom set of properties from a files frontmatter" });
  tab.plugin.settings.subSettings.forEach((subSetting, index) => {
    const subSettingDiv = containerEl.createDiv("sub-setting-item");
    new import_obsidian.Setting(subSettingDiv).setName(index).addText((text) => {
      text.setValue(subSetting.tag || "").setPlaceholder("Enter tag...").onChange(async (value) => {
        tab.plugin.settings.subSettings[index].tag = value;
        await tab.plugin.saveSettings();
      });
    }).addText((text) => {
      text.setValue(subSetting.folder || "").setPlaceholder("Enter folder...").onChange(async (value) => {
        tab.plugin.settings.subSettings[index].folder = value;
        await tab.plugin.saveSettings();
      });
    }).addButton((button) => button.setButtonText("Edit Properties Settings").onClick(() => {
      tab.openTagFolderSettings(index);
    })).addButton((button) => button.setButtonText("Delete").onClick(async () => {
      tab.plugin.settings.subSettings.splice(index, 1);
      await tab.plugin.saveSettings();
      tab.display();
    }));
  });
  new import_obsidian.Setting(containerEl).addButton((button) => button.setButtonText("Add New Sub-Setting").onClick(() => {
    tab.plugin.settings.subSettings.push({ tag: "", folder: "", fields: [] });
    tab.display();
  }));
}

// src/settings/parseFrontmatterFields.ts
function parseFrontmatterFields(file, plugin) {
  console.log("plugin object:", plugin);
  if (!plugin || !plugin.app || !plugin.app.metadataCache) {
    console.error("Invalid plugin object:", plugin);
    return [];
  }
  const parseFields = (obj, prefix = "") => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const displayName = key.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
      const field = {
        name: key,
        displayName,
        type: "string",
        // Default type is string
        enabled: true,
        showHeader: true
      };
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === "object") {
          field.type = "nested";
          field.nestedFields = Object.keys(value[0]).map((nestedKey) => ({
            name: nestedKey,
            displayName: nestedKey.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
            type: "string",
            enabled: true,
            showHeader: true,
            showHeaderRow: true
          }));
        } else {
          field.type = "list";
        }
      } else if (typeof value === "object" && value !== null) {
        field.type = "nested";
        field.nestedFields = parseFields(value, `${prefix}.${key}`);
      }
      return field;
    });
  };
  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  return frontmatter ? parseFields(frontmatter) : [];
}

// src/settings/openTagFolderSettings.ts
var import_obsidian2 = require("obsidian");
function openTagFolderSettings(tab, index) {
  const { containerEl } = tab;
  containerEl.empty();
  containerEl.createEl("h2", { text: `Settings for Tag/Folder: ${tab.plugin.settings.subSettings[index].tag || tab.plugin.settings.subSettings[index].folder}` });
  new import_obsidian2.Setting(containerEl).setName("Load Frontmatter from File").addButton((button) => {
    button.setButtonText("Select File").onClick(async () => {
      const files = tab.app.vault.getMarkdownFiles();
      const fileNames = files.map((file) => file.path);
      const fileSelector = containerEl.createEl("select");
      fileNames.forEach((fileName) => {
        const option = fileSelector.createEl("option");
        option.value = fileName;
        option.text = fileName;
      });
      const selectButton = containerEl.createEl("button", { text: "Load" });
      selectButton.onclick = async () => {
        const selectedFile = tab.app.vault.getAbstractFileByPath(fileSelector.value);
        if (selectedFile) {
          const fields = tab.parseFrontmatterFields(selectedFile, tab.plugin);
          tab.plugin.settings.subSettings[index].fields = fields;
          await tab.plugin.saveSettings();
          tab.openTagFolderSettings(index);
        }
      };
    });
  });
  const renderFieldSettings = (fields, prefix = "") => {
    fields.forEach((field, fieldIndex) => {
      const fieldDiv = containerEl.createDiv("settings-item drag-handle");
      if (prefix) {
        fieldDiv.style.marginLeft = `${30}px`;
      }
      const settings = new import_obsidian2.Setting(fieldDiv).setName("\u2630     " + field.name).setClass("drag-handle1").addText((text) => text.setValue(field.displayName).setPlaceholder("Title").onChange(async (value) => {
        field.displayName = value;
        await tab.plugin.saveSettings();
      }));
      if (!field.nestedFields) {
        settings.addDropdown((dropdown) => dropdown.addOptions({ string: "String", number: "Number", boolean: "Boolean", date: "Date", url: "URL", image: "Image", header: "Header" }).setValue(field.type).onChange(async (value) => {
          field.type = value;
          await tab.plugin.saveSettings();
        }));
      }
      if (!prefix) {
        settings.addToggle((toggle) => toggle.setTooltip("SHow Header").setValue(field.showHeader).onChange(async (value) => {
          field.showHeader = value;
          await tab.plugin.saveSettings();
        }));
      }
      if (field.nestedFields) {
        settings.addToggle((toggle) => toggle.setTooltip("Show Table Headers").setValue(field.showHeaderRow).onChange(async (value) => {
          field.showHeaderRow = value;
          await tab.plugin.saveSettings();
        }));
        renderFieldSettings(field.nestedFields, `${prefix}.${field.name}`);
      }
      settings.addButton((button) => button.setButtonText("Delete").setTooltip("If clicked, the field will be deleted from this settings file. The actual frontmatter data will not be deleted!").onClick(async () => {
        fields.splice(fieldIndex, 1);
        await tab.plugin.saveSettings();
        tab.openTagFolderSettings(index);
      })).addToggle((toggle) => toggle.setTooltip("Show/Hide Property").setValue(field.enabled).onChange(async (value) => {
        field.enabled = value;
        await tab.plugin.saveSettings();
      }));
      fieldDiv.draggable = true;
      fieldDiv.ondragstart = (e) => {
        e.dataTransfer?.setData("text/plain", fieldIndex.toString());
      };
      fieldDiv.ondragover = (e) => {
        e.preventDefault();
      };
      fieldDiv.ondrop = async (e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer?.getData("text/plain") || "", 10);
        const toIndex = fieldIndex;
        if (fromIndex !== toIndex) {
          const [movedField] = fields.splice(fromIndex, 1);
          fields.splice(toIndex, 0, movedField);
          await tab.plugin.saveSettings();
          tab.openTagFolderSettings(index);
        }
      };
    });
  };
  renderFieldSettings(tab.plugin.settings.subSettings[index].fields);
  new import_obsidian2.Setting(containerEl).addButton((button) => button.setButtonText("Back").onClick(() => {
    tab.display();
  }));
}

// src/settings.ts
var CustomPropPanelSettingTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    displaySettings(this);
  }
  parseFrontmatterFields(file, plugin) {
    return parseFrontmatterFields(file, plugin);
  }
  openTagFolderSettings(index) {
    openTagFolderSettings(this, index);
  }
};

// src/panel/customPropPanel.ts
var import_obsidian5 = require("obsidian");

// src/constants.ts
var VIEW_TYPE_CUSTOM_PROP_PANEL = "custom-prop-panel";

// src/panel/displayFrontmatterInfo.ts
var import_obsidian4 = require("obsidian");
function displayFrontmatterInfo(frontmatter, container, fields, sourcePath, plugin, app, prefix = "") {
  if (!plugin || !app) {
    console.error("Plugin or App instance is missing");
    return;
  }
  fields.forEach((field) => {
    if (field.enabled) {
      const value = getNestedField(frontmatter, field.name);
      if (field.nestedFields) {
        if (Array.isArray(value)) {
          if (field.showHeader) {
            container.createEl("h2", { text: field.displayName });
          }
          const table = container.createEl("table");
          const thead = table.createEl("thead");
          const tbody = table.createEl("tbody");
          if (field.showHeaderRow) {
            const headerRow = thead.createEl("tr");
            field.nestedFields.forEach((nestedField) => {
              if (nestedField.enabled) {
                headerRow.createEl("th", { text: nestedField.displayName });
              }
            });
          }
          value.forEach((item) => {
            const row = tbody.createEl("tr");
            field.nestedFields?.forEach((nestedField) => {
              if (nestedField.enabled) {
                const nestedValue = item[nestedField.name];
                const td = row.createEl("td");
                createFieldElement(td, nestedField.displayName, nestedValue, sourcePath, nestedField.type, plugin, app);
              }
            });
          });
          table.appendChild(thead);
          table.appendChild(tbody);
          container.appendChild(table);
        }
      } else {
        if (field.showHeader) {
          container.createEl("h2", { text: field.displayName });
        }
        createFieldElement(container, field.displayName, value, sourcePath, field.type, plugin, app);
      }
    }
  });
}
function getNestedField(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}
function processInternalLinks(parent, plugin) {
  const regex = /\[\[(.*?)\]\]/g;
  parent.innerHTML = parent.innerHTML.replace(regex, (match, p1) => {
    return `<a href="#" class="internal-link">${p1}</a>`;
  });
  if (!plugin || !plugin.registerDomEvent) {
    console.error("Plugin instance or registerDomEvent is missing in processInternalLinks");
    return;
  }
  plugin.registerDomEvent(document, "click", (event) => {
    if (event.target.classList.contains("internal-link")) {
      const linkText = event.target.innerText;
      plugin.app.workspace.openLinkText(linkText, "", false);
    }
  });
}
function createFieldElement(container, name, value, sourcePath, itemType, plugin, app) {
  const parent = container.createEl("p");
  if (Array.isArray(value)) {
    value = value.join(", ");
  }
  let markdownContent = "";
  if (typeof value === "string") {
    if (value.startsWith("http://") || value.startsWith("https://")) {
      markdownContent = `[${value}](${value})`;
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      markdownContent = `[${value}](mailto:${value})`;
    } else if (/^\+?[1-9]\d{1,14}$/.test(value)) {
      markdownContent = `[${value}](tel:${value})`;
    } else if (value.startsWith("[[") && value.endsWith("]]")) {
      markdownContent = `[[${value.slice(2, -2)}]]`;
    } else {
      markdownContent = value;
    }
  } else {
    markdownContent = String(value);
  }
  if (itemType === "image") {
    const img = parent.createEl("img");
    img.setAttribute("src", value);
  } else if (itemType === "header") {
    container.createEl("h1", { text: value });
  } else {
    import_obsidian4.MarkdownRenderer.renderMarkdown(markdownContent, parent, sourcePath, plugin).then(() => {
      processInternalLinks(parent, plugin);
    }).catch((error) => {
      console.error("Error rendering markdown:", error);
    });
  }
  if (!container.contains(parent)) {
    container.appendChild(parent);
  }
}

// src/panel/customPropPanel.ts
var CustomPropPanel = class extends import_obsidian5.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return VIEW_TYPE_CUSTOM_PROP_PANEL;
  }
  getDisplayText() {
    return "Custom Prop Panel";
  }
  async onOpen() {
    this.containerEl.empty();
    this.containerEl.addClass("custom-prop-panel");
    this.addReloadButton();
    this.updateContent();
  }
  addReloadButton() {
    const reloadButton = this.containerEl.createEl("button", { text: "Reload Info" });
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
        const folderPath = activeFile.path.substring(0, activeFile.path.lastIndexOf("/"));
        const tags = frontmatter.tags ? Array.isArray(frontmatter.tags) ? frontmatter.tags : [frontmatter.tags] : [];
        const subSetting = this.plugin.settings.subSettings.find(
          (setting) => setting.folder && folderPath.startsWith(setting.folder) || setting.tag && tags.includes(setting.tag)
        );
        const fieldsToShow = subSetting ? subSetting.fields : Object.keys(frontmatter).map((key) => ({
          name: key,
          displayName: key.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
          type: "string",
          enabled: true
        }));
        displayFrontmatterInfo(frontmatter, this.containerEl, fieldsToShow, activeFile.path, this.plugin, this.app);
      }
    }
  }
};

// src/commands.ts
function registerCommands(plugin) {
  plugin.addCommand({
    id: "show-custom-prop-panel",
    name: "Show Custom Prop Panel",
    callback: () => plugin.activateView()
  });
}

// src/functions.ts
var import_styles = __toESM(require_styles());
async function saveSettings(plugin) {
  await plugin.saveData(plugin.settings);
}
async function activateView(plugin) {
  plugin.app.workspace.detachLeavesOfType(VIEW_TYPE_CUSTOM_PROP_PANEL);
  console.log(plugin);
  console.log(plugin.app);
  let leaf = plugin.app.workspace.getRightLeaf(false);
  if (!leaf) {
    leaf = plugin.app.workspace.createLeafBySplit(plugin.app.workspace.rootSplit, "vertical");
  }
  if (leaf) {
    await leaf.setViewState({ type: VIEW_TYPE_CUSTOM_PROP_PANEL, active: true });
    plugin.app.workspace.revealLeaf(leaf);
  }
}
function updateView(plugin) {
  const leaf = plugin.app.workspace.getLeavesOfType(VIEW_TYPE_CUSTOM_PROP_PANEL)[0];
  if (leaf) leaf.view.updateContent();
}
function loadCSS(plugin) {
  const style = document.createElement("style");
  style.textContent = import_styles.default;
  document.head.appendChild(style);
}

// src/main.ts
var CustomPropPanelPlugin = class extends import_obsidian6.Plugin {
  async onload() {
    console.log("Loading Custom Prop Panel Plugin");
    this.settings = Object.assign({}, { frontmatterFields: [], subSettings: [] }, await this.loadData());
    this.addSettingTab(new CustomPropPanelSettingTab(this.app, this));
    this.registerView(VIEW_TYPE_CUSTOM_PROP_PANEL, (leaf) => new CustomPropPanel(leaf, this));
    registerCommands(this);
    this.registerEvent(this.app.workspace.on("file-open", this.updateView.bind(this)));
    this.registerEvent(this.app.metadataCache.on("changed", this.updateView.bind(this)));
    this.activateView();
    this.loadCSS();
  }
  onunload() {
    console.log("Unloading Custom Prop Panel Plugin");
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
};
