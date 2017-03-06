<template>
  <div class="coming">
    <div class="header">
      <div class="title-box">
        <h1 class="title over-ellipsis">{{ title }}</h1>
        <div class="add-box">
          <img class="add-popup" @click="addPopupShow" src="/static/img/edit.png">
        </div>
        <div class="sub-title-block">
          <p class="sub-title">{{ $t('event.create_event.event_info.sub_title') }}</p>
        </div>
      </div>
    </div>
    <div class="mar-top-20"></div>

    <div class="content">
      <input v-model="start_time" type="hidden">
      <datetime :value.sync="start_time" :title="$t('event.create_event.event_info.start_time')"
                :min-year=2000 format="YYYY-MM-DD HH:mm" @on-change="change"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                confirm-text="完成" cancel-text="取消">
      </datetime>

      <input v-model="end_time" type="hidden">
      <datetime :value.sync="end_time" :title="$t('event.create_event.event_info.end_time')"
                :min-year=2000 format="YYYY-MM-DD HH:mm" @on-change="change"
                year-row="{value}年" month-row="{value}月" day-row="{value}日" hour-row="{value}点" minute-row="{value}分"
                confirm-text="完成" cancel-text="取消">
      </datetime>

      <cell :title="">
        <div slot="icon">
          <div><span class="offer-title mar-left-10">{{ $t('event.create_event.event_info.place') }}:</span></div>
        </div>
        <div slot="value">
          <span class="detail-text">{{ place }}</span>
        </div>
      </cell>

      <group>
        <div class="notify-block">
          <p>{{ $t('event.create_event.event_info.notify') }}</p>
        </div>
      </group>
      <div class="btn-block mar-top-20">
        <x-button class="btn-primary" @click="jumpToEvent">
          {{ $t('button.create_event.save_share') }}
        </x-button>
        <x-button class="mar-top-20 btn-default" @click="cancel">
          {{ $t('button.cancel') }}
        </x-button>
      </div>

    </div>

    <i-form-dialog :header="dialog.header" :list="dialog.list" :warn_msg="$t('dialog.event_info.warn_msg')"
                   :cancel_text="dialog.cancel_text"
                   :confirm_text="dialog.confirm_text">
    </i-form-dialog>

    <i-footer :btn_active="footer_btn_active" :user_active="footer_user_active"></i-footer>
  </div>
</template>

<script lang="babel">

  import iFooter from './com-components/Footer/Index.vue'
  import iFormDialog from './com-components/Dialog/Index.vue'

  import Cell from 'vux/src/components/cell'
  import XButton from 'vux/src/components/x-button'
  import Group from 'vux/src/components/group'
  import Datetime from 'vux/src/components/datetime'

  import generateURL from '../utils/routers'

  export default{
    components: {
      iFooter,
      iFormDialog,
      Cell,
      XButton,
      Group,
      Datetime
    },
    data(){
      return {
        title: 'Event Title',
        place: null,
        start_time: this.$t('time', new Date().getTimeList()),
        end_time: this.$t('time', new Date().getTimeList()),

        //判断是否修改event
        is_update_event: false,
        event_id: null,

        //创建事件时需要event_code
        event_code: null,

        //按钮是否已经save
        footer_btn_active: false,
        footer_user_active: true
      }
    },
    computed: {
      dialog() {
        return {
          title: this.$t('dialog.event_info.title'),
          list: [
            {
              title: this.$t('dialog.event_info.name.title'),
              placeholder: this.$t('dialog.event_info.name.placeholder'),
              value: this.title
            },
            {
              title: this.$t('dialog.event_info.place.title'),
              placeholder: this.$t('dialog.event_info.place.placeholder'),
              value: this.place
            }
          ],
          cancel_text: this.$t('dialog.event_info.cancel_text'),
          confirm_text: this.$t('dialog.event_info.confirm_text')
        }
      }
    },
    methods: {
      change() {
        /**
         * start time or end time change
         */
      },
      jumpToEvent() {
        let self = this;

        if (!this.title || !this.place)
          return self.$dispatch('SHOW_ERROR', self.$t('error.createEvent.title'), self.$t('error.createEvent.content'));

        let args = {
          body: {
            name: self.title,
            place: self.place,
            start_time: new Date(self.start_time.replace(/-/g, "/")).getTime(),
            end_time: new Date(self.end_time.replace(/-/g, "/")).getTime()
          }
        };
        let failure = function (error) {
          self.$$utils.handleError(error, {
            'default': () => {
              self.$dispatch('SHOW_ERROR', self.$t('error.default.title'), self.$t('error.default.content'));
            }
          })
        };

        //若是修改事件，ajax请求updateEvent,若是创建事件,ajax请求createEvent
        if (self.is_update_event) {
          args.path = { event_id: self.event_id };

          self.$ajax.updateEvent(args)
            .then((res) => {
              self.$router.go(generateURL('EVENT', { params: { id: res.event.event_id } }));
            })
            .catch(failure);
        } else {
          args.body.event_code = self.event_code;

          this.$ajax.createEvent(args)
            .then((res) => {
              self.$$cache.clear('events');
              self.$router.go(generateURL('EVENT', { params: { id: res.event_id } }));
            })
            .catch(failure);
        }
      },
      addPopupShow(){
        this.$broadcast('DIALOG_SHOW');
      },
      cancel(){
        if (this.is_update_event)
          this.$router.go(generateURL('EVENT', { params: { id: this.event_id } }));
        else
          this.$router.go(generateURL('INDEX'));
      }
    },
    events: {
      SAVE_INPUT(new_list) {
        if (new_list[0].value && new_list[1].value) {
          this.$broadcast('HIDE_WARM');
          this.title = new_list[0].value;
          this.place = new_list[1].value;
          this.$broadcast('DIALOG_HIDDEN');
        } else {
          this.$broadcast('SHOW_WARN');
        }
      }
    },
    route: {
      data(transition) {
        const self = this;
        const result = {};

        let from_path = transition.from.name;
        if (from_path == 'create_event_code' && transition.to.query.event_code)
          result.is_update_event = false;
        else if (from_path == 'event' && transition.to.query.event)
          result.is_update_event = true;
        else
          return transition.redirect(generateURL('CREATE_EVENT_CODE'));

        if (result.is_update_event) {
          let event = JSON.parse(decodeURIComponent(self.$route.query.event));
          result.title = event.name;
          result.place = event.place;
          result.start_time = self.$t('time', new Date(event.start_time).getTimeList());
          result.end_time = self.$t('time', new Date(event.end_time).getTimeList());
          result.event_id = event.event_id;
        } else {
          result.event_code = self.$route.query.event_code;
        }
        return transition.next(result);
      }
    }
  }
</script>

<style scoped>
  .coming {
    background: #efeff4;
    height: 100%;
  }

  .content {
    width: 100%;
    overflow: hidden;
    background: #EFEFF4;
  }

  .notify-block {
    padding: 15px 10px;
    color: #888;
    font-size: 17px;
    text-align: center;
  }

  .weui_cell {
    background: #FFFFFF;
  }

  .weui_cells:before {
    /*color: #FFFFFF;*/
  }

  .detail-text {
    display: inline-block;
    width: 100%;
    vertical-align: top;
    font-size: 16px;
    text-align: center;
    word-wrap: break-word;
    word-break: break-all;
  }

  .offer-title {
    font-size: 18px;
    /*color: #666666;*/
  }

  .cancel {
    color: #4e4949;
    background: #FFFFFF;
  }

  .add-box {
    position: absolute;
    right: 15px;
    top: 15px;
  }

  .add-popup {
    width: 20px;
    height: 20px;
  }

</style>

<style>
  .weui_cell_ft.with_arrow.vux-datetime-value {
    padding-right: 10px;
  }
</style>
