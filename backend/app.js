const express = require('express');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
// Middleware
app.use(cors());
app.use(express.json());

// Routes (we’ll add these soon)
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

module.exports = app;
