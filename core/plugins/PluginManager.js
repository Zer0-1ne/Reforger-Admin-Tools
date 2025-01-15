import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Logger from './core/logger';  // Adjust the import path as necessary

// Get the current directory of this file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class PluginManager {
  constructor() {
    this.plugins = {};  // Store loaded plugins here
  }

  // Method to get and load plugins
  async loadPlugins(force = false) {
    // If plugins are already loaded and 'force' is false, return them
    if (this.plugins && !force) return this.plugins;

    // Reset the plugin list before loading
    this.plugins = {};

    try {
      // Use fs.promises to read the contents of the plugin directory
      const dir = await fs.promises.opendir(path.join(__dirname, './plugins'));

      // Array to hold the plugin filenames
      const pluginFilenames = [];

      for await (const dirent of dir) {
        // Only process .js files, and skip specific files
        if (!dirent.isFile() || !dirent.name.endsWith('.js')) continue;
        if (
          [
            'index.js',        // Skip the entry point file
            'base-plugin.js',   // Skip base plugin files
            'readme.md'         // Skip documentation files
          ].includes(dirent.name)
        ) continue;

        pluginFilenames.push(dirent.name);
      }

      // Loop through the plugin files and dynamically import each one
      for (const pluginFilename of pluginFilenames) {
        Logger.verbose('PluginManager', 1, `Loading plugin: ${pluginFilename}...`);
        const { default: Plugin } = await import(`./plugins/${pluginFilename}`);
        this.plugins[Plugin.name] = Plugin;  // Register the plugin by its name
      }

      Logger.verbose('PluginManager', 1, `Loaded ${pluginFilenames.length} plugins.`);
    } catch (error) {
      Logger.error('PluginManager', 1, `Error loading plugins: ${error.message}`);
    }

    return this.plugins;  // Return the loaded plugins
  }

  // Method to get a specific plugin by its name
  getPlugin(name) {
    return this.plugins[name] || null;
  }

  // Method to list all available plugin names
  listPlugins() {
    return Object.keys(this.plugins);
  }
}

export default new PluginManager();  // Export as a singleton instance
