"use strict";

function timeParse (str) {
  let temp = str.match(/^(\d+\.?\d?)([sdh])$/);
  let base;
  if (!temp)
    throw new Error('wrong date format');
  if (temp[2] == 's')
    base = 1000;
  else if (temp[2] == 'h')
    base = 60 * 60 * 1000;
  else if (temp[2] == 'd')
    base = 24 * 60 * 60 * 1000;
  else
    throw new Error('unknown time string');

  return Number.parseInt(Number.parseFloat(temp[1]) * base);
}

const cache = {
  save (key, value, expire_in = null) {
    // 防止safari使用无痕模式
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (expire_in)
        localStorage.setItem(`${key}:expire_at`, Date.now() + timeParse(expire_in));
      return true;
    } catch (err) {
      return false;
    }
  },

  saveMany (obj, expire_in = null) {
    const self = this;
    Object.keys(obj).forEach((key) => {
      self.save(key, obj[key], timeParse(expire_in));
    });
  },

  load (key, default_value = null) {
    let expire_at = localStorage.getItem(`${key}:expire_at`);
    if (expire_at && expire_at < Date.now()) {
      localStorage.removeItem(`${key}:expire_at`);
      localStorage.removeItem(key);
      return default_value;
    } else {
      return JSON.parse(localStorage.getItem(key)) || default_value;
    }
  },

  clear (key) {
    let result = localStorage.getItem(key);
    if (result) {
      localStorage.removeItem(key);
      return true;
    }
    else
      return false;
  }

};

module.exports = cache;
