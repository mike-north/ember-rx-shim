import Rx from 'rxjs/Rx';
import RxObservable from 'rxjs/Observable';

import { module, test } from 'qunit';

module('Unit | Utility | rxjs');

// Replace this with your real tests.
test('Important modules are available', function(assert) {
  assert.ok(Rx, 'Rx is available');
  assert.ok(RxObservable, 'RxObservable is available');
  assert.equal(typeof Rx.Observable, 'function', 'Rx.Observable is a function');
  let o = new Rx.Observable();
  assert.equal(typeof o, 'object', 'Observable is an object');
});
