const mongoose = require('mongoose');

const userScema = new mongoose.Schema({
    userName: {
        type: String,
        require: [true, 'User must have a userName'],
        unique: true
    },
    password: {
        type: String,
        require: [true, 'User must have a password']
    }
});

const User = mongoose.model("User", userScema);
module.exports = User;