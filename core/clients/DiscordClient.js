import { Client, GatewayIntentBits, Routes } from 'discord.js';
import { BaseClient } from './BaseClient.js';

class DiscordClient extends BaseClient {
    constructor(config) {
        super(config);  // Call the parent class constructor
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.MessageContent
            ]
        });
        this.commands = new Map();
    }

    async connect() {
        if (this.isConnected) return;

        await this.client.login(this.config.token);
        this.isConnected = true;
        console.log(`Discord bot logged in as ${this.client.user.tag}`);
    }

    async disconnect() {
        if (!this.isConnected) return;
        await this.client.destroy();
        this.isConnected = false;
    }

    async registerCommands(commands) {
        const commandData = commands.map(cmd => ({
            name: cmd.name,
            description: cmd.description,
            options: cmd.options || []
        }));

        try {
            // Use bulk command registration
            await this.client.rest.put(
                Routes.applicationCommands(this.client.user.id),
                { body: commandData }
            );
            console.log('Successfully registered application commands.');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    }

    async updateStatus(status) {
        if (!this.isConnected) return;
        await this.client.user.setActivity(status.text, status.options);
    }
}

export { DiscordClient };
