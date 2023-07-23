import { InternalMessageMap } from "@tools/definitions/types/InternalMessage";
import { Payload } from "@tools/definitions/types/Payload";
import { MID } from "@tools/definitions/types/InternalMessage";
import { Constructable } from "@tools/definitions/types/UtilTypes";
import { ExtendedLogger, LogDispatcherInterface, LogListenerInterface } from "@tools/utils/ts-modlog/Types";


// change to an independent class that just sends log messages
export const DeafultLogDispatcher: Constructable<LogDispatcherInterface> = class DeafultLogDispatcher implements LogDispatcherInterface {
    private readonly port: chrome.runtime.Port;
    public runner?: Payload.Request.Log.RunnerLog;
    public kwargs?: { [key: string]: any };
    public readonly requireMessageComposer = false;

    constructor(
        portName: string,
        runner?: Payload.Request.Log.RunnerLog,
        kwargs?: { [key: string]: any }
    ) {
        this.port = chrome.runtime.connect({ name: portName });
        this.runner = runner ? runner : {};
        this.kwargs = kwargs ? kwargs : {};
    }

    dispatch(
        type: string,
        message?: string,
        kwargs?: { [key: string]: any },
        optionalParams?: any[]
    ): void {

        let runner: Payload.Request.Log.RunnerLog = {};
        let _kwargs: { [key: string]: any } = this.kwargs ? this.kwargs : {};

        if (kwargs) {

            // append runner info
            if (kwargs.runner) {
                runner = { ...kwargs.runner, ...this.runner };
            }

            // collect other kwargs
            for (const key in kwargs) {
                if (runner[key as keyof Payload.Request.Log.RunnerLog] === undefined) {
                    _kwargs[key] = kwargs[key];
                }
            }
        }

        // append optional params as a list
        if (optionalParams) _kwargs["optionalParams"] = optionalParams

        // send logs
        this.port.postMessage(InternalMessageMap.constraint.getValid({
            mid: MID.Request.Log,
            payload: Payload.Request.Log.constraint.getValid({
                type: type,
                logMessage: message,
                runner: runner,
                timestamp: (new Date()).getTime(),
                kwargs: _kwargs
            }),
        }));
    }
}

export const DefaultLogListener: Constructable<LogListenerInterface> = class DefaultLogListener implements LogListenerInterface {
    private readonly logger: ExtendedLogger;
    private readonly portName: string;

    constructor(obj: ExtendedLogger, portName: string) {
        this.logger = obj;
        this.portName = portName;
    }

    listen(): void {
        chrome.runtime.onConnect.addListener((port) => {
            if (port.name === this.portName) {
                port.onMessage.addListener((message: InternalMessageMap.Type) => {
                    const payload: Payload.Request.Log.Type = message.payload as Payload.Request.Log.Type;
                    if (message.mid === MID.Request.Log) {
                        switch (payload.type) {
                            case (this.logger.Type.trace): {
                                this.logger.trace(payload);
                                break;
                            }
                            case (this.logger.Type.debug): {
                                this.logger.debug(payload)
                                break;
                            }
                            case (this.logger.Type.info): {
                                this.logger.info(payload)
                                break;
                            }
                            case (this.logger.Type.warn): {
                                this.logger.warn(payload)
                                break;
                            }
                            case (this.logger.Type.error): {
                                this.logger.error(payload)
                                break;
                            }
                        }
                    }
                });
            }
        });
    }
}