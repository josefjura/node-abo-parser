import { readFile } from 'fs'
import { ABOHeaderParser } from './classes'

function parseFile(uri) {
    readFile(uri, { encoding: "utf8" }, (err, data) => {
        if (!err) {
            return parse(data);
        }
    })
}

function parse(text) {
    console.log(text);
    var test = new ABOHeaderParser();
}

parseFile("./examples/example1.KPC");