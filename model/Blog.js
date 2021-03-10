const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        reqruired: true
    },

    discription: {
        type: String,
        reqruired: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('blog', blogSchema);