<template>
  <swiper>
    <swiper-item v-for="item in banners">
        <a :href="item.link">
            <img :src="item.image" alt="">
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
  components:{
    Swiper,
    SwiperItem
  }
};
</script>

<style>

</style>