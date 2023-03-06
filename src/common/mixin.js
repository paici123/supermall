import {debounce} from './utils';
import BackTop from '../components/content/backTop/BackTop';
import {BACKTOP_DISTANCE} from './const'
export const itemListenerMixin = {
  data(){
    return {
      itemImgListener:null
    }
  },
  mounted(){
    // ref如果是绑定在组件中的，那么通过this.$refs.refname获取到的是一个组件对象
    // 如果是绑定在普通的元素中，那么通过this.$refs.refname获取到的是一个元素对象
    // this.$refs.swiper
    //1.监听item中的图片加载完成
    let refresh = debounce(this.$refs.scroll.refresh, 200)
    // this.$bus.$on('itemImageLoad', () => {
    //   // console.log('---------');
    //   // this.$refs.scroll && this.$refs.scroll.refresh()
    //   refresh();
    // });
    this.itemImgListener = () =>{
      refresh()
    }
    this.$bus.$on('itemImgLoad',this.itemImgListener)
    // console.log('我是混入中的内容');
  }
}
export const backTopMixin = {
  components: {
    BackTop
  },
  data(){
    return {
      isShowBackTop:false
    }
  },
  methods: {
    backClick() { //点击图片回到顶部
      this.$refs.scroll.scrollTo(0, 0,300)
    },
    listenShowBackTop(position){
      this.isShowBackTop = -position.y > BACKTOP_DISTANCE
    }
  }
}

// export const tabControlMixin = {
//   data: function () {
//     return {
//       currentType: POP
//     }
//   },
//   methods: {
//     tabClick(index) {
//       switch (index) {
//         case 0:
//           this.currentType = POP
//           break
//         case 1:
//           this.currentType = NEW
//           break
//         case 2:
//           this.currentType = SELL
//           break
//       }
//       console.log(this.currentType);
//     }
//   }
// }
