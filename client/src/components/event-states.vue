<template>
  <div class="header">
    <div class="title-box" v-if="event">
      <h1 class="title over-ellipsis">{{ event.name }}</h1>
      <div class="sub-title-block">
        <div class="sub-title-left">
          <p class="sub-title over-ellipsis">{{ $t('header.event.time') }}: {{$t('time', event.start_time.getTimeList())
            }}</p>
          <p class="sub-title over-ellipsis">{{ $t('header.event.place') }}: {{ event.place}}</p>
        </div>
        <div class="sub-title-right">
          <span class="interested-count">{{ interested_count }}</span>
          <p class="interested-text">{{ $t('header.event.interested')}}</p>
        </div>
      </div>
    </div>
  </div>

  <div class="content" v-if="event">
    <div class="content-nav">
      <flexbox>
        <flexbox-item>
          <div class="sub-nav" :class="panel.invite_code_panel? 'active-nav' : '' "
               @click="showWhichPanel('invite_code_panel')">
            <h4>{{ $t('event.event_stats.invite_code_nav')}}</h4>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="sub-nav" :class="panel.qr_panel? 'active-nav' : ''" @click="showWhichPanel('qr_panel')">
            <h4>{{ $t('event.event_stats.qr_nav') }}</h4>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="sub-nav" :class="panel.count_panel? 'active-nav' : ''" @click="showWhichPanel('count_panel')">
            <h4>{{ $t('event.event_stats.count_nav') }}</h4>
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="sub-nav" :class="panel.excel_panel? 'active-nav' : '' "
               @click="showWhichPanel('excel_panel')">
            <h4>{{ $t('event.event_stats.excel_nav') }}</h4>
          </div>
        </flexbox-item>
      </flexbox>
    </div>

    <div class="content-body">
      <!--event stats-->
      <div class="excel-panel " v-if="panel.count_panel">
        <!--暂末实现，保留-->
        <!--<div class="cell-block">-->
        <!--<div class="pre-block">-->
        <!--<p class="num">{{ interested_present }}%</p>-->
        <!--</div>-->
        <!--<div class="detail-block">-->
        <!--<p class="font-size-m">{{ $t('event.event_stats.interested') }}</p>-->
        <!--<div class="sub-title-div notify-font-color">-->
        <!--<span class="font-size-m">{{ $t('event.event_stats.incoming_visits')}}: </span>-->
        <!--<span class="font-size-m">{{ incoming_visits }}</span>-->
        <!--</div>-->
        <!--<div class="sub-title-div notify-font-color">-->
        <!--<span class="font-size-m">{{ $t('event.event_stats.interested_total') }}: </span>-->
        <!--<span class="font-size-m">{{ event.stats.total_interested }}</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <div class="cell-block">
          <div class="pre-block">
            <p class="num">{{ rsvp_present }}%</p>
          </div>
          <div class="detail-block">
            <h4 class="detail-title">{{ $t('event.event_stats.rsvp') }}</h4>
            <div class="sub-title-div notify-font-color">
              <span class="font-size-m">{{ $t('event.event_stats.interested_total') }}:</span>
              <span class="font-size-m">{{ event.stats.total_interested }}</span>
            </div>
            <div class="sub-title-div notify-font-color">
              <span class="font-size-m">{{ $t('event.event_stats.rsvp_total') }}:</span>
              <span class="font-size-m">{{ event.stats.total_rsvp }}</span>
            </div>
          </div>
        </div>
        <div class="cell-block">
          <div class="pre-block">
            <p class="num">{{ checked_in_present }}%</p>
          </div>
          <div class="detail-block">
            <h4 class="detail-title">{{ $t('event.event_stats.checked_in') }}</h4>
            <div class="sub-title-div notify-font-color">
              <span class=" font-size-m">{{ $t('event.event_stats.rsvp_total') }}: </span>
              <span class="notify-font-color font-size-m ">{{ event.stats.total_rsvp }}</span>
            </div>
            <div class="sub-title-div notify-font-color">
              <span class="font-size-m">{{ $t('event.event_stats.checked_in_total') }}: </span>
              <span class="font-size-m">{{ event.stats.total_checkin }}</span>
            </div>
          </div>
        </div>
      </div>

      <!--invite code-->
      <div class="sub-panel invite-code-panel " v-if="panel.invite_code_panel">
        <div class="text-block">
          <p class="title-text font-size-m text-center">
            {{$t('event.event_stats.invite_code_notice')}}
          </p>
        </div>
        <div class="btn-block mar-top-20">
          <x-button class="button btn-primary" @click="createInviteCode">{{ $t('button.invite_code') }}</x-button>
        </div>
        <div class="text-block mar-top-10" v-if="invite_code">
          <p class="title-text font-size-m text-center">{{ $t('event.event_stats.copy_paste_code_notice') }}</p>
          <p class="code-text">{{ invite_code }}</p>
        </div>
        <div class="code-list-container" v-if="code_list.length">
          <div class="code-list-title"> {{ $t('event.event_stats.invite_code_header') }}</div>
          <div class="code-list-content">
            <template v-for="item in code_list">
              <div class="item-info">
                <span class="code-area">{{ item.code }}</span>
                <span class="nickname-area">{{ item.name }}</span>
                <span class="status-area" :class="item.is_used? 'font-green' : 'font-red' ">
                 {{ item.is_used ? $t('event.event_stats.invite_code_status.used') :$t('event.event_stats.invite_code_status.unused') }}
                </span>
                <span class="time-area" v-if="item.used_at">
                  {{ usedTime(Date.beautifyDate(item.used_at)) }}
                </span>
              </div>
            </template>
            <div class="mar-top-20">
              <div class="loading-btn" @click="loadMore">{{ loading_text }}</div>
              <div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>
            </div>
          </div>
        </div>
      </div>

      <!--export excel-->
      <div class="sub-panel invite-code-panel " v-if="panel.excel_panel">
        <div class="text-block">
          <p class="title-text font-size-m text-center">
            {{ $t('event.event_stats.excel_notice') }}
          </p>
        </div>
        <div class="btn-block mar-top-20">
          <x-button class="button btn-primary" @click="addPopupShow">{{ $t('button.excel_button.export_mail') }}
          </x-button>
        </div>
        <div class="mar-top-20 email-success-box" v-if="is_email_success">
          <p>{{ $t('event.event_stats.email_success_notice') }}</p>
        </div>
      </div>

      <!--qr panel-->
      <div class="sub-panel qr-panel" v-if="panel.qr_panel">
        <div class="text-block">

          <!--<div class="btn-block mar-top-20">-->
          <!--<x-button class="button btn-primary" :disabled="is_created_qr_code? true : false" @click="createQRCode">{{ $t('button.qr_button') }}</x-button>-->
          <!--</div>-->
          <div>
            <div class="title-text font-size-m text-center">{{ $t('event.event_stats.qr_title') }}</div>
            <div class="qr-text">{{ event_url}}</div>
          </div>
          <p class="title-text font-size-m text-center mar-top-10">
            {{ $t('event.event_stats.qr_notice') }}
          </p>
          <div class="qr-block">
            <div id="qrCode"></div>
          </div>
        </div>

      </div>
    </div> <!-- end for content-body-->
  </div> <!--end for content-->

  <div class="btn-block mar-top-20">
    <x-button class="btn-default " @click="jumpToPrevPage">{{ $t('button.back') }}</x-button>
  </div>


  <!--email 输入框-->
  <i-form-dialog :header="dialog_enter.header" :list="dialog_enter.list" :warn_msg="dialog_enter.warn_msg"
                 :cancel_text="dialog_enter.cancel_text"
                 :confirm_text="dialog_enter.confirm_text">
  </i-form-dialog>

  <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active"></i-footer>
</template>

<!--生成二维码包-->
<script lang="babel">
  import iFooter from './com-components/Footer/Index.vue'
  //  import {Cell, Group, XInput} from 'vux/src/components'
  import Cell from 'vux/src/components/cell'
  import Group from 'vux/src/components/group'
  import XButton from 'vux/src/components/x-button'
  import { Flexbox, FlexboxItem } from 'vux/src/components/flexbox'

  import iFormDialog from './com-components/Dialog/Index.vue'

  import rbac from '../utils/rbac/index'
  import { mapActions, mapGetters } from 'vuex'

  import font_config from '../config.js'

  export default{
    components: {
      iFooter,
      Cell,
      Group,
      XButton,
      Flexbox,
      FlexboxItem,
      iFormDialog
    },
    data() {
      return {
        event: null,
//        incoming_visits: 1,
        footer_btn_active: false,
        footer_user_active: true,

        //panel的切换
        panel: {
          count_panel: false,
//          invite_code_panel: false, //invite code panel
          excel_panel: false,
          qr_panel: false,
          invite_code_panel: true
        },
        //excel表格是否发送成功
        is_email_success: false,

        //code list & load More
        code_list: [],
        page_num: 1,
        is_showing_loading_icon: false,
        loading_text: this.$t('more_status'),
        is_showing_more_btn: true,

        //判断是否已经生成了二维码
        is_created_qr_code: false,

        invite_code: null //活动邀请码
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser']),
      event_id() {
        return this.$route.query.event_id;
      },
      role() {
        return this.$route.query.role;
      },
      interested_count() {
        return this.$route.query.interested_count
      },
//      interested_present: function () {
//        return (this.event.stats.total_interested / this.incoming_visits).toFixed(2) * 100
//      },
      rsvp_present () {
        if (this.event) {
          let total_interested = parseInt(this.event.stats.total_interested);
          let total_rsvp = parseInt(this.event.stats.total_rsvp);

          return (total_rsvp / total_interested).toFixed(2) * 100
        }
      },
      checked_in_present () {
        if (this.event) {
          let total_rsvp = parseInt(this.event.stats.total_rsvp) === 0 ? 1 : parseInt(this.event.stats.total_rsvp);
          let total_checkin = parseInt(this.event.stats.total_checkin);
          return (total_checkin / total_rsvp).toFixed(2) * 100
        }
      },
      dialog_enter() {
        return {
          header: this.$t('dialog.email_info.header'),
          warn_msg: this.$t('dialog.email_info.warn_msg'),
          list: [
            {
              title: this.$t('dialog.email_info.email.title'),
              placeholder: this.$t('dialog.email_info.email.placeholder'),
              value: this.email
            }
          ],
          cancel_text: this.$t('dialog.cancel_text'),
          confirm_text: this.$t('dialog.confirm_text')
        }
      },
      event_url() {
        return font_config.host_address + '/#!/?share=' + this.$route.query.event_id
      }
    },
    ready(){

    },
    methods: {
      jumpToPrevPage()
      {
        window.history.back();
      },
      //count-panel,excel_panel, qr_panel的切换
      showWhichPanel(is_showing_which_panel)
      {
        const self = this;
        Object.keys(this.panel).map((key) => {
          self.panel[key] = false;

          self.panel[is_showing_which_panel] = true;
        });
        //如果是切换到qr_panel生成二维码
        if (is_showing_which_panel == 'qr_panel') {
          self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));
          setTimeout(function () {
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
            new QRCode(document.getElementById('qrCode'), {
              text: self.event_url,
              width: 150,
              height: 150
            })
          }, 800);
        }

        if (!is_showing_which_panel in self.panel)
          throw new Error('the param is wrong');
      },
      // invite code used time
      usedTime(obj) {
        console.log(obj);
        if (obj.type != 'both')
          return;

        let num = obj.val[0];
        let unit = obj.val[1];

        if (unit == 's')
          return this.$t("invite_code_used_time['s']");
        else if (unit == 'm')
          return num + this.$t("invite_code_used_time['m']");
        else if (unit == 'h')
          return num + this.$t("invite_code_used_time['h']");
        else if (unit == 'd')
          return num + this.$t("invite_code_used_time['d']");

        return `${num}-${unit}`;
      },
      //弹出email输入框
      addPopupShow(){
        let email = this.$$cache.load('email');
        if (email) {
          this.dialog_enter.list[0].value = email;
        }
        this.$broadcast('DIALOG_SHOW');
      },
      loadMore(){
        let self = this;
        self.page_num++;
        self.is_showing_more_icon = true;

//        self.loading_status = 'loading';
        self.loading_text = self.$t('loading_status');
        let args = { path: { event_id: self.event_id }, options: { params: { page: self.page_num } } };
        self.$ajax.getInviteCodeList(args)
          .then((data) => {
            console.log(data);
//            self.loading_status = 'more';
            self.is_showing_more_icon = false;
            self.loading_text = self.$t('more_status');
            if (!data.invite_codes.length) {

//              self.loading_status = 'end';
              self.loading_text = self.$t('end_status');
              self.page_num--;
            } else {
              self.code_list = self.code_list.concat(data.invite_codes);
            }
          })
      },

      createInviteCode() {
        let self = this;
        let args = {
          path: { event_id: self.event_id }
        };
        console.log(args);
        this.$ajax.createInviteCode(args)
          .then((res) => {

            self.invite_code = res.invite_code.code;
            console.log(res)
          })
          .catch((res) => {
            console.log(res);
            self.$$utils.handleError(res, {
              'default': () => {
                self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
              }
            })
          })
      }
    },
    events: {
      SAVE_INPUT(new_list){
        let self = this;

        //发送邮件，先判断邮件是否填写完整 =》 发送邮件，根据状态来判断是否发送成功
        let email = new_list[0].value;
        if (email) {
          this.$broadcast('HIDE_WARM');
          let args = {
            path: { event_id: self.event_id },
            body: { email: email }
          };
          self.$ajax.sendEventStatsEmail(args)
            .then((res) => {
              self.is_email_success = true;
              //存入localstore里
              self.$$cache.save('email', email, 12);
              this.$broadcast('DIALOG_HIDDEN');
            })
            .catch((res) => {
              self.$$utils.handleError(res, {
                [403]: () => {
                  this.$broadcast('SHOW_WARN');
                },
                'default': () => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
                }
              })
            })

        } else {
          this.$broadcast('SHOW_WARN');
        }
      }
    },
    transitions: {
      slide: {
        enterClass: 'slideInRight',
        leaveClass: 'slideOutLeft'
      },
      slideRight: {
        enterClass: 'slideInRight',
        leaveClass: 'slideOutLeft'
      },
      slideLeft: {
        enterClass: 'slideInLeft',
        leaveClass: 'slideOutRight'
      }
    },
    route: {
      data(transition){
        let self = this;
        let loading_times = 1;

        //getEventStats与getInviteCodeList都已经加载完成之后，再取消loading..
        function isLoadingComplete () {
          if (loading_times == 2)
            self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));
          else
            loading_times++;
        }

        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));

        //权限访问控制，只有这个活动的manager才能进入这个页面
        rbac
          .init()
          .allow(rbac.MANAGER_ROLE, rbac.ADMIN_ROLE)
          .check(self.getCurrentUser.role, self.role, function (can_pass) {
            if (!can_pass)
              transition.redirect(generateURL('INDEX')); //如果访问失败，返回index页面

            self.$ajax.getEventStats({ path: { event_id: self.$route.query.event_id } })
              .then((event_data) => {
                isLoadingComplete();
                self.event = event_data.event;
              })
              .catch((res) => {
                self.$$utils.handleError(res, {
                  'default': () => {
                    self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                      self.$t('error.default.content'));
                  }
                })
              });

            let get_invite_code_args = {
              path: { event_id: self.event_id },
              options: { params: { page: self.page_num } }
            };
            //获取invite code list
            self.$ajax.getInviteCodeList(get_invite_code_args)
              .then((invite_code_list) => {
                isLoadingComplete();
                transition.next({
                  code_list: invite_code_list.invite_codes
                })
              })
              .catch((res) => {
                self.$$utils.handleError(res, {
                  'default': () => {
                    self.$dispatch('SHOW_ERROR', self.$t('error.default.title'),
                      self.$t('error.default.content'));
                  }
                })
              }); //end for catch();
          }); //end for rbac();
      } //end for data();
    } //end for route()
  }
</script>

<style scoped>
  /*@import "/static/css/header.css";*/

  body {
    background: #FFFFFF;
    min-height: 100%;
  }

  .content {
    background: #efeff4;
    width: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .content-body {
    background: #FFFFFF;
  }

  .content-body:after {
    content: '';
    height: 1px;
    display: block;
    background: #D9D9D9;
  }

  .sub-nav {
    /*border-bottom: 1px solid #cccccc;*/
    height: 30px;
    line-height: 30px;
  }

  .active-nav {
    background: white;
    border-bottom: none;
  }

  .sub-panel {
    width: 100%;
    overflow: hidden;
  }

  .invite-code-panel, .excel-panel, .qr-panel {
    padding: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .cell-block {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }

  .cell-block:after {
    content: '';
    height: 1px;
    display: block;
    /*border-bottom:1px solid #D9D9D9;*/
    background: #D9D9D9;
  }

  .cell-block:last-child:after {
    height: 0;
  }

  .pre-block {
    display: inline-block;
    width: 42%;
    padding-left: 5px;
  }

  .email-success-box {
    width: 90%;
    margin: 0 auto;
    text-align: center;
    font-size: 14px;
    color: #338a2c;
  }

  .detail-block {
    display: inline-block;
    text-align: left;
  }

  .detail-title {
    font-weight: normal;
    font-size: 17px;
  }

  .num {
    color: #538DE2;
    font-size: 45px;
    /*padding-right: 20px;*/
  }

  .sub-title-div {
    line-height: 18px;
  }

  .qr-block {
    text-align: center;
    margin-top: 10px;
  }

  .notify-font-color {
    color: #666;
  }

  .qr-text {
    font-size: 14px;
    color: #666;
    width: 80%;
    border: 1px solid #dedddd;
    margin: 0 auto;
    background: #f5f2f2;
    height: 30px;
    overflow: auto;
    line-height: 30px;
    margin: 10px auto;
  }

  .total {
    margin-left: 5px;
    font-size: 17px;
  }

  .code-list-content {
    border: 2px solid #f9f3f3;
    padding: 10px;
  }

  .item-info {
    width: 100%;
    height: 30px;
    overflow: hidden;
    line-height: 30px;
  }

  .code-area {
    width: 30%;
    font-size: 16px;
    color: #518be0;
    font-weight: bold;
    margin-right: 10px;
    display: inline-block;
  }

  .nickname-area {
    width: 25%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 16px;
    display: inline-block;
    margin-left: 5px;
    line-height: 15px;
    text-align: left;
  }

  .loading-btn {
    text-align: left;
  }

  .text-block {
    margin-bottom: 20px;
  }

  .code-text {
    width: 50%;
    border: 1px solid #dedddd;
    margin: 0 auto;
    background: #f5f2f2;
    height: 30px;
    line-height: 30px;
    text-align: center;
    margin-top: 10px;
  }

  .status-area {
    font-size: 16px;
    display: inline-block;
    margin-right: 5px;
  }

  .time-area {
    font-size: 12px;
    display: inline-block;
  }

  .font-green {
    color: #38BD00;
  }

  .font-red {
    color: #b05f6b;
  }

  .code-list-title {
    font-size: 18px;
    font-weight: normal;
    /* border-bottom: 2px solid #333; */
    background: #babdc1;
    color: white;
    text-indent: 10px;
  }

  /*.btn-block {*/
  /*margin-top:30px;*/
  /*}*/

</style>
<style>
  #qrCode img {
    display: block;
    margin: 0 auto !important;
  }
</style>
