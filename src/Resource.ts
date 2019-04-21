import {IFormatHandler} from "./IFormatHandler";

export class Resource {
    public readonly resourceId: string;
    public readonly filePath: string;
    public readonly handler: IFormatHandler;

    public  constructor(resourceId: string, filePath: string, handler: IFormatHandler) {
        this.resourceId = resourceId;
        this.filePath = filePath;
        this.handler = handler;
    }
}