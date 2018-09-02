const path = require('path');
const fs = require("fs");
const babelConfig = require('./babel.config');

module.exports = function (cfg) {
    const rules = [];
    const oneOf = [];

    const assestMedia = cfg.assest.media;

    if (cfg.module.eslint) {
        const eslintFile = fs.existsSync(cfg.eslintFile) ? cfg.eslintFile : null;
        rules.push(
            {
                enforce: "pre",
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: require.resolve("eslint-loader"),
                options: {
                    baseConfig: require('./eslint.config.js'),
                    useEslintrc: false,
                    configFile: eslintFile,
                }
            }
        );
    }

    if (cfg.module.vue) {
        rules.push({
            test: /\.vue$/,
            loader: require.resolve("vue-loader"),
        });
    }

    oneOf.push({
        test: /\.html?$/,
        loader: require.resolve("html-loader"),
        options: cfg.htmlLoaderOptions
    });

    oneOf.push({
        test: cfg.rawLoaderRegexp,
        loader: require.resolve("raw-loader"),
    });

    if (cfg.module.babel) {
        oneOf.push({
            test: /\.jsx?$/,
            exclude: [
                /(node_modules|bower_components)/m,
                // /node_modules[\\/]core-js/m, //解决$export错误，不应该再对core-js转码，不然出现循环依赖问题
                // /node_modules[\\/]babel-runtime/m,
                // /node_modules[\\/]@babel/m,
                // /node_modules[\\/]webpack/m,
            ],
            use: [{
                loader: require.resolve('babel-loader'),
                options: babelConfig(cfg)
            }]
        });
    }

    if (cfg.module.css) {
        oneOf.push({
            test: /\.css$/,
            use: [
                //require.resolve("style-loader"),
                require(require.resolve("mini-css-extract-plugin")).loader,
                require.resolve('css-loader'),
                {
                    loader: require.resolve("postcss-loader"),
                    options: {
                        config: {
                            path: path.resolve(__dirname, './postcss.config.js')
                        }
                    }
                }
            ]
        });
    }
    if (cfg.module.less) {
        oneOf.push({
            test: /\.less$/,
            use: [
                //require.resolve("style-loader"),
                require(require.resolve("mini-css-extract-plugin")).loader,
                require.resolve('css-loader'),
                {
                    loader: require.resolve("postcss-loader"),
                    options: {
                        config: {
                            path: path.resolve(__dirname, './postcss.config.js')
                        }
                    }
                },
                require.resolve("less-loader")
            ]
        });
    }
    if (cfg.module.sass) {
        oneOf.push({
            test: /\.scss$/,
            use: [
                //require.resolve("style-loader"),
                require(require.resolve("mini-css-extract-plugin")).loader,
                require.resolve('css-loader'),
                {
                    loader: require.resolve("postcss-loader"),
                    options: {
                        config: {
                            path: path.resolve(__dirname, './postcss.config.js')
                        }
                    }
                },
                require.resolve("sass-loader")
            ]
        });
    }
    if (cfg.module.json5) {
        oneOf.push({
            test: /\.json5$/,
            loader: require.resolve('json5-loader')
        });
    }

    oneOf.push({
        test: assestMedia.regexp,
        use: [{
            loader: require.resolve('url-loader'),
            options: {
                limit: assestMedia.limit,
                name: assestMedia.output + '/' + assestMedia.name,
            }
        }]
    });

    const exclude = [
        /\.ejs$/,
        /\.jsx?$/,
        /\.css$/,
        /\.scss$/,
        /\.less$/,
        /\.json5?$/,
        /\.html?$/,
        cfg.rawLoaderRegexp,
        assestMedia.regexp,
    ];

    if (cfg.module.vue) {
        exclude.push(/\.vue$/);
    }

    oneOf.push({
        exclude,
        loader: require.resolve('file-loader'),
        options: {
            name: assestMedia.output + '/' + assestMedia.name,
        }
    });

    rules.push({
        oneOf
    });

    return { rules };
}