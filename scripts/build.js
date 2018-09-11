const isFunction = require('lodash.isfunction');
const { installDeps, normalizeConfig, createWebpackConfig } = require('../lib');
const webpack = require("webpack");
const merge = require("webpack-merge");
const omit = require('object.omit');
const log = require('../lib/logger');

module.exports = function (cfg = {}) {
    if (isFunction(cfg)) {
        cfg = cfg(normalizeConfig({}));
    }

    cfg.mode = 'production';
    // const watch = cfg.watch;

    cfg = omit(cfg, ['devServer', 'watch']);

    installDeps(cfg);

    const webpackConfig = merge(createWebpackConfig(cfg), cfg.webpack || {});
    const compiler = webpack(webpackConfig);

    const compilerCb = function (err, stats) {
        if (err) {
            return log(err);
        }

        log(stats.toString({
            chunks: false,
            colors: true,
        }));
    }

    compiler.run(compilerCb);

}