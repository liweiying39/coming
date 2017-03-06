<template>
  <div class="content" v-if="reseller">
    <div class="text-block">
      <p class="font-size-l text-center notify-font-color">
        {{ $t('reseller.request_code.notify') }}
      </p>

      <div class="mar-top-20">
        <div class="text-block-top-left text-right">
          <img src="/static/img/chancejiang.jpg" class="avatar-img">
          <div class="dis-inline-block vertical-top text-left  mar-right-10">
            <p class="avator-text">{{ reseller.name }}</p>
            <p class="avator-text">{{ reseller.tel }}</p>
          </div>
        </div>
        <div class="text-block-top-right text-left">
          <a href="tel:{{ reseller.tel }}">
            <img src="/static/img/tel.png" class="tel-img">
          </a>
        </div>
      </div>
    </div>

    <div class="btn-block mar-top-20">
      <a class="btn btn-call call" href="tel:{{reseller.tel}}">
        {{ $t('button.reseller.call_code') }}
      </a>
      <!--</x-button>-->
      <x-button class="btn-default mar-top-20" @click="cancel">{{ $t('button.cancel') }}</x-button>
    </div>
  </div>

  <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active"></i-footer>
</template>
<style>

</style>
<script lang="babel">

  import iFooter from './com-components/Footer/Index.vue'
  import XButton from 'vux/src/components/x-button'

  import generateURL from '../utils/routers'

  export default{
    data(){
      return {
        footer_btn_active: false,
        footer_user_active: true,
        reseller: null
      }
    },
    methods: {
      cancel() {
        this.$router.go(generateURL('RESELL'));
      },
      call() {
        /** call admin */
      }
    },
    components: {
      iFooter,
      XButton
    },
    route: {
      data(transition){
        let self = this;
        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));
        this.$ajax.getAdminTel()
          .then((reseller_data) => {
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));

            transition.next({
              reseller: reseller_data
            })
          })
          .catch((res) => {
            this.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          })
      }
    }
  }
</script>
<style scoped>

  body {
    min-height: 100%;
    background: #FFFFFF;
  }

  .content {
    width: 100%;
    background: #efeff4;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .text-block-top-left {
    width: 60%;
    display: inline-block;
  }

  .text-block-top-right {
    display: inline-block;
    width: 38%;
  }

  .avatar-block {
    display: inline-block;
    width: 60%;
  }

  .btn-call {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding-left: 14px;
    padding-right: 14px;
    box-sizing: border-box;
    font-size: 18px;
    text-align: center;
    text-decoration: none;
    color: #FFFFFF;
    line-height: 2em;
    border-radius: 5px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    width: 90%;

  }

  .tel-img {
    width: 50px;
    height: 50px;
    transform: translateY(-10px);

  }

  .notify {
    font-size: 17px;
    text-align: center;
    color: #484646;
  }

  .btn-block .call {
    background: #538DE2;
    color: #FFFFFF;
  }

  .btn-block .cancel {
    background: #FBFAFC;
  }


</style>

