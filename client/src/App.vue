<template>
  <div id="app">
    <router-view></router-view>

    <alert :show.sync="is_showing_error" :title="error_title" @on-show="show" @on-hide="hide">
      {{ error_content }}
    </alert>
    <loading :show="is_showing_loading" :text="loading_text"></loading>
  </div>
</template>

<script lang="babel">
  import Alert from 'vux/src/components/alert'
  import Loading from 'vux/src/components/loading'
  import { mapActions, mapGetters } from 'vuex'
  import generateURL from './utils/routers'

  export default {
    sockets: {
      coming(msg) {
        /** queue */
        // msg.type
        this.$$queue.push(msg);
      }
    },
    data() {
      return {
        is_showing_error: false,
        error_title: null,
        error_content: null,
        is_showing_loading: false,
        loading_text: null
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser'])
    },
    ready() {
      // 即时通信
      this.$$queue.bind(this);
    },
    methods: {
      ...mapActions(['updateEventNews']),
      // 即时通信
      notice() {
        let message = this.$$queue.pop();
        this.$$utils.handleSocketMessage(this, message, {
          event_news: function (message) {
            this.updateEventNews(message);
          },
          ready_done: function (message) {
            this.$socket.emit('connection', { token: localStorage.getItem('token') });
          },
          connection_done: function (message) {
            if (!message.done)
              this.$socket.emit('connection', { token: localStorage.getItem('token') });
          }
        });
      },
      show() {
        this.is_showing_error = true;
      },
      hide() {
//        this.$broadcast('HIDE_ERROR_CALLBACK');
        // 发生错误提示时回到首页
        this.$router.go(generateURL('INDEX'));
        this.is_showing_error = false;
      }
    },
    events: {
      SHOW_ERROR(title, content) {
        this.is_showing_loading = false;
        this.is_showing_error = true;
        this.error_title = title;
        this.error_content = content;
      },
      HIDE_ERROR() {

      },
      /*loading效果
       * */
      IS_SHOWING_LOADING(bol, text) {
        this.is_showing_loading = bol;
        this.loading_text = text;
      }
    },

    components: {
      Alert,
      Loading
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset';
</style>

