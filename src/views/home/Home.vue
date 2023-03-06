<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl1" class="tab-control"
      v-show="isTabFixed" />
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll" :pull-up-load="true"
      @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad" />
      <home-recommend :recommends="recommends" />
      <feature-view />
      <tab-control :titles="['流行','新款','精选']" @tabClick="tabClick" ref="tabControl2" />
      <!-- <good-list :goods="goods['pop'].list"/>  写死了，只能展示流行 -->
      <good-list :goods="showGcods" />
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import HomeRecommend from './childComps/HomeRecommend'
  import FeatureView from './childComps/FeatureView'

  import NavBar from '../../components/common/navbar/NavBar'
  import TabControl from '../../components/content/tabControl/TabControl'
  import GoodList from '../../components/content/goods/GoodsList'
  import Scroll from '../../components/common/scroll/Scroll'

  import {itemListenerMixin,backTopMixin} from '../../common/mixin'
  import {getHomeMultidata,getHomeGoods} from '../../network/home'
  import {debounce} from '../../common/utils'

  export default {
    name: 'Home',
    components: {
      NavBar,
      HomeSwiper,
      HomeRecommend,
      FeatureView,
      TabControl,
      GoodList,
      Scroll,
    },
    mixins:[itemListenerMixin,backTopMixin],
    //保存请求过来的数据
    data() {
      return {
        // result:null,
        banners: [], //轮播图的资源
        recommends: [], //推荐信息的资源
        goods: { //详细商品数据
          'pop': {
            page: 0,
            list: []
          },
          'new': {
            page: 0,
            list: []
          },
          'sell': {
            page: 0,
            list: []
          },
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
      }
    },
    computed: { //计算属性
      showGcods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() { //保存回来浏览的记录
      this.$refs.scroll.scrollTo(0, this.saveY, 10)
      this.$refs.scroll.refresh() //刷新
    },
    deactivated() {
      //1.保存Y值
      this.saveY = this.$refs.scroll.getScrollY()
      //2.取消全局事件的监听
      this.$bus.$off('itemImgload',this.itemImgListener)
    },
    created() { //vue实例创建之前不能有参数  所以使用methods封装
      //1.请求多个数据
      this.getHomeMultidata();
      //2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
      //3.手动代码点击一次
      // this.tabClick(0)
    },
    mounted() {
    },
    methods: {
      /*  事件监听的方法    */
      tabClick(index) {
        // console.log(index);
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break;
          case 1:
            this.currentType = 'new'
            break;
          case 2:
            this.currentType = 'sell'
            break;
        }
        // this.showGcods = this.goods[this.currentType].list
        //让两个TabControl的currentIndex保存一致
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      contentScroll(position) { //监听滚动的位置
        // console.log(position);
        //1.判断BackTop是否显示
        this.listenShowBackTop(position);
        //2.决定tabControl是否吸顶(position:fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop;
      },
      loadMore() { //获取三页的上拉加载更多
        this.getHomeGoods(this.currentType)
      },
      swiperImageLoad() { //获取轮播图片的高度
        //2.获取tabContorl的offsetTop
        //所有的组件都有一个属性$el:用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      /*  网络请求的方法     */
      getHomeMultidata() {
        getHomeMultidata().then(res => { //1.请求多个数据  异步操作
          // console.log(res);
          // this.result = res;
          this.banners = res.data.banner.list,
          this.recommends = res.data.recommend.list
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1

          //完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }

  };
  // scoped  作用域

</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position:fixed;
        left:0;
        right:0;
        top:0;
        z-index: 9; */
  }

  .content {
    /* height: calc(100% - 93px);
        overflow: hidden;
        margin-top: 44px; */
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

</style>
