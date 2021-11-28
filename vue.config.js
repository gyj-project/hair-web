module.exports = {
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/hair':{
                target:'http://localhost:8081',
                changeOrigin:true,
                pathRewrite:{
                    '/hair':''
                }
            }
        }
    }
}