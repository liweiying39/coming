<template>
  <div class="coming">
    <!--header-->
    <div class="header">
      <!--判断用户是从event page进来的，还是点击从头像进来-->
      <div class="title-block" v-if="!event">
        <h1 class="title over-ellipsis">{{ $t('header.profile.title') }}</h1>
        <div class="sub-title-block">
          <p class="sub-title managing over-ellipsis">{{ $t('header.profile.managing') }}:
            <span class="count">{{ getCurrentUser.managing_count }}</span>
          </p>
          <p class="sub-title over-ellipsis">{{ $t('header.profile.interested')}}:
            <span class="count"> {{ getCurrentUser.interesting_count }}</span>
            <!--<span class="sub-title my-rsvp">{{ $t('header.profile.rsvp') }}:-->
            <!--<span class="count"> {{ rsvp_count }}</span></span>-->
          </p>
        </div>
      </div>

      <div class="title-block" v-if="event">
        <h1 class="title over-ellipsis">{{ event.information.name }}</h1>
        <div class="sub-title-block">
          <div class="sub-title-left">
            <p class="sub-title over-ellipsis">{{ $t('header.event.time') }}:
              {{ $t('time', event.information.start_time.getTimeList()) }}
            </p>
            <p class="sub-title over-ellipsis">{{ $t('header.event.place') }}: {{ event.information.place}}</p>
          </div>
          <div class="sub-title-right">
            <span class="interested-count">{{ interested_count }}</span>
            <p class="interested-text">{{ $t('header.event.interested') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mar-top-20"></div>

    <!--content-->
    <div v-if="!$loadingRouteData" class="content">
      <cell :title="getCurrentUser.name">
        <div slot="icon" class="cell-icons">
          <div class="mar-right-10">
            <img class="avatar-img" :src="getCurrentUser.avatar">
          </div>
        </div>
        <div slot="value">
          <!--<img class="add-popup add-popup-inline" src="/static/img/add-popup.png" @click="showDialog('job')">-->
          <div class="mar-right-10" v-if="event">
              <span class="like-count"><span class="likes-count-num">{{ event.likes }}</span>
                {{ $t('event.likes') }}
              </span>
          </div>
        </div>
        <div slot="child">
          <div class="" v-if="event">
            <span v-if="checkUserStatus('is_rsvp',event.status)" class="icon-label rsvp">
              {{ $t('status.rsvp') }}
            </span>
            <span v-if="checkUserStatus('is_checkin',event.status)" class="icon-label checked-in">
              {{ $t('status.checked_in') }}
            </span>
            <span v-if="checkUserStatus('is_checkout',event.status)"
                  class="icon-label checked-out">
              {{ $t('status.checked_out') }}
            </span>
          </div>
        </div>
      </cell>

      <div class="cell-group lange-selected-box">
        <div class="mar-top-20"></div>
        <selector :title="$t('user.lang_title')" :options="lang_list" :value.sync="lang_current"
                  @on-change="changeLanguage"></selector>
      </div>

      <div class="cell-group">
        <div class="mar-top-20"></div>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.job_title') }} </span>
              {{ getCurrentUser.job_title }}</p>
          </div>
          <div slot="value">
            <img class="add-popup" src="/static/img/edit.png" @click="showDialog('job')">
          </div>
        </cell>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.organization') }} </span>
              {{ getCurrentUser.organization }}</p>
          </div>
        </cell>
      </div>

      <div class="cell-group" v-if="event">
        <div class="mar-top-20"></div>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.i_need') }}</span>
              {{ event.i_need }} </p>
          </div>
          <div slot="value">
            <img class="add-popup" src="/static/img/edit.png" @click="showDialog('hobby')">
          </div>
        </cell>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.i_offer') }}</span>
              {{ event.i_offer }}</p>
          </div>
        </cell>
      </div>

      <div class="cell-group" v-if="event">
        <div class="mar-top-20"></div>
        <cell>
          <div slot="icon">
            <p class="need-offter"><span class="offer-title">{{ $t('user.last_show_time') }}</span>
            </p>
          </div>
          <div slot="value">
            <switch :value.sync="event.is_sharing_showup" title="" @on-change="changeLocationStatus"></switch>
          </div>
        </cell>

        <cell v-if="event.is_sharing_showup">
          <div slot="icon">
            <div>
              <p class="need-offter location-notice" v-if="last_showup_time == null">
                {{ $t('user.edit_last_showup') }}
              </p>
              <p class="need-offter">{{ last_showup_time }}</p>
              <p class="need-offter">{{ event.last_showup_location}}</p>
            </div>

          </div>
          <div slot="value">
            <img class="add-popup" src="/static/img/edit.png" @click="showDialog('time_place')">
          </div>
        </cell>
      </div>

      <div class="btn-block mar-top-20">
        <x-button v-if="event" :class="[event.status.is_checkin ? 'btn-checkout': 'btn-info']" @click="updateStatus">
          {{ event.status.is_checkin ? $t('button.checked_out') : $t('button.checked_in') }}
        </x-button>
        <x-button class="btn-default" @click="jumpToPrevPage">{{ $t('button.back') }}</x-button>
      </div>

      <i-form-dialog :header="dialog.header" :list.sync="dialog.list" :warn_msg="warn_msg"
                     :cancel_text="$t('dialog.change_info.cancel_text')"
                     :confirm_text="$t('dialog.change_info.confirm_text')">
      </i-form-dialog>
    </div>

    <div class="notice-block" v-if="notice_messages.length">
      <div class="notice-block-header" @click="noticeBlockToggle">
        未读信息
      </div>
      <div class="notice-content" v-if="is_showing_notice_block">
        <template v-for="notice in notice_messages">
          <div class="notice-info"> {{ noticeText(notice) }}</div>
        </template>
        <div class="mar-top-20">
          <div class="loading-btn" @click="loadMore">{{ loading_text }}</div>
          <div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>
        </div>


      </div>
    </div>

    <i-footer :btn_active="btn_active" :user_active="user_active"></i-footer>
  </div>
</template>

<script lang="babel">
  import iFooter from './com-components/Footer/Index.vue'
  import iFormDialog from './com-components/Dialog/Index.vue'

  import Cell from 'vux/src/components/cell'
  import XButton from 'vux/src/components/x-button'
  import Group from 'vux/src/components/group'
  import Switch from 'vux/src/components/switch'
  import Datetime from 'vux/src/components/datetime'
  import Selector from 'vux/src/components/selector'

  import co from 'co'

  import { mapGetters, mapActions } from 'vuex'

  export default{
    components: {
      iFooter,
      Cell,
      XButton,
      Group,
      Switch,
      Datetime,
      iFormDialog,
      Selector
    },
    data(){
      return {
        btn_active: false,
        user_active: false,
        title: this.$t('header.profile.title'),

        //判断用户是否从event page进来的
        event: null,
        path_from_event: false,
        interested_count: null,

        //用户点击从头像进来时，获取event message没有读的信息
        notice_messages: [],
//        loading_status: 'more',
        page_num: 1,
        is_showing_loading_icon: false,

        loading_text: this.$t('more_status'),
        is_showing_notice_block: false,

        min_id: null,
        page_count: 20,

        showing_dialog_name: 'job',
        dialogs: {},

        //语言选择
        lang_list: [{ key: 'en', value: 'English' }, { key: 'zh_CN', value: '中文' }],
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser']),

      lang_current() {
        return this.$$locale.current();
      },

      dialogs() {
        return {
          job: {
            header: this.$t('dialog.change_info.job_org.title'),
            list: [
              {
                title: this.$t('dialog.change_info.job_org.job.title'),
                placeholder: this.$t('dialog.change_info.job_org.job.placeholder'),
                value: null
              },
              {
                title: this.$t('dialog.change_info.job_org.organization.title'),
                placeholder: this.$t('dialog.change_info.job_org.organization.placeholder'),
                value: null
              }
            ]
          },
          hobby: {
            header: this.$t('dialog.change_info.hobby.title'),
            list: [
              {
                title: this.$t('dialog.change_info.hobby.i_need.title'),
                placeholder: this.$t('dialog.change_info.hobby.i_need.placeholder'),
                value: null
              },
              {
                title: this.$t('dialog.change_info.hobby.i_offer.title'),
                placeholder: this.$t('dialog.change_info.hobby.i_offer.placeholder'),
                value: null
              }
            ]
          },
          time_place: {
            header: this.$t('dialog.change_info.time_place.title'),
            list: [
              {
                title: this.$t('dialog.change_info.time_place.last_showup_location.title'),
                placeholder: this.$t('dialog.change_info.time_place.last_showup_location.placeholder'),
                value: null
              }
            ]
          }
        }
      },
      last_showup_time() {
        if (this.event.last_showup_time)
          return this.$t('time', this.event.last_showup_time.getTimeList());
        else
          return null;
      },
      warn_msg() {
        if (this.showing_dialog_name == 'job')
          return this.$t('dialog.change_info.job_org.warn_msg');
        else if (this.showing_dialog_name == 'hobby')
          return this.$t('dialog.change_info.hobby.warn_msg');
        else if (this.showing_dialog_name == 'time_place')
          return this.$t('dialog.change_info.time_place.warn_msg');
        else
          return null;
      },
      dialog() {
        return this.dialogs[this.showing_dialog_name];
      }
    },
    methods: {
      ...mapActions(['updateCurrentUser', 'updateHasNoticeMessages']),
      checkUserStatus(key, obj) {
        return Boolean(obj[key]);
      },
      updateStatus() {
        let self = this;

        let args = {
          path: {
            event_id: self.event.event_id
          },
          body: {
            is_checkin: (!self.event.status.is_checkin).toString()
          }
        };
        this.$ajax.updateCurrentStatus(args)
          .then((res) => {
            self.event.status.is_checkin = res.event.status.is_checkin;
            self.event.status.is_checkout = res.event.status.is_checkout;
          })
          .catch((res) => {
              this.$$utils.handleError(res, {
                [422]: (res) => {
                  if (res.data.message == 'early')
                    self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('event_not_start_error'));
                  else if (res.data.message == 'late')
                    self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('event_has_end_error'));
                },
                'default': () => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                    self.$t('error.default.content'));
                }
              })
            }
          )
      },
      noticeText(notice) {
        let type = notice.content.sub_type;
        let from = notice.content.body.from;
        let value = notice.content.body.value.toString();

        let events = this.$$cache.load('events');
        for (let e of events) {
          if (e.event_id == notice.event_id)
            return this.$t(`messages.${type}.${value}`, [from, e.information.name]);
        }
        return this.$t(`messages.${type}.${value}`, [from, '']);
      },
      noticeBlockToggle() {

        this.is_showing_notice_block = !this.is_showing_notice_block;
      },
      loadMore() {
        let self = this;
        self.page_num++;
        self.is_showing_more_icon = true;

//        self.loading_status = 'loading';
        self.loading_text = self.$t('loading_status');

        co(function* () {
          let news_data = yield self.$ajax.getEventMessages({ options: { params: { page: self.page_num } } });

//          self.loading_status = 'more';
          self.loading_text = self.$t('more_status');
          if (!news_data.messages.length) {
//            self.loading_status = 'end';
            self.loading_text = self.$t('end_status');
            self.page_num--;
            self.updateHasNoticeMessages(false);
          } else {
            news_data.messages.forEach((news) => {
              self.notice_messages.push(news)
            });
            self.min_id = news_data.min_id;
          }
          yield self.$ajax.putMessagesRead({ body: { min_id: self.min_id } });
          self.is_showing_more_icon = false;

        })
          .catch((res) => {
            this.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                  self.$t('error.default.content'));
              }
            })
          })
      },
      changeLocationStatus() {
        let self = this;
        let args = {
          path: { event_id: self.event.event_id },
          body: { is_sharing_showup: (self.event.is_sharing_showup).toString() }
        };
        this.$ajax.updateCurrentStatus(args)
          .catch((res) => {
            this.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                  self.$t('error.default.content'));
              }
            })
          })
      },
      showDialog(dialog_name) {
        if (dialog_name === 'job') {
          this.dialogs[dialog_name].list[0].value = this.getCurrentUser.job_title;
          this.dialogs[dialog_name].list[1].value = this.getCurrentUser.organization;
        } else if (dialog_name === 'hobby') {
          this.dialogs[dialog_name].list[0].value = this.event.i_need;
          this.dialogs[dialog_name].list[1].value = this.event.i_offer;
        } else if (dialog_name === 'time_place') {
          this.dialogs[dialog_name].list[0].value = this.event.last_showup_location
        } else
          throw new Error('wrong dialog name');

        this.showing_dialog_name = dialog_name;
        this.$broadcast('DIALOG_SHOW');
      },
      jumpToPrevPage() {
        window.history.back();
      },
      //change language
      changeLanguage(val) {
        this.$$locale.change(val);
      }
    },
    events: {
      SAVE_INPUT(new_list) {
        let self = this;

        let failure = function (err) {
          self.$$utils.handleError(err, {
            [422]: () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.updateCurrentUser.title'),
                self.$t('error.updateCurrentUser.content'))
            },
            'default': () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                self.$t('error.default.content'));
            }
          })
        };
        let value1 = new_list[0].value;
        let value2;

        /** update last show up location */
        if (self.showing_dialog_name == 'time_place' && value1) {
          self.$broadcast('DIALOG_HIDDEN');
          let args = {
            path: { event_id: self.event.event_id },
            body: { last_showup_location: value1 }
          };
          return this.$ajax.updateCurrentStatus(args)
            .then((user_data) => {
              self.event.last_showup_location = user_data.event.last_showup_location;
              self.event.last_showup_time = user_data.event.last_showup_time;
            })
            .catch(failure);
        } else {
          self.$broadcast('SHOW_WARN');
        }

        if (self.showing_dialog_name != 'time_place') {
          value2 = new_list[1].value;
        }

        if (value1 && value2) {
          self.$broadcast('HIDE_WARN');
          self.$broadcast('DIALOG_HIDDEN');

          if (this.showing_dialog_name === 'job') {
            this.$ajax.updateCurrentUser(
              {
                body: {
                  job_title: value1,
                  organization: value2
                }
              })
              .then((user_data) => {
                this.updateCurrentUser({
                  job_title: user_data.job_title,
                  organization: user_data.organization
                });
              })
              .catch(failure);
          } else if (this.showing_dialog_name === 'hobby') {
            this.$ajax.updateCurrentStatus({
              path: {
                event_id: self.event.event_id
              },
              body: {
                i_need: value1, i_offer: value2
              }
            }).then((user_data) => {
              self.event.i_need = user_data.event.i_need;
              self.event.i_offer = user_data.event.i_offer;
            }).catch(failure);
          }
          else
            throw new Error('wrong showing_dialog_name');

        } else {
          self.$broadcast('SHOW_WARN');
        }
      }
    },
    route: {
      data(transition){
        const self = this;
        //判断用户是从event page进来，还是点击从头像进来，若是点击从头像进来，用户的头部信息从state里拿
        //若是点击event page进来，ajax请求数据
        if (transition.from.name !== 'event') {
          self.path_from_event = false;

          self.$ajax.getEventMessages({ options: { params: { page: self.page_num } } })
            .then((data) => {
              self.min_id = data.min_id;
              data.messages.forEach((news) => {
                self.notice_messages.push(news);
              })
            })

        }

        self.path_from_event = true;
        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));
        this.$ajax.getCurrentUser({ options: { params: { event_id: self.$route.query.event_id } } })
          .then((user_data) => {
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
            this.updateCurrentUser(user_data);
            transition.next({
              event: user_data.event,
              interested_count: self.$route.query.interested_count,
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

  body {
    min-height: 100%;
  }

  .coming {
    height: 100%;
    background: #efeff4;
  }

  .content {
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    background: #EFEFF4;
  }

  .content .weui_cell_bd {
    width: 100%;
    word-wrap: normal;
    word-break: break-all;
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

  .need-offter {
    font-size: 15px;
    color: #000000;
    letter-spacing: 1px;
    line-height: 33px;
    width: 100%;
    overflow: hidden;
    word-break: break-all;
  }

  .location-notice {
    font-size: 14px;
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

  .add-popup-inline {
    position: absolute;
    /* padding-right: 10px; */
    right: 10px;
    top: 10px;
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

  .likes-count-num {
    color: #e85151;
  }

  .notice-block {
    /* width: 100%; */
    margin: 10px;
    box-sizing: border-box;
  }

  .notice-content {
    width: 100%;
    border: 1px solid #ccc;
    max-height: 150px;
    padding: 10px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .notice-block-header {
    /*width: 100%;*/
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    background: #ccc;
    padding-left: 10px;
  }

  .notice-info {
    font-size: 13px;
    min-height: 20px;
    padding-left: 10px;
    background: #e8e884;
    overflow-x: auto;
    word-wrap: break-word;
  }

  .notice-info:nth-child(2n) {
    background: #efd79b;
  }

</style>

<style>

  .weui_cell {
    background: #FFFFFF;
  }

  .weui_label {
    font-size: 15px;
  }

  .lange-selected-box .weui_label {
    font-size: 17px;
    color: #666;
  }

  .lange-selected-box .weui_select {
    font-size: 15px;
    color: #000;
  }
</style>
