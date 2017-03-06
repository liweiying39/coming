<template>
  <div class="header">
    <div class="title-block" v-if="event">
      <div class="title-panel" v-if="getCurrentUserInfo.role != 'manager'">
        <h1 class="title over-ellipsis">{{ event.name }}</h1>
      </div>

      <!--manager显示可修改按钮-->
      <div class="title-panel" v-if="getCurrentUserInfo.role == 'manager'">
        <div class="title-block-left">
          <h1 class="title over-ellipsis">{{ event.name }}</h1>
        </div>
        <div class="title-block-right">
          <img class="add-popup" src="/static/img/edit.png" @click="jumpToUpdateEvent">
        </div>
      </div>

      <div class="sub-title-block">
        <div class="sub-title-left">
          <p class="sub-title work-break-all">{{ $t('header.event.time') }}:
            {{ $t('time', event.start_time.getTimeList())}}
          </p>
          <p class="sub-title work-break-all">{{ $t('header.event.place') }}: {{ event.place }}</p>
        </div>
        <div class="sub-title-right">
          <span class="interested-count">{{ event.interested_count }}</span>
          <p class="interested-text">{{ $t('header.event.interested')}}</p>
        </div>
      </div>

    </div>
  </div>
  <div v-if="event">
    <div class="notice-block">
      <template v-for="item in event_news">
        <div class="notice-message-block animated" transition="slide">
          {{ noticeText(item) }}
        </div>
      </template>
    </div>
  </div>

  <div class="content" v-if="event" style="background:#efeff4 ;">

    <!--current_user-->
    <cell :title="getCurrentUserInfo.name"
          :link="generateURL('PROFILE', {query:{event_id:event_id,interested_count: event.interested_count}})"
          is-link>
      <div slot="after-title">
        <p class="cell-sub-title over-ellipsis">{{ getCurrentUser.job_title }}</p>
        <p class="cell-sub-title over-ellipsis">{{ getCurrentUser.organization }}</p>
      </div>
      <div slot="icon">
        <strong class="mark" v-if="getCurrentUserInfo.role == 'manager'"></strong>
        <div class="participant-avatar-block">
          <img class="own-img avatar-img" :src="getCurrentUser.avatar">
        </div>
      </div>
      <div slot="value">
        <div class="mar-right-10" v-if="event">
          <span class="like-count"><span class="likes-count-num">{{ getCurrentUserInfo.likes }}</span>{{ $t('event.likes') }}</span>
        </div>
      </div>
      <div slot="child">
        <div class="mar-right-10">
          <span v-if="checkUserStatus('is_rsvp',getCurrentUserInfo.status)" class="icon-label rsvp">
            {{ $t('status.rsvp') }}
          </span>
          <span v-if="checkUserStatus('is_checkin',getCurrentUserInfo.status)" class="icon-label checked-in">
          {{ $t('status.checked_in') }}
          </span>
          <span v-if="checkUserStatus('is_checkout',getCurrentUserInfo.status)" class="icon-label checked-out">
          {{ $t('status.checked_out') }}
          </span>
        </div>
      </div>
    </cell>

    <router-view></router-view>
    <!--interested-->
    <!--<div class="content-section">-->
      <!--<div class="content-section-nav" @click="showCollse('interested')">-->
        <!--{{ $t('event.classify.interested') }}-->
        <!--<div class="badge-blcok">-->
          <!--<div class="badge" :text="getParticipants.length.toString()">{{ getParticipants.length.toString() }}</div>-->
        <!--</div>-->
        <!--<div class="arrow-block">-->
          <!--<img :src="collse['interested'] ? '../../static/img/arrow-top.png' : '../../static/img/arrow-bottom.png'">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="content-section-container" v-if="collse['interested']">-->
        <!--<template v-for="user in getParticipants">-->
          <!--<cell :title="user.name" :link="jumpToProfileOrUser(user)" is-link>-->
            <!--<div slot="after-title">-->
              <!--<p class="cell-sub-title over-ellipsis">{{ user.information.job_title }}</p>-->
              <!--<p class="cell-sub-title over-ellipsis">{{ user.information.organization }}</p>-->
            <!--</div>-->
            <!--<div slot="icon">-->
              <!--&lt;!&ndash;<strong class="mark" v-if="$index == 0 && getCurrentUserInfo.role != 'manager'"></strong>&ndash;&gt;-->
              <!--<strong class="mark" v-if="user.role == 'manager'"></strong>-->
              <!--<div class="participant-avatar-block">-->
                <!--<img class="avatar-img" :src="user.avatar">-->
              <!--</div>-->
            <!--</div>-->

            <!--<div slot="value">-->
              <!--<div class="mar-right-10">-->
            <!--<span class="like-count">-->
              <!--<span class="likes-count-num">{{ user.likes }}</span> {{ $t('event.likes') }}-->
            <!--</span>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div slot="child">-->
              <!--<div class="mar-right-10">-->
            <!--<span v-if="checkUserStatus('is_rsvp', user.status)" class="icon-label rsvp">-->
              <!--{{ $t('status.rsvp') }}-->
            <!--</span>-->
                <!--<span v-if="checkUserStatus('is_checkin',user.status)" class="icon-label checked-in">-->
            <!--{{ $t('status.checked_in') }}-->
            <!--</span>-->
                <!--<span v-if=" checkUserStatus('is_checkout',user.status)" class="icon-label checked-out">-->
            <!--{{ $t('status.checked_out') }}-->
            <!--</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</cell>-->
        <!--</template>-->
        <!--<div class="mar-top-20">-->
          <!--<div class="loading-btn" @click="loadMore">{{ loading_text }}</div>-->
          <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
        <!--</div>-->
      <!--</div>-->

    <!--</div>-->

    <!--rsvp-->
    <!--<div class="content-section">-->
      <!--<div class="content-section-nav" @click="showCollse('rsvp')">-->
        <!--{{ $t('event.classify.rsvp') }}-->
        <!--<div class="badge-blcok">-->
          <!--<div class="badge" :text="getRsvp.length.toString()">{{ getRsvp.length.toString() }}</div>-->
        <!--</div>-->
        <!--<div class="arrow-block">-->
          <!--<img :src="collse['rsvp'] ? '../../static/img/arrow-top.png' : '../../static/img/arrow-bottom.png'">-->
        <!--</div>-->
      <!--</div>-->

      <!--<div class="content-section-container" v-if="collse['rsvp']">-->
        <!--<template v-for="user in getRsvp">-->
          <!--<cell :title="user.name" :link="jumpToProfileOrUser(user)" is-link>-->
            <!--<div slot="after-title">-->
              <!--<p class="cell-sub-title over-ellipsis">{{ user.information.job_title }}</p>-->
              <!--<p class="cell-sub-title over-ellipsis">{{ user.information.organization }}</p>-->
            <!--</div>-->
            <!--<div slot="icon">-->
              <!--<strong class="mark" v-if="user.role == 'manager'"></strong>-->
              <!--<div class="participant-avatar-block">-->
                <!--<img class="avatar-img" :src="user.avatar">-->
              <!--</div>-->
            <!--</div>-->

            <!--<div slot="value">-->
              <!--<div class="mar-right-10">-->
            <!--<span class="like-count">-->
              <!--<span class="likes-count-num">{{ user.likes }}</span> {{ $t('event.likes') }}-->
            <!--</span>-->
              <!--</div>-->
            <!--</div>-->
            <!--<div slot="child">-->
              <!--<div class="mar-right-10">-->
            <!--<span v-if="checkUserStatus('is_rsvp', user.status)" class="icon-label rsvp">-->
              <!--{{ $t('status.rsvp') }}-->
            <!--</span>-->
                <!--<span v-if="checkUserStatus('is_checkin',user.status)" class="icon-label checked-in">-->
            <!--{{ $t('status.checked_in') }}-->
            <!--</span>-->
                <!--<span v-if=" checkUserStatus('is_checkout',user.status)" class="icon-label checked-out">-->
            <!--{{ $t('status.checked_out') }}-->
            <!--</span>-->
              <!--</div>-->
            <!--</div>-->
          <!--</cell>-->
        <!--</template>-->
        <!--<div class="mar-top-20">-->
          <!--<div class="loading-btn" @click="loadMore">{{loading_text}}</div>-->
          <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
        <!--</div>-->
      <!--</div>-->
    </div>

    <!--checkedin-->
    <!--<div class="content-section">-->
      <!--<div class="content-section-nav" @click="showCollse('checkedin')">-->
        <!--{{ $t('event.classify.checked_in') }}-->
        <!--<div class="badge-blcok">-->
          <!--<div class="badge" :text="getCheckin.length.toString()">{{getCheckin.length.toString() }}</div>-->
        <!--</div>-->
        <!--<div class="arrow-block">-->
          <!--<img :src="collse['checkedin'] ? '../../static/img/arrow-top.png' : '../../static/img/arrow-bottom.png'">-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="content-section-container" v-if="collse['checkedin']">-->
        <!--<div class="content">-->
          <!--<template v-for="user in getCheckin">-->
            <!--<cell :title="user.name" :link="jumpToProfileOrUser(user)" is-link>-->
              <!--<div slot="after-title">-->
                <!--<p class="cell-sub-title over-ellipsis">{{ user.information.job_title }}</p>-->
                <!--<p class="cell-sub-title over-ellipsis">{{ user.information.organization }}</p>-->
              <!--</div>-->
              <!--<div slot="icon">-->
                <!--<strong class="mark" v-if="user.role == 'manager'"></strong>-->
                <!--<div class="participant-avatar-block">-->
                  <!--<img class="avatar-img" :src="user.avatar">-->
                <!--</div>-->
              <!--</div>-->

              <!--<div slot="value">-->
                <!--<div class="mar-right-10">-->
            <!--<span class="like-count">-->
              <!--<span class="likes-count-num">{{ user.likes }}</span> {{ $t('event.likes') }}-->
            <!--</span>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div slot="child">-->
                <!--<div class="mar-right-10">-->
            <!--<span v-if="checkUserStatus('is_rsvp', user.status)" class="icon-label rsvp">-->
              <!--{{ $t('status.rsvp') }}-->
            <!--</span>-->
                  <!--<span v-if="checkUserStatus('is_checkin',user.status)" class="icon-label checked-in">-->
            <!--{{ $t('status.checked_in') }}-->
            <!--</span>-->
                  <!--<span v-if=" checkUserStatus('is_checkout',user.status)" class="icon-label checked-out">-->
            <!--{{ $t('status.checked_out') }}-->
            <!--</span>-->
                <!--</div>-->
              <!--</div>-->
            <!--</cell>-->
          <!--</template>-->
          <!--<div class="mar-top-20">-->
            <!--<div class="loading-btn" @click="loadMore">{{loading_text}}</div>-->
            <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->

    <!--most tag-->
    <!--<div class="content-section">-->
      <!--<div class="content-section-nav" @click="showCollse('most_tag')">-->
        <!--{{ $t('event.classify.most_tagged') }}-->
        <!--<div class="badge-blcok">-->
          <!--<div class="badge" :text="getTopLikes.length.toString()">{{ getTopLikes.length.toString() }}</div>-->
        <!--</div>-->
        <!--<div class="arrow-block">-->
          <!--<img :src="collse['most_tag'] ? '../../static/img/arrow-top.png' : '../../static/img/arrow-bottom.png'">-->
        <!--</div>-->
      <!--</div>-->
      <!--<div class="content-section-container" v-if="collse['most_tag']">-->
        <!--<div class="content">-->
          <!--<template v-for="user in getTopLikes">-->
            <!--<cell :title="user.name"-->
                  <!--:link="jumpToProfileOrUser(user)"-->
                  <!--is-link>-->
              <!--<div slot="after-title">-->
                <!--<p class="cell-sub-title over-ellipsis">{{ user.information.job_title }}</p>-->
                <!--<p class="cell-sub-title over-ellipsis">{{ user.information.organization }}</p>-->
              <!--</div>-->
              <!--<div slot="icon">-->
                <!--<strong class="mark" v-if="user.role == 'manager'"></strong>-->
                <!--<div class="participant-avatar-block">-->
                  <!--<img class="avatar-img" :src="user.avatar">-->
                <!--</div>-->
              <!--</div>-->

              <!--<div slot="value">-->
                <!--<div class="mar-right-10">-->
            <!--<span class="like-count">-->
              <!--<span class="likes-count-num">{{ user.likes }}</span> {{ $t('event.likes') }}-->
            <!--</span>-->
                <!--</div>-->
              <!--</div>-->
              <!--<div slot="child">-->
                <!--<div class="mar-right-10">-->
            <!--<span v-if="checkUserStatus('is_rsvp', user.status)" class="icon-label rsvp">-->
              <!--{{ $t('status.rsvp') }}-->
            <!--</span>-->
                  <!--<span v-if="checkUserStatus('is_checkin',user.status)" class="icon-label checked-in">-->
            <!--{{ $t('status.checked_in') }}-->
            <!--</span>-->
                  <!--<span v-if=" checkUserStatus('is_checkout',user.status)" class="icon-label checked-out">-->
            <!--{{ $t('status.checked_out') }}-->
            <!--</span>-->
                <!--</div>-->
              <!--</div>-->
            <!--</cell>-->
          <!--</template>-->
          <!--<div class="mar-top-20">-->
            <!--<div class="loading-btn" @click="loadMore">{{ loading_text }}</div>-->
            <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
  </div>
  <div class="mar-top-20 link-block">
    <div class="loading-btn link-block-left"><a class="link-to-event" href="http://dropmeet.chatek.co">Get Dropmeet</a>
    </div>
    <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
  </div>


  <confirm :show.sync="is_showing_confirm_sharing" :title="$t('dialog.is_sharing_info.title')"
           :confirm-text="$t('dialog.is_sharing_info.confirm_text')"
           :cancel-text="$t('dialog.is_sharing_info.cancel_text')"
           @on-cancel="confirmShareCancel" @on-confirm="confirmShareOk">
    <!--<p>You are about to share you WeChart avatar,nickname,and geo-tag to other people you-->
    <!--may not know who also intersted in this event</p>-->
    <!--<p>You can stop sharing aboved data anytime afterwards if you choose to.</p>-->
    <p>{{ $t('dialog.is_sharing_info.content') }}</p>
  </confirm>

  <i-form-dialog :header="dialog_enter.header" :warn_msg="dialog_enter.warn_msg"
                 :list.sync="dialog_enter.list" :cancel_text="dialog_enter.cancel_text"
                 :confirm_text="$t('dialog.enter_info.confirm_text')">
  </i-form-dialog>


  <i-footer :btn_active="footer_btn_active" :user_active="footer_btn_user">
    <div slot="popup_menus" v-if="checkUserIdentity('participant')">
      <div class="popup-container participant-activated">
        <cell v-if="is_showing_rsvp" :title="change_rsvp_status ?  $t('footer_menus.event.participant.not_going') :
                $t('footer_menus.event.participant.rsvp')"
              :class="[change_rsvp_status ? 'is_notgoing_class' : 'is_rsvp_class']"
              @click="popUpDialogShow('telephone_code')">
        </cell>
        <cell :title="is_checkin_status ? $t('footer_menus.event.checked_out') :
        $t('footer_menus.event.checked_in')" :class="[is_checkin_status ? 'is_checkout_class ' : 'is_checkin_class']"
              @click="updateCheckinStatus">
        </cell>
        <cell :title="$t('footer_menus.event.participant.stop_sharing')" @click="stopSharingLeave"></cell>
      </div>
    </div>

    <div slot="popup_menus" v-if="checkUserIdentity('manager')">
      <div class="popup-container manager-activated">
        <cell :title="$t('footer_menus.event.manager.stats')" @click="jumpToStats"></cell>
        <cell :title="is_checkin_status ? $t('footer_menus.event.checked_out') :
        $t('footer_menus.event.checked_in')" :class="[is_checkin_status ? 'is_checkout_class ' : 'is_checkin_class']"
              @click="updateCheckinStatus">
        </cell>
      </div>
    </div>
  </i-footer>

</template>


<script lang="babel">
  import iFooter from './com-components/Footer/Index.vue'
  import iFormDialog from './com-components/Dialog/Index.vue'

  import Cell from 'vux/src/components/cell'
  import XButton from 'vux/src/components/x-button'
  import Confirm from 'vux/src/components/confirm'
  import Badge from 'vux/src/components/badge'

  import generateURL from '../utils/routers'
  import { mapActions, mapGetters } from 'vuex'

  import frontend_config from '../config.js';

  import co from 'co';

  // 引入vue-animate样式文件
  require('vue-animate/dist/vue-animate.min.css');

  export default{
    components: {
      iFooter,
      Cell,
      XButton,
      iFormDialog,
      Confirm,
      Badge
    },
    data(){
      return {
        event: null,
        event_id: null,

        is_showing_notice: false,

        // current_user='manager'时，只显示manager信息，不显示own information的信息
        is_showing_own_information: false,
        is_showing_confirm_sharing: false,
        collse: {
          rsvp: false,
          checkedin: false,
          interested: false,
          most_tag: false
        },

        // loading的三种状态
        is_showing_loading_icon: false,
//        loading_status: 'more',
        loading_text: this.$t('more_status'),
        is_showing_more_btn: true,
        page_num: 1,

        footer_btn_active: false,
        footer_btn_user: true,

        max_news_count: 1,
        max_news_stay_time: 3000,

        dialog_type: 'job_organization',  // update event dialog or telephone dialog
      }
    },
    transitions: {
      slide: {
        enterClass: 'fadeInRight',
        leaveClass: 'fadeOutLeft'
      },
      zoom: {
        enterClass: 'zoomDown',
        leaveClass: 'zoomUp'
      },
      bounce: {
        enterClass: 'bounceDown',
        leaveClass: 'bounceUp'
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser', 'getEventNews', 'getTopLikes', 'getActiveEventId', 'getActiveEventInfo',
        'getParticipants', 'getCurrentUserInfo', 'getRsvp', 'getCheckin']),
      // event && event users
      dialog_enter() {
        if (this.dialog_type == 'job_organization') {
          return {
            header: this.$t('dialog.enter_info.header'),
            warn_msg: this.$t('dialog.enter_info.warn_msg'),
            list: [
              {
                title: this.$t('dialog.enter_info.job_title'),
                placeholder: '',
                value: null
              },
              {
                title: this.$t('dialog.enter_info.organization'),
                placeholder: '',
                value: null
              }
            ],
            cancel_text: ''
          }
        } else if (this.dialog_type == 'telephone') {
          return {
            header: this.$t('dialog.enter_telephone.header'),
            warn_msg: this.$t('dialog.enter_telephone.warn_msg_verification_code'),
            list: [
              {
                title: this.$t('dialog.enter_telephone.tel'),
                placeholder: this.$t('dialog.enter_telephone.tel_placeholder'),
                value: null
              },
              {
                type: 'button',
                text: this.$t('button.verification_code'),
                class_name: 'btn_primary'
              },
              {
                title: '',
                placeholder: this.$t('dialog.enter_telephone.verification_code_placeholder'),
                value: null,
              }
            ],
            cancel_text: this.$t('dialog.cancel_text')
          }
        } else if (this.dialog_type == 'invite_code') {
          return {
            header: this.$t('dialog.invite_code.header'),
            warn_msg: this.$t('dialog.invite_code.warn_msg'),
            list: [
              {
                title: this.$t('dialog.invite_code.title'),
                placeholder: this.$t('dialog.invite_code.placeholder'),
                value: null
              }
            ],
            cancel_text: this.$t('dialog.cancel_text')
          }
        }

      },

      change_rsvp_status() {
        return (this.getCurrentUserInfo && this.getCurrentUserInfo.status.is_rsvp);
      },

      footer_btn_active() {
        if (this.getCurrentUserInfo)
          return (this.getCurrentUserInfo.role === 'manager' || this.getCurrentUserInfo.role === 'participant');
        return false;
      },
      is_checkin_status() {
        if (this.getCurrentUserInfo)
          return this.getCurrentUserInfo.status.is_checkin;
        return false;
      },
      is_showing_rsvp() {
        if (this.getCurrentUserInfo)
          return (!this.getCurrentUserInfo.status.is_checkin && !this.getCurrentUserInfo.status.is_checkout);
        return false;
      },
      // 即时通信
      event_news() {
        if (this.$store.state.event_news.news_group[this.event_id]) {
          return this.$store.state.event_news.news_group[this.event_id].slice(0, this.max_news_count);
        }
        return [];
      },
      is_showing_news() {
        return Boolean(this.event_news.length);
      },
    },


    ready() {
      this.event_id = this.$route.params.id;

      this.$$timer.bind(this).start(this.event_id);

      const self = this;
      const args = {
        options: {
          params: {
            url: location.href.split('#')[0],
            sdk: JSON.stringify(['onMenuShareAppMessage', 'onMenuShareTimeline'])
          }
        }
      };

      self.$ajax.getJsConfig(args)
        .then(function (config) {
          wx.config(config);

          wx.ready(function () {
            wx.onMenuShareAppMessage({
              title: self.event.name, // 分享标题
              desc: self.$t('time', self.event.start_time.getTimeList()) + '\n' + self.$t('event.from') + '<' +
                    self.getCurrentUser.name + '>', // 分享描述
              link: `${frontend_config.host_address}/#!/?share=${self.event_id}`, // 分享链接
              imgUrl: `${frontend_config.host_address}/static/img/chatek_logo.png`,
              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });

            wx.onMenuShareTimeline({
              title: self.event.name, // 分享标题
              link: url, // 分享链接
              imgUrl: `${frontend_config.host_address}/img/comingly.png`, // 分享图标
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });
          });
        });

    },
    methods: {
      generateURL: generateURL,
      ...mapActions(['updateCurrentUser', 'shiftEventNews', 'updateActiveEvent', 'updateActiveEventUsers',
        'updateCurrentUserRole', 'increaseEventPageNum']),


      //test
      showCollse(target) {
        let self = this;
        Object.keys(this.collse).some((element, index, array) => {
          return this.collse[element];
        });
        Object.keys(this.collse).forEach((element, index, array) => {
          if (element != target)
            self.collse[element] = false;
        });
        this.collse[target] = !this.collse[target];
      },

      onlyOneCollseShow(target) {
      },

      checkUserIdentity(key){
        return (this.getCurrentUserInfo && this.getCurrentUserInfo.role === key);
      },
      checkUserStatus(key, obj){
        return Boolean(obj[key]);
      },
      popUpDialogShow(type) {
        let self = this;

        /**
         * job && organization，telephone,invite_code 的填写共用一个dialog,
         * 如果当前用户已经了telephon && invite code时，直接修改状态即可
         * 如果当前用户没有填写telephone时，用户rsvp时，让用户填写telephone以及验证，进一步填写invite code
         * 当用户已经填写了telephone时，直接填写invite code
         * 当用户not going时,此时不需要弹窗，只需要改写状态
         */
        function updateCurrentRsvpStatus () {
          let args = {
            path: {
              event_id: self.event_id
            },
            body: {
              is_rsvp: (!self.change_rsvp_status).toString()
            }
          };
          self.$ajax.updateCurrentStatus(args)
            .then((user_data) => {
              self.change_rsvp_status = user_data.event.status.is_rsvp;
              self.getCurrentUserInfo.status.is_rsvp = user_data.event.status.is_rsvp;

            })
            .catch((res) => {
              self.$$utils.handleError(res, {
                'default': () => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                    self.$t('error.default.content'));
                },
                [422]: (err) => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('event_is_start_error'));
                }
              })
            })
        }

        if (type == 'job_organization') {
          self.dialog_type = 'job_organization';
          this.dialog_enter.list[0].value = this.getCurrentUser.job_title;
          this.dialog_enter.list[1].value = this.getCurrentUser.organization;
          this.$broadcast('DIALOG_SHOW');
          self.$broadcast('cancel');
        } else if (type == 'telephone_code') {
          if (self.getCurrentUserInfo.status.is_invited) {
            updateCurrentRsvpStatus();
            self.$broadcast('cancel');
            return;
          }

          let telephone = self.getCurrentUser.telephone;
          if (telephone) {
            self.dialog_type = 'invite_code';
            self.$broadcast('DIALOG_SHOW');
            self.$broadcast('cancel');
          } else {
            // 判断是否RSVP =》 NOT going || not going => rsvp 如果是前者，直接修改状态即可
            if (!self.change_rsvp_status) {
              self.dialog_type = 'telephone';
              self.$broadcast('DIALOG_SHOW');
            } else if (self.change_rsvp_status) {
              updateCurrentRsvpStatus();
            }
          }
        }
      },
      confirmShareOk(){
        // 确定分享后，用户填写job title && organization
        let self = this;
        this.$ajax.followEvent({ body: { event_id: self.event_id } })
          .then((data) => {
            self.interested_count = self.interested_count + 1;

            self.updateCurrentUserRole();
            this.is_showing_confirm_sharing = false;
            this.current_user = data;
            this.is_showing_own_information = this.getCurrentUserInfo.role === 'participant';
            if (!this.getCurrentUser.job_title && !this.getCurrentUser.organization) {
              self.popUpDialogShow('job_organization');
            }
            this.$$cache.clear('events');
            self.updateActiveEventUsers({
              current_user: data,
              participants: []
            });
          }).catch((res) => {
          this.$$utils.handleError(res, {
            'default': () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
            }
          })
        })
      },
      confirmShareCancel() {
        this.$router.go(generateURL('INDEX'));
        /**
         * jump to another website if this event have a url
         */
      },

      updateCheckinStatus() {
        let self = this;
        let args = {
          path: {
            event_id: self.event_id
          },
          body: {
            is_checkin: (!self.getCurrentUserInfo.status.is_checkin).toString()
          }
        };
        self.$ajax.updateCurrentStatus(args)
          .then((res) => {
            if (self.getCurrentUserInfo.role == 'manager') {
              self.manager.status.is_checkin = res.event.status.is_checkin;
              self.manager.status.is_checkout = res.event.status.is_checkout;
            }
            self.getCurrentUserInfo.status.is_checkin = res.event.status.is_checkin;
            self.getCurrentUserInfo.status.is_checkout = res.event.status.is_checkout;
          })
          .catch((res) => {
            this.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                  self.$t('error.default.content'));
              },
              [422]: (err) => {
                if (err.data.message == 'early')
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('event_not_start_error'));
                else if (err.data.message == 'late')
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('event_has_end_error'));
              }
            })
          });
        self.$broadcast('cancel');
      },

      stopSharingLeave(){
        let self = this;
        self.$ajax.deleteEvent({ options: { body: { event_id: self.event_id } } })
          .then((res) => {
            /** deleteEvent时，重新清空localStorong中events的值 */
            self.$$cache.clear('events');
            self.$router.go(generateURL('INDEX'));
          })
          .catch((res) => {
            self.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          })
        self.$broadcast('cancel');
      },
      jumpToUpdateEvent() {
        let event_information = {
          name: this.event.name.trim(),
          place: this.event.place.trim(),
          start_time: new Date(this.event.start_time).getTime(),
          end_time: new Date(this.event.end_time).getTime(),
          event_id: this.event_id
        };
        this.$router.go(generateURL(
          'UPDATE_EVENT', { query: { event: JSON.stringify(event_information) } }));
      },
      jumpToStats() {
        this.$router.go(generateURL('EVENT_STATS', {
          query: {
            event_id: this.event_id,
            role: this.getCurrentUserInfo.role,
            interested_count: this.event.interested_count
          }
        }));
      },
      cancel(){
        this.$broadcast('cancel');
      },
      toggleNotice() {
        this.is_showing_notice_block = !this.is_showing_notice_block;
      },
      // 根据不同的提醒，显示不同的icon与text
      noticeText(notice) {
        let type = notice.sub_type;
        let from = notice.body.from;
        let value = notice.body.value.toString();

        return this.$t(`notice.${type}.${value}`, [from]);
      },
      loadMore() {
        let self = this;
        self.page_num++;
        self.is_showing_more_icon = true;

//        self.loading_status = 'loading';
        self.loading_text = self.$t('loading_status');
        let args = { path: { event_id: self.$route.params.id }, options: { params: { page: self.page_num } } };

        this.$ajax.getEventUsers(args)
          .then((data) => {
//            self.loading_status = 'more';
            self.is_showing_more_icon = false;
            self.loading_text = self.$t('more_status')
            if (!data.users.length) {
//              self.loading_status = 'end';
              self.loading_text = self.$t('end_status');
              self.page_num--;
            } else {
              self.updateActiveEventUsers(data.users);
              self.increaseEventPageNum();
            }

          })
      },
      // 判断用户的跳转，跳转到profile or user
      jumpToProfileOrUser(item) {
        let event_id = this.event_id;
        let interested_count = this.event.interested_count;
        let user_id = item.user_id;

        if (this.getCurrentUser.user_id == user_id) {
          return generateURL('PROFILE', {
            query: { event_id: event_id, interested_count: interested_count }
          });
        } else {
          return generateURL('USER', {
            params: { id: user_id },
            query: { event_id: event_id, interested_count: interested_count }
          });
        }
      }
    },
    events: {
      SAVE_INPUT(new_list){
        let self = this;

        // ajax请求错误提示
        let failure = {
          update_current_user_error: function (error) {
            self.$$utils.handleError(error, {
              [422]: () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.updateCurrentUser.title'),
                  self.$t('error.updateCurrentUser.content'))
              },
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          },
          put_user_telephone_error: function (error) {
            self.$$utils.handleError(error, {
              [404]: () => {      //phone number || verification code 错误时
                self.dialog_enter.warn_msg = self.$t('dialog.enter_telephone.warn_msg_verification_code');
                self.$broadcast('SHOW_WARN');
              },
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          },
          update_current_user_status_error: function (error) {
            self.$$utils.handleError(error, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              },
              [422]: (error) => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('event_is_start_error'));
              }
            })
          },
          update_invite_code_error: function (error) {
            self.$$utils.handleError(error, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              },
              [422]: (error) => {
                self.$dispatch('ShOW_ERROR', self.$t('error.default.title'), self.$t('error.invite_code.content'))
              }
            })
          }
        };

        // 弹出框是job && organizaton,先判断job && organization是否填写完整，更新currentuser的信息，然后更新state
        if (self.dialog_type == 'job_organization') {
          if (new_list[0] && new_list[1]) {
            self.$broadcast('HIDE_WARN');
            self.$broadcast('DIALOG_HIDDEN');
            let args = {
              body: {
                job_title: new_list[0].value,
                organization: new_list[1].value
              }
            };
            this.$ajax.updateCurrentUser(args)
              .then((user_data) => {
                this.updateCurrentUser({
                  job_title: user_data.job_title,
                  organization: user_data.organization
                })
              })
              .catch((res) => {
                failure.update_current_user_error(res);
              });
          } else {
            self.$broadcast('SHOW_WARN');
          }
        }

        // 弹出框是telephone
        // 当用户填写的验证信息与号码通过时，同时telephone存入数据库，更新state,弹出填写invite code
        if (self.dialog_type == 'telephone') {
          if (new_list[0].value && new_list[2].value) {
            self.$broadcast('HIDE_WARN');

            // 验证telephone && 验证码,同时存入数据库
            let args_tel_code = {
              body: {
                telephone: new_list[0].value,
                code: new_list[2].value
              }
            };
            self.$ajax.putUserTelephone(args_tel_code)
              .then((user_data)=> {
                if (user_data.done) {
                  self.$broadcast('DIALOG_HIDDEN');

                  // 更新state的currentUser telephone
                  let tel = user_data.data.new_telephone;
                  self.updateCurrentUser({
                    telephone: tel
                  });
                  // 弹出填写invite code
                  self.popUpDialogShow('telephone_code');
                }
              })
              .catch((error) => {
                failure.put_user_telephone_error(error);
              })
          } else {
            self.$broadcast('SHOW_WARN');
          }
        }

        // 弹出框为invite code，
        if (self.dialog_type == 'invite_code') {
          let invite_code = new_list[0].value;
          if (invite_code) {
            let args = {
              path: { event_id: self.event_id },
              body: { code: invite_code }
            };
            self.$ajax.updateInviteCode(args)
              .then((res) => {
                self.$store.commit('UPDATE_CURRENT_USER_INVITED', true);
                self.$broadcast('DIALOG_HIDDEN');
                // 填写invite code成功时，改变RSVP状态
                let args = {
                  path: { event_id: self.event_id },
                  body: { is_rsvp: (!self.change_rsvp_status).toString() }
                };
                this.$ajax.updateCurrentStatus(args)
                  .then((user_data) => {
                    self.change_rsvp_status = user_data.event.status.is_rsvp;
                    self.getCurrentUserInfo.status.is_rsvp = user_data.event.status.is_rsvp;
                  })
                  .catch((error) => {
                    failure.update_current_user_status_error(error);
                  })
              })
              .catch((error) => {
                console.log(error);
                failure.update_invite_code_error(error)
              })
          } else {
            self.$broadcast('SHOW_WARN');
          }
        }
      },

      CLICK_BUTTON(new_list) {
        // 请求发送短信验证
        let self = this;
        let telephone = new_list[0].value;

        if (telephone) {
          self.$broadcast('HIDE_WARN');
          let args = {
            body: {
              telephone: telephone
            }
          };
          self.$ajax.postUserTelephone(args)
        } else {
          self.$broadcast('SHOW_WARN');
        }


      }
    }
    ,

    route: {
      deactivate()
      {
        this.$$timer.stop();
      },
      data(transition){

        let self = this;
        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));

        let event_id = self.$route.params.id;

        let args1 = { path: { event_id: event_id } };
        let args2 = { path: { event_id: event_id }, options: { params: { page: self.page_num } } };
        let failure = function (error) {
          self.$$utils.handleError(error, {
            'default': () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
            }
          })
        };


        // 首先从查找state里是否有数据，有就从state里拿，没有再ajax请求成功之后，把数据存入state
        if (this.getActiveEventId == event_id) {
          self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
          self.event = self.getActiveEventInfo;
          transition.next({
            is_showing_own_information: self.getCurrentUserInfo.role == 'participant',
            is_showing_confirm_sharing: self.getCurrentUserInfo.role == null,
            page_num: self.$store.state.active_event.page_num
          });
        } else {
          co(function* () {
            let event_data = yield self.$ajax.getEvent(args1);
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
            self.updateActiveEvent(event_data.event);

            let event_users = yield self.$ajax.getEventUsers(args2);
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
            self.updateActiveEventUsers(event_users.users);
          })
            .then(() => {
              self.event = self.getActiveEventInfo;
              transition.next({
                is_showing_own_information: self.getCurrentUserInfo.role == 'participant',
                is_showing_confirm_sharing: self.getCurrentUserInfo.role == null
              });
            })
            .catch((err) => {
              failure(err);
            });
        }
      }
    }
  }
</script>

<style scoped>
  body {
    min-height: 100%;
    background: #EFEFF4;
  }

  .content:after {
    content: '';
    height: 1px;
    display: block;
    /*border-bottom:1px solid #D9D9D9;*/
    /*background: #D9D9D9;*/
  }

  .title-panel {
    height: 30px;
    width: 100%;
  }

  .title-block-left {
    display: inline-block;
    width: 75%;
  }

  .title-block-right {
    display: inline-block;
    width: 20%;
    height: 100%;
    vertical-align: top;
    text-align: right;
    margin-top: 5px;
  }

  .add-popup {
    width: 20px;
    height: 20px;
  }

  /*.icon-label {*/
  /*padding: 4px 5px;*/
  /*font-size: 10px;*/
  /*line-height: 1em;*/
  /*color: #FFFFFF;*/
  /*display: block;*/
  /*margin-top: 8px;*/
  /*margin-left: 0*/
  /*}*/

  .weui_cell .mark {
    content: '';
    display: inline-block;
    width: 5px;
    background: #538DE2;
    height: 60px;
    /* right: 15px; */
    left: 10px;
    /*margin-top: 5px;*/
    padding: 0;
  }

  .avatar-block {
    margin-left: 0px;
    margin-right: 0px;
    display: inline-block;
  }

  .participant-avatar-block {
    margin-left: 10px;
    margin-right: 0px;
    display: inline-block;
  }

  .like-count {
    font-size: 14px;
    /*margin-right: 10px;*/
  }

  .likes-count-num {
    color: #e85151;
  }

  /*notice-block*/
  .notice-block {
    width: 100%;
    height: 20px;
    overflow: hidden;
    margin: 5px 0;
    /*height: 60px;*/
    /*background: #feffef;*/
    color: #000000;
    overflow: hidden;
    /*padding: 5px 0px;*/
    box-sizing: border-box;
  }

  .notice-message-block {
    width: 100%;
    height: 20px;
    font-size: 12px;
    text-align: left;
    text-indent: 20px;
    word-wrap: break-word;
    /*border-bottom:1px solid #D9D9D9;*/
  }

  .content-section-nav {
    height: 50px;
    background: #cccccc;
    line-height: 50px;
    margin: 5px 0px;
    box-sizing: border-box;
    text-indent: 5px;
    font-size: 18px;
  }

  .content-section-container {
    display: block;
    background: white;
    margin: 0 10px;
  }

  .arrow-block {
    display: inline-block;
    float: right;
    padding-right: 5px;
    line-height: 50px;
    width: 30px;
  }

  .arrow-block img {
    display: inline-block;
    width: 20px;
  }

  .link-block:after {
    content: '';
    width: 0;
    height: 0;
    clear: both;
  }

  .link-block-left {
    text-align: left;
    float: left;
    padding-left: 15px;
    width: 100px;
  }

  .link-block a {
    font-size: 12px;
    color: #666;
  }

  .badge-blcok {
    display: inline-block;
  }

  .notice-message-block:nth-child(odd) {
    background: lightyellow;
  }

  .notice-message-block:nth-child(even) {
    background: #fff7cf;
  }

  .participant-activated .weui_cell.is_rsvp_class {
    background: #38AF10;
  }

  .participant-activated .weui_cell.is_notgoing_class {
    background: #B05F6B;
  }

  .weui_cell.is_checkin_class {
    /*background: #ea9c3e;*/
    background: #de5a5a;
  }

  .weui_cell.is_checkout_class {
    background: #9B9B9B;
    /*background: #38BD00;*/
  }

  .participant-activated .weui_cell:nth-child(2) {
    /*background: #86D51C*/
    background: #538DE2;
  }

  .participant-activated .weui_cell:nth-child(3) {
    background: #B05F6B
  }

  .participant-activated .weui_cell:nth-child(4) {
    background: #B9B8B9
  }

  .manager-activated .weui_cell:nth-child(1) {
    background: #538DE2
  }

  .manager-activated .weui_cell:nth-child(3) {
    background: #B05F6B
  }

  .manager-activated .weui_cell:nth-child(4) {
    background: #B9B8B9
  }

  .badge-blcok .vue-badge-single {
    display: inline-block;
    width: 20px;
  }

  .badge {
    display: inline-block;
    padding: 0 5px 0 3px;
    height: 16px;
    line-height: 16px;
    border-radius: 8px;
    background: #e63131;
    color: white;
    font-size: 12px;
    text-align: center;
  }

  .content .loading-btn {
    height: 20px;
    margin-left: 50%;
    /* width: 100%; */
    width: 50%;
    text-align: right;
    padding-right: 15px;
    font-size: 12px;
    box-sizing: border-box;
    color: #666;
    text-decoration: underline;
  }

</style>


