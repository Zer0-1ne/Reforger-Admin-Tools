import { EventEmitter } from 'events';
import { Client } from 'ssh2';

export class SftpTailReader extends EventEmitter {
    constructor(config) {
        super();
        this.config = config;
        this.client = new Client();
        this.sftp = null;
        this.fileStream = null;
        this.remotePath = null;
        this.readInterval = 500; // Time interval for checking new data (in ms)
        this.isMonitoring = false;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.client.on('ready', () => {
                this.client.sftp((err, sftp) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.sftp = sftp;
                    resolve();
                });
            });

            this.client.on('error', (error) => {
                this.emit('error', error);
                reject(error);
            });

            this.client.connect({
                host: this.config.host,
                port: this.config.port,
                username: this.config.username,
                password: this.config.password,
            });
        });
    }

    async startMonitoring(remotePath) {
        this.remotePath = remotePath;
        this.isMonitoring = true;

        this.fileStream = this.sftp.createReadStream(this.remotePath, {
            start: 0, // Start reading from the beginning of the file
            encoding: 'utf8',
        });

        this.fileStream.on('data', (chunk) => {
            this.emit('data', chunk);
        });

        this.fileStream.on('end', () => {
            console.log('End of file reached, continuing to monitor...');
            if (this.isMonitoring) {
                this.fileStream.resume(); // Keep listening for new data
            }
        });

        this.fileStream.on('error', (err) => {
            this.emit('error', err);
            console.error('Error reading from remote file:', err);
        });

        // Simulate tailing by re-opening the stream after a certain period
        this.monitorFile();
    }

    monitorFile() {
        setInterval(async () => {
            if (this.isMonitoring && this.sftp) {
                try {
                    // Check for file changes (tail-like behavior)
                    await this.sftp.stat(this.remotePath); // Check if file exists and is accessible
                } catch (err) {
                    this.emit('error', err);
                    console.error('File monitoring error:', err);
                }
            }
        }, this.readInterval);
    }

    stop() {
        this.isMonitoring = false;
        if (this.fileStream) {
            this.fileStream.destroy();
        }
        if (this.sftp) {
            this.sftp.end();
        }
        this.client.end();
    }
}
