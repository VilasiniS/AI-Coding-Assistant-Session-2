jest.mock('axios');

import taskService from '../taskService';
import axios from 'axios';

describe('Task Service', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Test Task 1',
      description: 'Description 1',
      dueDate: '2026-02-20',
      priority: 'high',
      completed: false,
      category: 'Work',
      createdAt: '2026-02-13T10:00:00Z',
      updatedAt: '2026-02-13T10:00:00Z'
    },
    {
      id: 2,
      title: 'Test Task 2',
      description: 'Description 2',
      dueDate: '2026-02-25',
      priority: 'medium',
      completed: true,
      category: 'Personal',
      createdAt: '2026-02-12T10:00:00Z',
      updatedAt: '2026-02-12T10:00:00Z'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch all tasks', async () => {
      axios.get.mockResolvedValue({ data: mockTasks });

      const result = await taskService.getTasks();

      expect(axios.get).toHaveBeenCalledWith('/tasks');
      expect(result).toEqual(mockTasks);
    });

    it('should handle errors when fetching tasks', async () => {
      const mockError = new Error('Network error');
      axios.get.mockRejectedValue(mockError);

      await expect(taskService.getTasks()).rejects.toThrow('Network error');
    });
  });

  describe('getTask', () => {
    it('should fetch a single task by id', async () => {
      axios.get.mockResolvedValue({ data: mockTasks[0] });

      const result = await taskService.getTask(1);

      expect(axios.get).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(mockTasks[0]);
    });

    it('should handle errors when fetching a task', async () => {
      const mockError = new Error('Task not found');
      axios.get.mockRejectedValue(mockError);

      await expect(taskService.getTask(999)).rejects.toThrow('Task not found');
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const newTaskData = {
        title: 'New Task',
        description: 'New Description',
        dueDate: '2026-03-01',
        priority: 'high',
        category: 'Work'
      };

      const createdTask = { id: 3, ...newTaskData, completed: false, createdAt: '2026-02-13T10:00:00Z', updatedAt: '2026-02-13T10:00:00Z' };
      axios.post.mockResolvedValue({ data: createdTask });

      const result = await taskService.createTask(newTaskData);

      expect(axios.post).toHaveBeenCalledWith('/tasks', newTaskData);
      expect(result).toEqual(createdTask);
    });

    it('should handle validation errors when creating task', async () => {
      const invalidTaskData = {
        title: '',
        priority: 'invalid'
      };

      const mockError = new Error('Validation failed');
      axios.post.mockRejectedValue(mockError);

      await expect(taskService.createTask(invalidTaskData)).rejects.toThrow('Validation failed');
    });

    it('should handle server errors when creating task', async () => {
      const mockError = new Error('Server error');
      axios.post.mockRejectedValue(mockError);

      await expect(taskService.createTask({ title: 'Test' })).rejects.toThrow('Server error');
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const updateData = { title: 'Updated Title', completed: true };
      const updatedTask = { ...mockTasks[0], ...updateData };

      axios.put.mockResolvedValue({ data: updatedTask });

      const result = await taskService.updateTask(1, updateData);

      expect(axios.put).toHaveBeenCalledWith('/tasks/1', updateData);
      expect(result).toEqual(updatedTask);
    });

    it('should handle errors when updating task', async () => {
      const mockError = new Error('Task not found');
      axios.put.mockRejectedValue(mockError);

      await expect(taskService.updateTask(999, { title: 'New Title' })).rejects.toThrow('Task not found');
    });

    it('should handle partial updates', async () => {
      const partialUpdate = { completed: true };
      const updatedTask = { ...mockTasks[0], completed: true };

      axios.put.mockResolvedValue({ data: updatedTask });

      const result = await taskService.updateTask(1, partialUpdate);

      expect(axios.put).toHaveBeenCalledWith('/tasks/1', partialUpdate);
      expect(result.completed).toBe(true);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const deleteResponse = { message: 'Task deleted successfully', id: 1 };
      axios.delete.mockResolvedValue({ data: deleteResponse });

      const result = await taskService.deleteTask(1);

      expect(axios.delete).toHaveBeenCalledWith('/tasks/1');
      expect(result).toEqual(deleteResponse);
    });

    it('should handle errors when deleting task', async () => {
      const mockError = new Error('Task not found');
      axios.delete.mockRejectedValue(mockError);

      await expect(taskService.deleteTask(999)).rejects.toThrow('Task not found');
    });
  });

  describe('completeTask', () => {
    it('should mark task as complete', async () => {
      const completedTask = { ...mockTasks[0], completed: true };
      axios.put.mockResolvedValue({ data: completedTask });

      const result = await taskService.completeTask(1);

      expect(axios.put).toHaveBeenCalledWith('/tasks/1', { completed: true });
      expect(result.completed).toBe(true);
    });
  });

  describe('incompleteTask', () => {
    it('should mark task as incomplete', async () => {
      const incompletedTask = { ...mockTasks[1], completed: false };
      axios.put.mockResolvedValue({ data: incompletedTask });

      const result = await taskService.incompleteTask(2);

      expect(axios.put).toHaveBeenCalledWith('/tasks/2', { completed: false });
      expect(result.completed).toBe(false);
    });
  });

  describe('Error handling', () => {
    it('should log errors to console', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const mockError = new Error('Test error');
      axios.get.mockRejectedValue(mockError);

      try {
        await taskService.getTasks();
      } catch (error) {
        // Expected to throw
      }

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
