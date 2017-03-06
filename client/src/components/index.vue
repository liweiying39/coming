<template>
  <div class="coming">

    <div class="header">
      <div class="title-block">
        <h1 class="title over-ellipsis">{{ $t('header.profile.title') }}</h1>
        <div class="sub-title-block">
          <p class="sub-title managing over-ellipsis">{{ $t('header.profile.managing') }}:
            <span class="count">{{ managing_count }}</span>
          </p>
          <p class="sub-title over-ellipsis">{{ $t('header.profile.interested')}}:
            <span class="count"> {{ interested_count }}</span>
            <span class="sub-title my-rsvp">{{ $t('header.profile.rsvp') }}:<span
              class="count"> {{ rsvp_count }}</span></span>
          </p>
        </div>
      </div>
    </div>

    <div class="mar-top-20"></div>
    <div class="content">
      <template v-for="event in events" tracy-by="$index">
        <cell :title="event.information.name" :link="generateURL('EVENT',{params:{id:event.event_id}})" is-link>
          <div slot="icon">
            <strong v-if="event.role == 'manager'" class="mark"></strong>
          </div>
          <div slot="after-title">
            <p class="cell-sub-title over-ellipsis">
              {{ $t('time', (event.information.start_time).getTimeList())}}
            </p>
            <p class="cell-sub-title over-ellipsis">{{ event.information.place }}</p>
          </div>
          <div slot="value">
            <badge v-if="getEventNews[event.event_id] && getEventNews[event.event_id].length"
                   :text="getEventNews[(event.event_id)].length.toString()"></badge>
            <div class="mar-right-10">
              <span v-if="checkUserStatus('is_rsvp', event.status)" class="icon-label rsvp">
                {{ $t('status.rsvp') }}
              </span>
              <span v-if="checkUserStatus('is_checkin', event.status)" class="icon-label checked-in">
                {{ $t('status.checked_in') }}
              </span>
              <span v-if="checkUserStatus('is_checkout',event.status)" class="icon-label checked-out">
                {{ $t('status.checked_out') }}
              </span>
            </div>
          </div>
        </cell>
      </template>

      <!--<div class="loading-btn" @click="loadMore">{{ $t('loading_text', loading_status ) }}</div>-->
      <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
      <div v-if="!events.length" class="events-empty">
        <p class="event-empty-text">
          {{ $t('index.event_list_empty')}}
        </p>
      </div>
    </div>

    <div class="mar-top-20 link-block">
      <div class="loading-btn link-block-right " @click="loadMore">{{ loading_text }}
      </div>
      <div class="loading-btn link-block-left"><a class="link-to-event" href="http://dropmeet.chatek.co">Get
        Dropmeet</a></div>
      <!--<div v-if="is_showing_loading_icon"><img src="../../static/img/loading-more.gif"></div>-->
    </div>

    <!--创建新活动时，判断用户是否已经填写了telephone -->
    <i-form-dialog :header="dialog_enter.header" :warn_msg="dialog_enter.warn_msg"
                   :list.sync="dialog_enter.list" :cancel_text="dialog_enter.cancel_text"
                   :confirm_text="dialog_enter.confirm_text">
    </i-form-dialog>

    <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active" :rsvp_count="rsvp_count">
      <div slot="popup_menus" v-if="checkUserIdentity('client')">
        <div class="popup-container client-menus">
          <cell :title="$t('footer_menus.index.new_event')" @click="createEvent"></cell>
          <!--保留-->
          <!--<cell :title="$t('footer_menus.cancel')" @click="cancel"></cell>-->
        </div>
      </div>
      <div slot="popup_menus" v-if="checkUserIdentity('reseller')">
        <div class="popup-container reseller-menus">
          <cell :title="$t('footer_menus.index.reseller')" @click="jumpToResell"></cell>
          <cell :title="$t('footer_menus.index.new_event')" @click="createEvent"></cell>
          <!--保留-->
          <!--<cell :title=" $t('footer_menus.cancel') " @click="cancel"></cell>-->
        </div>
      </div>
      <div slot="popup_menus" v-if="checkUserIdentity('admin')">
        <div class="popup-container reseller-menus">
          <cell :title="$t('footer_menus.index.admin')" @click="jumpToAdmin"></cell>
          <cell :title="$t('footer_menus.index.new_event')" @click="createEvent"></cell>
          <!--保留-->
          <!--<cell :title=" $t('footer_menus.cancel') " @click="cancel"></cell>-->
        </div>
      </div>
    </i-footer>
  </div>
</template>

<script lang="babel">
  import iFooter from './com-components/Footer/Index.vue'
  import iFormDialog from './com-components/Dialog/Index.vue'

  import Badge from 'vux/src/components/badge'
  import Cell from 'vux/src/components/cell'
  import Group from 'vux/src/components/group'
  import XInput from 'vux/src/components/x-input'
  import XButton from 'vux/src/components/x-button'

  import { mapGetters, mapActions } from 'vuex'
  import generateURL from '../utils/routers.js'

  export default{
    components: {
      iFooter,
      iFormDialog,
      Cell,
      Group,
      XButton,
      Badge
    },
    data(){
      return {
        managing_count: null,
        interested_count: null,
        rsvp_count: null,
        events: [],

        page_num: 1,
        is_showing_loading_icon: false,
        is_dialog_button_actived: false, //判断dialog的button是否处于活动状态

        //loading 的三种状态
//        loading_status: 'more',
        loading_text: this.$t('more_status'),
        footer_btn_active: true,
        footer_user_active: true,
      }
    },
    computed: {
      ...mapGetters(['getCurrentUser']),
      ...mapGetters(['getEventNews']),
      dialog_enter() {

        let list_button = [];
        if (this.is_dialog_button_actived) {
          list_button = {
            type: 'button',
            text: this.$t('button.active_verification_code'),
            class_name: 'btn_primary',
            able: true
          };
        } else {
          list_button = {
            type: 'button',
            text: this.$t('button.verification_code'),
            class_name: 'btn_primary',
            able: false,
          }
        }
        return {
          header: this.$t('dialog.enter_telephone.header'),
          warn_msg: this.$t('dialog.enter_telephone.warn_msg_verification_code'),
          list: [
            {
              title: this.$t('dialog.enter_telephone.tel'),
              placeholder: this.$t('dialog.enter_telephone.tel_placeholder'),
              value: null
            },
            list_button,
            {
              title: '',
              placeholder: this.$t('dialog.enter_telephone.verification_code_placeholder'),
              value: null,
            }
          ],
          confirm_text: this.$t('dialog.enter_telephone.confirm_text'),
          cancel_text: this.$t('dialog.cancel_text')
        }
      }
    },

    methods: {
      ...
        mapActions(['updateCurrentUser']),
      //排序
      ordeByRole() {

      },
      generateURL: generateURL,
      checkUserIdentity(key) {
        return (this.getCurrentUser.role === key);
      },
      createEvent() {
        this.$broadcast('cancel');
        let telephone = this.getCurrentUser.telephone;
        if (!telephone) {
          this.$broadcast('DIALOG_SHOW');
          this.dialog_enter.list[0].value = telephone;
        } else {
          this.$router.go(generateURL('CREATE_EVENT_CODE'));
        }
      },
      cancel() {
        this.$broadcast('cancel');
      },
      checkUserStatus(key, obj) {
        return Boolean(obj[key]);
      },
      countByRole(key, arr) {
        if (!Array.isArray(arr))
          throw new Error('parameter 2 require array type');
        return arr.filter((element) => element['role'] == key).length;
      },
      countByStatus(key, arr) {
        if (!Array.isArray(arr))
          throw new Error('parameter 2 require array type');
        return arr.filter((element) => element['status'][key] == true).length;
      },
      jumpToAdmin() {
        this.$router.go(generateURL('ADMIN'));
      },
      jumpToResell() {
        this.$router.go(generateURL('RESELL'));
      },
      loadMore() {
        let self = this;
        self.page_num++;
        self.is_showing_more_icon = true;

//        self.loading_status = 'loading';

        self.loading_text = self.$t('loading_status');
        this.$ajax.getUserEvents({ options: { params: { page: self.page_num } } })
          .then((data) => {
            self.is_showing_more_icon = false;
//            self.loading_status = 'more';
            self.loading_text = self.$t('more_status');
            if (!data.length) {
//              self.loading_status = 'end';
              self.loading_text = self.$t('end_status');
              self.page_num--;
            } else {
              data.forEach((val) => {
                self.events.push(val);
              })
              ;
              self.$$cache.save('events', self.events, '60s');
              self.$$cache.save('last_index_page', self.page_num, '60s');
            }
          })
      }
    },
//    watch: {
//      is_dialog_button_actived () {
//        let self = this;
//        if (this.is_dialog_button_actived) {
//          self.dialog_enter.list.$set(1, {
//            type: 'button',
//            text: self.$t('button.active_verification_code'),
//            class_name: 'btn_primary',
//            able: true
//          });
//          console.log(self.dialog_enter.list[1])
//        }
//      }
//    },
    events: {
      CLICK_BUTTON(new_list)
      {
        let self = this;


        //请求发送短信验证
        self.is_dialog_button_actived = true; //改变button的状态

        let telephone = new_list[0].value;
        if (telephone) {
          self.$broadcast('HIDE_WARN');
          let args = {
            body: {
              telephone: telephone
            }
          };
          self.$ajax.postUserTelephone(args)
            .then((res) => {

            })
        } else {
          self.$broadcast('SHOW_WARN');
        }
      }
      ,

      SAVE_INPUT(new_list)
      {
        let self = this;

        let failure = function (error) {
          self.$$utils.handleError(error, {
            [422]: () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.updateCurrentUser.title'),
                self.$t('error.updateCurrentUser.content'))
            },
            'default': () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
            }
          })
        };

        //当用户填写的验证信息与号码通过时，同时写入数据库，更改state，跳转到创建事件中
        if (new_list[0].value && new_list[2].value) {
          //验证电话号码和验证码，同时写入数据库
          let args = {
            body: {
              telephone: new_list[0].value,
              code: new_list[2].value
            }
          };
          self.$ajax.putUserTelephone(args)
            .then((user_data)=> {
              if (user_data.done) {
                self.$broadcast('DIALOG_HIDDEN');

                //更改state,跳转到创建事件活动页面
                let tel = user_data.data.new_telephone;
                self.updateCurrentUser({
                  telephone: tel
                });
                self.$router.go(generateURL('CREATE_EVENT_CODE'));
              }
            })
            .catch((res) => {
              self.$$utils.handleError(res, {
                [404]: () => {      //phone number || verification code 错误时
                  self.$broadcast('SHOW_WARN');
                },
                'default': () => {
                  self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
                }
              })
            });
        } else {
          self.$broadcast('SHOW_WARN');
        }
      }
    }
    ,
    route: {
      activate(transition)
      {
        const self = this;
        if (!self.$store.state.variables.is_first_loading_done && transition.to.query.share) {
          self.$store.commit('SET_FIRST_LOADING_DONE');
          transition.redirect(generateURL('EVENT', { params: { id: transition.to.query.share } }));
        } else
          transition.next();
      }
      ,
      data(transition)
      {
        let self = this;
        /**
         * 每次请求ajax请求数据前，都要先出现loading..，ajax请求完毕后，loading..消失
         */
        self.$dispatch('IS_SHOWING_LOADING', true, self.$t('loading.text'));
        /**先判断localStorage中是否有events的值，若有，直接从localStorage中拿数据
         * 若无，再请求ajax请求数据
         */
        //判断localStorage中是否有events的值，若没有AJAX请求数据，若有则从localStorage里拿值
        if (self.$$cache.load('events')) {
          self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));

          let data = self.$$cache.load('events');
          data.map((obj) => {
            obj.information.start_time = new Date(obj.information.start_time);
            obj.information.end_time = new Date(obj.information.end_time);
          });

          self.page_num = self.$$cache.load('last_index_page', 1);
          self.events = data;
          self.managing_count = self.countByRole('manager', data);
          self.interested_count = data.length;
          self.rsvp_count = self.countByStatus('is_rsvp', data);
        } else {
          this.$ajax.getUserEvents({ options: { params: { page: self.page_num } } })
            //          this.$ajax.getUserEvents()
            .then((data) => {
              //首次进入首页，AJAX请求events数据，并存在localStorage里
              self.$$cache.save('events', data, '60s');
              self.$dispatch('IS_SHOWING_LOADING', false, self.$t('loading.text'));

              transition.next({
                events: data,
                managing_count: self.countByRole('manager', data),
                interested_count: data.length,
                rsvp_count: self.countByStatus('is_rsvp', data)
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
  }
</script>

<style scoped>

  .content:after {
    content: '';
    height: 1px;
    display: block;
    background: #D9D9D9;
  }

  .content .weui_cell {
    /*padding: 6px 12px 0;*/
  }

  .weui_cell .mark {
    content: '';
    display: block;
    width: 5px;
    background: #538DE2;
    height: 60px;
    left: 10px;
    padding: 0;
  }

  .events-empty {
    padding: 15px 10px;
    color: #504e4e;
    font-size: 17px;
    text-align: center;
  }

  .events-empty-text {
    line-height: 25px;
  }

  .client-menus .weui_cell:nth-child(1) {
    background: #38BD00;
  }

  .client-menus .weui_cell:nth-child(2) {
    background: #B9B8B9;
  }

  .reseller-menus .weui_cell:nth-child(1) {
    background: #538DE2;
  }

  .reseller-menus .weui_cell:nth-child(2) {
    background: #38BD00;
  }

  .reseller-menus .weui_cell:nth-child(3) {
    background: #B9B8B9;
  }

  /*.loading-btn {*/
  /*height: 20px;*/
  /*width: 100%;*/
  /*text-align: center;*/
  /*font-size: 12px;*/
  /*color: #666;*/
  /*text-decoration: underline;*/
  /*}*/
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

  .link-block-right {
    text-align: right;
    float: right;
    padding-right: 15px;
    width: 100px;
    font-size: 12px;
    color: #666;
  }

  .link-block a {
    font-size: 12px;
    color: #666;
  }


</style>

<style>
  .weui_cell_bd {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 10px;
  }

  .popup-container .weui_cell .weui_cell_bd.weui_cell_primary {
    text-align: center;
  }

  .popup-container .weui_cell .weui_cell_bd p {
    color: #FFFFFF;
  }

  .popup-container .weui_cell:nth-child(2) {
    background: #B9B8B9;
  }

</style>
