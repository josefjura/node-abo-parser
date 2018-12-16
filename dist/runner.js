"use strict";

var _index = require("./index");

(0, _index.parseFile)(process.argv[2]).then(function (data) {
  console.log(data);
});