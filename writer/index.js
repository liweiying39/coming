"use strict";

const colors = require('colors');
// const memwatch = require('memwatch-next');

const timer = require('./timer.js');

// watch the memory, print info if it leak
// memwatch.on('leak', function (info) {
//   console.log(`[WRAN MEMLEAK] ${info}`.yellow);
// });

// start the timer
timer.start();

// bind a stop event
// restart timer where timer stop by some error
timer.on('stop', function (timer) {
  setTimeout(function() {
    timer.start(`[TIMER RESTART] restart`.green);
  }, 30000);
});
