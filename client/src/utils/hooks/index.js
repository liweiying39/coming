'use strict';

import co from 'co'
import cache from '../cache/index.js'
import frontend_config from '../../config.js';

const initHooks = function (router) {
  router.beforeEach(function (transition) {
    const app = router.app;

    // 解除队列对于组件的绑定
    // app.$$queue.unbind();

    // 第一次载入应用state.current_user内容为空
    // 在$ajax.getCurrentUser获取成功之前也是没有值
    if (app.$store.state.current_user.user_id === null) {

      // 每次进入app时清空localStorage的events
      cache.clear('events');

      if (app.$route.query.lang)
        app.$$locale.change(app.$route.query.lang);

      return co(function* () {
        try {
          // 获取api token
          if (!localStorage.getItem('token')) {
            yield app.$ajax.getToken()
              .then((data) => {
                localStorage.setItem('token', data.token);
              });
          }
          // 获取current user信息
          yield app.$ajax.getCurrentUser()
            .then((data) => {
              app.$store.commit('UPDATE_CURRENT_USER', data);
            });
        } catch (err) {
          // 任意一个请求错误都会被跳向验证页面
          localStorage.removeItem('token');
          let event_id = app.$route.query.share || 0;
          window.location.replace(frontend_config.oauth_address + '?share=' + event_id);
          return transition.abort();
        }
        return transition.next();
      });
    } else {
      return transition.next();
    }
  });
};


export default {
  initHooks
}
