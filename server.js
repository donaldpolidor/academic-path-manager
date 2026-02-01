require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection - simplified version for Mongoose 7+
mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use('/api/auth', require('./routes/auth'));  // New auth routes
app.use('/api/courses', require('./routes/courses'));
app.use('/api/students', require('./routes/students'));

// Root directory
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Academic Path Manager API',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile'
            },
            courses: {
                getAll: 'GET /api/courses',
                getOne: 'GET /api/courses/:code',
                create: 'POST /api/courses (Protected: Professor/Admin)',
                update: 'PUT /api/courses/:code (Protected: Professor/Admin)',
                delete: 'DELETE /api/courses/:code (Protected: Admin)',
                query: '?field=computer_science&level=beginner'
            },
            students: {
                getAll: 'GET /api/students (Protected)',
                getOne: 'GET /api/students/:id (Protected)',
                create: 'POST /api/students (Protected: Professor/Admin)',
                update: 'PUT /api/students/:id (Protected: Professor/Admin)',
                enroll: 'PUT /api/students/:id/enroll (Protected)',
                delete: 'DELETE /api/students/:id (Protected: Admin)',
                query: '?field=computer_science'
            }
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'healthy',
        timestamp: new Date(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Swagger documentation endpoint
app.get('/api-docs', (req, res) => {
    res.json(require('./docs/swagger.json'));
});

// Serve Swagger UI
app.get('/docs', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Academic Path Manager API Documentation</title>
            <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"></script>
            <script>
                window.onload = () => {
                    window.ui = SwaggerUIBundle({
                        url: '/api-docs',
                        dom_id: '#swagger-ui',
                    });
                };
            </script>
        </body>
        </html>
    `);
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
