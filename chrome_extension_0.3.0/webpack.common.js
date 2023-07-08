const path = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        utils: generateEntries("./src/utils"),
        'content-scripts': {
            dependOn: utils,
            import: generateEntries("./src/content-scripts")
        },
        'service-worker': {
            dependOn: utils,
            import: generateEntries("./src/service-worker")
        },
        'popup/assets/scripts/popup': {
            dependOn: utils,
            import: generateEntries("./src/popup/assets/scripts")
        },
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, './dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    // Copy already compiled stylesheets
                    from: './src/popup/assets/styles/css/*.css',
                    to: 'popup/assets/css/[name][ext]',
                },
                {
                    from: './src/popup/*.html',
                    to: 'popup/[name][ext]',
                },
            ],
        }),
    ],
}

// Generate list of entry filenames under the given _path
function generateEntries(_path) {
    const entries = [];
    const files = glob.sync(`${_path}/**/*`);

    files.forEach((file) => {
        const entryName = path.relative(`${_path}`, file);
        entries.push(path.resolve(__dirname, file));
    });

    return entries;
}