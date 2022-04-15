// Karma configuration
// Generated on Sat Dec 16 2017 21:57:37 GMT-0500 (Eastern Standard Time)

const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function(config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        plugins: [
            require('karma-typescript'),                                    
            require('karma-jasmine'),
            require('karma-chrome-launcher'),            
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter')            
        ],
        client:{
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },

        coverageIstanbulReporter: {
            reports: [ 'html', 'lcovonly' ],
            fixWebpackSourcePaths: true
        },
        
        files: [
            { pattern: "src/**/*.+(js|ts)" }            
        ],

        preprocessors: {
            "src/**/*.+(js|ts)": ['karma-typescript']
        },
        
        karmaTypescriptConfig: {
            compilerOptions: {
                allowJs: true,
                experimentalDecorators: true,
                jsx: "react",
                module: "es2020",
                sourceMap: true,
                target: "es2015",
                moduleResolution: "node",
                baseUrl: "./"                
            },
            bundlerOptions: {
                transforms: [require("karma-typescript-es6-transform")()]
            },            
            exclude: [
                "node_modules",
                "deployment"
            ]
        },

        reporters: ['progress', 'kjhtml'],

        browsers: ["Chrome"],


        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        singleRun: false,
        restartOnFileChange: true        
    });
};
