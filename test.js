/* global describe, it */
'use strict';
var assert = require('assert')
  , gutil = require('gulp-util')
  , ngNewRouterTemplates = require('./');

describe('gulp-ng-new-router-templates', function () {
  describe('no file input', function () {
    it('should return no templates injected', function (done) {
      var stream = ngNewRouterTemplates()
        , expected;

      expected = ['(function () {',
                  'angular.module(\'app\').config(function ($componentLoaderProvider) {',
                  '})();'].join('');

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

      expected = ['(function () {',
                  'angular.module(\'app\').config(function ($componentLoaderProvider) {',
                  '$componentLoaderProvider.setTemplateMapping(function (name) {',
                  'return {',
                  '\'home\': \'home/home.tpl.html\'',
                  '}[name];',
                  '});',
                  '});',
                  '})();'].join('');

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

      expected = ['(function () {',
                  'angular.module(\'test\').config(function ($componentLoaderProvider) {',
                  '$componentLoaderProvider.setTemplateMapping(function (name) {',
                  'return {',
                  '\'hello\': \'home/hello/hello.html\',',
                  '\'home\': \'home/home.html\'',
                  '}[name];',
                  '});',
                  '});',
                  '})();'].join('');

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
