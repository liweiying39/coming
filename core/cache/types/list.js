class List {

  constructor (ctx, ...names) {
    this.ctx = ctx;
    if (names.length < 1)
      throw new Error(`need parameter`);
    this.names = names;
  }

  key (index = 0) {
    return `${this.ctx.prefix}:list:${this.names[index]}`;
  }

  lpush (...values) {
    let _values = values.map((v) => {
      return typeof v == 'string' ? v : JSON.stringify(v);
    });
    return this.ctx.client.lpushAsync(this.key(), ..._values);
  }

  rpush (...values) {
    let _values = values.map((v) => {
      return typeof v == 'string' ? v : JSON.stringify(v);
    });
    return this.ctx.client.rpushAsync(this.key(), ..._values);
  }

  len () {
    return this.ctx.client.llenAsync(this.key());
  }

  range (start, end) {
    return this.ctx.client.lrangeAsync(this.key(), start, end);
  }

  trim (start, end) {
    return this.ctx.client.ltrimAsync(this.key(), start, end);
  }

  set (index, value) {
    return this.ctx.client.lsetAsync(this.key(), index, value);
  }

  rem (count, value) {
    return this.ctx.client.lremAsync(this.key(), count, value);
  }

  destory () {
    return this.ctx.delAsync(this.key());
  }

}

module.exports = List;