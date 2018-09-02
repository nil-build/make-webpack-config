const browsers = require('./browserslist.config');
const merge = require('webpack-merge');

module.exports = function (cfg) {
    const useJSX = cfg.module.jsx;

    const presets = [
        [require.resolve('@babel/preset-env'), {
            "targets": {
                "ie": 9,
                "browsers": browsers
            },
            modules: "commonjs",
            useBuiltIns: false,
        }],
        useJSX ? require.resolve('@babel/preset-react') : null,
        require.resolve('@babel/preset-flow')
    ];

    return merge({
        "babelrc": false,
        "compact": false,
        "presets": presets.filter(v => v),
        "plugins": [
            require.resolve("@babel/plugin-syntax-dynamic-import"),
            require.resolve("@babel/plugin-proposal-async-generator-functions"),
            require.resolve("@babel/plugin-proposal-class-properties"),
            require.resolve("@babel/plugin-proposal-do-expressions"),
            require.resolve("@babel/plugin-proposal-export-default-from"),
            require.resolve("@babel/plugin-proposal-export-namespace-from"),
            require.resolve("@babel/plugin-proposal-function-bind"),
            require.resolve("@babel/plugin-proposal-logical-assignment-operators"),
            require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
            require.resolve("@babel/plugin-proposal-numeric-separator"),
            require.resolve("@babel/plugin-proposal-optional-chaining"),
            require.resolve("@babel/plugin-proposal-throw-expressions"),
            useJSX ? require.resolve("@babel/plugin-transform-react-jsx") : null,
            [require.resolve("@babel/plugin-proposal-decorators"), {
                legacy: true
            }],
            require.resolve("@babel/plugin-transform-proto-to-assign"), //Internet Explorer(10 and below)
            [require.resolve("@babel/plugin-transform-runtime"), {
                corejs: 2,
                helpers: true,
                regenerator: true,
                useESModules: false,
            }]
        ].filter(v => v)
    }, cfg.babelConfig)

}