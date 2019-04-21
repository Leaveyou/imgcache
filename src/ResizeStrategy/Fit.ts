import {IResizeStrategy} from "../IResizeStrategy";

export class Fit implements IResizeStrategy {
    getResizeFlags(): string {
        return "";
    }
}