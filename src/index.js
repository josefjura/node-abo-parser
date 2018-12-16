import { readFile } from 'fs'
import { ABOHeaderParser, GroupHeaderParser, FileHeaderParser, RecordParser } from './classes'

export function parseFile(uri) {
    return new Promise((resolve, reject) => {
        readFile(uri, { encoding: "utf8" }, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(parse(data));

        })
    })
}

export function parse(text) {
var result = [];

    var ahp = new ABOHeaderParser();
    var ghp = new GroupHeaderParser();
    var fhp = new FileHeaderParser();
    var rp = new RecordParser();
    var rows = text.split('\r\n');
    ahp.parse(rows[0]);
    result.push(ahp.rawData);
    ghp.parse(rows[1]);
    result.push(ghp.rawData);
    fhp.parse(rows[2]);
    result.push(fhp.rawData);
    rp.parse(rows[3]);
    result.push(rp.rawData);

    return result;
}