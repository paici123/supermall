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
  props:{
    probeType:{//显示隐藏回到顶部图标
      type:Number,
      default:0
    },
    pullUpLoad:{//上拉加载更多
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      scroll:null
    };
  },
  mounted() {
    //1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper,{
      click:true,
      probeType:this.probeType,
      pullUpLoad:this.pullUpLoad,
    }),
    // console.log(this.scroll);  查看滚动占的高度
    this.scroll.refresh()//解决滚动加载的高度
    //2.监听滚动的位置  严谨一点写个判断
    if(this.probeType === 2 || this.probeType ===3){
      this.scroll.on('scroll',(position)=>{
        // console.log(position);
        //自定义事件，把position传出去，这样每个组件都可以使用
        this.$emit('scroll',position);
      })
    }

    //3.监听scroll滚动到底部
    if(this.pullUpLoad){
      this.scroll.on('pullingUp',()=>{
        // console.log('监听滚动到底部');
        this.$emit('pullingUp')
      })
    }
  },
  methods:{
    scrollTo(x,y,time=300){
      this.scroll.scrollTo(x,y,time)
    },
    finishPullUp(){//&&给个判断 值是否已经传过来了
      this.scroll && this.scroll.finishPullUp()
    },
    refresh(){
      // console.log('------');
      this.scroll && this.scroll.refresh()
    },
    getScrollY(){
      return this.scroll ? this.scroll.y:0
    }
  }
};
</script>

<style>

</style>