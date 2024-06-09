import { TFile, App, Plugin, MetadataCache } from 'obsidian';
import { FrontmatterFieldSetting, CustomPropPanelSettings } from '../types';
import { CustomPropPanelPlugin } from '../main';



export function parseFrontmatterFields(file: TFile, plugin: CustomPropPanelPlugin): FrontmatterFieldSetting[] {
  // Debug logging to check the plugin object

  console.log('plugin object:', plugin);

  if (!plugin || !plugin.app || !plugin.app.metadataCache) {
    console.error('Invalid plugin object:', plugin);
    return [];
  }

  const parseFields = (obj: any, prefix = ''): FrontmatterFieldSetting[] => {
    return Object.keys(obj).map(key => {
      const value = obj[key];
      const displayName = key.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
      const field: FrontmatterFieldSetting = {
        name: key,
        displayName,
        type: 'string', // Default type is string
        enabled: true,
        showHeader: true
      };

      // Handle nested fields
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          field.type = 'nested';
          field.nestedFields = Object.keys(value[0]).map(nestedKey => ({
            name: nestedKey,
            displayName: nestedKey.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
            type: 'string',
            enabled: true,
            showHeader: true,
            showHeaderRow: true
          }));
        } else {
          field.type = 'list';
        }
      } else if (typeof value === 'object' && value !== null) {
        field.type = 'nested';
        field.nestedFields = parseFields(value, `${prefix}.${key}`);
      }

      return field;
    });
  };

  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  return frontmatter ? parseFields(frontmatter) : [];
}



/* // --- settings/parseFrontmatterFields.ts ---

import { TFile, App, Plugin, MetadataCache} from 'obsidian';
import { FrontmatterFieldSetting, CustomPropPanelSettings } from '../types';
import { CustomPropPanelPlugin } from '../main';

export function parseFrontmatterFields( file: TFile, plugin: CustomPropPanelPlugin): FrontmatterFieldSetting[] {
  const parseFields = (obj: any, prefix = ''): FrontmatterFieldSetting[] => {
    return Object.keys(obj).map(key => {
      const value = obj[key];
      const displayName = key.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
      const field: FrontmatterFieldSetting = {
        name: key,
        displayName,
        type: 'string', // Default type is string
        enabled: true
      };

      // Handle nested fields
      if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object') {
          field.type = 'nested';
          field.nestedFields = Object.keys(value[0]).map(nestedKey => ({
            name: nestedKey,
            displayName: nestedKey.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
            type: 'string',
            enabled: true,
          }));
        } else {
          field.type = 'list';
        }
      } else if (typeof value === 'object' && value !== null) {
        field.type = 'nested';
        field.nestedFields = parseFields(value, `${prefix}.${key}`);
      }

      return field;
    });
  };

  const frontmatter = plugin.app.metadataCache.getFileCache(file)?.frontmatter;
  return frontmatter ? parseFields(frontmatter) : [];
}


 */