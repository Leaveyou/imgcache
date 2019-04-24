
import {DiskStorage} from "../domains/resizer/services/cacheGateways/DiskStorage";

jest.mock("fs");

import fs from "fs";

const mockedFs: any = fs;

describe('Cache implementation', () => {

    const cacheFileData = "cacheFile data";
    const newerDate = new Date(2019, 2);
    const olderDate = new Date(2019, 1);
    const whateverSize = {width: 100, height: 100};

    test("newer cache is returned", async () => {

        await mockedFs.seedStat({mtime: newerDate});
        await mockedFs.seedReadFile(cacheFileData);
        const diskStorage = new DiskStorage("cache_path_mock");

        const result = await diskStorage.get("cache_file_mock", whateverSize, olderDate);
        expect(result).toBe(cacheFileData);
    });

    test("old cache is deleted and Error is thrown", async () => {
        await mockedFs.seedStat({mtime: olderDate});
        await mockedFs.seedReadFile(cacheFileData);
        const diskStorage = new DiskStorage("cache_path_mock");

        let err = false;
        try {
            const result = await diskStorage.get("cache_file_mock", whateverSize, newerDate);
        } catch (error) {
            err = true;
        }
        expect(err).toBe(true);
    });
});