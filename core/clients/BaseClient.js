class BaseClient {
    constructor(config = {}) {
        this.config = config;
        this.isConnected = false;
    }

    async connect() {
        throw new Error('connect() must be implemented by child class');
    }

    async disconnect() {
        throw new Error('disconnect() must be implemented by child class');
    }

    getStatus() {
        return {
            isConnected: this.isConnected,
            config: this.config
        };
    }
}

export { BaseClient };
