import EventEmitter from 'events';

class BaseProvider extends EventEmitter {
    constructor(name, config = {}) {
        super();
        this.name = name;
        this.config = config;
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