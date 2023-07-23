export type LoggerConfig = {
    [key: string]: any
} & {
    name?: string,
    loggers?: LoggerPluginInterface[],
    messageComposer?: MessageComposerIterface,
    logDispatcher?: LogDispatcherInterface,
}

export interface ExtendedLogger {
    Type: {
        trace: string;
        debug: string;
        info: string;
        warn: string;
        error: string;
    };
    config: LoggerConfig;
    trace(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void;
    debug(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void;
    info(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void;
    warn(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void;
    error(message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): void;
}

/**
 * Automatically used when added to the ModLog. Creates connection via port.
 */
export interface LogDispatcherInterface {
    dispatch(type: string, message?: string, kwargs?: { [key: string]: any }, optionalParams?: any[]): void;
}

/**
 * Listens for incoming log messages.
 */
export interface LogListenerInterface {
    listen(): void;
}

/**
 * Automatically used when added to the ModLog. Creates a string that will represent the message
 */
export interface MessageComposerIterface {
    compose(type: string, message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): string
}

/**
 * Automatically used when added to ModLog. Works as a tool to output the log message to various resource types.
 */
export interface LoggerPluginInterface {
    append(composedMessage: any, ...args: any[]): void;
}