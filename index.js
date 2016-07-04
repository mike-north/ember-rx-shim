/* jshint node: true */

'use strict';

var stew = require('broccoli-stew');
var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var Filter = require('broccoli-filter');

/**
  A broccoli filter to get around what appears to be a
  babel bug. The following is not parsed properly

  let Scheduler = {
      asap,
      async,
      queue,
      animationFrame
  };

  So we transform it to the non-enhanced object literal form

  let Scheduler = {
      asap: asap,
      async: async,
      queue: queue,
      animationFrame: animationFrame
  };
*/
RxHack.prototype = Object.create(Filter.prototype);
RxHack.prototype.constructor = RxHack;
function RxHack(inputNode) {
  Filter.call(this, inputNode);
}

RxHack.prototype.extensions = ['js'];
RxHack.prototype.targetExtension = 'js';

RxHack.prototype.processString = function(content, relativePath) {
  return content.replace("let Scheduler = {\n    asap,\n    async,\n    queue,\n    animationFrame\n};",
      "let Scheduler = {\n    asap: asap,\n    async: async,\n    queue: queue,\n    animationFrame: animationFrame\n};");
};

/**
  A simple broccoli filter to transform a commonjs module into
  a require.js module with a single default export. This also
  takes care of a small module-remapping task.
 */
RequireWrapper.prototype = Object.create(Filter.prototype);
RequireWrapper.prototype.constructor = RequireWrapper;
function RequireWrapper(inputNode) {
  Filter.call(this, inputNode);
}

RequireWrapper.prototype.extensions = ['js'];
RequireWrapper.prototype.targetExtension = 'js';

RequireWrapper.prototype.processString = function(content, relativePath) {
  console.log('relativePath', relativePath);
  var moduleName = relativePath.split('.')[0];
  if (content.indexOf('module.exports') >= 0) {
    return 'define(\'' + moduleName + '\', [], function() {\n\n' +
      '\nvar module = {exports: undefined};\n' +
      '\nvar global = window;' +
      '\n\n' + content.replace('\./ponyfill' ,'symbol-observable/ponyfill') + '\n' +
      '\nreturn module.exports;' + 
      '\n\n});';    
  }
  else {
    return content;
  }

};

module.exports = {
  name: 'rxjs',
  included: function(app) {
    app.import('vendor/symbol-observable/ponyfill.js');
    app.import('vendor/symbol-observable.js');
    this._super.included.call(this, app);
  },
  treeForAddon: function(tree) {
    var rxPath = path.dirname(require.resolve('rxjs-es'));
    var rxTree = stew.find(rxPath, {
      include: ['**/*.js']
    });
    
    var trees = mergeTrees([tree, new RxHack(rxTree)]);
    return this._super.treeForAddon.call(this, trees);
  },
  treeForVendor: function(tree) {
    /**
     * Add the symbol-observable polyfill, taking care to 
      not add a "ponyfill.js" to the root vendor namespace (it's
      likely to clash w/ something else!)
    */
    var soPath = path.dirname(require.resolve('symbol-observable/index.js'));
    var soTree = stew.rename(stew.find(soPath, {
      include: ['**/*.js']
    }), function(relPath) {
      switch (relPath) {
        case 'index.js':
          return 'symbol-observable.js';
        case 'ponyfill.js':
          return 'symbol-observable/ponyfill.js';
        default:
          return relPath;
      }
    });
    var trees = mergeTrees([tree, new RequireWrapper(soTree)]);

    return this._super.treeForVendor.call(this, trees);

  }
};
