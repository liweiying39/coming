/**
 * Created by brambles on 16/9/24.
 */
"use strict";

const Router = require('koa-router');

class Resource extends (Router) {

  constructor (name) {
    super({ prefix: '/' + name })
  }

  index () {
    return this.get('index', '/', ...arguments)
  }

  create () {
    return this.post('create', '/', ...arguments)
  }

  show () {
    return this.get('show', '/:id', ...arguments)
  }

  update () {
    return this.put('update', '/:id', ...arguments)
  }

  destory () {
    return this.delete('update', '/:id', ...arguments)
  }

}

module.exports = Resource;
