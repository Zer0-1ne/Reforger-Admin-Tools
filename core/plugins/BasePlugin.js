class BasePlugin {
    constructor(name) {
        this.name = name;
        this.server = null;
    }

    onRegister(server) {
        this.server = server;
    }

    async initialize() {
        throw new Error('initialize() must be implemented by child class');
    }

    async destroy() {
        throw new Error('destroy() must be implemented by child class');
    }
}
