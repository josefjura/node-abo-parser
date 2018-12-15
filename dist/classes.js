"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RecordParser = exports.GroupHeaderParser = exports.FileHeaderParser = exports.ABOHeaderParser = exports.Parser = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Parser =
/*#__PURE__*/
function () {
  function Parser() {
    _classCallCheck(this, Parser);

    _defineProperty(this, "rawData", []);

    _defineProperty(this, "position", 0);
  }

  _createClass(Parser, [{
    key: "start",
    value: function start(line) {
      this.value = line;
      this.position = 0;
    }
  }, {
    key: "readByLength",
    value: function readByLength(length) {
      if (!this.value || this.value === '') throw new Error("EMPTY");
      if (length < 1) throw new Error("BAD_LENGTH");
      if (this.value.length + this.position < length) throw new Error("TOO_LONG"); //console.log(`Reading from: ${value}, position: ${this.position}, length: ${length}`);

      this.rawData.push(this.value.substr(this.position, length));
      this.position += length;
    }
  }, {
    key: "skip",
    value: function skip(length) {
      this.position += length;
    }
  }, {
    key: "readByDelimiter",
    value: function readByDelimiter(delimiter) {
      if (!this.value || this.value === '') throw new Error("EMPTY");
      if (!delimiter) throw new Error("BAD_DELIMITER");
      var delIndex = this.value.indexOf(delimiter, this.position);

      if (delIndex == -1) {
        var partial = this.value.substr(this.position);
        this.rawData.push(partial); //console.log(`Reading to end: ${value}, position: ${this.position}, delIndex: ${delIndex}, partial: "${partial}"`);

        this.position = this.value.length;
      } else {
        delIndex += delimiter.length;
        var partial = this.value.substr(this.position, delIndex - this.position - 1); //console.log(`Reading from: ${value}, position: ${this.position}, delIndex: ${delIndex}, partial: "${partial}"`);

        this.rawData.push(partial);
        this.position = delIndex;
      }
    }
  }, {
    key: "readToEnd",
    value: function readToEnd() {
      if (!this.value || this.value === '') throw new Error("EMPTY"); //console.log(`Reading to end: ${value}, position: ${this.position}`);

      this.rawData.push(this.value.substr(this.position));
      this.position = this.value.length;
    }
  }]);

  return Parser;
}();

exports.Parser = Parser;

var ABOHeaderParser =
/*#__PURE__*/
function (_Parser) {
  _inherits(ABOHeaderParser, _Parser);

  function ABOHeaderParser() {
    var _getPrototypeOf2;

    var _this;

    _classCallCheck(this, ABOHeaderParser);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ABOHeaderParser)).call.apply(_getPrototypeOf2, [this].concat(args)));

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "length", 58);

    _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "elements", [4, 6, 20, 10, 3, 3, 6, 6]);

    return _this;
  }

  _createClass(ABOHeaderParser, [{
    key: "parse",
    value: function parse(line) {
      if (!line) throw Error("EMPTY HEADER");
      if (line.length != this.length) throw Error("BAD HEADER LENGTH");
      this.start(line);
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var el = _step.value;
          this.readByLength(el);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "datum",
    get: function get() {
      return this.rawData[1];
    }
  }, {
    key: "nazev_prikazce",
    get: function get() {
      return this.rawData[2];
    }
  }, {
    key: "cislo_klienta",
    get: function get() {
      return this.rawData[3];
    }
  }], [{
    key: "equals",
    value: function equals(row) {
      return row.startsWith("UHL1");
    }
  }]);

  return ABOHeaderParser;
}(Parser);

exports.ABOHeaderParser = ABOHeaderParser;

var FileHeaderParser =
/*#__PURE__*/
function (_Parser2) {
  _inherits(FileHeaderParser, _Parser2);

  function FileHeaderParser() {
    _classCallCheck(this, FileHeaderParser);

    return _possibleConstructorReturn(this, _getPrototypeOf(FileHeaderParser).apply(this, arguments));
  }

  _createClass(FileHeaderParser, [{
    key: "parse",
    value: function parse(line) {
      if (!line) throw Error("EMPTY HEADER");
      this.start(line);
      this.readByDelimiter(' ');
      this.readByDelimiter(' ');
      this.readByLength(3);
      this.readByLength(3);
      this.skip(1);
      this.readToEnd();
    }
  }, {
    key: "druh",
    get: function get() {
      return this.rawData[1];
    }
  }, {
    key: "poradove_cislo",
    get: function get() {
      return this.rawData[2];
    }
  }, {
    key: "pobocka_banky",
    get: function get() {
      return this.rawData[3];
    }
  }, {
    key: "kod_banky_prikazce",
    get: function get() {
      return this.rawData[4];
    }
  }], [{
    key: "equals",
    value: function equals(line) {
      return line.startsWith("1");
    }
  }]);

  return FileHeaderParser;
}(Parser);

exports.FileHeaderParser = FileHeaderParser;

var GroupHeaderParser =
/*#__PURE__*/
function (_Parser3) {
  _inherits(GroupHeaderParser, _Parser3);

  function GroupHeaderParser() {
    _classCallCheck(this, GroupHeaderParser);

    return _possibleConstructorReturn(this, _getPrototypeOf(GroupHeaderParser).apply(this, arguments));
  }

  _createClass(GroupHeaderParser, [{
    key: "parse",
    value: function parse(line) {
      if (!line) throw Error("EMPTY HEADER");
      this.start(line);
      this.readByDelimiter(' ');
      this.readByDelimiter(' ');
      this.readByDelimiter(' ');
      this.readToEnd();
    }
  }, {
    key: "prikazce",
    get: function get() {
      return this.rawData[1];
    }
  }, {
    key: "suma",
    get: function get() {
      return this.rawData[2];
    }
  }, {
    key: "splatnost",
    get: function get() {
      return this.rawData[3];
    }
  }], [{
    key: "equals",
    value: function equals(line) {
      return line.startsWith("2");
    }
  }]);

  return GroupHeaderParser;
}(Parser);

exports.GroupHeaderParser = GroupHeaderParser;

var RecordParser =
/*#__PURE__*/
function (_Parser4) {
  _inherits(RecordParser, _Parser4);

  function RecordParser() {
    _classCallCheck(this, RecordParser);

    return _possibleConstructorReturn(this, _getPrototypeOf(RecordParser).apply(this, arguments));
  }

  _createClass(RecordParser, [{
    key: "parse",
    value: function parse(line) {
      if (!line) throw Error("EMPTY HEADER");
      this.start(line);
      this.readByDelimiter(' ');
      this.readByDelimiter(' ');
      this.readByDelimiter(' ');
      this.readByLength(4);
      this.readByLength(4);
    }
  }, {
    key: "protistrana",
    // protistrana castka vsym bank ksym
    get: function get() {
      return this.rawData[0];
    }
  }, {
    key: "castka",
    get: function get() {
      return this.rawData[1];
    }
  }, {
    key: "vsym",
    get: function get() {
      return this.rawData[2];
    }
  }, {
    key: "kod_banky",
    get: function get() {
      return this.rawData[3];
    }
  }, {
    key: "ksym",
    get: function get() {
      return this.rawData[4];
    }
  }], [{
    key: "equals",
    value: function equals(line) {
      return false;
    }
  }]);

  return RecordParser;
}(Parser);

exports.RecordParser = RecordParser;