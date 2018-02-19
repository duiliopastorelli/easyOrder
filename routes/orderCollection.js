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

router.patch('/:orderCollectionId', (req, res, next) => {
    const id = req.params.orderCollectionId;
    let updateOps = {};
    console.log(req.body);
    // for (const ops of req.body) {
    //     console.log(ops);
    //     updateOps[ops.propName] = ops.value;
    // }
    OrderCollection.update(
        {_id: id},
        {$set: req.body})
        .exec()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        })
});

router.get('/', (req, res, next) => {
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

router.delete('/:orderCollectionId', (req, res, next) => {
    const id = req.params.orderCollectionId;

    // console.log(OrderCollection.findOne({_id: id}));
    OrderCollection
        .findOne({_id: id})
        .remove()
        .exec()
        .then(response => {
            console.log(response.n);
            if (response.n !== 0) {
                res.status(200).json({
                    message: 'Resource deleted',
                    id: id
                })
            } else {
                res.status(200).json({
                    message: 'Resource not found',
                    id: id
                })
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
});

module.exports = router;