// Debug configuration
export const DEBUG_CONFIG = {
  enabled: true,
  categories: {
    store: true,
    grid: true,
    worker: true,
    imageSource: true,
    frameCard: true,
  }
};

// Helper to enable/disable debug categories
export const setDebugCategory = (category: keyof typeof DEBUG_CONFIG.categories, enabled: boolean) => {
  DEBUG_CONFIG.categories[category] = enabled;
  console.log(`[Debug] ${category} logging ${enabled ? 'enabled' : 'disabled'}`);
};

// Helper to enable/disable all debug logging
export const setDebugEnabled = (enabled: boolean) => {
  DEBUG_CONFIG.enabled = enabled;
  console.log(`[Debug] All logging ${enabled ? 'enabled' : 'disabled'}`);
};

// Export to window for easy console access
if (typeof window !== 'undefined') {
  (window as any).bgDebug = {
    enable: () => setDebugEnabled(true),
    disable: () => setDebugEnabled(false),
    enableCategory: (cat: string) => setDebugCategory(cat as any, true),
    disableCategory: (cat: string) => setDebugCategory(cat as any, false),
    showCategories: () => console.table(DEBUG_CONFIG.categories),
    help: () => {
      console.log(`
Better Grid Playground Debug Commands:
--------------------------------------
bgDebug.enable()                 - Enable all debug logging
bgDebug.disable()                - Disable all debug logging
bgDebug.enableCategory('store')  - Enable specific category
bgDebug.disableCategory('grid')  - Disable specific category
bgDebug.showCategories()         - Show all categories and their status
bgDebug.help()                   - Show this help

Available categories: ${Object.keys(DEBUG_CONFIG.categories).join(', ')}
      `);
    }
  };
  
  console.log('[Debug] Debug utilities loaded. Type "bgDebug.help()" for commands.');
} 