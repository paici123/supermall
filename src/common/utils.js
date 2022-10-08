
/*  防抖函数：就是搜索时不断的发送网络请求*/
export function debounce(func,delay){
  let timer = null
  return function(...args){
      if(timer) clearTimeout(timer)
      timer = setTimeout(() => {
          func.apply(this,args)
      }, delay);
  }
}