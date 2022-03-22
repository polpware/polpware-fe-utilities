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
            { pattern: "src/**/*.ts" }
        ],

        typescriptPreprocessor: {
            // options passed to the typescript compiler
            options: {
                target: 'ES6' // (optional) Specify ECMAScript target version: 'ES3' (default), or 'ES5'
            }
        },        

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
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
