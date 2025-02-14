const axios = require('axios');
const fs = require('fs');
const path = require('path');

// GitHub raw URL for plugin files
const GITHUB_PLUGINS_URL = 'https://raw.githubusercontent.com/kinghansmd/Vortex-xmd-data-base/main/plugins/';

// List of plugin files to fetch
const pluginFiles = [
    'menu.js', // Add more plugin filenames here
];

// Local plugins directory
const pluginsDir = path.join(__dirname, 'plugins');

// Ensure plugins directory exists
if (!fs.existsSync(pluginsDir)) {
    fs.mkdirSync(pluginsDir, { recursive: true });
}

// Function to download and execute plugins
async function loadPlugins() {
    console.log('Downloading and loading plugins from GitHub...');

    for (let file of pluginFiles) {
        try {
            let url = `${GITHUB_PLUGINS_URL}${file}`;
            let response = await axios.get(url);

            if (response.status === 200) {
                let filePath = path.join(pluginsDir, file);
                fs.writeFileSync(filePath, response.data, 'utf8');
                console.log(`Loaded plugin: ${file}`);

                // Execute plugin script
                require(filePath);
            }
        } catch (error) {
            console.error(`Failed to load plugin: ${file}`, error.message);
        }
    }
}

// Initialize Plugins
loadPlugins().then(() => {
    console.log('All plugins loaded successfully!');
});

// Example Command Handling (Replace with your bot framework)
const commandHandler = (command) => {
    if (command === '.menu') {
        console.log('Executing menu command from plugin...');
        // Call the menu function from the loaded plugin
        if (global.menuCommand) {
            global.menuCommand();
        } else {
            console.log('Menu command not found in plugins.');
        }
    }
};

// Simulated command execution (Replace with WhatsApp Bot API)
commandHandler('.menu');
