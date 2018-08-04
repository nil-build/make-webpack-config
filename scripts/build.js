const { init } = require('./utils');
const webpack = require("webpack");
const merge = require("webpack-merge");
const omit = require('object.omit');

module.exports = async function (cfg = {}) {
    cfg.mode = 'production';
    const watch = cfg.watch;

    cfg = omit(cfg, ['devServer', 'watch']);

    const webpackConfig = merge(await init(cfg), cfg.webpack || {});
    const compiler = webpack(webpackConfig);

    const compilerCb = function (err, stats) {
        if (err) {
            return console.log(err);
        }

        console.log(stats.toString({
            chunks: false,
            colors: true,
        }));
    }
    if (watch) {
        compiler.watch({
            aggregateTimeout: 300,
            poll: undefined
        }, compilerCb);
    } else {
        compiler.run(compilerCb);
    }

}