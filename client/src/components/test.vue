<template>
  <!--<button @click="checkInStatus">check-in or check-out</button>-->
  <!--<button @click="likeStatus">like or unlike</button>-->
  <!--<a @click="$router.go('/')">back</a>-->
<div>
  <tabbar>
    <tabbar-item>
      <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_button.png">
      <span slot="label">Wechat</span>
    </tabbar-item>
    <tabbar-item show-dot>
      <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_msg.png">
      <span slot="label">Message</span>
    </tabbar-item>
    <tabbar-item selected>
      <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_article.png">
      <span slot="label">Explore</span>
    </tabbar-item>
    <tabbar-item>
      <img slot="icon" src="https://o84lhz5xo.qnssl.com/master/src/assets/demo/icon_nav_cell.png">
      <span slot="label">News</span>
    </tabbar-item>
  </tabbar>
</div>


</template>

<script lang="babel">

  import _config from '../config.js'
 import { Tabbar, TabbarItem } from 'vux/src/components/tabbar'
  export default {
    ready() {
    },
    data() {
      return {}
    },
    components: {
      Tabbar,
      TabbarItem
    },
    methods: {

      checkInStatus() {
//        this.$ajax.test()
//          .then((data) => {
//            console.log(`checkin-status: ${data}`);
//          });
      },

      likeStatus() {
//        this.$ajax.test({ options: { params: { type: 'like_status' } } })
//          .then((data) => {
//            console.log(`like-status: ${data}`)
//          });
      }

    }
  }

</script>

<style>

</style>
