'use strict';
import _ from 'lodash';
import {EOL} from 'os';
import gutil from 'gulp-util';
import path from 'path';
import pkg from '../package.json';
import through from 'through2';

module.exports = function (options) {
  let files = []
    , content = ''
    , defaults, footer, header;

  defaults = {
    extension: '.tpl.html',
    fileName: 'templates.js',
    moduleName: 'app'
  };

  options = _.merge(defaults, options);

  header = [
    `(function () {${EOL}`,
    `  angular${EOL}`,
    `    .module('<%= moduleName %>')${EOL}`,
    `    .config(['$componentLoaderProvider', function ($componentLoaderProvider) {${EOL}`
  ].join('');

  footer = [
    `    }]);${EOL}`,
    '}());'
  ].join('');

  return through.obj((file, encoding, next) => {
    if (!file || file.isNull()) {
      return next();
    }

    if (file.isStream()) {
      return this.emit('error', new gutil.PluginError(pkg.name, 'Streaming not supported'));
    }

    files.push(file);

    next();
  }, function (callback) {
    let templates;

    if (files.length > 0) {
      content = files.map((file) => {
        let component;
        // 'component-name':
        component = `          '${path.basename(file.path).replace(options.extension, '')}': `;
        // 'component-name': 'relative/path/to/component-name.html'
        component += `'${path.relative(file.base, file.path).replace(/\\/g, '/')}'`;
        return component;
      }).join(',' + EOL);
      // $componentLoaderProvider.setTemplateMapping(function (name) {
      //   return {
      //     'component-name': 'relative/path/to/component-name.html'
      //   }[name];
      // });
      content = [
        `      $componentLoaderProvider.setTemplateMapping(function (name) {${EOL}`,
        `        return {${EOL}`
      ].join('') + content + EOL;
      content += [`        }[name];${EOL}`,
                 `      });${EOL}`].join('');
    }

    templates = _.template(header + content + footer)(options);
    this.push(new gutil.File({
      base: '',
      path: options.fileName,
      contents: new Buffer(templates)
    }));
    callback();
  });
};
