// --- types.ts ---

// Interface Definitions
export interface FrontmatterFieldSetting {
  
    name: string;
    displayName: string;
    type: 'string' | 'number' | 'boolean' | 'date' | 'url' | 'image' | 'header';
    enabled: boolean;
    nestedFields?: FrontmatterFieldSetting[];
    showHeaderRow?: boolean;
    showHeader?: boolean;
  
  }
  
  export interface SubSetting {
    tag: string; // Tag to apply settings to
    folder: string; // Folder to apply settings to
    fields: FrontmatterFieldSetting[];
  }
  
  export interface CustomPropPanelSettings {
    frontmatterFields: FrontmatterFieldSetting[];
    subSettings: SubSetting[];
  }c