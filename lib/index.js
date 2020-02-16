'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _compareme = _interopRequireDefault(require("compareme"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var INVALID = 'INVALID';
var WRONG_TYPE = 'WRONG_TYPE';
var DEFAULT_SETTINGS = {
  logErrors: true,
  logName: 'setupme'
};

var getInvalidOptions = function getInvalidOptions() {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _compareme["default"].get(defaultOptions).unexpected.elements.strictly.and.deeply["with"](options).map(function (diff) {
    return {
      error: INVALID,
      key: diff.index
    };
  });
};

var getWrongTypeOptions = function getWrongTypeOptions() {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return _compareme["default"].get(defaultOptions).type.differences.strictly.and.deeply["with"](options).map(function (diff) {
    return {
      error: WRONG_TYPE,
      key: diff.index,
      expected: diff.first,
      actual: diff.second
    };
  });
};

var getErrors = function getErrors() {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return [].concat(_toConsumableArray(getWrongTypeOptions(defaultOptions, options)), _toConsumableArray(getInvalidOptions(defaultOptions, options)));
};

var getResultData = function getResultData() {
  var errors = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return {
    success: errors.length === 0,
    errors: errors
  };
};

var doLogErrors = function doLogErrors(defaultOptions, options, logName) {
  getWrongTypeOptions(defaultOptions, options).forEach(function (diff) {
    console.error("[".concat(logName, "] The option \"").concat(diff.key, "\" is expected to be ") + "\"".concat(diff.expected, "\" but received as \"").concat(diff.actual, "\"."));
  });
  getInvalidOptions(defaultOptions, options).forEach(function (diff) {
    console.error("[".concat(logName, "] The option \"").concat(diff.key, "\" is not valid."));
  });
};

var getSettings = function getSettings() {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return Object.assign({}, defaultOptions, options);
};

var logErrorsIfRequested = function logErrorsIfRequested() {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _ref = arguments.length > 2 ? arguments[2] : undefined,
      _ref$logErrors = _ref.logErrors,
      logErrors = _ref$logErrors === void 0 ? DEFAULT_SETTINGS.logErrors : _ref$logErrors,
      _ref$logName = _ref.logName,
      logName = _ref$logName === void 0 ? DEFAULT_SETTINGS.logName : _ref$logName;

  return logErrors ? doLogErrors(defaultOptions, options, logName) : false;
};

var printErrorsOfSetupMeSettings = function printErrorsOfSetupMeSettings(settings) {
  return doLogErrors(DEFAULT_SETTINGS, settings, DEFAULT_SETTINGS.logName);
};

var validate = function validate() {
  var defaultOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  printErrorsOfSetupMeSettings(settings);
  logErrorsIfRequested(defaultOptions, options, getSettings(settings));
  return getResultData(getErrors(defaultOptions, options));
};

var _default = {
  validate: validate
};
exports["default"] = _default;