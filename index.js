const {
    installDeps,
    normalizeConfig,
    getDepsFromConfig,
    createWebpackConfig,
} = require('./lib');

const build = require('./scripts/build');
const server = require('./scripts/server');
const start = require('./scripts/start');

module.exports = {
    installDeps,
    normalizeConfig,
    initWebpackConfig: installDeps,
    getDepsFromConfig,
    createWebpackConfig,
    build,
    server,
    start,
}

