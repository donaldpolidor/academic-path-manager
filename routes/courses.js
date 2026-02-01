const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { validateCourse } = require('../middleware/validation');
const { auth, professorAuth } = require('../middleware/auth');

// GET all courses - Public
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

// GET a course by code - Public
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

// POST create a course - Protected (Professor or Admin only)
router.post('/', auth, professorAuth, validateCourse, async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ 
            success: true, 
            message: 'Course created successfully',
            data: course 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update a course - Protected (Professor or Admin only)
router.put('/:code', auth, professorAuth, validateCourse, async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            { code: req.params.code.toUpperCase() },
            req.body,
            { new: true, runValidators: true }
        );
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        res.json({ 
            success: true, 
            message: 'Course updated successfully',
            data: course 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE delete a course - Protected (Admin only)
router.delete('/:code', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied. Admin privileges required.' 
            });
        }
        
        const course = await Course.findOneAndDelete({ code: req.params.code.toUpperCase() });
        if (!course) {
            return res.status(404).json({ success: false, error: 'Course not found' });
        }
        res.json({ 
            success: true, 
            message: 'Course deleted successfully', 
            data: course 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
