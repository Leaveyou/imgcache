import {IFormatHandler} from "./IFormatHandler";

export class HandlerCollection
{
    protected formatHandlers: IFormatHandler[] = [];

    public getHandlerForFile(fullPath: string): IFormatHandler {
        const extension = fullPath.split('.').pop();
        if (this.formatHandlers[extension]) {
            return this.formatHandlers[extension];
        }
        throw new Error("Handler for extension " + extension + " not found");
    }

    public registerFileFormatHandler(handler: IFormatHandler, extension: string): void {
        this.formatHandlers[extension] = handler;
    }
}