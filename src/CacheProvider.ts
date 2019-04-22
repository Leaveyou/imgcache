
export interface CacheProvider {

    get(name: string): Promise <Buffer>;

    set(name: never, data: Buffer, ttl: number): void;
}