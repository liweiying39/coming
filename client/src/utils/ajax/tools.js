'use strict';

const tools = {};

tools.injectToken = function (opt) {
  if (opt === null || opt === undefined)
    opt = {};
  if (!opt.headers)
    opt.headers = {};
  opt.headers.authorization = localStorage.getItem('token');
  return opt;
};

// tools.fullDate = function fullDate (data) {
//   if (data < 10) return '0' + data;
//   return '' + data;
// };
//
// // wrong place
// Date.prototype.getTimeList = function (is_full = true) {
//   let result = [
//     this.getFullYear(), this.getMonth() + 1, this.getDate(),
//     this.getHours(), this.getMinutes(), this.getSeconds()
//   ];
//   if (is_full)
//     result = result.map(tools.fullDate);
//   return result;
// };

export default tools;
