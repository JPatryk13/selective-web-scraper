import { Constructable } from "@tools/definitions/types/UtilTypes";
// import * as fs from "fs";
import { LoggerPluginInterface } from "@tools/utils/ts-modlog/Types";


export const ConsoleLogger: Constructable<LoggerPluginInterface> = class ConsoleLogger implements LoggerPluginInterface {
    public readonly requireMessageComposer = true;

    append(composedMessage: string): void {
        console.log(composedMessage)
    }
}


// export const FileLogger: Constructable<LoggerPluginInterface> = class FileLogger implements LoggerPluginInterface {
//     private readonly fd: number;
//     public readonly requireMessageComposer = true;

//     constructor(filename: string) {
//         this.fd = fs.openSync(filename, "a");
//     }

//     append(composedMessage: string) {
//         fs.writeSync(this.fd, composedMessage);
//     }
// }