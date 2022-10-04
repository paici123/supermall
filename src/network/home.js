import {request} from './request'

export function getHomeMultidata(){
  return request({
    url:'/home/multidata'
  })
}

export function getHomeGoods(type,page){
  return request({
    url:'/home/data',
    params:{
      type,
      page
    }
  })
}

//函数调用 -> 压入函数栈(保存函数调用过程中所有变量)
//函数调用结束 -> 弹出函数栈(释放函数所有的变量)
// function text(){
//   const names = ['why','aaa']
// }
// test()

// const totalNums = []
// const nums = [20,11,222]
// totalNums = nums //不能直复制

// // for {let n of nums1}{
// //   totalNums.push(n)
// // }//遍历可以 但不是最好

// totalNums.push(...nums) 最佳方法