const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_API_URL = 'https://api.github.com/repos/kinghansmd/Vortex-xmd-data-base/contents/plugins';
const LOCAL_PLUGIN_DIR = path.join(__dirname, 'plugins');

// Ensure the local plugins directory exists
if (!fs.existsSync(LOCAL_PLUGIN_DIR)) {
    fs.mkdirSync(LOCAL_PLUGIN_DIR, { recursive: true });
}

// Function to download a plugin file
async function downloadPlugin(plugin) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(LOCAL_PLUGIN_DIR, plugin.name);
        const file = fs.createWriteStream(filePath);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };

        https.get(plugin.download_url, options, (response) => {
            if (response.statusCode !== 200) {
                reject(`Failed to download ${plugin.name}: ${response.statusCode}`);
                return;
            }
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
}

// Function to load all plugins
async function loadPlugins() {
    try {
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };

        https.get(GITHUB_API_URL, options, async (response) => {
            if (response.statusCode !== 200) {
                console.error(`Failed to fetch plugin list: ${response.statusCode}`);
                return;
            }

            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', async () => {
                const plugins = JSON.parse(data);
                for (const plugin of plugins) {
                    if (plugin.type === 'file' && plugin.name.endsWith('.js')) {
                        try {
                            await downloadPlugin(plugin);
                            require(path.join(LOCAL_PLUGIN_DIR, plugin.name));
                            console.log(`${plugin.name} loaded successfully.`);
                        } catch (error) {
                            console.error(`Error loading ${plugin.name}:`, error);
                        }
                    }
                }
            });
        }).on('error', (error) => {
            console.error('Error fetching plugin list:', error);
        });
    } catch (error) {
        console.error('Error loading plugins:', error);
    }
}

loadPlugins();
                       
