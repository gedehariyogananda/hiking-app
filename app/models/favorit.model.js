const mongoose = require('mongoose');

const favoritSchema = new mongoose.Schema({
        user_id: {
            type: String,
            required: true
        },
        product_id: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    });


favoritSchema.method("toJSON", function() {
        const { _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

const Favorit = mongoose.model('favorits',favoritSchema);

module.exports = Favorit;
