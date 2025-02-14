const axios = require('axios');
const fs = require('fs');
const path = require('path');

// GitHub repository where plugins are stored
const GITHUB_PLUGINS_URL = 'https://raw.githubusercontent.com/kinghansmd/Vortex-xmd-data-base/main/plugins/';

// List of plugin files to fetch from GitHub
const pluginFiles = [
    'menu.js',  // Add more plugin filenames here
];

// Local plugins directory
const pluginsDir = path.join(__dirname, 'plugins');

// Ensure the plugins directory exists
if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
}

// Function to download plugins
async function downloadPlugins() {
    console.log('🔄 Downloading latest plugins from GitHub...');

    for (let file of pluginFiles) {
        try {
            let url = `${GITHUB_PLUGINS_URL}${file}`;
            let response = await axios.get(url);

            if (response.status === 200) {
                let filePath = path.join(pluginsDir, file);
                fs.writeFileSync(filePath, response.data, 'utf8');
                console.log(`✅ Plugin loaded: ${file}`);
            }
        } catch (error) {
            console.error(`❌ Failed to load plugin: ${file}`, error.message);
        }
    }
}

// Function to install and execute plugins
function installPlugins() {
    console.log('🛠 Installing plugins...');
    fs.readdirSync(pluginsDir).forEach((plugin) => {
        if (path.extname(plugin).toLowerCase() === '.js' && plugin !== 'HansTz.js') {
            require(path.join(pluginsDir, plugin));
            console.log(`🚀 Plugin installed: ${plugin}`);
        }
    });
}

// Main function to update and install plugins
(async () => {
    await downloadPlugins();
    installPlugins();
})();
