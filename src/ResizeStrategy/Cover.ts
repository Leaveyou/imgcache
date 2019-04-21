import {IResizeStrategy} from "../IResizeStrategy";

export class Cover implements IResizeStrategy
{
    getResizeFlags(): string {
        return "^";
    }
}