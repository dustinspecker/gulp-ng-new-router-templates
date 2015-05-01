'use strict';
var _ = require('lodash')
  , gutil = require ('gulp-util')
  , path = require('path')
  , pkg = require('./package.json')
  , through = require('through2');

module.exports = function (options) {
  var files = []
    , content = ''
    , footer = '});}());'
    , defaults, header;

  defaults = {
    extension: '.tpl.html',
    fileName: 'templates.js',
    moduleName: 'app'
  };

  options = _.merge(defaults, options);

  header = ['(function () {',
            'angular.module(\'<%= moduleName %>\').config(function ($componentLoaderProvider) {'].join('');

  return through.obj(function (file, encoding, next) {
    if (!file || file.isNull()) {
      return next();
    }

    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError(pkg.name, 'Streaming not supported'));
    }

    files.push(file);

    next();
  }, function (callback) {
    var templates;

    if (files.length > 0) {
      content = files.map(function (file) {
        var component;
        // `'component-name': `
        component = '\'' + path.basename(file.path).replace(options.extension, '') + '\': ';
        // `'component-name': 'relative/path/to/component-name.html'
        component += '\'' + path.relative(file.base, file.path).replace(/\\/g, '/') + '\'';
        return component;
      }).join(',');
      // $componentLoaderProvider.setTemplateMapping(function (name) {
      //   return {
      //     'component-name': 'relative/path/to/component-name.html'
      //   }[name];
      content = [
                  '$componentLoaderProvider.setTemplateMapping(function (name) {',
                  'return {'
                ].join('') + content + '}[name];});';
    }

    templates = _.template(header + content + footer)(options);
    this.push(new gutil.File({base: '', path: options.fileName, contents: new Buffer(templates)}));
    callback();
  });
};
