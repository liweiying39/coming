class Hash {

  constructor (ctx, name) {
    this.ctx = ctx;
    if (!name)
      throw new Error(`need parameter`);
    this.name = name;
  }

  get key () {
    return `${this.ctx.prefix}:hash:${this.name}`;
  }

  get (field) {
    return this.ctx.client.hgetAsync(this.key, field);
  }

  mget (...fields) {
    return this.ctx.client.hmgetAsync(this.key, ...fields);
  }

  getall () {
    return this.ctx.client.hgetallAsync(this.key);
  }

  set (field, value) {
    let _value = typeof value == 'string' ? value : JSON.stringify(value);
    return this.ctx.client.hsetAsync(this.key, field, _value);
  }

  mset (dict) {
    let params = [];
    Object.keys(dict).forEach((attr) => {
      let _value = typeof dict[attr] == 'string' ? dict[attr] : JSON.stringify(dict[attr]);
      params.push(attr, _value);
    });
    return this.ctx.client.hmsetAsync(this.key, ...params);
  }

  del (...fields) {
    return this.ctx.client.hdelAsync(this.key, ...fields);
  }

  len () {
    return this.ctx.client.hlenAsync(this.key);
  }

}

module.exports = Hash;
