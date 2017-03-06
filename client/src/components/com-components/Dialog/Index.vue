<template>
  <dialog :show.sync="show">
    <h3 class="title">{{ header}}</h3>

    <div class="dialog-content">
      <template v-for="item in render_list">
        <!--button-->
        <template v-if="item.type == 'button'">
          <div class="input-group">
            <div v-if="item.title" class="input-block">
              {{ item.title }}
            </div>
            <div class="btn-block">
              <x-button :disabled="item.able" class="button btn-primary" type="button" :class="item.class_name" @click="clickButton"> {{ item.text }}
              </x-button>
            </div>
          </div>
        </template>
        <!--input-->
        <template v-else>
          <div class="input-group">
            <div v-if="item.title" class="input-block">
              {{ item.title }}
            </div>
            <div class="input-block">
              <input class="input-text" type="text" v-model="item.value" :placeholder="item.placeholder">
            </div>
          </div>
        </template>
      </template>

      <div v-if="is_showing_warn">
        <p class="warn-msg">{{ warn_msg }}</p>
      </div>

      <p class="notify-message">{{ notify_message }}</p>
      <div>
        <flexbox>
          <flexbox-item v-if="cancel_text" @click="confirmCancel">
            <a class="text cancel-text">{{ cancel_text }}</a>
          </flexbox-item>

          <flexbox-item v-if="confirm_text" :class="[cancel_text ? 'disline': '']" @click="confirmOk">
            <a class="text confirm-text">{{ confirm_text }}</a>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </dialog>
</template>

<script lang="babel">

  //  import { Dialog, Flexbox, FlexboxItem} from 'vux/src/components'
  import Dialog from 'vux/src/components/dialog'
  import { Flexbox, FlexboxItem } from 'vux/src/components/flexbox'
  import XButton from 'vux/src/components/x-button'

  export default {
    data(){
      return {
        show: false,
        copy_list: null,
        is_showing_warn: false,
        need_update_list: false,
      }
    },
    computed: {
      render_list() {
        if (this.need_update_list) {
          this.copy_list = JSON.parse(JSON.stringify(this.list));
          this.need_update_list = false;
        }
        return this.copy_list;
      }
    },
    components: {
      Dialog,
      Flexbox,
      FlexboxItem,
      XButton
    },
    props: {
      list: Array,
      header: String,
      warn_msg: String,
      notify_message: {
        type: String
      },
      confirm_text: {
        type: String
      },
      cancel_text: {
        type: String
      },
    },
    methods: {
      confirmOk() {
        this.copy_list.forEach((item) => {
          item.value = (item.value || '').trim();
        });
        this.$dispatch('SAVE_INPUT', this.copy_list);
//        this.show = false;
      },
      clickButton() {
        this.$dispatch('CLICK_BUTTON', this.copy_list);
      },
      confirmCancel(){
        this.$dispatch('CANCEL_INPUT');
        this.show = false;
      }
    },
    events: {
      DIALOG_SHOW() {
        this.copy_list = null;
        this.is_showing_warn = false;
        this.need_update_list = true;
        this.show = true;
      },
      DIALOG_HIDDEN() {
        this.show = false;
        this.need_update_list = false;
      },
      SHOW_WARN() {
        this.is_showing_warn = true;
      },
      HIDE_WARN() {
        this.is_showing_warn = false;
      }
    }
  }
</script>
<style scoped>
  .title {
    font-weight: normal;
    padding: 15px;
    text-align: center;
  }

  .input-group {
    margin-bottom: 10px;
  }

  .input-block {
    text-align: center;
    font-size: 18px;
    letter-spacing: 1px;
    width: 100%;
    color: #585555
  }

  .btn-block button.weui_btn {
    width: 90%;
    border-radius: 2px;
    /*line-height: 2em;*/
    box-shadow: 0 3px 5px 0 #ddd;
  }

  .btn-block button.weui_btn:after {
    border: none !important;
  }

  .btn-block .btn-primary {
    background: #538DE2;
    color: #FFFFFF;
  }

  .input-text {
    height: 40px;
    width: 90%;
    border: none;
    background: #EBEBEB;
    font-size: 16px;
    color: #3a3838;
    line-height: 40px;
    text-indent: 1em;
  }

  .warn-msg {
    color: red;
    font-size: 14px;
  }

  .notify-message {
    font-size: 17px;
    text-align: center;
    text-indent: 1em;
    padding: 5px 10px;
    word-wrap: break-word;
    table-layout: fixed;
    -ms-word-break: break-all;
    word-break: break-all;
  }

  .text {
    display: block;
    -webkit-box-flex: 1;
    -ms-flex: 1;
    flex: 1;
    color: #3CC51F;
    text-decoration: none;
    font-size: 18px;
  }

  .cancel-text {
    color: #d43d3d;
  }

  .confirm-text {
    color: #0BB20C;
  }

  .disline:after {
    content: " ";
    position: absolute;
    left: 50%;
    top: 0;
    width: 1px;
    height: 100%;
    border-left: 1px solid #D5D5D6;
    color: #D5D5D6;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5)
  }
</style>

<style>
  .weui_dialog .weui_dialog_title {
    color: #3a3838
  }

  .vux-flexbox-item {
    text-align: center;
  }

  .vux-flexbox {
    position: relative;
    line-height: 42px;
    margin-top: 20px;
    font-size: 17px;
  }

  .vux-flexbox:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 1px;
    border-top: 1px solid #D5D5D6;
    color: #D5D5D6;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5)
  }
</style>
