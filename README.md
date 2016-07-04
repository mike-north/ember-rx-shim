# ember-rx-shim

A simple addon for adding [RxJS 5](https://github.com/ReactiveX/rxjs#rxjs-5-beta) to your Ember.js app.

### Purpose

This only makes the library available for consumption as ES6 modules, and will, in the future, be responsible for the most basic level of integration. Anything further should be accomplished via other addons that bring this one in as a dependency.

## Installation

You can install this addon using ember-cli
```
ember install ember-rx-shim
```

## Use

RxJS may be imported as ES6 modules

```js
import Rx from 'rxjs/Rx';

let observable = new Rx.Observable((observer) => {
  ...
});

```


## Contributing

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
