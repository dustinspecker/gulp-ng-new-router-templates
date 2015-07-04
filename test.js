/* global describe, it */
'use strict';
import assert from 'assert';
import {EOL} from 'os';
import gutil from 'gulp-util';
import ngNewRouterTemplates from './lib/';

describe('gulp-ng-new-router-templates', () => {
  describe('no file input', () => {
    it('should return no templates injected', (done) => {
      let stream = ngNewRouterTemplates()
        , expected;

      expected = [
        '(function () {' + EOL,
        '  angular' + EOL,
        '    .module(\'app\')' + EOL,
        '    .config([\'$componentLoaderProvider\', function ($componentLoaderProvider) {' + EOL,
        '    }]);' + EOL,
        '}());'
      ].join('');

      stream.on('data', (file) => {
        assert(file.contents.toString() === expected);
        done();
      });

      stream.write();

      stream.end();
    });
  });

  describe('one file input', () => {
    it('should have home template in templates.js for app module', (done) => {
      let stream = ngNewRouterTemplates()
        , expected;

      expected = [
        '(function () {' + EOL,
        '  angular' + EOL,
        '    .module(\'app\')' + EOL,
        '    .config([\'$componentLoaderProvider\', function ($componentLoaderProvider) {' + EOL,
        '      $componentLoaderProvider.setTemplateMapping(function (name) {' + EOL,
        '        return {' + EOL,
        '          \'home\': \'home/home.tpl.html\'' + EOL,
        '        }[name];' + EOL,
        '      });' + EOL,
        '    }]);' + EOL,
        '}());'
      ].join('');

      stream.on('data', (file) => {
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

  describe('multiple file inputs with options', () => {
    it('should have home and hello templates in component-templates.js for test module', (done) => {
      let expected, stream;

      stream = ngNewRouterTemplates({
        extension: '.html',
        fileName: 'component-templates.js',
        moduleName: 'test'
      });

      expected = [
        '(function () {' + EOL,
        '  angular' + EOL,
        '    .module(\'test\')' + EOL,
        '    .config([\'$componentLoaderProvider\', function ($componentLoaderProvider) {' + EOL,
        '      $componentLoaderProvider.setTemplateMapping(function (name) {' + EOL,
        '        return {' + EOL,
        '          \'hello\': \'home/hello/hello.html\',' + EOL,
        '          \'home\': \'home/home.html\'' + EOL,
        '        }[name];' + EOL,
        '      });' + EOL,
        '    }]);' + EOL,
        '}());'
      ].join('');

      stream.on('data', (file) => {
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
