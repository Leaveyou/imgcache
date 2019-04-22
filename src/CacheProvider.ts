import {Size} from "./Size";

export interface CacheProvider {
    get(name: string, size: Size, notOlderThan: Date): Promise<Buffer>;
    set(name: string, size: Size, image: Buffer, ttl?: number): void;
}