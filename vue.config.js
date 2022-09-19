module.exports = {
  transpileDependencies: true,
  //配置资源文件引入的别名
  configureWebpack:{
    resolve:{
      alias:{
        'assets':'@/assets',
        'common':'@/common',
        'components':'@/network',
        'views':'@/views',
      }
    }
  }
}
