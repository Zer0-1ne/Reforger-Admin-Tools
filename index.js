import config from './settings.json' assert { type: 'json' };
import { GameServer } from './core/GameServer.js';
import { LogProvider } from './core/providers/logs/LogProvider.js';
import { SftpProvider } from './core/providers/SftpProvider.js';
import { DiscordClient } from './core/clients/DiscordClient.js';
import { RconClient } from './core/clients/RconClient.js';
import { BattlEyeClient } from './core/clients/BattlEyeClient.js';
import { LogProcessor } from './core/plugins/LogProcessor.js';
import { FileSync } from './core/plugins/FileSync.js';
import { LogMonitor } from './core/providers/logs/LogMonitor.js';

async function main() {
    const server = new GameServer(config);

    // Register providers first
    const logProvider = new LogProvider(config.logMonitor);
    server.registerProvider('log', logProvider);
    server.registerProvider('sftp', new SftpProvider(config.sftp));

    // Register clients
    server.registerClient('discord', new DiscordClient(config.discord));
    server.registerClient('rcon', new RconClient(config.rcon));
    server.registerClient('battleye', new BattlEyeClient(config.battleye));

    // Register plugins
    server.registerPlugin('log-processor', new LogProcessor());
    server.registerPlugin('file-sync', new FileSync());

    // Initialize everything
    await server.initialize();

    // Event listeners for logProvider
    logProvider.on('playerConnected', async (data) => {
        console.log('[Event: playerConnected]', data);
    });

    logProvider.on('playerGuidSet', async (data) => {
        console.log('[Event: playerGuidSet]', data);
    });

    logProvider.on('log', async (line) => {
        console.log('[Event: log]', line);
    });

    // Handle shutdown
    process.on('SIGINT', async () => {
        console.log('Shutting down...');
        try {
            await server.stop();
        } catch (error) {
            console.error('Error during shutdown:', error);
        }
        process.exit(0);
    });
}

main().catch(console.error);
