import axios from 'axios'
export function request(config){
    //1.创建axios的实例
    const instance = axios.create({
        baseURL:'http://123.207.32.32:8000',
        timeout:5000
    })
     //2.axios的拦截器
        // axios.interceptors（全局拦截）
    instance.interceptors.request.use(config => {//请求（局部）
        //console.log(config);//发送出去了 ，但是没有打印出请求的数据
        return config;//返回回去就不会被拦截了，就不会失败了
    },err => {
        // console.log(err);
    });
    instance.interceptors.response.use(res => {//响应(局部)
        // console.log(res);
        return res.data
    },err => {
        console.log(err);
    })
    //3.发送真正的网络请求
    return instance(config)
}
