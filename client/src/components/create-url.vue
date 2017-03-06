<template>
  <div>
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
        <p class="title-text font-size-l text-center">{{ $t('event.create_event.event_url.url_title') }}</p>
      </div>
      <div class="input-block">
        <x-input :placeholder="$t('event.create_event.event_url.placeholder')" :value.sync="input_value"></x-input>
      </div>
    </div>
    <div class="btn-block mar-top-20">
      <x-button class="btn-primary" @click="next">{{ $t('button.create_event.next') }}</x-button>
      <!--<x-button class="btn none-url" @click="skipNext">{{ $t('button.create_event.skip_next') }}</x-button>-->
      <x-button class="btn-default" @click="cancel">{{ $t('button.cancel') }}</x-button>
    </div>

    <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active">
    </i-footer>
  </div>
</template>


<script lang="babel">
  import iFooter from './com-components/Footer/Index.vue'
  //  import {XInput, XButton} from 'vux/src/components'

  import XInput from 'vux/src/components/x-input'
  import XButton from 'vux/src/components/x-button'

  import generateURL from '../utils/routers'

  export default{
    components: {
      iFooter,
      XInput,
      XButton
    },
    data(){
      return {
        footer_btn_active: false,
        footer_user_active: true,
        input_value: null
      }
    },
    computed: {
      event_code() {
        return this.$route.query.event_code;
      }
    },
    methods: {
      generateURL: generateURL,
//      skipNext(){
//        this.$router.go(generateURL('UPDATE_EVENT', { query: { event_code: this.event_code } }));
//      },
      next(){
        this.$router.go(generateURL('UPDATE_EVENT', {
          query: {
            url: this.input_value,
            event_code: this.event_code
          }
        }));
      },
      cancel(){
        this.$router.go(generateURL('CREATE_EVENT_CODE'));
      }
    },
    route: {
      activate(transition) {
        if (transition.from.path && transition.from.path.slice(0, 13) === '/create-event'
                && transition.to.query.event_code)

          transition.next();
        else {
          transition.redirect(generateURL('CREATE_EVENT_CODE'));
        }
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
    width: 100%;
    background: #efeff4;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .title-text-block {
    width: 100%;
    height: auto;
    text-align: center;
    padding: 10px;
    box-sizing: border-box;

  }

  .title-text {
    color: #3a3636;
    font-size: 18px;
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
    font-size: 18px;
  }

  .next {
    background: #38BD00;
    color: #FFFFFF;
  }

  .none-url {
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
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid #efefef;
  }

</style>
