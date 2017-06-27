const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: {
        client: "./client/app"
    },
    output: {
        // options related to how webpack emits results

        path: path.resolve(__dirname, "build"), // string
        // the target directory for all output files
        // must be an absolute path (use the Node.js path module)

        filename: "[name].js", // string
        // the filename template for entry chunks
    },
    module: {
        // configuration regarding modules

        rules: [
            // rules for modules (configure loaders, parser options, etc.)

            {
                test: /\.js$/,
                loader: "babel-loader",
                include: [
                    path.resolve(__dirname, "client")
                ],
                exclude: [
                    path.resolve(__dirname, "node_modules")
                ],
                options: {
                    presets: ["es2015"]
                },
            }
        ]
    },
    resolve: {
        // options for resolving module requests
        // (does not apply to resolving to loaders)

        modules: [
            "node_modules",
            path.resolve(__dirname, "client")
        ],
        // directories where to look for modules

        extensions: [".js", ".json", ".css"]
        // extensions that are used
    },
    context: __dirname,
    plugins: [new HtmlWebpackPlugin({
        title: "sea-battle"
    })],
    devtool: "eval-source-map"
};

module.exports = config;