const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
        name_product: {
            type: String,
            required: true
        },
        priceday_product: {
            type: String,
            required: true,
        },
        image_product : {
            type: String,
            required: true
        },
        category_product: {
            type: String,
            required: true
        },
        description_product: {
            type: String,
            required: true
        },
        condition_product: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);


    productSchema.method("toJSON", function() {
        const { _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

const Product = mongoose.model('products', productSchema);

module.exports = Product;
