const mongoose = require('mongoose');

const userPurchaseSchema = new mongoose.Schema({
        user_id: {
            type: String,
            required: true
        },
        product_id: {
            type: String,
            required: true
        },
        start_borrow_purchased : {
            type: Date,
            required: true
        
        },
        end_borrow_purchased : {
            type: Date,
            required: true
        
        },
        result_price_purchased : {
            type: String,
            required: false
        },
        status_purchased : {
            type: String,
            required: true
        },
        checkout : {
            type : Number,
            required: false
        },
        attemp_purchased : {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });


    userPurchaseSchema.method("toJSON", function() {
        const { _id, __v, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

const UserPurchased = mongoose.model('user_purchaseds', userPurchaseSchema);

module.exports = UserPurchased;
