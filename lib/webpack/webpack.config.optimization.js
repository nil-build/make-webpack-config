const merge = require('../merge');

module.exports = function (cfg) {
    return merge({
        nodeEnv: cfg.mode,
        runtimeChunk: false,//'single' false ,
        splitChunks: {
            name: 'commons',
            chunks: 'all',
            maxAsyncRequests: 5,
            maxInitialRequests: cfg.splitChunks ? 5 : 1,
            minSize: 30000,
            cacheGroups: {
                vendors: {
                    name: "vendors",
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                },
            }
        }
    }, cfg.optimization);
}