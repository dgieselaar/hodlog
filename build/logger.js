'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _stdIOStream = require('./stdIOStream');

var _stdIOStream2 = _interopRequireDefault(_stdIOStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function FrontEndLogger() {
  this.isFrontEnd = true;
  this.info = console.log.bind(console);
  this.error = console.error.bind(console);
  this.warning = console.warn.bind(console);
  this.trace = console.trace.bind(console);
}

exports.default = function () {
  if (typeof window !== 'undefined') {
    return new FrontEndLogger();
  }
  var runningScript = require.main.filename.split('/').pop();
  var logDirPath = process.cwd() + '/log';
  var logFilePath = logDirPath + '/' + runningScript + '.log';
  var streams = [];
  try {
    var logDirStats = _fs2.default.statSync(logDirPath);
    if (logDirStats.isDirectory()) {
      // create file if not exists
      var fd = _fs2.default.openSync(logFilePath, 'a');
      _fs2.default.closeSync(fd);

      streams.push({
        level: 'info',
        path: logFilePath
      });
    }
  } catch (e) {
    console.log(e);
  }

  streams.push({
    level: 'info',
    stream: _stdIOStream2.default
  });

  return _bunyan2.default.createLogger({
    name: runningScript,
    streams: streams
  });
}();