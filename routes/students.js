const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { validateStudent } = require('../middleware/validation');

// GET all students
router.get('/', async (req, res) => {
    try {
        const { field } = req.query;
        let filter = {};
        
        if (field) filter.field = field;
        
        const students = await Student.find(filter).sort({ lastName: 1 });
        res.json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// GET a student by ID
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// POST create a student
router.post('/', validateStudent, async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update a student
router.put('/:id', validateStudent, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT enroll a student in a course
router.put('/:id/enroll', async (req, res) => {
    try {
        const { courseCode, courseTitle } = req.body;
        
        if (!courseCode || !courseTitle) {
            return res.status(400).json({ 
                success: false, 
                error: 'courseCode and courseTitle are required' 
            });
        }
        
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        
        // Check if already registered
        const alreadyEnrolled = student.enrolledCourses.some(
            course => course.courseCode === courseCode
        );
        
        if (alreadyEnrolled) {
            return res.status(400).json({ 
                success: false, 
                error: 'Student already enrolled in this course' 
            });
        }
        
        student.enrolledCourses.push({
            courseCode,
            courseTitle,
            grade: null
        });
        
        await student.save();
        res.json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE delete a student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ success: true, message: 'Student deleted successfully', data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
