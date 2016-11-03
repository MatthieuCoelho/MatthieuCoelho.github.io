var gulp = require("gulp");
var webpack = require("gulp-webpack");
var webpackClassique = require("webpack");
var webpackDevServer = require("webpack-dev-server");
var path = require("path");


var mainJS = __dirname + "/dev/main.jsx";
var racineDevProject = __dirname + "/dev/";
var repertoireFichierMinifier = __dirname + "/";
var nomFichierMinifier = "bundle.js";

gulp.task("dev-server", function (callback) {
    var compiler = webpackClassique({
        entry: mainJS,
        output: {
            path: path.resolve(repertoireFichierMinifier),
            publicPath: "http://localhost:8081/assets/",
            filename: nomFichierMinifier
        },
        resolve: {
            root: [
                path.resolve(racineDevProject)
            ]
        },
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    loader: 'babel',
                    query: {
                        presets: ['react', 'es2015'],
                        plugins: ['transform-runtime']
                    },
                },
                {
                    test: /\.scss$/,
                    loaders: ["style", "css", "sass"]
                },
                {
                    test: /\.css$/,
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.png$/,
                    loader: "url-loader?limit=100000"
                },
                { 
                    test: /\.svg$/, 
                    loader: 'file-loader' 
                }
            ]
        }
    });

    new webpackDevServer(compiler, {
        publicPath: "http://localhost:8081/assets/"
    }).listen(8081, "localhost", function (err) { });
});

gulp.task("prod", function () {
    return gulp.src(mainJS)
        .pipe(webpack({
            output: {
                path: path.resolve(repertoireFichierMinifier),
                filename: nomFichierMinifier
            },
            watch:true,
            //Minification
            plugins: [
                //Utilise les version min des packages
                new webpackClassique.DefinePlugin({
                    "process.env": {
                        "NODE_ENV": JSON.stringify("production")
                    }
                }),
                //minifie notre code js
                new webpackClassique.optimize.UglifyJsPlugin()

            ],
            resolve: {
                root: [
                    path.resolve(racineDevProject)
                ]
            },
            module: {
                loaders: [
                    {
                        test: /\.jsx?$/,
                        exclude: /(node_modules)/,
                        loader: 'babel',
                        query: {
                            presets: ['react', 'es2015'],
                            plugins: ['transform-runtime']
                        },
                    },
                    {
                        test: /\.scss$/,
                        loaders: ["style", "css", "sass"]
                    },
                    {
                        test: /\.css$/,
                        loader: "style-loader!css-loader"
                    },
                    {
                        test: /\.png$/,
                        loader: "url-loader?limit=100000"
                    },
                    { 
                        test: /\.svg$/, 
                        loader: 'file-loader' 
                    }
                ]
            }
        }))
        .pipe(gulp.dest(repertoireFichierMinifier));
});
