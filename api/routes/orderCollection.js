const
    express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    OrderCollection = require('../models/orderCollection');

router.post('/', (req, res, next) => {
    const orderCollection = new OrderCollection({
        _id: mongoose.Types.ObjectId(),
        created: new Date,
        lastModified: new Date,
        participants: [
            mongoose.Types.ObjectId(),
            mongoose.Types.ObjectId()
        ],
        orders: [
            mongoose.Types.ObjectId(),
            mongoose.Types.ObjectId()
        ],
        restaurantLink: req.body.restaurantLink
    });
    orderCollection
        .save()
        .then(result => {
            res.status(201).json({result});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});






router.get('/', (req, res, next) => {
    Order
        .find()
        .exec()
        .then(response => {
            res.status(200).json({response});
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

router.get('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    res.status(200).json({
        message: 'Orders detail',
        id: id
    })
});

router.delete('/:orderId', (req, res, next) => {
    const id = req.params.orderId;

    res.status(200).json({
        message: 'Orders deleted',
        id: id
    })
});

module.exports = router;