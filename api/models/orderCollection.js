const
    mongoose = require('mongoose'),
    orderCollectionSchema = mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        created: {
            type: Date
        },
        lastModified: {
            type: Date
        },
        participants: {
            type: [mongoose.Schema.Types.ObjectId],
        },
        orders: {
            type: [mongoose.Schema.Types.ObjectId],
        },
        restaurantLink: {
            type: String,
            required: true
        }
    });

module.exports = mongoose.model('OrderCollection', orderCollectionSchema);