<template>
  <div class="header">
    <div class="title-block">
      <h1 class="title over-ellipsis">{{ $t('header.admin.title') }}</h1>
      <div class="sub-title-block" v-if="business">
        <span class="sub-title">{{ $t('header.admin.admin_id') }}: {{ getCurrentUser.telephone }}</span>
      </div>
    </div>
  </div>

  <div class="mar-top-20"></div>

  <div class="content" v-if="business">
    <div class="content-body">
      <cell :title="$t('reseller.summary.sold')">
        <div slot="value">
          <strong class="num">{{ business.sold }}</strong>
        </div>
      </cell>

      <cell :title="$t('reseller.summary.used')">
        <div slot="value">
          <strong class="num">{{ business.used }}</strong>
        </div>
      </cell>

      <cell :title="$t('reseller.summary.inventory')">
        <div slot="value">
          <strong class="num">{{ business.inventory }}</strong>
        </div>
      </cell>
    </div>
    <div class="btn-block mar-top-20">
      <x-button class="btn-default" @click="jumpToPrevPage">{{ $t('button.back') }}</x-button>
    </div>
  </div>


  <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active"></i-footer>
</template>


<script lang="babel">
  import iFooter from '../components/com-components/Footer/Index.vue'
  import Cell from 'vux/src/components/cell'
  import XButton from 'vux/src/components/x-button'

  import rbac from '../utils/rbac/index'
  import {mapGetters, mapActions} from 'vuex'
  import generateURL from '../utils/routers'

  export default{
    data(){
      return {
        footer_btn_active: false,
        footer_user_active: true,
        business: null
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser'])
    },
    components: {
      iFooter,
      Cell,
      XButton
    },
    methods: {
      jumpToPrevPage() {
        window.history.back();
      }
    },
    route: {
      activate(transition) {
        let self = this;
        rbac
                .init()
                .allow(rbac.ADMIN_ROLE)
                .check(self.getCurrentUser.role, function (can_pass) {
                  if (!can_pass)
                    transition.redirect(generateURL('INDEX'));
                  transition.next();
                })
      },
      data(transition) {
        let self = this;
        self.$dispatch('IS_SHOWING_LOADING',true, self.$t('loading.text'));
        this.$ajax.getAdminBusiness()
                .then((res) => {
                  self.$dispatch('IS_SHOWING_LOADING',false, self.$t('loading.text'));
                  transition.next({
                    business: res
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
  /*@import '/static/css/content.css';*/

  body {
    min-height: 100%;
    background: #FFFFFF;
  }

  .sub-title-text {
    color: #FFFFFF;
  }
  .content {
  width: 100%;
  background: #efeff4;
  overflow-x: hidden;
  overflow-y: scroll;
  }

  .content-body:after {
    content: '';
    height: 1px;
    display: block;
    background: #D9D9D9;
  }

  .content:after {

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
    font-size: 17px;
  }

  .num {
    color: #538DE2;
    font-weight: normal;
    font-size: 22px;
    padding-right: 5px;
  }
</style>
