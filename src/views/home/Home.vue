<template>
    <div id="home">
        <nav-bar class="home-nav">
            <div slot="center">购物街</div>
        </nav-bar>
        <scroll class="content" ref="scroll">
            <home-swiper :banners="banners" ref="swiper"/>
            <home-recommend :recommends="recommends"/>
            <feature-view/>
            <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"/>
            <!-- <good-list :goods="goods['pop'].list"/>  写死了，只能展示流行 -->
            <good-list :goods="showGcods"/>
        </scroll>
        <back-top @click.native="backClick"/>
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
import BackTop from '../../components/content/backTop/BackTop';

import {getHomeMultidata,getHomeGoods} from '../../network/home'


export default {
    name: 'Home',
    components:{
        NavBar,
        HomeSwiper,
        HomeRecommend,
        FeatureView,
        TabControl,
        GoodList,
        Scroll,
        BackTop
    },
    //保存请求过来的数据
    data(){
        return {
            // result:null,
            banners:[],//轮播图的资源
            recommends:[],//推荐信息的资源
            goods:{//详细商品数据
                'pop':{page:0,list:[]},
                'new':{page:0,list:[]},
                'sell':{page:0,list:[]},
            },
            currentType:'pop'
        }
    },
    computed:{//计算属性
        showGcods(){
            return this.goods[this.currentType].list
        }
    },
    created(){//vue实例创建之前不能有参数  所以使用methods封装
        //1.请求多个数据
        this.getHomeMultidata();
        //2.请求商品数据
        this.getHomeGoods('pop');
        this.getHomeGoods('new');
        this.getHomeGoods('sell');

    },
    // mounted() {
        //ref如果是绑定在组件中的，那么通过this.$refs.refname获取到的是一个组件对象
        //如果是绑定在普通的元素中，那么通过this.$refs.refname获取到的是一个元素对象
    //     this.$refs.swiper
    // },
    methods:{
        /*  事件监听的方法    */
        tabClick(index){
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
        },
        backClick(){//点击图片回到顶部
            this.$refs.scroll.scrollTo(0,0)
        },
        /*  网络请求的方法     */
        getHomeMultidata(){
            getHomeMultidata().then(res =>{//1.请求多个数据  异步操作
                // console.log(res);
                // this.result = res;
                this.banners = res.data.banner.list,
                this.recommends = res.data.recommend.list
            })
        },
        getHomeGoods(type){
            const page = this.goods[type].page + 1;
            getHomeGoods(type,page).then(res => {
                this.goods[type].list.push(...res.data.list);
                this.goods[type].page += 1
            })
        }
    }

};
// scoped  作用域
</script>

<style scoped>
    #home{
        padding-top: 44px;
        height: 100vh;
        position:relative;
    }
    .home-nav{
        background-color: var(--color-tint);
        color: #fff;
        position:fixed;
        left:0;
        right:0;
        top:0;
        z-index: 9;
    }
    .tab-control{
        position: sticky;
        top:44px;
        z-index: 9;
    }
    .content{
        /* height: calc(100% - 93px); */
        overflow: hidden;
        position:absolute;
        top:44px;
        bottom:49px;
    }
</style>

