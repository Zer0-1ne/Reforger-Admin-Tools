class StatusUpdater extends BasePlugin {
    constructor() {
        super('status-updater');
        this.updateInterval = null;
    }

    async initialize() {
        const discord = this.server.getClient('discord');
        const rcon = this.server.getClient('rcon');

        this.updateInterval = setInterval(async () => {
            try {
                const players = await rcon.getAllPlayers();
                await discord.updateStatus({
                    text: `Players Online: ${players.length}`,
                    options: { type: 'WATCHING' }
                });
            } catch (error) {
                console.error('Failed to update status:', error);
            }
        }, 30000);
    }

    async destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}