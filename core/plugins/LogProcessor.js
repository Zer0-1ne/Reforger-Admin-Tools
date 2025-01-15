export class LogProcessor extends BasePlugin {
    constructor() {
        super('log-processor');
        this.players = new Map();
    }

    async initialize() {
        const logProvider = this.server.getProvider('log');
        const discord = this.server.getClient('discord');

        logProvider.on('playerConnected', async (data) => {
            this.players.set(data.playerNumber, {
                ...data,
                joinTime: Date.now()
            });

            await discord.updateStatus({
                text: `Players Online: ${this.players.size}`,
                options: { type: 'WATCHING' }
            });

            const adminChannel = await discord.getChannel(this.server.config.adminChannelId);
            if (adminChannel) {
                await adminChannel.send(`Player connected: ${data.playerName} (${data.ipAddress})`);
            }
        });

        logProvider.on('playerGuidSet', (data) => {
            for (const [id, player] of this.players) {
                if (!player.beGuid) {
                    this.players.set(id, {
                        ...player,
                        beGuid: data.beGuid
                    });
                    break;
                }
            }
        });
    }

    getPlayerInfo(identifier) {
        for (const player of this.players.values()) {
            if (
                player.playerNumber === identifier ||
                player.playerName === identifier ||
                player.beGuid === identifier
            ) {
                return player;
            }
        }
        return null;
    }

    async destroy() {
        this.players.clear();
    }
}
