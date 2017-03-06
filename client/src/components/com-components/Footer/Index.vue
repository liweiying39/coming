<template>
  <div class="footer">
    <tabbar>
      <tabbar-item :link="{path:'/'}" class="logo-block" title="Coming">
        <div slot="icon">
          <span class="logo-text">Dropmeet</span>
        </div>

      </tabbar-item>

      <tabbar-item @click="PopupMenu">
        <img class="button-img" slot="icon" v-if="btn_active"
             :class="[button_transform ? 'transform-add-button' : 'normal-add-button']"
             src='/static/img/add-noborder.png'>
      </tabbar-item>

      <tabbar-item :show-dot="$store.state.variables.notice_messages.has_notice"
                   :link="{path:'/profile',query:{rsvp_count:rsvp_count}}">
        <img class="avatar-img" slot="icon"
             src="/static/img/pos-avatar.png">
      </tabbar-item>
    </tabbar>

    <popup :show.sync="show_menus">
      <div class="popup-container">
        <slot name="popup_menus"></slot>
      </div>
    </popup>

  </div>
</template>
<style>

</style>
<script>

  import { Tabbar, TabbarItem } from 'vux/src/components/tabbar'
  import Popup from 'vux/src/components/popup'
  import { mapGetters, mapActions } from 'vuex';

  export default{
    components: {
      Tabbar,
      TabbarItem,
      Popup
    },
    data(){
      return {
        show_menus: false,
        has_news: true
      }
    },
    ready() {
      let self = this;

      if (!self.$store.state.variables.notice_messages.is_done) {
        self.$ajax.getEventMessages({ options: { params: { page: 1 } } })
          .then((data) => {
            if (data.messages.length) {
              self.updateHasNoticeMessages(true);
            }
          });
        self.setNoticeMessageDone();
      }
    },
    computed: {
      button_transform() {
        return this.show_menus;
      },

    },
    methods: {
      ...mapActions(['setNoticeMessageDone', 'updateHasNoticeMessages']),
      PopupMenu(){
        if (this.btn_active) {
          this.button_transform = !this.button_transform;
          this.show_menus = !this.show_menus;
        } else {
          this.button_transform = false;
          this.show_menus = false;
        }
      }
    },
    events: {
      cancel(){
        this.show_menus = !this.show_menus;
        this.button_transform = !this.button_transform;
      }
    },


    props: {
      btn_active: {
        type: Boolean
      },
      user_active: {
        type: Boolean
      },
      rsvp_count: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style scoped>
  .footer {
    width: 100%;
    height: 55px;
    overflow: hidden;
  }

  .weui_tabbar {
    height: 55px;
    line-height: 55px;
    position: fixed;
    z-index: 1000;
  }

  .button-img {
    display: inline-block;
    width: 25px;
    height: 25px;
    vertical-align: middle;
  }

  .avatar-img {
    display: inline-block;
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }

  .logo-text {
    font-size: 18px;
    /*font-family:Big Caslon, sans-serif;*/
    font-family: "Big Caslon", sans-serif;
    color: #333;
    font-weight: bold;
  }

  .weui_tabbar_item {
    padding-top: 0;
  }

  .pop-alink {
    display: block;
    width: 100%;
    height: 50px;
    color: #FFFFFF;
    text-decoration: none;
    text-align: center;
    font-size: 18px;
    line-height: 50px;
  }

  .transform-add-button {
    transform: rotate(45deg);
    transform-origin: center;
    transition-duration: .5s;
  }

  .normal-add-button {
    transition-duration: .5s;
    transform: rotate(0deg);
    transform-origin: center;
  }


</style>

<style>
  .vux-popup-dialog {
    position: fixed;
    left: 0;
    bottom: 54px !important;
    width: 100%;
    background: #eee;
    z-index: 101;
  }

  .weui_tabbar {
    z-index: 5001;
  }

  .weui_tabbar .weui_tabbar_icon {
    width: 100%;
    height: 55px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /*text-align: center;*/
  }

  .weui_tabbar_item:nth-child(1) .weui_tabbar_icon {
    text-align: left;
    padding-left: 10px;
  }

  .weui_tabbar_item:nth-child(2) .weui_tabbar_icon {
    text-align: center;
  }

  .weui_tabbar_item:nth-child(3) .weui_tabbar_icon {
    text-align: right;
    padding-right: 10px;
  }

  .weui_actionsheet .vux-actionsheet-gap {
    height: 0px;
  }

  .weui_actionsheet_cell {
    margin-bottom: 1px;
    color: #FFFFFF;
  }

  .weui_actionsheet_menu .weui_actionsheet_cell:nth-child(1) {
    background: #b05f6b;
  }

  .weui_actionsheet_menu .weui_actionsheet_cell:nth-child(2) {
    background: #86D51C;
  }

  .weui_actionsheet_menu .weui_actionsheet_cell:nth-child(3) {
    background: #b05f6b
  }

  .weui_actionsheet .vux-actionsheet-cancel {
    background: #B9B8B9;
  }

  .weui_mask_transition {
    background: none;
  }

  .vux-reddot:after {
    content: '';
    position: absolute;
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-clip: padding-box;
    background-color: #f74c31;
    right: 11px;
    top: 8px;
  }
</style>
