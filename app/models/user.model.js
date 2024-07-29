const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email_user: {
            type: String,
            required: true,
            unique: true
        },
        phone_number_user : {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    });


    userSchema.method("toJSON", function() {
        const { _id, __v, ...object } = this.toObject();
        object.id = _id;
        return object;
    })

const User = mongoose.model('users', userSchema);

module.exports = User;
