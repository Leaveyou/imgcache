import m from "gm";
import {IResizeStrategy} from "./IResizeStrategy";
import {ISize} from "./ISize";

export class Resource
{
    public readonly resourceId: string;
    public readonly filePath: string;
    private image: m.State;

    public constructor(resourceId: string, filePath: string, image: m.State)
    {
        this.resourceId = resourceId;
        this.filePath = filePath;
        this.image = image;
    }



    public async getResizedImageContents(requestedSize: ISize, resizeStrategy: IResizeStrategy)
    {
        const originalSize = await this.promiseGetSize();
        const predictedSize = resizeStrategy.getPredictedSize(originalSize, requestedSize);

        // todo: cache read

        this.image.resize(predictedSize.width, predictedSize.height, "!");

        return await this.promiseGetBuffer();

        // const cacheFile = config.CACHE_PATH + fileUri;
        // const baseName = path.dirname(cacheFile);
        //
        // fs.mkdir(`${cacheFile}/width_x.jpg`, {recursive: true}, (error) => {
        //     if (error) {return console.log(error);}
        //     this.image.write(cacheFile, function (err) {
        //         if (!err) console.log('done');
        //         else console.log(err);
        //     });
        // });


    }

    public promiseGetSize(): Promise <ISize> {
        return new Promise((resolve, reject) => {
            this.image.size((error, size) => {
                if (error) {
                    return reject(error);
                }
                return resolve(size);
            });
        });
    }

    private promiseGetBuffer(): Promise <Buffer> {
        return new Promise((resolve, reject) => {
            this.image.toBuffer( (error, buffer) => {
                if (error) return reject(error);
                return resolve(buffer);
            });
        });
    }

    public getImageFormat(): Promise <string> {
        return new Promise((resolve, reject) => {
            this.image.format( (error, format) => {
                if (error) reject(error);
                return resolve(format);
            });
        });
    }
}
