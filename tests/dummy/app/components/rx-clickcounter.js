import Ember from 'ember';
import Rx from 'rxjs/Rx';

const { Component, Evented } = Ember;

export default Component.extend(Evented, {
  val: 1,
  didInsertElement() {
    this._super(...arguments);

    let observable = Rx.Observable.create((observer) => {
      this.on('abc', (val) => {
        observer.next(val);
        this.incrementProperty('val');
      });
    });

    observable.subscribe((x) => console.log(x));
  }
});