/* global describe, it */
'use strict';
var assert = require('assert')
  , eol = require('os').EOL
  , gutil = require('gulp-util')
  , ngNewRouterTemplates = require('./');

describe('gulp-ng-new-router-templates', function () {
  describe('no file input', function () {
    it('should return no templates injected', function (done) {
      var stream = ngNewRouterTemplates()
        , expected;

      expected = ['(function () {' + eol,
                  '  angular' + eol,
                  '    .module(\'app\')' + eol,
                  '    .config([\'$componentLoaderProvider\', function ($componentLoaderProvider) {' + eol,
                  '    }]);' + eol,
                  '}());'].join('');

      stream.on('data', function (file) {
        assert(file.contents.toString() === expected);
        done();
      });

      stream.write();

      stream.end();
    });
  });

  describe('one file input', function () {
    it('should have home template in templates.js for app module', function (done) {
      var stream = ngNewRouterTemplates()
        , expected;

      expected = ['(function () {' + eol,
                  '  angular' + eol,
                  '    .module(\'app\')' + eol,
                  '    .config([\'$componentLoaderProvider\', function ($componentLoaderProvider) {' + eol,
                  '      $componentLoaderProvider.setTemplateMapping(function (name) {' + eol,
                  '        return {' + eol,
                  '          \'home\': \'home/home.tpl.html\'' + eol,
                  '        }[name];' + eol,
                  '      });' + eol,
                  '    }]);' + eol,
                  '}());'].join('');

      stream.on('data', function (file) {
        assert(file.contents.toString() === expected);
        assert(file.path === 'templates.js');
        done();
      });

      stream.write(new gutil.File({
        base: './',
        path: './home/home.tpl.html',
        contents: new Buffer('<h1>home</h1>')
      }));

      stream.end();
    });
  });

  describe('multiple file inputs with options', function () {
    it('should have home and hello templates in component-templates.js for test module', function (done) {
      var expected, stream;

      stream = ngNewRouterTemplates({
        extension: '.html',
        fileName: 'component-templates.js',
        moduleName: 'test'
      });

      expected = ['(function () {' + eol,
                  '  angular' + eol,
                  '    .module(\'test\')' + eol,
                  '    .config([\'$componentLoaderProvider\', function ($componentLoaderProvider) {' + eol,
                  '      $componentLoaderProvider.setTemplateMapping(function (name) {' + eol,
                  '        return {' + eol,
                  '          \'hello\': \'home/hello/hello.html\',' + eol,
                  '          \'home\': \'home/home.html\'' + eol,
                  '        }[name];' + eol,
                  '      });' + eol,
                  '    }]);' + eol,
                  '}());'].join('');

      stream.on('data', function (file) {
        assert(file.contents.toString() === expected);
        assert(file.path === 'component-templates.js');
        done();
      });

      stream.write(new gutil.File({
        base: './',
        path: './home/hello/hello.html',
        contents: new Buffer('<h1>hello</h1>')
      }));

      stream.write(new gutil.File({
        base: './',
        path: './home/home.html',
        contents: new Buffer('<h1>home</h1>')
      }));

      stream.end();
    });
  });
});
