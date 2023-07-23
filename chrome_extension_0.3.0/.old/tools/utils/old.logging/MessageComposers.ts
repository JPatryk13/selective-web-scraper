import { Payload } from "@tools/definitions/types/Payload"
import { MessageComposerIterface } from "@tools/utils/ts-modlog/Types";




export const DefaultMessageComposer: MessageComposerIterface = {
    compose(type: string, message?: any, kwargs?: { [key: string]: any }, ...optionalParams: any[]): string {
        return `${new Date().toISOString()} ${type} ${message} ${JSON.stringify(optionalParams)}\n`
    }
}

export const DetailedMessageComposer: MessageComposerIterface = {
    compose(type: string, message: Payload.Request.Log.Type, kwargs?: { [key: string]: any }, ...optionalParams: any[]): string {

        let composedRunner = '';

        if (message.runner) {
            const composedRunnerWorker = message.runner.worker ? ('/<worker: ' + message.runner.class + '>') : '';
            const composedRunnerClass = message.runner.class ? ('/<class: ' + message.runner.class + '>') : '';
            const composedRunnerFunction = message.runner.function ? '/<function: ' + message.runner.function + '>' : '';
            composedRunner = composedRunnerWorker + composedRunnerClass + composedRunnerFunction
        }

        return `${(new Date(message.timestamp)).toISOString()} ${type} ${composedRunner} ${message.logMessage} ${message.kwargs ? ' kwargs: ' + JSON.stringify(message.kwargs) : ''} ${optionalParams ? ' optionalParams: ' + JSON.stringify(optionalParams) : ''}\n`
    }
}