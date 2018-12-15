"use strict";

var _fs = require("fs");

var _classes = require("./classes");

function parseFile(uri) {
  (0, _fs.readFile)(uri, {
    encoding: "utf8"
  }, function (err, data) {
    if (!err) {
      return parse(data);
    }
  });
}

function parse(text) {
  console.log(text);
  var test = new _classes.ABOHeaderParser();
}

parseFile("./examples/example1.KPC");