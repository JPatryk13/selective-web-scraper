import { ExtendedLogger, LoggerConfig, MessageComposerIterface } from "@tools/utils/ts-modlog/Types";


// To developer: make the runner config modifiable via class properties

/**
 * Example use:
 * <br><br>
 * ```
 * const MyModuleLogger: CustomLogger = new CustomLogger({
 *     name: "MyModuleLogger",
 *     loggers: [new ConsoleLogger()]
 * });
 * 
 * // that's being written to a consol
 * MyModuleLogger.info("That is an info log."); // 2023-07-15T01:14:11.330Z INFO  That is an info log.
 * MyModuleLogger.error("Error message here."); // 2023-07-15T01:14:11.331Z ERROR Error message here.
 * 
 * const MyOtherModuleLogger: CustomLogger = new CustomLogger({
 *     name: "MyOtherLogger",
 *     loggers: [
 *         new LogDispatcher({ worker: "popup-script", class: "SomeClass", function: "randomFunction" }),
 *         new FileLogger({ filename: "path/to/the/log/file.log" })
 *     ],
 *     messageComposer: DetailedMessageComposer
 * });
 * 
 * // that's being sent to service-worker and saved to a file
 * MyOtherModuleLogger.debug("This is some debug."); // 2023-07-15T01:14:12.672Z DEBUG <worker: popup-script>:<class: SomeClass>:<function: randomFunction> This is some debug.
 * ```
 * 
 */
export class TSModLog implements ExtendedLogger {

    public readonly Type = {
        trace: "TRACE",
        debug: "DEBUG",
        info: "INFO ",
        warn: "WARN ",
        error: "ERROR"
    }

    readonly config: LoggerConfig = {
        name: "TSLogger",
        loggers: [],
    };

    constructor(kwargs?: LoggerConfig) {
        // configure logger
        for (let key in kwargs) {

            // Assign given attribute if it matches schema
            if (this.config[key]) this.config[key] = kwargs[key];
        }
    }

    public trace(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void {
        this.appendToAll(this.Type.trace, message, kwargs, optionalParams);
    }

    public debug(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void {
        this.appendToAll(this.Type.debug, message, kwargs, optionalParams);
    }

    public info(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void {
        this.appendToAll(this.Type.info, message, kwargs, optionalParams);
    }

    public warn(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void {
        this.appendToAll(this.Type.warn, message, kwargs, optionalParams);
    }

    public error(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void {
        this.appendToAll(this.Type.error, message, kwargs, optionalParams);
    }

    private appendToAll(type: string, message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void {
        // Run each of the given loggers
        this.config.loggers?.forEach((logger) => {
            logger.append((this.config.messageComposer as MessageComposerIterface).compose(type, message, kwargs, optionalParams));
        });
        // Send log message if log dispatcher given
        if (this.config.logDispatcher) {
            this.config.logDispatcher.dispatch(type, message, kwargs, optionalParams);
        }
    }
}