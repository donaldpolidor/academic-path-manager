const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { validateStudent } = require('../middleware/validation');
const { auth, professorAuth } = require('../middleware/auth');

// GET all students - Protected (Authenticated users only)
router.get('/', auth, async (req, res) => {
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

// GET a student by ID - Protected (Authenticated users only)
router.get('/:id', auth, async (req, res) => {
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

// POST create a student - Protected (Professor or Admin only)
router.post('/', auth, professorAuth, validateStudent, async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json({ 
            success: true, 
            message: 'Student created successfully',
            data: student 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT update a student - Protected (Professor or Admin only)
router.put('/:id', auth, professorAuth, validateStudent, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ 
            success: true, 
            message: 'Student updated successfully',
            data: student 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// PUT enroll a student in a course - Protected (Authenticated users only)
router.put('/:id/enroll', auth, async (req, res) => {
    try {
        // Students can only enroll themselves, professors/admins can enroll anyone
        if (req.user.role === 'student') {
            // Here you would add logic to check if student is enrolling themselves
            // For now, we'll allow it with a note
            console.log(`Student ${req.user.username} is enrolling in a course`);
        }
        
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
        res.json({ 
            success: true, 
            message: 'Student enrolled successfully',
            data: student 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// DELETE delete a student - Protected (Admin only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied. Admin privileges required.' 
            });
        }
        
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }
        res.json({ 
            success: true, 
            message: 'Student deleted successfully', 
            data: student 
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
