import {ADD_COUNTER,ADD_TO_CART} from './mutation-types'
export default{
  addCart(context, payload) {
    // 1.查看之前数据中是否添加过
    let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

    // 2.+1或者新添加
    if (oldProduct) {//数量加1
      // oldProduct.count += 1
      context.commit(ADD_COUNTER,oldProduct)
      resolve('当前的商品数量加1')
    } else {//添加新的商品
      payload.count = 1
      context.commit(ADD_TO_CART,payload)
      resolve('添加了新的商品')
    }
  }
}