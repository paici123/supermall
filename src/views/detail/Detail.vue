<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <!-- 属性：topImages 传入值：top-images -->
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detailInfo="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
    <toast :message="message" :show="show"/>
  </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar'

import Scroll from '../../components/common/scroll/Scroll'
import GoodsList from '../../components/content/goods/GoodsList'
// import Toast from '../../components/common/toast/Toast'

import {getDetail,Goods,Shop,GoodsParam,getRecommend} from '../../network/detail'
import {debounce} from '../../common/utils'
import {itemListenerMixin,backTopMixin} from '../../common/mixin'
import {mapActions} from 'vuex'

export default {
  name: 'Detail',
  components:{
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    Scroll,
    // Toast,
  },
  mixins:[itemListenerMixin,backTopMixin],
  data() {
    return {
      iid:null,
      topImages:[],
      goods:{},//详情页轮播图下的文字
      shop:{},
      detailInfo:{},
      paramInfo:{},
      commentInfo:{},//详情页中的评论信息
      recommends:[],//保存请求推荐数据
      themeTopYs:[],
      getThemeTopY:null,
      currentIndex:0,
      // message:'',
      // show:false,
    };
  },
  created() {
    //1.获取iid
    this.iid = this.$route.params.iid
    //2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);//打印数据
      //1.获取数据
      const data = res.result;
      //2.获取顶部图片轮播数据
      this.topImages = data.itemInfo.topImages
      //3.获取商品信息
      this.goods = new Goods(data.itemInfo,data.columns,data.shopInfo.services)
      //4.创建店铺信息的对象
      this.shop = new Shop(data.shopInfo)
      //5.保存商品的详情数据
      this.detailInfo = data.detailInfo
      //6.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
      //7.取出清理的信息
      if(data.rate.cRate !==0){//判断是否有评论信息，等于0没有，不等于有
        this.commentInfo = data.rate.list[0]
      }
      /*
      //1.第一次获取，值不对。
      //值不对的原因：this.$refs.params.$el压根没有渲染
      this.themeTopYs=[];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);

      //回调函数
      this.$nextTick(()=>{
        //2.第二次获取：值不对
        //值不对的原因：图片没有计算在类
        //根据最新的数据，对应的DOM是已经被渲染出来
        //但是图片依然是没有加载完(目前获取到offsetTop不包含其中的图片)
        //offsetTop值不对的适合，都是因为图片的问题
        this.themeTopYs=[];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.param.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        console.log(this.themeTopYs);
      });*/
    })
    //3.请求推荐数据
    getRecommend().then(res => {
      //console.log(res);//打印请求推荐数据
      this.recommends = res.data.list;
    })
    //4.给getThemeTopY赋值(对给this.themeTopYs赋值的操作进行防抖)
    this.getThemeTopY=debounce(() => {
      this.themeTopYs=[];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop-49);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop-49);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop-49);
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
    },200)
  },
  mounted() {
  },
  destroyed() {
    this.$bus.$off(itemImgLoad,this.itemImgListener);
  },
  methods: {
    ...mapActions({add:addCart}),
    //刷新
    imageLoad(){
      // this.refresh()
      this.$refs.scroll.refresh()
      this.getThemeTopY()
    },
    titleClick(index){
      // console.log(index);
      this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
    },
    contentScroll(position){
      // console.log(position);
      //1.获取y值
      const positionY = -position.y
      //2.positionY和主题中的值进行比较
      // [0, 5755, 6515, 6848,Number.MAX_VALUE]
      //console.log(Number.MAX_VALUE);
      // positionY 在0和5755之间，index=0
      // positionY 在5755和6515之间，index=1
      // positionY 在6515和6848之间，index=2
      // positionY 大于或者等于6848值，index=3
      let length = this.themeTopYs.length
      for(let i = 0;i < length-1; i++){
        // if(this.currentIndex !==i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY <
        //   this.themeTopYs[i+1]) || (i === length -1 && positionY >= this.themeTopYs[i]))){
        //   this.currentIndex=i;
        //   this.$refs.nav.currentIndex = this.currentIndex;
        // }
        if(this.currentIndex !==i && (positionY >= this.themeTopYs[i] && positionY <this.themeTopYs[i+1])){
          this.currentIndex=i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }
      //3.是否显示回到顶部
      this.listenShowBackTop(position);
    },
    addToCart(){
      // 1.获取购物车展示信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      //2.将商品添加到购物车
      // this.$store.cartList.push(product)
      // this.$store.commit('addCart',product)
      this.addCart(product).then(res=>{
        // this.show = true;
        // this.message = res;
        // // console.log(res);
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = ''
        // }, 1000);
        this.$toast.show('res',1500)
      })
      // this.$store.dispatch('addCart',product).then(res => {
      //   console.log(res);
      // })
    }
  }
};
</script>

<style scoped>
#detail{
  position: relative;
  z-index: 9;
  background-color: #fff;
  height:100vh;
}
.detail-nav{
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content{
  background-color: #fff;
  height:calc(100% - 44px)
}
</style>