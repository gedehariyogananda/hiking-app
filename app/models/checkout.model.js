const mongoose = require('mongoose');

const checkoutSchema = new mongoose.Schema({
        user_id: {
            type: String,
            required: true
        },
        result_checkout : {
            type: String,
            required: true
        },
        date_checkout : {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    });


checkoutSchema.method("toJSON", function() {
        const { _id, __v, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

const Checkout = mongoose.model('checkouts',checkoutSchema);

module.exports = Checkout;
