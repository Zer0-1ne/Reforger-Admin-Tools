import { BaseProvider } from '../providers/BaseProvider.js';
import { SftpTailReader } from './SftpTailReader.js';

export class SftpProvider extends BaseProvider {
    constructor(config) {
        super('sftp', config);
        this.readers = new Map();
    }

    async initialize() {
        // Initialize any default SFTP connections from config
        if (this.config.defaultConnections) {
            for (const [name, connConfig] of Object.entries(this.config.defaultConnections)) {
                await this.createReader(name, connConfig);
            }
        }
    }

    async createReader(name, config) {
        const reader = new SftpTailReader(config);

        reader.on('data', (data) => this.emit('data', { name, data }));
        reader.on('error', (error) => this.emit('error', { name, error }));
        reader.on('reconnecting', (attempt) => this.emit('reconnecting', { name, attempt }));

        await reader.connect(config);
        this.readers.set(name, reader);
        return reader;
    }

    async startMonitoring(name, remotePath) {
        const reader = this.readers.get(name);
        if (!reader) {
            throw new Error(`No SFTP reader found with name: ${name}`);
        }
        await reader.startMonitoring(remotePath);
    }

    async destroy() {
        const stopPromises = Array.from(this.readers.values()).map((reader) => reader.stop());
        await Promise.all(stopPromises);
        this.readers.clear();
    }
}
