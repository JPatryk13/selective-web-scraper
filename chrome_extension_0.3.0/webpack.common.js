const path = require('path');
const glob = require('glob');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { log } = require('console');

module.exports = {
    entry: {
        'content-scripts': {
            import: generateEntries("./src/content-scripts")
        },
        'service-worker': {
            import: generateEntries("./src/service-worker")
        },
        'popup/assets/scripts/popup': {
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
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    },
                    {
                        loader: 'eslint-loader'
                    }
                ],
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@tools/Types': path.resolve(__dirname, 'src/tools/Types.ts'),
            '@tools/Errors': path.resolve(__dirname, 'src/tools/Errors.ts'),
            '@tools/utils/RequestHandler': path.resolve(__dirname, 'src/tools/utils/RequestHandler.ts'),
            '@tools/utils/PopupCollectionUtil': path.resolve(__dirname, 'src/tools/utils/PopupCollectionUtil.ts'),
            '@tools/utils/UIManager': path.resolve(__dirname, 'src/tools/utils/UIManager.ts'),
            '@tools/utils/WindowDimensions': path.resolve(__dirname, 'src/tools/utils/WindowDimensions.ts'),
            '@tools/utils/SubmitTextStatics': path.resolve(__dirname, 'src/tools/utils/SubmitTextStatics.ts'),
            '@tools/utils/Logging': path.resolve(__dirname, 'src/tools/utils/Logging.ts'),
        },
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

/**
 * Generate list of entry filenames under the given _path.
 * 
 * @param {string} _path 
 * @param {string} [_ext="ts"]
 * @param {boolean} [_resolve=true] 
 * @returns {string[]}
 */
function generateEntries(_path, _ext = "ts", _resolve = true) {
    // console.log("======== " + _path + " ========"); // DEBUG
    // console.log("__dirname: " + __dirname); // DEBUG

    const entries = [];
    const files = glob.sync(`${_path}/**/*${_ext.includes(".") ? _ext : "." + _ext}`);

    // console.log("files: "); // DEBUG
    // console.log(files); // DEBUG
    // console.log('\n'); // DEBUG

    files.forEach((file) => {
        const entryName = path.relative(`${_path}`, file);

        // console.log("entryName: " + entryName); // DEBUG
        // console.log("file: " + file); // DEBUG
        // console.log("path.resolve(__dirname, file): " + path.resolve(__dirname, file) + '\n'); // DEBUG

        entries.push(_resolve ? path.resolve(__dirname, file) : file);
    });

    // console.log('\n\n'); // DEBUG

    if (entries.length === 0) {
        throw new Error(`No files were found at the entry path: ${_path} or entry path does not exist.`);
    } else {
        return entries;
    }
}