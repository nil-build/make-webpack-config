
const execSync = require('child_process').execSync;
const fs = require("fs");
const dependencies = require('./config/dependencies.config');
const webpackConfig = require('./webpack/webpack.config');
const defaultOptions = require('./defaultOptions');
const log = require('./logger');

const normalizeConfig = defaultOptions;

/**
 * 获取未安装依赖
 */
function getDepsFromConfig(cfg) {
    cfg = defaultOptions(cfg);

    const deps = new Set(dependencies.core);
    const pkgFile = process.cwd() + '/package.json';
    let pkg = {};
    if (fs.existsSync(pkgFile)) {
        pkg = require(pkgFile);
    }

    const pkgDeps = Object.assign({}, pkg.dependencies, pkg.devDependencies);

    Object.keys(cfg.module).filter(v => cfg.module[v]).forEach(v => {
        if (dependencies[v]) {
            dependencies[v].forEach(dep => {
                deps.add(dep);
            });
        }
    });

    return [...deps].filter(v => !(v in pkgDeps));
}

function installDeps(cfg) {
    const options = defaultOptions(cfg);
    const deps = getDepsFromConfig(cfg);

    const executor = options.cnpm ? 'cnpm' : 'npm';

    if (!deps.length) return;

    log('开始安装依赖，共计 ' + deps.length + ' 个...');

    const cmd = `${executor} install --save-dev ${deps.join(' ')}`;
    log(cmd);
    execSync(cmd);

    log('依赖安装完成。');
}

function createWebpackConfig(options = {}) {
    return webpackConfig(defaultOptions(options));
}

module.exports = {
    installDeps,
    normalizeConfig,
    getDepsFromConfig,
    createWebpackConfig
};
