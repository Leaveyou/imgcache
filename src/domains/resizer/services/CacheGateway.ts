import {Size} from "../models/Size";

export interface CacheGateway {
    get(name: string, size: Size, notOlderThan: Date): Promise<Buffer>;
    set(name: string, size: Size, image: Buffer, ttl?: number): void;
}