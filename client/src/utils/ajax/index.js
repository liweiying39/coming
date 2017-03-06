'use strict';

import methods from './methods.js'
import co from 'co'

/**
 * IAjax
 *
 * 自定义ajax请求插件，目的是封装使用自定义的函数来访问api
 * Example::
 *    // @methods.js
 *    const methods = {
 *      getUsers: function(http) {
 *        return function* (opt) {
 *          let data = yield http.get('/users', opt)
 *            .then((res)=>{ return res }, (res)=>{ throw res });
 *          return data;
 *        }
 *      }
 *    }
 *    // 组件中
 *    ready() {
 *      this.$ajax.getUsers()
 *        .then((res) => { console.log(res); })
 *        .catch((err) => { console.log(err); });
 *    }
 *
 * 通过此方式的ajax请求仍是异步请求
 *
 * @created 2016.10.9
 */
const IAjax = function () {
  class AjaxInterface {
    constructor (http, methods) {
      let self = this;

      self._http = http;
      self.current_api_path = '/api';
      self.global_error = {
        [401]: (res) => {
          throw res;
          // let openid = localStorage.getItem('wechat_openid');
          // if (!openid)
          //   throw res;
          // self.getToken({ options: { params: { openid: openid} } })
          //   .then((data) => {
          //     localStorage.setItem('token', data.token);
          //   })
          //   .catch((res) => {
          //     throw res;
          //   });
        }
      };

      // 从methods加载定义的接口函数
      Object.getOwnPropertyNames(methods).forEach(function (val, idx, array) {
        if (typeof methods[val] === 'object') {
          Object.defineProperty(self, val, {
            value: co.wrap(buildGenerator(self, methods[val], self._http))
          });
          return;
        }
        Object.defineProperty(self, val, {
          value: co.wrap(methods[val](self._http))
        })
      });
    }
  }

  return {
    installed: false,

    install(Vue, options) {
      if (this.installed) {
        console.error('ajax already installed');
        return;
      }

      // 为所有组件实例添加对象$ajax
      // 可以在组件内通过this.$ajax访问
      Vue.prototype.$ajax = new AjaxInterface(Vue.http, methods);
      this.installed = true;
    }
  };
}();

function buildGenerator (ajax, brocker, http) {
  return function* ({ path, body, options } = {}) {
    options = injectOptions(options);
    let method = brocker.method.toLowerCase();

    // 处理url
    let url = ajax.current_api_path + brocker.url;
    if (path) {
      Object.keys(path).forEach((key) => {
        let pattern = new RegExp(`:${key}`, 'g');
        url = url.replace(pattern, path[key]);
      });
    }

    // 处理body与options
    let args = [];
    if (method === 'put' || method === 'post')
      args.push(body);
    args.push(options);

    // decorate success callback
    let decorateSuccess = function(callback) {
      return function(response) {
        return callback(response);
      }
    };

    if (brocker.mock)
      return brocker.success();
    else
      return yield http[method](url, ...args)
        .then(decorateSuccess(brocker.success), buildErrorHandler(ajax, brocker.error));
  }
}

function buildErrorHandler (ajax, error) {
  return function (response) {
    let status = response.status;
    if (error && status in error)
      throw error[status](response);
    else if (status in ajax.global_error)
      throw ajax.global_error[status](response);
    else
      throw response;
  }
}

function injectOptions (opt) {
  if (opt === null || opt === undefined)
    opt = {};
  if (!opt.headers)
    opt.headers = {};
  opt.headers.authorization = localStorage.getItem('token') || '';
  return opt;
}

export default IAjax;
