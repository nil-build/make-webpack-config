
const webpackDevServer = require('webpack-dev-server');
const isFunction = require('lodash.isfunction');
const { installDeps, normalizeConfig, createWebpackConfig } = require('../lib');
const webpack = require("webpack");
const merge = require("webpack-merge");
const omit = require('object.omit');
const opn = require("opn");
const log = require('../lib/logger');

const options = {
    host: '127.0.0.1',
    clientLogLevel: 'none',
    hot: true,
    overlay: false,
    compress: true,
    port: 9000,
};

module.exports = function (cfg = {}) {
    if (isFunction(cfg)) {
        cfg = cfg(normalizeConfig({}));
    }

    const devServer = cfg.devServer || {};

    cfg = omit(cfg, ['devServer', 'watch']);

    installDeps(cfg);

    const webpackConfig = merge(createWebpackConfig(cfg), cfg.webpack || {});

    const compiler = webpack(webpackConfig);

    const devServerOptions = Object.assign({}, options, devServer, {
        contentBase: webpackConfig.output.path,
    });

    const server = new webpackDevServer(compiler, devServerOptions);

    server.listen(devServerOptions.port, devServerOptions.host, () => {
        log('Starting server on http://%s:%d', devServerOptions.host, devServerOptions.port);
        opn(`http://${devServerOptions.host}:${devServerOptions.port}`);
    });

}