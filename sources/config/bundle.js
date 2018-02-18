'use strict';

// Set default options for uglify on production only and for add the async flag
// Include this object
let options = {
        uglify: 'production',
        result: {
            type: {
                scripts: function xJavascript(path) {
                    return "<script async src='" + path + "'></script>";
                }
            }
        },
    },
    syncOptions = {
        uglify: 'production',
        result: {
            type: {
                scripts: function xJavascript(path) {
                    return "<script src='" + path + "'></script>";
                }
            }
        }
    };

module.exports = {
    bundle: {
        "vueDev": {
            scripts: [
                './public/js/temp/vue.js'
            ],
            options: syncOptions
        },
        "vue": {
            scripts: [
                './public/js/temp/vue.min.js'
            ],
            options: syncOptions
        }
    }
};