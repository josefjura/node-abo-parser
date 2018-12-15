"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseFile = parseFile;
exports.parse = parse;

var _fs = require("fs");

var _classes = require("./classes");

function parseFile(uri) {
  return new Promise(function (resolve, reject) {
    (0, _fs.readFile)(uri, {
      encoding: "utf8"
    }, function (err, data) {
      if (err) reject(err);else resolve(parse(data));
    });
  });
}

function parse(text) {
  var result = [];
  var ahp = new _classes.ABOHeaderParser();
  var ghp = new _classes.GroupHeaderParser();
  var fhp = new _classes.FileHeaderParser();
  var rp = new _classes.RecordParser();
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

parseFile("./examples/example1.KPC").then(function (data) {
  console.log(data);
});