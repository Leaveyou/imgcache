import {IResizeStrategy} from "../IResizeStrategy";

export class Stretch implements IResizeStrategy {
    getResizeFlags(): string {
        return "!";
    }
}