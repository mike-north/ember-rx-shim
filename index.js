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

module.exports = {
  name: 'rxjs',
  
  treeForAddon: function(tree) {
    var rxPath = path.dirname(require.resolve('rxjs-es'));
    var rxTree = stew.find(rxPath, {
      include: ['**/*.js']
    });
    
    var rxHackTree = new RxHack(rxTree);
    var trees = tree ? mergeTrees([tree, rxHackTree]) : rxHackTree;
    return this._super.treeForAddon.call(this, trees);
  }
};
