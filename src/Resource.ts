import {IFormatHandler} from "./IFormatHandler";

export class Resource {

    private resourceId: string;
    private filePath: string;
    private handler: IFormatHandler;

    public  constructor(resourceId: string, filePath: string, handler: IFormatHandler) {
        this.resourceId = resourceId;
        this.filePath = filePath;
        this.handler = handler;
    }
}