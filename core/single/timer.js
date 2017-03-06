'use strict';

const co = require('co');

class Looper {
  constructor (ctx) {
    this.ctx = ctx;
  }

  run () {
    const self = this;
    const ctx = self.ctx;
    setTimeout(() => {
      if (!ctx.is_running)
        return;

      if (ctx.is_ignored) {
        ctx.is_ignored = false;
        return self.run();
      } else {
        ctx.action().then((res) => {
          return self.run();
        });
      }
    }, ctx.interval);
  }
}

class Timer {

  constructor (interval, generator) {
    this.interval = interval;
    this.action = co.wrap(generator).bind(this);
    this.is_running = false;
    this.is_ignored = false;
    this._looper = new Looper(this);
    this._logger = null;
    this._listener = {};
  }

  start (log_text) {
    this.is_running = true;
    this._looper.run();
    if (log_text)
      this.log(log_text);
  }

  stop (log_text) {
    this.is_running = false;
    this.trigger('stop');
    if (log_text)
      this.log(log_text);
  }

  pass (log_text) {
    this.is_ignored = true;
    if (log_text)
      this.log(log_text);
  }

  shift (ms, log_text) {
    ms = Number.parseInt(ms);
    if (ms < 0)
      throw new Error('interval time must bigger than 0');
    this.interval = ms;
    if (log_text)
      this.log(log_text);
  }

  log (text) {
    if (this._logger)
      return this._logger(text);
    return console.log(text);
  }

  registerLogger (log_fn) {
    if (typeof log_fn != 'function')
      throw new Error(`'log_fn' must be a function`);
    this._logger = log_fn;
  }

  on (event, action) {
    if (typeof action != 'function')
      throw new Error('action must be a function');
    this._listener[event] = action;
  }

  trigger (event) {
    if (this._listener[event])
      return this._listener[event](this);
  }

}

module.exports = Timer;