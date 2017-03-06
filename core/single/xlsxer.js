'use strict';

const fs = require('fs');
const xlsx = require('node-xlsx');

class Xlsxer {
  constructor () {
  }

  build (path, worksheets, options = undefined) {
    if (!Array.isArray(worksheets) && worksheets.data)
      worksheets = [worksheets];

    return new Promise((resolve, reject) => {
      let file = xlsx.build(worksheets, options);
      fs.writeFile(path, file, 'binary', function (err) {
        if (err) return reject(err);
        return resolve();
      });
    });
  }

  createWorksheet (body) {
    return {
      data: body
    };
  }
}

const xlsxer = new Xlsxer();

module.exports = xlsxer;
