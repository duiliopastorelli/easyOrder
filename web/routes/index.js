const
    express = require('express'),
    router = express.Router(),
    jsBundles = require('../public/js/bundle.result.json');

/* GET home page. */
router.get('/', function (req, res, next) {

    const scriptsToLoad = {};

    //Determine if vue should start on develop or production mode
    if (process.env.NODE_ENV === 'production') {
        scriptsToLoad.vue = jsBundles.vue.scripts
    } else {
        scriptsToLoad.vue = jsBundles.vueDev.scripts
    }

    res.render('index', {
        title: 'Express',
        process: process.env.NODE_ENV,
        scriptVue: scriptsToLoad.vue
    });
});

module.exports = router;