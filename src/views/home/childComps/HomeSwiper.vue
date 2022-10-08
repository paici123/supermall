<template>
  <swiper>
    <swiper-item v-for="item in banners">
        <a :href="item.link">
            <img :src="item.image" alt="" @load="imageLoad">
        </a>
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper,SwiperItem} from '../../../components/common/swiper'
export default {
  name: 'HomeSwiper',
  props:{//父组件Home传递给子组件
    banners:{
      type:Array,
      default(){
        return []
      }
    }
  },
  data(){//设置图片加载一次
    return {
      isLoad:false
    }
  },
  components:{
    Swiper,
    SwiperItem
  },
  methods: {
    imageLoad(){
      if (!this.isLoad) {
        this.$emit('swiperImageLoad');
        this.isLoad = true
      }
    }
  },
};
</script>

<style>

</style>