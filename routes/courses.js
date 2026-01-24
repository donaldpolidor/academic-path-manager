const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { validateCourse } = require('../middleware/validation');

// GET all courses
router.get('/', async (req, res) => {
    try {
        const { field, level } = req.query;
        let filter = {};
        
        if (field) filter.field = field;
        if (level) filter.level = level;
        
        const courses = await Course.find(filter).sort({ code: 1 });
        res.json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET a course by code
router.get('/:code', async (req, res) => {
    try {
        const course = await Course.findOne({ code: req.params.code.toUpperCase() });
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        res.json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create a course
router.post('/', validateCourse, async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update a course
router.put('/:code', validateCourse, async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { code: req.params.code.toUpperCase() },
            req.body,
            { new: true, runValidators: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        res.json({ success: true, data: course });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE delete a course
router.delete('/:code', async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({ code: req.params.code.toUpperCase() });
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        res.json({ success: true, message: 'Course deleted successfully', data: course });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
