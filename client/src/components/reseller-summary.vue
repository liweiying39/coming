<template>
  <div>
    <div class="content" v-if="reseller">
      <div class="content-body">
        <cell :title="$t('reseller.summary.sold')">
          <div slot="value">
            <strong class="num">{{ reseller.business.sold }}</strong>
          </div>
        </cell>

        <cell :title="$t('reseller.summary.used')">
          <div slot="value">
            <strong class="num">{{ reseller.business.used }}</strong>
          </div>
        </cell>


        <cell :title="$t('reseller.summary.inventory')">
          <div slot="value">
            <strong class="num">{{ reseller.business.inventory }}</strong>
          </div>
        </cell>

        <cell :title="$t('reseller.summary.total')">
          <div slot="value">
            <strong class="num">{{ total }}</strong>
          </div>
        </cell>
      </div>

      <div class="btn-block mar-top-20">
        <x-button class="btn-default" @click="jumpToPrevPage">{{ $t('button.back') }}</x-button>
      </div>

    </div>

    <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active">
      <div slot="popup_menus" class="popup-container reseller-menus">
        <cell :title="$t('footer_menus.reseller.request_code')" @click="jumpToRequestCode"></cell>
        <cell :title="$t('footer_menus.reseller.sell_code')" @click="jumpToSaleCode"></cell>
        <!--<cell :title="$t('footer_menus.cancel')" @click="cancel"></cell>-->
      </div>
    </i-footer>
  </div>
</template>

<script lang="babel">

  import iFooter from './com-components/Footer/Index.vue'
  import Cell from 'vux/src/components/cell'
  import XButton from 'vux/src/components/x-button'

  import generateURL from '../utils/routers'

  import { mapGetters, mapActions } from 'vuex'

  import rbac from '../utils/rbac/index'

  export default{
    components: {
      iFooter,
      Cell,
      XButton
    },
    data(){
      return {
//        title: 'My @Coming Service',
        footer_btn_active: true,
        footer_user_active: true,
        reseller: null
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser']),
      total(){
        if (this.reseller) {
          return parseInt(parseInt(this.reseller.business.sold) + parseInt(this.reseller.business.inventory));
        } else {
          return 0;
        }
      }
    },
    methods: {
      generateURL: generateURL,
      jumpToRequestCode() {
        this.$router.go(generateURL('RESELL_REQUEST_CODE'));
      },
      jumpToSaleCode() {
        this.$router.go(generateURL('RESELL_SELL_CODE'));
      },
      cancel() {
        this.$broadcast('cancel');
      },
      jumpToPrevPage() {
        window.history.back();
      }
    },
    route: {
      activate(transition) {
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

        this.$ajax.getReseller()
          .then((reseller_data) => {
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
            transition.next({
              reseller: reseller_data
            });
          })
          .catch((res) => {
            this.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          });

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

  .weui_cell_bd > p {
    color: #666;
  }

  .content-body:after {
    content: '';
    height: 1px;
    display: block;
    background: #D9D9D9;
  }


  .num {
    color: #538DE2;
    font-weight: normal;
    font-size: 22px;
    padding-right: 5px;
  }

  /*.popup-container .weui_cell {*/
    /*height: 30px;*/
    /*font-size: 18px;*/
    /*letter-spacing: 1px;*/
    /*border-bottom: 1px solid #FFFFFF;*/
  /*}*/

  .reseller-menus .weui_cell:nth-child(1) {
    background: #538DE2;
  }

  .reseller-menus .weui_cell:nth-child(2) {
    background: #38BD00;
  }

  .reseller-menus .weui_cell:nth-child(3) {
    background: #B9B8B9;
  }


</style>
<style>

  .main .weui_cell .weui_cell_bd p {
    font-size: 20px;
    color: #3e3b3b;
    font-weight: normal;
    text-indent: 5px;
  }

  .weui_input {
    text-align: center;
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid #efefef;
  }



</style>
