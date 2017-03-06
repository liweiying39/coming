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
      <div class="text-block-top-left text-right">
        <img src="" class="avatar-img">
      </div>
      <div class="text-block-top-top-right text-left vertical-top">
          <p>{{ reseller.name }}</p>
          <p>{{ reseller.address }}</p>
      </div>
      <p class="font-size-l text-center">{{ $t('reseller.follow_reseller.notify') }}</p>
      <div class="tel-block text-center mar-top-20">
        <strong class="tel font-size-xl blue-font ">{{ reseller.telephone }}</strong>
      </div>
    </div>

    <div class="btn-block mar-top-20">
      <a class="btn-call" href="tel:{{reseller.telephone}}">
        {{ $t('button.reseller.call_code') }}
      </a>
      <x-button class="btn-default" @click="cancel">{{ $t('button.cancel')}}</x-button>
    </div>
  </div>

  <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active">
  </i-footer>

</template>


<script lang="babel">
  import iFooter from './com-components/Footer/Index.vue'
  import XButton from 'vux/src/components/x-button'

  import generateURL from '../utils/routers'

  export default{
    components: {
      iFooter,
      XButton
    },
    data(){
      return {
        reseller: {
          name: 'Chance',
          address: '广东 广州',
          telephone: '13006899827'
        },
        title: 'My @Coming Service',
        footer_btn_active: false,
        footer_user_active: true
      }
    },
    methods: {
      generateURL: generateURL,
      cancel() {
        this.$router.go(generateURL('CREATE_EVENT_CODE'));
      }
    }
  }
</script>

<style scoped>

  body {
    background: #FFFFFF;
  }

  .content {
    width: 100%;
    background: #efeff4;
    overflow-x: hidden;
    overflow-y: scroll;
  }


  .text-block-top-left,.text-block-top-top-right {
    display: inline-block;
    width: 49%;
    overflow: hidden;
  }

  .vertical-top {
    vertical-align: top;
  }


  .nick-address-area {
    display: inline-block;
    text-align: left;
    vertical-align: top;
  }

  .title-text {
    color: #3a3636;
    font-size: 17px;
    margin-top: 15px;
    text-align: center;
  }

  .avatar-img {
    width: 50px;
    height: 50px;
    display: inline-block;
    margin-right: 10px;
  }

  .tel-block {
    width: 100%;
    /*text-align: center;*/
  }

  .wq-img {
    width: 100px;
    height: 100px;
  }

  .btn-call {
    width: 90%;
    background: #538DE2;
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
    border-radius: 2px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    margin-bottom: 20px;
  }

</style>

<style>

  .weui_input {
    text-align: center;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid #efefef;
  }
</style>
