'use strict';
const fn = {};

fn.fullDate = function (data) {
  if (data < 10) return '0' + data;
  return '' + data;
};

Date.prototype.getTimeList = function (is_full = true) {
  let result = [
    this.getFullYear(), this.getMonth() + 1, this.getDate(),
    this.getHours(), this.getMinutes(), this.getSeconds()
  ];
  if (is_full)
    result = result.map(fn.fullDate);
  return result;
};

fn.intDate = function(timestamp, unit) {
 let cur_date = timestamp / unit;
  if(cur_date < 0 )
    throw new Error('the date format is wrong');

  if(cur_date > 0 && cur_date < 1)
    return 1;
  else
    return parseInt(cur_date);

};
/**
 *
 * @param timestamp
 * @param type
 *  type = 'data' 返回日期格式
 *  type= 'beautify' 返回 [月，日]格式
 *  type = 'both' 当大于30天时返回[月，日]，否则返回[num, unit],unit可能是'n','m','h','d'
 */
Date.beautifyDate = function (timestamp, type = 'both') {
  let current_time = Date.now();
  let min_time = 60 * 1000; //分
  let hour_time = 60 * min_time; //时
  let day_time = 24 * hour_time; //天
  let month_time = 30 * day_time; //月
  let result = {
    type: type,
    val: []
  };

  if (type == 'data') {
    result = {
      type: 'data',
      val: [new Date(timestamp).getMonth() + 1, new Date(timestamp).getDate()]
    }
  }

  if (type = 'both') {
    let timer = current_time - timestamp;
    let num;
    let unit;

    if (timer <= min_time) {
      num = 0;
      unit = 's';
    } else if (timer > min_time && timer <= 60 * min_time) {
      num = fn.intDate(timer, min_time);
      unit = 'm';
    } else if (timer > hour_time && timer <= day_time) {
      num = fn.intDate(timer, hour_time);
      unit = 'h';
    } else if (timer > day_time && timer <= month_time) {
      num = fn.intDate(timer, day_time);
      unit = 'd';
    } else {
      num = new Date(timestamp).getMonth() + 1;
      unit = new Date(timestamp).getDate();
    }

    result = {
      type: 'both',
      val: [num, unit]
    }
  }

  return result;
};

module.exports = {};
