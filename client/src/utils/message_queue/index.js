'use strict';

class Queue {
  constructor () {
    this._queue = [];
    this.observer = null;
    this.is_activated = false;
  }

  bind (observer) {
    this.observer = observer;
    if (this.observer.bind)
      this.observer.bind(this);
    this.activate();
  }

  unbind () {
    this.deactivate();
    this.observer = null;
  }

  activate () {
    if (!this.observer)
      throw new Error('please bind an observer before calling activate()');
    if (this.is_activated == false)
      this.is_activated = true;
    this.loop();
  }

  deactivate () {
    this.is_activated = false;
  }

  loop () {
    setTimeout(() => {
      if (this.observer && this._queue.length) {
        this.observer.notice();

        if (this.is_activated)
          this.activate();
      } else
        this.deactivate();
    }, this.getDelayTime());
  }

  getDelayTime () {
    return 2000;
  }

  push (item) {
    this._queue.push(item);

    if (this.observer && this._queue.length && !this.is_activated)
      this.activate();
  }

  pop () {
    if (this._queue.length == 0)
      throw new Error('queue is empty');
    return this._queue.shift();
  }
}

const queue = new Queue();

module.exports = queue;
