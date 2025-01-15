export class GameServer {
    constructor(config) {
        this.config = config;
        this.clients = new Map();
        this.providers = new Map();
        this.plugins = new Map();
    }

    registerProvider(name, provider) {
        provider.onRegister(this);
        this.providers.set(name, provider);
    }

    getProvider(name) {
        return this.providers.get(name);
    }

    async initialize() {
        // Initialize providers first
        for (const provider of this.providers.values()) {
            await provider.initialize();
        }

        // Then initialize plugins
        for (const plugin of this.plugins.values()) {
            await plugin.initialize();
        }
    }
    
    async start() {
        // Connect all clients
        for (const [name, client] of this.clients) {
            try {
                await client.connect();
                console.log(`Client ${name} connected successfully`);
            } catch (error) {
                console.error(`Failed to connect client ${name}:`, error);
            }
        }

        // Initialize all plugins
        for (const [name, plugin] of this.plugins) {
            try {
                await plugin.initialize();
                console.log(`Plugin ${name} initialized successfully`);
            } catch (error) {
                console.error(`Failed to initialize plugin ${name}:`, error);
            }
        }
    }

    async stop() {
        // Disconnect all clients in reverse order
        const clients = Array.from(this.clients.entries()).reverse();
        for (const [name, client] of clients) {
            try {
                await client.disconnect();
                console.log(`Client ${name} disconnected successfully`);
            } catch (error) {
                console.error(`Failed to disconnect client ${name}:`, error);
            }
        }
    }
}
