<template>
  <!-- ref  /拿到某个子组件的元素 -->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
export default {
  name: 'Scroll',
  data() {
    return {
      scroll:null
    };
  },
  mounted() {
    this.scroll = new BScroll(this.$refs.wrapper,{

    })
    this.scroll.scrollTo(0,0)
  },
  methods:{
    scrollTo(x,y,time=300){
      this.scroll.scrollTo(x,y,time)
    }
  }
};
</script>

<style>

</style>