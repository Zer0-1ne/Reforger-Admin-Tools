// Logger.js
class Logger {
    constructor() {
      this.logLevels = ['verbose', 'info', 'warn', 'error']; // Define available log levels
    }
  
    // Helper method to format the log message with a timestamp
    formatMessage(level, message) {
      const timestamp = new Date().toISOString();
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    }
  
    // Log a verbose message
    verbose(module, level, message) {
      if (level >= 1) {
        console.log(this.formatMessage('verbose', `[${module}] ${message}`));
      }
    }
  
    // Log an informational message
    info(module, message) {
      console.log(this.formatMessage('info', `[${module}] ${message}`));
    }
  
    // Log a warning message
    warn(module, message) {
      console.warn(this.formatMessage('warn', `[${module}] ${message}`));
    }
  
    // Log an error message
    error(module, message) {
      console.error(this.formatMessage('error', `[${module}] ${message}`));
    }
  
    // Optionally add methods for more levels (e.g., debug, fatal, etc.)
  }
  
  export default new Logger();
  