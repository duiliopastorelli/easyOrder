const
    express = require('express'),
    router = express.Router(),
    app = express(),
    morgan = require('morgan'),
    mongoose = require('mongoose'),
    OrderCollection = require('./models/orderCollection'),
    orderRoutes = require('./routes/orderCollection'),
    bodyParser = require('body-parser');


mongoose.connect('mongodb://just-order-mongo/api');

//Enable request logging on console
app.use(morgan('dev'));

//Enable the body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Adjust header for CORS errors
//The 2nd parameter can be used to restrict the allowance to a specific domain
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    //Handle the 1st request in which the browser is checking if it can perform
    //the request
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH,' +
            ' DELETE, PUT');
        return res.status(200).json({});
    }
    next();
});

//todo move me in router folder
app.use('/', router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'all good!'
    })
}));

app.use('/orderCollection', orderRoutes);











router.get('/db', (req, res, next) => {
    OrderCollection
        .find()
        .exec()
        .then(response => {
            res.status(200).json({response});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

//The request didn't find any route, let's catch it
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//Catch any other errors thrown by the db for i.e.
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;