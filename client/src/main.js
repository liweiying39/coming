"use strict";

import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import VueI18n from 'vue-i18n'
import VueSocketIO from 'vue-socket.io'

// 自定义IAjax插件
import IAjax from './utils/ajax'

Vue.use(VueI18n);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(Vuex);

import frontend_config from './config.js'
Vue.use(VueSocketIO, frontend_config.host_address);
// Vue.use(VueSocketIO, 'http://coming.co');

// 注册IAjax插件
Vue.use(IAjax);

import Vue from 'vue'
import App from './App'

import router_map from './router_map'
import hooks from './utils/hooks'

const router = new VueRouter();
router.map(router_map);

// 多语言相关
import locales from './locales';
Vue.config.lang = localStorage.getItem('locale') || 'zh_CN';
Vue.prototype.$$locale = {
  allow_lang: {}
};
Object.keys(locales).forEach((lang) => {
  Vue.prototype.$$locale.allow_lang[lang] = true;
  Vue.locale(lang, locales[lang]);
});
Vue.prototype.$$locale.change = function (lang) {
  if (!Vue.prototype.$$locale.allow_lang[lang])
    return;
  Vue.config.lang = lang;
  localStorage.setItem('locale', lang);
  console.log('current locale: ' + Vue.config.lang);
};
Vue.prototype.$$locale.current = function () {
  return Vue.config.lang
};

import actions from './store/actions.js'
import getters from './store/getters.js'
import current_user from './store/modules/current_user.js'
import variables from './store/modules/variables.js'
import event_news from './store/modules/event_news.js'
import active_event from './store/modules/active_event'

// inject object to Vue.prototype
import utils from './utils/vue_prototype_fn.js'
import cache from './utils/cache'
import queue from './utils/message_queue'
import timer from './utils/timer'
Vue.prototype.$$utils = utils;
Vue.prototype.$$cache = cache;
Vue.prototype.$$queue = queue;
Vue.prototype.$$timer = timer;

const main = Vue.extend({
  components: { App },
  store: new Vuex.Store({
    actions,
    getters,
    modules: {
      current_user,
      variables,
      event_news,
      active_event,
    }
  })
});

import './utils/injection.js';

// vue-router 0.7中
// 先注册beforeEach会使得直接通过url访问页面无效
// 先start router会使得首次进入页面beforeEach不触发
hooks.initHooks(router);
router.start(main, 'html');

window.loadingDone();
// window.Vue = Vue;
