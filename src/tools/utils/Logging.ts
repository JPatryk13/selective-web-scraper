import { MID, Message } from '@tools/Types';
import { EventEmitter } from 'events';

// export interface LogOptions {
//     minLevels: { [module: string]: string }
// }

export interface LogEntry {
    level: string;
    module: string;
    location?: string;
    group?: { args: any[] };
    message: string;
}

export interface LogListener {
    (logEntry: LogEntry): void | Promise<void>
}

export interface LogComposer {
    (logEntry: LogEntry): string;
}

export class LogManager extends EventEmitter {
    // private options: LogOptions = {
    //     minLevels: {
    //         '': 'info'
    //     }
    // };

    // Prevent the console logger from being added twice
    private loggerRegistered = false;

    public configure(/* options: LogOptions */): LogManager {
        // this.options = Object.assign({}, this.options, options);
        return this;
    }

    /**
     * @default
     * ```
     * minLevels: {
     *     'app': 'error',
     *     'app.worker': 'info',
     *     'app.worker.module': 'debug',
     *     'app.worker.module.etc': 'trace',
     * }
     * ```
     * @example
     * The `this.options.minLevels` are set as follows:
     * ```
     * minLevels: {
     *     '': 'warn',
     *     'core': 'info',
     *     'core.module': 'debug',
     *     'core.module.class': 'trace'
     * }
     * ```
     * And `getLogger` is being called with `module = 'core.module'`. The starting parameters within the function are:
     * ```
     * let minLevel = 'none';
     * let match = '';
     * ```
     * 
     * The loop interates over minLevels keys: [`''`, `'core'`, `'core.module'`, `'core.module.class'`] checking if the `module`
     * start with the `key` value and if the length of the `key` is greater or equal that of `match`. Let's look at the process:
     * 
     * Iteration #1 - `key = ''`: (`module` starts with `''` && `key` and `match` are equal length) = `true`
     * ```
     * minLevel = 'warn'
     * match = ''
     * ```
     * Interation #2 - `key = 'core'`: (`module` starts with `'core'` && `key` has greater length than `match`) = `true`
     * ```
     * minLevel = 'info';
     * match = 'core';
     * ```
     * Interation #3 - `key = 'core.module'`: (`module` starts with `'core.module'` && `key` has greater length than `match`) = `true`
     * ```
     * minLevel = 'debug';
     * match = 'core.module';
     * ```
     * Interation #4 - `key = 'core.module.class'`: (`module` doesn't start with `'core.module.class'` && `key` is shorter than `match`) = `false`
     * Therefore, we return a `Logger` object with the last `minLevel` and given `module`:
     * ```
     * return new Logger(this, 'core.module', 'debug');
     * ```
     * Lifecycle continued at `Logger.log()`
     * @see Logger.log
     * @param module
     */
    public getLogger(module: string): Logger {
        let minLevel = 'none';
        let match = '';

        // for (const key in this.options.minLevels) {
        //     if (module.startsWith(key) && key.length >= match.length) {
        //         minLevel = this.options.minLevels[key];
        //         match = key;
        //     }
        // }

        return new Logger(this, module, /* minLevel */);
    }

    public onLogEntry(listener: LogListener): LogManager {
        this.on('log', listener);
        return this;
    }

    public registerLogger(onLogEntryListener: LogListener): LogManager {
        if (this.loggerRegistered) return this;

        this.onLogEntry(onLogEntryListener);

        this.loggerRegistered = true;
        return this;
    }
}


/**
 * A collection of defined listener functions to use as a config for `LogManager`.
 */
export class Listener {

    public static consoleLogListener: LogListener = (logEntry: LogEntry) => {

        function _logToConsole(_level: string, _message: string) {
            switch (_level) {
                case 'trace':
                    console.trace(_message);
                    break;
                case 'debug':
                    console.debug(_message);
                    break;
                case 'info':
                    console.info(_message);
                    break;
                case 'warn':
                    console.warn(_message);
                    break;
                case 'error':
                    console.error(_message);
                    break;
                default:
                    console.log(`{${logEntry.level}} ${_message}`);
            }
        }

        const msg = `${new Date().toISOString()} [${logEntry.level.toUpperCase()}] @<${logEntry.module}> ${logEntry.message}`; // ignoring location parameter

        _logToConsole(logEntry.level, msg);

        if (logEntry.group) {

            // Use message as a label for the group
            console.groupCollapsed('args');

            for (const args of logEntry.group.args) {
                _logToConsole(logEntry.level, args);
            }

            console.groupEnd();
        }

    }

    public static chromeRuntimeDispatcher: LogListener = async (logEntry: LogEntry) => {

        await chrome.runtime.sendMessage({
            mid: MID.Log,
            payload: logEntry,
            _sender: logEntry.module,
            _recipient: 'service-worker'
        } as Message);

    }
}

class Composer {

}

export class Logger {
    private logManager: EventEmitter;
    // private minLevel: number;
    private module: string;
    private readonly levels: { [key: string]: number } = {
        'trace': 1,
        'debug': 2,
        'info': 3,
        'warn': 4,
        'error': 5
    };
    private submodule?: string;

    /**
     * @example
     * Let's say the logger has been created as follows:
     * ```
     * return new Logger(this, 'core.module', 'debug');
     * ```
     * Therefore:
     * ```
     * this.module = 'core.module';
     * this.minLevel = 2;
     * ```
     * @see Logger.log
     * @param logManager
     * @param module
     * @param minLevel
     */
    constructor(logManager: EventEmitter, module: string, /* minLevel: string */) {
        this.logManager = logManager;
        this.module = module;
        // this.minLevel = this.levelToInt(minLevel);
    }

    /**
     * Converts a string level (trace/debug/info/warn/error) into a number 
     * 
     * @param minLevel 
     */
    // private levelToInt(minLevel: string): number {
    //     if (minLevel.toLowerCase() in this.levels)
    //         return this.levels[minLevel.toLowerCase()];
    //     else
    //         return 99;
    // }

    /**
     * Central logging method.
     * @example
     * Let's say the logger has been created with initials:
     * ```
     * module = 'core.module';
     * minLevel = 2;
     * ```
     * And the logger is being called via `trace()`:
     * ```
     * logger.trace("This is a trace message");
     * ```
     * In this function we receive `logLevel = 'trace'` and `message = 'This is a trace message'`. Therefore:
     * ```
     * const level = this.levelToInt('trace'); // that is being evaluated to 1
     * if (level < this.minLevel) return; // which in fact, is smaller than the minLevel property the class was instantiated with
     * // Therefore the journey ends here - no message is being logged
     * ```
     * Let's look at different case. The logger is being called with `info()`:
     * ```
     * logger.info("This is an info message");
     * ```
     * Clearly, it passes the first checks. Later we have:
     * ```
     * const logEntry: LogEntry = { level: 'info', module: 'core.module', message: "This is an info message" };
     * ```
     * 
     * @param logLevel 
     * @param message 
     */
    public log(logLevel: string, message: string, group?: { args: any[] }): void {
        // const level = this.levelToInt(logLevel);
        // if (level < this.minLevel) return;

        const module = this.submodule ? this.module + `.${this.submodule}` : this.module;

        const logEntry: LogEntry = { level: logLevel, module, message, group };

        // Obtain the line/file through a thoroughly hacky method
        // This creates a new stack trace and pulls the caller from it.  If the caller
        // if .trace()
        // const error = new Error("");
        // if (error.stack) {
        //     const cla = error.stack.split("\n");
        //     let idx = 1;
        //     while (idx < cla.length && cla[idx].includes("at Logger.Object.")) idx++;
        //     if (idx < cla.length) {
        //         logEntry.location = cla[idx].slice(cla[idx].indexOf("at ") + 3, cla[idx].length);
        //     }
        // }
        logEntry.location = "";

        this.logManager.emit('log', logEntry);
    }

    public logExplicit(logEntry: LogEntry): void {
        this.logManager.emit('log', logEntry);
    }

    public setSubmodule(submodule: string): Logger {
        this.submodule = submodule;
        return this
    }

    public trace(message: string, group?: { args: any[] }): void { this.log('trace', message, group); }
    public debug(message: string, group?: { args: any[] }): void { this.log('debug', message, group); }
    public info(message: string, group?: { args: any[] }): void { this.log('info', message, group); }
    public warn(message: string, group?: { args: any[] }): void { this.log('warn', message, group); }
    public error(message: string, group?: { args: any[] }): void { this.log('error', message, group); }

}


/**
 * ```
 * minLevels: {
 *     'app': 'error',
 *     'app.worker': 'info',
 *     'app.worker.module': 'debug',
 *     'app.worker.module.etc': 'trace',
 * }
 * ```
 */
export const logDispatcher = new LogManager().registerLogger(Listener.chromeRuntimeDispatcher);
