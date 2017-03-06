<template>
  <div class="header">
    <div class="title-block">
      <h1 class="title">{{ $t('header.create_event.title') }}</h1>
      <div class="sub-title-block">
        <p class="sub-title">{{$t('header.create_event.sub_title')}}</p>
      </div>
    </div>
  </div>
  <div class="mar-top-20"></div>

  <div class="content">
    <div class="text-block">
      <p class="title-text font-size-l text-center">{{ $t('event.create_event.event_code.code_title') }}</p>
      <div class="error-warn" v-if="is_showing_code_wrong">
        <p class="red-font font-size-m text-center">
          {{ $t('event.create_event.event_code.code_error_msg') }}
        </p>
      </div>
    </div>
    <div class="input-block">
      <x-input :placeholder="$t('event.create_event.event_code.placeholder')" :value.sync="input_value">
      </x-input>
    </div>
  </div>

  <div class="btn-block mar-top-20">
    <x-button class="btn-info" @click="createEvent">
      {{ $t('button.create_event.new_event') }}
    </x-button>
  </div>

  <div class="text-block mar-top-20">
    <p class="font-size-l text-center">{{ $t('event.create_event.event_code.request_title') }}</p>
  </div>


  <div class="btn-block mar-top-20">
    <x-button class="btn-primary" @click="jumpToFollowReseller">
      {{ $t('button.create_event.request_code') }}
    </x-button>
    <x-button class="btn-default" @click="cancelCreateEvent">{{ $t('button.cancel') }}</x-button>
  </div>

  <!--<confirm :show.sync="is_showing_confirm" :title="$t('dialog.code_error.title')"-->
  <!--:confirm-text="$t('dialog.code_error.confirm')"-->
  <!--:cancel-text="$t('dialog.code_error.cancel')"-->
  <!--@on-cancel="confirmShareCancel" @on-confirm="confirmShareOk">-->
  <!--<p>{{ $t('dialog.code_error.content') }}</p>-->
  <!--</confirm>-->

  <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active">
  </i-footer>
</template>

<script lang="babel">

  import iFooter from './com-components/Footer/Index.vue'
  //  import {XInput, XButton, Confirm} from 'vux/src/components'

  import XInput from 'vux/src/components/x-input'
  import XButton from 'vux/src/components/x-button'
  import Confirm from 'vux/src/components/confirm'

  import {mapGetters} from 'vuex'
  import generateURL from '../utils/routers'

  export default{
    components: {
      iFooter,
      XInput,
      XButton,
      Confirm
    },
    data(){
      return {
        title: 'aaa',
        footer_btn_active: false,
        footer_user_active: true,
        input_value: null,
//        is_showing_confirm: false,
        is_showing_code_wrong: false
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser']),
      code() {
        return this.$t('event.create_event.event_code');
      }
    },
    methods: {
      generateURL: generateURL,
//      confirmShareCancel() {
//        this.is_showing_confirm = false;
//      },
//      confirmShareOk() {
//        this.is_showing_confirm = false;
//      },
      createEvent() {
        let self = this;
        if (self.input_value) {
          let args = { options: { params: { content: self.input_value.trim() || null } } };
          this.$ajax.getEventCode(args)
                .then((res) => {
                  if (res.code && !res.is_used) {
                    return self.$router.go(generateURL('UPDATE_EVENT', {
                      query: {
                        event_code: res.code
                      }
                    }));
                  } else
                    self.is_showing_code_wrong = true;
                })
                .catch((res) => {
                  this.$$utils.handleError(res, {
                    [404]: () => {
                      self.is_showing_code_wrong = true
                    },
                    [422]: () => {
                      self.is_showing_code_wrong = true
                    },
                    'default': () => {
                      self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
                    }
                  })
                })
        } else {
          this.is_showing_code_wrong = true;
        }

        /*有免费event code的情况*/
//        this.is_showing_code_wrong = false;
//        let args = {};
//        if (self.input_value)
//          args = { options: { params: { content: self.input_value } } };

//        this.$ajax.getEventCode(args)
//                .then((res) => {
//                  if (res.code && !res.is_used) {
////                      return self.$router.go(generateURL('CREATE_EVENT_URL', {
////                        query: {
////                          event_code: res.code
////                        }
////                      }));
//                    return self.$router.go(generateURL('UPDATE_EVENT', {
//                      query: {
//                        event_code: res.code
//                      }
//                    }));
//                  } else
//                    self.is_showing_code_wrong = true;
//                })
//                .catch((res) => {
//                  this.$$utils.handleError(res, {
//                    [404]: () => {
////                  self.$dispatch('SHOW_ERROR', self.$t('error.getEventCode.title'),
////                    self.$t('error.getEventCode.content'));
////                      self.is_showing_code_empty = true;
//                      self.is_showing_code_wrong = true
//                    },
//                    ['422']: () => {
//                      self.is_showing_code_wrong = true
//                    },
//                    'default': () => {
//                      self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
//                    }
//                  })
//                })
      },
      jumpToFollowReseller(){
        this.$router.go(generateURL('FOLLOW_RESELLER'));
      },
      cancelCreateEvent(){
        this.$router.go(generateURL('INDEX'));
      }
    }
  }
</script>

<style scoped>
  /*@import "/static/css/content.css";*/

  body {
    min-height: 100%;
    background: #FFFFFF;
  }

  .content {
    background: #efeff4;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .notify-block {
    margin-top: 40px;
    width: 100%;
    height: auto;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;
  }

  .notify-text {
    color: #3a3636;
    font-size: 17px;
  }

  .request {
    background: #538DE2;
    color: #FFFFFF;
  }

  .cancel {
    background: #FBFAFC;
  }
</style>

<style>
  .weui_input {
    text-align: center;
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid #efefef;
  }
</style>
