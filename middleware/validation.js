const validateCourse = (req, res, next) => {
    const { code, title, field, level, credits } = req.body;
    
    const errors = [];
    
    if (!code || code.trim().length < 2) {
        errors.push('Course code is required and must be at least 2 characters');
    }
    
    if (!title || title.trim().length < 3) {
        errors.push('Course title is required and must be at least 3 characters');
    }
    
    if (!field || !['computer_science', 'social_sciences'].includes(field)) {
        errors.push('Field must be either "computer_science" or "social_sciences"');
    }
    
    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
        errors.push('Level must be "beginner", "intermediate", or "advanced"');
    }
    
    if (!credits || credits < 1 || credits > 6) {
        errors.push('Credits must be between 1 and 6');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors.map(msg => ({ message: msg }))
        });
    }
    
    next();
};

const validateStudent = (req, res, next) => {
    const { studentId, firstName, lastName, email, field } = req.body;
    
    const errors = [];
    
    if (!studentId || studentId.trim().length < 3) {
        errors.push('Student ID is required and must be at least 3 characters');
    }
    
    if (!firstName || firstName.trim().length < 2) {
        errors.push('First name is required and must be at least 2 characters');
    }
    
    if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name is required and must be at least 2 characters');
    }
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Valid email is required');
    }
    
    if (!field || !['computer_science', 'social_sciences'].includes(field)) {
        errors.push('Field must be either "computer_science" or "social_sciences"');
    }
    
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            errors: errors.map(msg => ({ message: msg }))
        });
    }
    
    next();
};

module.exports = { validateCourse, validateStudent };
