<template>
  <div>
    <actionsheet :show.sync="show_menus" :menus="menus" show-cancel @on-click-menu="click"></actionsheet>
  </div>
</template>
<style>

</style>
<script>
  import Actionsheet from 'vux/src/components/actionsheet'
  export default{
    data(){
      return {
        msg: 'hello vue'
      }
    },
    components: {
      Actionsheet
    },
    props: {
      menus: {
        type: Object,
        default: function () {
          return null;
        }
      },
      show_menus:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      click(key){
        if(key == 'path'){
          this.router.go()
        }
        this.$dispatch('cancel');
      }
    }
  }

</script>
