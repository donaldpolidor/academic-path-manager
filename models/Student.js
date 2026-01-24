const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    field: {
        type: String,
        required: true,
        enum: ['computer_science', 'social_sciences']
    },
    enrolledCourses: [{
        courseCode: String,
        courseTitle: String,
        grade: {
            type: String,
            enum: ['A', 'B', 'C', 'D', 'F', null]
        }
    }],
    totalCredits: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Student', studentSchema);
