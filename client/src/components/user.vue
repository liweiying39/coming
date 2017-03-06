<template>
  <div class="coming">
    <div class="header">
      <div class="title-block" v-if="user">
        <h1 class="title over-ellipsis">{{ user.event.information.name }}</h1>
        <div class="sub-title-block">
          <div class="sub-title-left">
            <p class="sub-title over-ellipsis">{{ $t('header.event.time') }}: {{ $t('time',
              (new Date(user.event.information.start_time)).getTimeList()) }}</p>
            <p class="sub-title over-ellipsis">{{ $t('header.event.place') }}: {{ user.event.information.place}}</p>
          </div>
          <div class="sub-title-right">
            <span class="interested-count">{{ interested_count }}</span>
            <p class="interested-text">{{ $t('header.event.interested') }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mar-top-20"></div>
    <div class="content" v-if="user">
      <cell :title="user.name">
        <div slot="after-title">
          <p class="cell-sub-title over-ellipsis">{{ user.information.job_title }}</p>
          <p class="cell-sub-title over-ellipsis">{{ user.information.organization }}</p>
        </div>
        <div slot="icon">
          <div class="mar-right-10">
            <img class="avatar-img" :src="user.avatar">
          </div>
        </div>
        <div slot="value">
          <div class="mar-right-10">
             <span class="like-count"><span
               class="likes-count-num">{{ user.event.likes }}</span> {{ $t('event.likes') }}</span>
          </div>
        </div>
        <div slot="child">
          <div class="mar-right-10">
              <span v-if="checkUserStatus('is_rsvp',user.event.status)" class="icon-label rsvp">
                {{ $t('status.rsvp') }}
                </span>
            <span v-if="checkUserStatus('is_checkin',user.event.status)" class="icon-label checked-in">
                {{ $t('status.checked_in') }}
              </span>
            <span v-if="checkUserStatus('is_checkout',user.event.status)" class="icon-label checked-out">
                {{ $t('status.checked_out') }}
              </span>
          </div>
        </div>
      </cell>
      <div class="cell-group mar-top-20">
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.i_offer') }}</span>{{user.information.i_need}}
            </p>
          </div>
        </cell>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.i_need') }}</span>{{user.information.i_offer}}
            </p>
          </div>
        </cell>
      </div>

      <div class="cell-group">
        <div class="mar-top-20"></div>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.last_show_time') }}</span>
            </p>
          </div>
          <div slot="value">
            <!--<switch :value.sync="user.event.is_sharing_showup" title="" disabled></switch>-->
          </div>
        </cell>

        <cell v-if="user.event.is_sharing_showup">
          <div slot="icon">
            <div>
              <p class="need-offter">{{ $t('time', (user.event.last_showup_time).getTimeList()) }} </p>
              <p class="need-offter">{{ user.event.last_showup_location}}</p>
            </div>
          </div>
        </cell>
      </div>

      <div class="btn-block mar-top-20">
        <x-button v-if="user.event" class="mar-top-20 like" :class="like_button_class" @click="changeLike">{{ likes }}
        </x-button>
        <x-button class="btn-default" @click="jumpToPrevPage">{{ $t('button.back') }}</x-button>
      </div>
    </div>

    <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active"></i-footer>
  </div>
</template>
<style>

</style>
<script lang="babel">

  import iFooter from './com-components/Footer/Index.vue'

  import Cell from 'vux/src/components/cell'
  import XButton from 'vux/src/components/x-button'
  import Group from 'vux/src/components/group'
  import Switch from 'vux/src/components/switch'

  import generateURL from '../utils/routers'
  import rbac from '../utils/rbac'
  import { mapActions, mapGetters } from 'vuex'

  export default{
    components: {
      iFooter,
      Cell,
      XButton,
      Switch
    },
    data(){
      return {
        user: null,
        is_liked: null,
        current_user: null,
        footer_btn_active: false,
        footer_user_active: true,
        is_showing_address: true
      }
    },
    computed: {
      interested_count() {
        return this.$route.query.interested_count;
      },
      likes() {
        if (this.user && this.is_liked)
          return this.$t('user.unlike');
        else
          return this.$t('user.like');
      },
      like_button_class() {
        if (this.user && this.is_liked)
          return 'unlikes-btn';
        else
          return 'likes-btn';
      },
      user_id() {
        return this.$route.params.id;
      },
      event_id() {
        return this.$route.query.event_id;
      }
    },
    methods: {
      generateURL: generateURL,
      ...mapActions(['updateUserTagCount']),
      checkUserStatus(key, obj) {
        return Boolean(obj[key]);
      },
      changeLike() {
        let self = this;

        let args = {
          path: { user_id: self.user_id },
          options: { params: { event_id: self.event_id } }
        };

        this.$ajax.putUserLikes(args)
          .then((res) => {

            this.user.event.is_liked = res;
            this.is_liked = res;
            let delta = res ? 1 : -1;
            this.user.event.likes += delta;
            if (this.user.event.likes < 0)
              this.user.event.likes = 0;
            //更新state的值
            self.updateUserTagCount({ event_id: self.event_id, user_id: self.user_id, delta: delta });

          })
          .catch((res) => {
            this.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          })
      },
      jumpToPrevPage() {
        window.history.back();
      }
    },
    route: {
      data(transition) {
        let self = this;
        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));

        if (self.event_id) {
          let args = {
            path: { user_id: self.user_id },
            options: { params: { event_id: self.event_id } }
          };
          this.$ajax.getOtherUser(args)
            .then((user_data) => {
              self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));

              transition.next({ user: user_data, is_liked: user_data.event.is_liked });
            })
            .catch((res) => {
              this.$$utils.handleError(res, {
                'default': () => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
                },
                [422]: () => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.user_not_following'));
                }
              })
            })
        }
      }
    }
  }
</script>

<style scoped>

  .coming {
    height: 100%;
    background: #efeff4;
  }

  .weui_cell {
    background: #FFFFFF;
  }

  .content {
    width: 100%;
    overflow: hidden;
    background: #EFEFF4;
  }

  .cell-icons {
    position: relative;
    margin-right: 10px;
  }

  /*.icon-label {*/
  /*padding: 4px 5px;*/
  /*font-size: 12px;*/
  /*line-height: 1em;*/
  /*color: #FFFFFF;*/
  /*display: block;*/
  /*margin-top: 8px;*/
  /*margin-left: 0*/
  /*}*/

  .likes-count-num {
    color: #e85151;
  }

  .need-offter {
    font-size: 15px;
    color: #000000;
    letter-spacing: 1px;
    line-height: 33px;
  }

  .offer-title {
    font-size: 17px;
    color: #666666;
  }

  .like {
    color: #FFFFFF;
    width: 90%;
    font-size: 18px;
    letter-spacing: 2px;
  }

  .likes-btn {
    background: #38BD00;
  }

  .unlikes-btn {
    background: #b05f6b;
  }

</style>
