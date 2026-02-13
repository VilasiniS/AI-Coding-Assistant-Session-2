const request = require('supertest');
const { app, db } = require('../src/app');

// Close the database connection after all tests
afterAll(() => {
  if (db) {
    db.close();
  }
});

// Test helpers
const createTask = async (taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2026-02-20',
    priority: 'medium',
    ...taskData
  };
  
  const response = await request(app)
    .post('/api/tasks')
    .send(defaultTask)
    .set('Accept', 'application/json');

  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');
  return response.body;
};

describe('Task API Endpoints', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      // Check if tasks have the expected structure
      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('completed');
      expect(task).toHaveProperty('createdAt');
      expect(typeof task.completed).toBe('boolean');
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a specific task', async () => {
      const createdTask = await createTask({ title: 'Specific Task' });
      const response = await request(app).get(`/api/tasks/${createdTask.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(createdTask.id);
      expect(response.body.title).toBe('Specific Task');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).get('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).get('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with all properties', async () => {
      const newTask = {
        title: 'Integration Test Task',
        description: 'Testing task creation',
        dueDate: '2026-03-01',
        priority: 'high',
        category: 'Testing'
      };
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.dueDate).toBe(newTask.dueDate);
      expect(response.body.priority).toBe(newTask.priority);
      expect(response.body.category).toBe(newTask.category);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should create task with minimal properties', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Minimal Task' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Minimal Task');
      expect(response.body.priority).toBe('medium');
      expect(response.body.completed).toBe(false);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
      expect(response.body.errors).toContain('Task title is required');
    });

    it('should return 400 if title is empty', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Task title is required');
    });

    it('should return 400 for invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', priority: 'invalid' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Priority must be low, medium, or high');
    });

    it('should return 400 for invalid due date', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Test', dueDate: 'invalid-date' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Invalid due date format');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task title', async () => {
      const task = await createTask({ title: 'Original Title' });
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ title: 'Updated Title' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.id).toBe(task.id);
    });

    it('should update task completion status', async () => {
      const task = await createTask();
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ completed: true })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.completed).toBe(true);
    });

    it('should update multiple task properties', async () => {
      const task = await createTask();
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({
          title: 'Updated Title',
          priority: 'high',
          completed: true,
          category: 'Urgent'
        })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.priority).toBe('high');
      expect(response.body.completed).toBe(true);
      expect(response.body.category).toBe('Urgent');
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app)
        .put('/api/tasks/999999')
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid task data', async () => {
      const task = await createTask();
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ priority: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Priority must be low, medium, or high');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask({ title: 'Task To Delete' });

      const deleteResponse = await request(app).delete(`/api/tasks/${task.id}`);
      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toEqual({ message: 'Task deleted successfully', id: task.id });

      const getResponse = await request(app).get(`/api/tasks/${task.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 404 when task does not exist', async () => {
      const response = await request(app).delete('/api/tasks/999999');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 for invalid id', async () => {
      const response = await request(app).delete('/api/tasks/abc');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Valid task ID is required');
    });
  });
});