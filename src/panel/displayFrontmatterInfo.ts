import { App, MarkdownRenderer, Plugin } from 'obsidian';
import { FrontmatterFieldSetting } from '../types';

// --- Display Frontmatter Info ---
export function displayFrontmatterInfo(frontmatter: any, container: HTMLElement, fields: FrontmatterFieldSetting[], sourcePath: string, plugin: Plugin, app: App, prefix = '') {
  if (!plugin || !app) {
    console.error('Plugin or App instance is missing');
    return;
  }

  // Iterate through each field and display it if enabled
  fields.forEach(field => {
    if (field.enabled) {
      const value = getNestedField(frontmatter, field.name);
      if (!value || value.toString().trim() === '') {
        // Skip empty values
        return;
      }
      if (field.nestedFields) {
        if (Array.isArray(value)) {
          // Create a table for nested fields
          if (field.showHeader) {
            container.createEl('h2', { text: field.displayName });
          }
          const table = container.createEl('table');
          const thead = table.createEl('thead');
          const tbody = table.createEl('tbody');

          if (field.showHeaderRow) {
            const headerRow = thead.createEl('tr');
            field.nestedFields.forEach(nestedField => {
              if (nestedField.enabled) {
              headerRow.createEl('th', { text: nestedField.displayName });}
            });
          }

          value.forEach(item => {
            const row = tbody.createEl('tr');
            field.nestedFields?.forEach(nestedField => {
              if (nestedField.enabled) {
              const nestedValue = item[nestedField.name];
              const td = row.createEl('td');
              createFieldElement(td, nestedField.displayName, nestedValue, sourcePath, nestedField.type, plugin, app);}
            });
          });

          table.appendChild(thead);
          table.appendChild(tbody);
          container.appendChild(table);
        }
      } else {
        // Display non-nested fields
        if (field.showHeader) {
          container.createEl('h2', { text: field.displayName });
        }
        createFieldElement(container, field.displayName, value, sourcePath, field.type, plugin, app);
      }
    }
  });
}

// --- Get Nested Field ---
function getNestedField(obj: any, path: string) {
  // Retrieve nested field value based on the path
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// --- Process Internal Links ---
function processInternalLinks(parent: HTMLElement, plugin: Plugin) {
  // Convert [[Internal Links]] into clickable links
  const regex = /\[\[(.*?)\]\]/g;
  parent.innerHTML = parent.innerHTML.replace(regex, (match, p1) => {
    return `<a href="#" class="internal-link">${p1}</a>`;
  });

  if (!plugin || !plugin.registerDomEvent) {
    console.error('Plugin instance or registerDomEvent is missing in processInternalLinks');
    return;
  }

  // Add event listener for internal link clicks
  plugin.registerDomEvent(document, 'click', (event) => {
    if ((event.target as HTMLElement).classList.contains('internal-link')) {
      const linkText = (event.target as HTMLElement).innerText;
      plugin.app.workspace.openLinkText(linkText, '', false);
    }
  });
}

// --- Create Field Element ---
function createFieldElement(container: HTMLElement, name: string, value: any, sourcePath: string, itemType?: string, plugin: Plugin, app: App) {
  const parent = container.createEl('p');

  if (Array.isArray(value)) {
    value = value.join(', ');
  }

  let markdownContent = '';

  // Determine the appropriate Markdown content based on the field type


  if (value === null || value === '' || value.trim() === '') {
    markdownContent = 'No date or phone number found.';
    console.log(`No date or phone number found for ${name}`);
  }

  else if (typeof value === 'string') {

     if (value.startsWith('http://') || value.startsWith('https://')) {
      markdownContent = `[${value}](${value})`;
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      markdownContent = `[${value}](mailto:${value})`;}
      else if (/^\d{1,2}\/\d{1,2}\/\d{4}$|^\d{4}-\d{2}-\d{2}$|^\d{8}$/.test(value.trim())) {
        // Date format
        const dateValue = value.replace(/\s+/g, '');
        markdownContent = `[[${dateValue}]]`;
        console.log('date', dateValue);
      }
      else if (/^\+?[1-9]\d{0,5}|0[\s.-]?[1-9]\d{3}[\s.-]?\d{4}$/.test(value.trim())) {
        // Phone number or similar format
        markdownContent = `[${value.replace(/\s+/g, '')}](tel:${value.replace(/\s+/g, '')})`;
      console.log('phone', value)
      
    } else if (value.startsWith('[[') && value.endsWith(']]')) {
      markdownContent = `[[${value.slice(2, -2)}]]`;
    } else {
      markdownContent = value;
    }
  } else {
    markdownContent = String(value);
  }
  
  // Render the field value based on its type

    if (itemType === 'image') {
    const img = parent.createEl('img');
    img.setAttribute('src', value);
    }  
    else if (itemType === 'header') {
      container.createEl('h1', { text: value });
    } else {
      MarkdownRenderer.renderMarkdown(markdownContent, parent, sourcePath, plugin).then(() => {
        processInternalLinks(parent, plugin);
      }).catch(error => {
        console.error('Error rendering markdown:', error);
      });
    }
  


  if (!container.contains(parent)) {
    container.appendChild(parent);
  }
}