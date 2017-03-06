'use strict';

const colors = require('colors');
const core = require('../core');

const Timer = core.getService('timer');
const db = core.getService('db');
const cache = new (core.getService('cache'))();

let list = cache.list('event_messages');

const COUNT_THRESHOLD = 50;
const PASS_LIMIT = 3;
let pass_count = 0;
let error_count = 0;

// `this` in generator is mean timer instance
const timer = new Timer(2000, function* () {

  const timer = this;
  let current_count = yield list.len();

  if (current_count > 0 && timer.interval != 1000)
    timer.shift(1000, `${new Date} [TIMER SPEED] *normal speed*`.bold);

  // console.log(`${new Date} list: ${current_count}\tpass: ${pass_count}`);

  if ((pass_count < PASS_LIMIT) && (current_count < COUNT_THRESHOLD))
    return ++pass_count;

  pass_count = 0;

  // left 1 item in the list
  let ran_start = 0, ran_end = pass_count >= PASS_LIMIT ? -2 : COUNT_THRESHOLD - 2;
  let data = yield list.range(ran_start, ran_end);

  let insert_datas = [];
  let error_index = [];

  for (let i = 0; i < data.length; i++) {
    let d = data[i];
    try {
      let v = JSON.parse(d);
      insert_datas.push({
        target_user_id: v.target_user_id,
        event_id: v.event_id,
        content: v.content,
        is_read: v.is_read
      });
    } catch (err) {
      error_index.push(i);
      console.error(`${new Date} [PARSE ERROR] ${d}`.red);
    }
  }

  if (insert_datas.length) {
    let trim_start = ran_end == -2 ? -1 : COUNT_THRESHOLD - 1;
    try {
      yield db.EventMessage.bulkCreate(insert_datas);
      yield list.trim(trim_start, -1);
    } catch (err) {
      error_count++;
      console.error(`${new Date} [WRITE ERROR] ${err}`.red);
      if (error_count > 10) {
        error_count = 0;
        yield list.trim(trim_start, -1);
        timer.stop(`${new Date} [TIMER STOP] write error, drop the wrong datas`.red);
      }
    }
  } else {
    if (error_index) {
      for (let i of error_index)
        yield list.set(i, 'DELETED');
      yield list.rem(error_index.length, 'DELETED');
    }
    timer.shift(5000, `${new Date} [TIMER SPEED] *low speed* list has less item more than 3 write cycles`.yellow);
  }

});

module.exports = timer;
