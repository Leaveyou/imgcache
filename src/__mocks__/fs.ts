

const fs: any = jest.genMockFromModule('fs');


let statSeed: any;
let readFileSeed: any = "";

function seedStat(value: any) {
    statSeed = value;
}
function seedReadFile(value: any) {
    readFileSeed = value;
}

function my_stat(directoryPath: any) {
    return statSeed;
}
function my_readFile(directoryPath: any) {
    return readFileSeed;
}

function my_unlink(directoryPath: any) {
}

fs.promises = {};

fs.seedStat = seedStat;
fs.promises.stat = my_stat;

fs.seedReadFile = seedReadFile;
fs.promises.readFile = my_readFile;
fs.promises.unlink = my_unlink;

export default fs;