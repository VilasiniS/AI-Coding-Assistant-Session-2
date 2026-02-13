const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT 0,
    category TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial sample data
const initialTasks = [
  { title: 'Complete project documentation', dueDate: '2026-02-20', priority: 'high', description: 'Write comprehensive docs' },
  { title: 'Review PR for task feature', dueDate: '2026-02-15', priority: 'medium', description: '' },
  { title: 'Setup database schema', dueDate: '2026-02-25', priority: 'high', description: 'Design task table' }
];

const insertTaskStmt = db.prepare(`
  INSERT INTO tasks (title, description, due_date, priority, category)
  VALUES (?, ?, ?, ?, ?)
`);

initialTasks.forEach(task => {
  insertTaskStmt.run(task.title, task.description, task.dueDate, task.priority, 'Work');
});

console.log('Database initialized with sample tasks');

// Input validation helpers
function validateTask(data) {
  const errors = [];
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('Task title is required');
  }
  
  if (data.title && data.title.length > 255) {
    errors.push('Task title must be less than 255 characters');
  }
  
  if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
    errors.push('Priority must be low, medium, or high');
  }
  
  if (data.dueDate && isNaN(new Date(data.dueDate))) {
    errors.push('Invalid due date format');
  }
  
  return errors;
}

// API Routes

// GET /api/tasks - Fetch all tasks
app.get('/api/tasks', (req, res) => {
  try {
    const tasks = db.prepare(`
      SELECT 
        id, title, description, due_date as dueDate, 
        priority, completed, category, 
        created_at as createdAt, updated_at as updatedAt
      FROM tasks
      ORDER BY completed ASC, due_date ASC
    `).all();
    
    // Convert boolean from SQLite (0/1) to proper boolean
    const formattedTasks = tasks.map(task => ({
      ...task,
      completed: Boolean(task.completed)
    }));
    
    res.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /api/tasks/:id - Fetch single task
app.get('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const task = db.prepare(`
      SELECT 
        id, title, description, due_date as dueDate, 
        priority, completed, category, 
        created_at as createdAt, updated_at as updatedAt
      FROM tasks WHERE id = ?
    `).get(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json({
      ...task,
      completed: Boolean(task.completed)
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// POST /api/tasks - Create new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, dueDate, priority = 'medium', category } = req.body;
    
    const errors = validateTask({ title, priority, dueDate });
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    const result = db.prepare(`
      INSERT INTO tasks (title, description, due_date, priority, category)
      VALUES (?, ?, ?, ?, ?)
    `).run(title.trim(), description || '', dueDate || null, priority, category || null);
    
    const newTask = db.prepare(`
      SELECT 
        id, title, description, due_date as dueDate, 
        priority, completed, category, 
        created_at as createdAt, updated_at as updatedAt
      FROM tasks WHERE id = ?
    `).get(result.lastInsertRowid);
    
    res.status(201).json({
      ...newTask,
      completed: Boolean(newTask.completed)
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, priority, completed, category } = req.body;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const updateData = {
      title: title !== undefined ? title : existingTask.title,
      priority: priority !== undefined ? priority : existingTask.priority,
      dueDate: dueDate !== undefined ? dueDate : existingTask.due_date
    };
    
    const errors = validateTask(updateData);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, due_date = ?, priority = ?, completed = ?, category = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      title !== undefined ? title.trim() : existingTask.title,
      description !== undefined ? description : existingTask.description,
      dueDate !== undefined ? dueDate : existingTask.due_date,
      priority !== undefined ? priority : existingTask.priority,
      completed !== undefined ? (completed ? 1 : 0) : existingTask.completed,
      category !== undefined ? category : existingTask.category,
      id
    );
    
    const updatedTask = db.prepare(`
      SELECT 
        id, title, description, due_date as dueDate, 
        priority, completed, category, 
        created_at as createdAt, updated_at as updatedAt
      FROM tasks WHERE id = ?
    `).get(id);
    
    res.json({
      ...updatedTask,
      completed: Boolean(updatedTask.completed)
    });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }
    
    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    
    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };