<template>
  <div class="content">
    <div class="text-block">
      <p class="font-size-l text-center notify-font-color">
        {{ $t('reseller.sell_code.notify') }}
      </p>
      <div class="mar-top-20">
        <div class="code" v-if="event_code">
          <h2 class="font-size-xxl text-center">{{ event_code.code }}</h2>
        </div>
      </div>

      <div class="tel-con-block"></div>
    </div>

    <div class="btn-block mar-top-20">
      <!--<x-button class="btn-primary" data-clipboard-target=".code">-->
      <!--{{ $t('button.reseller.copy_code') }}-->
      <!--</x-button>-->
      <x-button class="btn-default" @click="cancel">{{ $t('button.reseller.back') }}</x-button>
    </div>
  </div>


  <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active"></i-footer>

</template>

<script lang="babel">

  //  new Clipboard('.copyCode');

  import iFooter from './com-components/Footer/Index.vue'
  import XButton from 'vux/src/components/x-button'

  import generateURL from '../utils/routers'

  import {mapGetters, mapActions} from 'vuex'

  import rbac from '../utils/rbac/index'


  export default{
    components: {
      iFooter,
      XButton
    },
    data(){
      return {
        footer_btn_active: false,
        footer_user_active: true,
        event_code: null
      }
    },

    computed: {
      ...mapGetters(['getCurrentUser'])
    },

    methods: {
//      copyCode() {
//
//
//      },
      cancel() {
        this.$router.go(generateURL('RESELL'));
      }
    },
    events: {
      HIDE_ERROR_CALLBACK(){
        this.$router.go(generateURL('RESELL_REQUEST_CODE'));
      }
    },
    route: {
      activate(transition){
        let self = this;
        rbac
                .init()
                .allow(rbac.RESELLER_ROLE, rbac.ADMIN_ROLE)
                .check(self.getCurrentUser.role, function (can_pass) {
                  if (!can_pass)
                    transition.redirect(generateURL('INDEX'));
                  transition.next();
                })
      },
      data(transition) {
        let self = this;
        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));
        this.$ajax.putResellerInventory()
                .then((res) => {
                  self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));

                  transition.next({
                    event_code: res
                  })
                })
                .catch((res) => {
                  this.$$utils.handleError(res, {
                    [404]: () => {
                      self.$dispatch('SHOW_ERROR', self.$t('error.putInventory.title'),
                              self.$t('error.putInventory.content'))
                    },
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

  .panel-block {
    padding: 20px 10px;
    text-align: center;
  }

  .mid-block {
    width: 100%;
    text-align: center;
    padding: 20px 0;
  }

  .code {
    font-size: 26px;
    font-weight: normal;
  }

  .notify {
    font-size: 17px;
    text-align: center;
    color: #484646;
  }

  .btn-block .copy {
    background: #38BD00;
    color: #FFFFFF;
  }

  .btn-block .cancel {
    background: #FBFAFC;
  }
</style>

