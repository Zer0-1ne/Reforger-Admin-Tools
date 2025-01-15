// src/clients/RconClient.js
import { Rcon } from 'rcon-client';
import { BaseClient } from './BaseClient.js';

class RconClient extends BaseClient {
    constructor(config) {
        super(config);
        this.rcon = new Rcon(config);
    }

    async connect() {
        if (this.isConnected) return;
        await this.rcon.connect();
        this.isConnected = true;
    }

    async disconnect() {
        if (!this.isConnected) return;
        await this.rcon.end();
        this.isConnected = false;
    }

    async sendCommand(command) {
        if (!this.isConnected) {
            throw new Error('RCON not connected');
        }
        return await this.rcon.send(command);
    }
}