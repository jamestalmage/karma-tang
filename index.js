var ngInject = require('ng-test-utils');
var path     = require('path');
var convert  = require('convert-source-map');

var createNgInjectPreprocessor = function(args, config, logger, helper) {
  config = config || {};

  var log = logger.create('preprocessor.ng-test-utils');

  var defaultOptions = {
    sourceMap: false
  };
  var options = helper.merge(defaultOptions, args || {}, config || {});


  return function(content, file, done) {
    var result = null;
    var map;

    log.debug('Processing "%s".', file.originalPath);
    file.path = file.originalPath;

    var opts = {};

    if(options.sourceMap){
      opts.sourceFileName = file.originalPath; // TODO: Should this just be file.path?
      var previousMap = convert.fromSource(content);
      if(previousMap){
        opts.inputSourceMap = previousMap.toObject();
      }
    }

    try {
      result = ngInject(content, opts);
    } catch (e) {
      log.error('%s\n  at %s:%d', e.message, file.originalPath, e.location && e.location.first_line);
      return done(e, null);
    }

    if (result.map) {
      file.sourceMap = result.map;
      map = convert.fromObject(result.map);
      done(null, result.code + '\n' + map.toComment() + '\n');
    } else {
      done(null, result.code)
    }
  };
};

createNgInjectPreprocessor.$inject = ['args', 'config.ngInjectPreprocessor', 'logger', 'helper'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:ng-inject': ['factory', createNgInjectPreprocessor]
};