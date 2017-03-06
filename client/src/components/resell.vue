<template>
  <div>
    <div class="header">
      <div class="title-block">
        <h1 class="title over-ellipsis">{{ $t('header.reseller.title') }}</h1>
        <div class="sub-title-block" v-if="reseller">
          <p class="sub-title">{{ $t('header.reseller.reseller_id') }}: {{ reseller.telephone }}</p>
          <p class="sub-title">{{ $t('header.reseller.status') }}: {{ status_string }}</p>
        </div>

      </div>

    </div>
    <div class="mar-top-20"></div>
    <router-view></router-view>
  </div>
</template>

<script lang="babel">
  import {mapGetters, mapActions} from 'vuex'
  import rbac from '../utils/rbac/index'
  import generateURL from '../utils/routers'

  export default{
    data(){
      return {
        reseller: null
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser']),
      status_string() {
        if (this.reseller) {
          return this.$t(`header.reseller.status_value.${ this.reseller.business.status }`)
        }
        return '';
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
        self.$dispatch('IS_SHOWING_LOADING',true, self.$t('loading.text'));
        this.$ajax.getReseller()
                .then((reseller_data) => {
                  self.$dispatch('IS_SHOWING_LOADING',false, self.$t('loading.text'));
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
                })
      }
    }
  }
</script>

<style scoped>
  /*@import '/static/css/content.css';*/

  body {
    background: #FFFFFF;
  }

  .content {
    width: 100%;
    background: #efeff4;
    overflow-x: hidden;
    overflow-y: scroll;
  }
</style>
