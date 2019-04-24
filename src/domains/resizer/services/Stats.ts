import {StatsD} from "node-statsd";

export class Stats {

    private readonly client: StatsD;

    constructor (host: string | undefined = "", port: string | undefined = "")
    {
        this.client = new StatsD(host, parseInt(port));
    }

    private increment(stat: string) {
        console.log(`## ${stat}`);
        this.client.increment(stat, 1, (error: Error, buffer: Buffer) => {
            if (error) {
                console.log(error);
            }
        });
    }

    public incrementCacheHit()
    {
        this.increment("resolution.hit");
    }

    public incrementOriginalHit()
    {
        this.increment("resolution.original");
    }

    public incrementCacheMiss()
    {
        this.increment("resolution.miss");
    }

    public incrementNotFound()
    {
        this.increment("resolution.notFound");
    }

    public incrementError()
    {
        this.increment("resolution.error");
    }

}