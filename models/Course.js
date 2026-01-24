const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    title: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true,
        enum: ['computer_science', 'social_sciences']
    },
    level: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);
