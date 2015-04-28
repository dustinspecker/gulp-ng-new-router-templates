# gulp-ng-new-router-templates
[![NPM version](https://badge.fury.io/js/gulp-ng-new-router-templates.svg)](http://badge.fury.io/js/gulp-ng-new-router-templates) [![Build Status](https://travis-ci.org/dustinspecker/gulp-ng-new-router-templates.svg)](https://travis-ci.org/dustinspecker/gulp-ng-new-router-templates) [![Coverage Status](https://img.shields.io/coveralls/dustinspecker/gulp-ng-new-router-templates.svg)](https://coveralls.io/r/dustinspecker/gulp-ng-new-router-templates?branch=master)

[![Code Climate](https://codeclimate.com/github/dustinspecker/gulp-ng-new-router-templates/badges/gpa.svg)](https://codeclimate.com/github/dustinspecker/gulp-ng-new-router-templates) [![Dependencies](https://david-dm.org/dustinspecker/gulp-ng-new-router-templates.svg)](https://david-dm.org/dustinspecker/gulp-ng-new-router-templates/#info=dependencies&view=table) [![DevDependencies](https://david-dm.org/dustinspecker/gulp-ng-new-router-templates/dev-status.svg)](https://david-dm.org/dustinspecker/gulp-ng-new-router-templates/#info=devDependencies&view=table) [![PeerDependencies](https://david-dm.org/dustinspecker/gulp-ng-new-router-templates/peer-status.svg)](https://david-dm.org/dustinspecker/gulp-ng-new-router-templates/#info=peerDependencies&view=table)


> Gulp plugin for injecting template paths into $componentLoaderProvider

## Install
`npm install --save-dev gulp-ng-new-router-templates`

## Purpose
`ngNewRouter` assumes all templates are in a `components` folder. Unfortunately, many of us are using modular structures and are then required to define the template paths ourselves. `gulp-ng-new-router-templates` does that for you.

## Usage

```javascript
var gulp = require('gulp')
  , ngNewRouterTemplates = require('gulp-ng-new-router-templates');

/* file structure
 app/
  - home/
    - hello/
      - hello.tpl.html
    - home.tpl.html
  - app.js
*/
gulp.task('injectTemplatePaths', function () {
  return gulp.src(['app/**/*.tpl.html'], {base: 'app'})
    .pipe(ngNewRouterTemplates({
      extension: '.tpl.html',
      fileName: 'component-templates.js',
      moduleName: 'awesomeApp'
    }))
    .pipe(gulp.dest('./app'));
});
/* file structure
 app/
  - home/
    - hello/
      - hello.tpl.html
    - home.tpl.html
  - app.js
  - component-templates.js
*/
```

`app/component-templates.js` contents will be
```js
(function () {
  angular.module('awesomeApp').config(function ($componentLoaderProvider) {
    $componentLoaderProvider.setTemplateMapping(function (name) {
      return {
        'hello': 'home/hello/hello.tpl.html',
        'home': 'home/home.tpl.html'
      }[name];
    });
  });
})();
```

## Options
### extension
File extension to remove from component name. An extension option of `.tpl.html` would create `home` from `home.tpl.html`.

### fileName
Name of file created with component template mapping.

### moduleName
Module to use for $componentLoaderProvider. Commonly, it's the top-level module.

## Projects using gulp-ng-new-router-templates
- [angular-new-router-example](https://github.com/dustinspecker/gulp-ng-new-router-templates)

## License
MIT