<template>
  <div class="bottom-bar">
    <check-button class="select-all" :is-checked="isSelectAll" @click.native="checkClick"/>
    <span>全选</span>
    <span class="total-price">合计: ¥{{totalPrice}}</span>
    <span class="buy-product" @click="calcClick">去计算：{{checkLength}}</span>
  </div>
</template>

<script>
  import CheckButton from './CheckButton'
  import {mapGetters} from 'vuex'

	export default {
		name: "CartBottomBar",
    components: {
		  CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
		  totalPrice() {//合计
        return this.cartList.filter(item => {
          return item.checked
        }).reduce((preValue,item)=>{
          return item.price * item.count
        },0)
      },
      checkLength(){//结算
        return this.cartList.filter(item => item.checked).length
      },
      isSelectAll(){//部分选中，全选不显示；全部选中，全选显示
        if(this.cartList.length === 0){
          return false
        }else{
          //方法一：使用find
          // return !this.cartList.find(item => !item.checked)
          //方法二：使用filter
          // return !(this.cartList.filter(item => !item.checked).length)
          //方法三：普通遍历
          for(let item of this.cartList){
            if(!item.checked){
              return false
            }
          }
          return true
        }
      }
    },
    methods: {
      checkClick(){//点击全选与不选
        if(this.isSelectAll){
          this.cartList.forEach(item => item.checked = false)
        }else{
          this.cartList.forEach(item => item.checked = true)
        }
      },
      calcClick(){
        if(!this.isSelectAll){
          this.$toast.show('请选择购买的商品',2000)
        }
      }
    },
	}
</script>

<style scoped>
  .bottom-bar {
    width: 100%;
    height: 44px;
    background-color: #eee;
    position: fixed;
    bottom: 50px;
    left: 0;
    box-shadow: 0 -2px 3px rgba(0, 0, 0, .2);
    font-size: 16px;
    color: #888;
    line-height: 44px;
    padding-left: 35px;
    box-sizing: border-box;
  }

  .bottom-bar .select-all {
    position: absolute;
    line-height: 0;
    left: 12px;
    top: 13px;
  }

  .bottom-bar .total-price {
    margin-left: 15px;
    font-size: 16px;
    color: #666;
  }

  .bottom-bar .buy-product {
    background-color: orangered;
    color: #fff;
    width: 100px;
    height: 44px;
    text-align: center;
    line-height: 44px;
    float: right;
  }
</style>
