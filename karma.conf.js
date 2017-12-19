// Karma configuration
// Generated on Sat Dec 16 2017 21:57:37 GMT-0500 (Eastern Standard Time)

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

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        reporters: ["dots", "karma-typescript"],

        browsers: ["Chrome"]
    });
};
