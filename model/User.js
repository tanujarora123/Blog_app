const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        reqruired: true
    },

    email: {
        type: String,
        default: null
    },

    password: {
        type: String,
        default: null
    },

    googleId: {
        type: String,
        default: null
    },

    image: {
        type: String,
        default: null
    },
});

module.exports = mongoose.model('user', userSchema);