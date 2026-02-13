import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import taskService from '../services/taskService';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form dialog states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  // Search and filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch tasks from API
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task creation
  const handleCreateTask = () => {
    setSelectedTask(null);
    setFormOpen(true);
  };

  // Handle task editing
  const handleEditTask = (task) => {
    setSelectedTask(task);
    setFormOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (formData) => {
    try {
      if (selectedTask) {
        // Update existing task
        const updatedTask = await taskService.updateTask(selectedTask.id, formData);
        setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
        setSuccessMessage('Task updated successfully');
      } else {
        // Create new task
        const newTask = await taskService.createTask(formData);
        setTasks([...tasks, newTask]);
        setSuccessMessage('Task created successfully');
      }
      setFormOpen(false);
      setSelectedTask(null);
    } catch (err) {
      console.error('Error saving task:', err);
      throw new Error(err.response?.data?.errors?.[0] || 'Failed to save task');
    }
  };

  // Handle task completion toggle
  const handleCompleteTask = async (id, completed) => {
    try {
      const updatedTask = await taskService.updateTask(id, { completed });
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      setSuccessMessage(completed ? 'Task marked as complete' : 'Task marked as incomplete');
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
    }
  };

  // Handle delete button click
  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm task deletion
  const handleConfirmDelete = async () => {
    try {
      await taskService.deleteTask(taskToDelete);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setSuccessMessage('Task deleted successfully');
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task =>
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter(t => t.completed).length;
  const incompleteCount = tasks.length - completedCount;

  return (
    <Container maxWidth="md" sx={{ paddingY: '32px', minHeight: '100vh' }}>
      {/* Page title */}
      <Box sx={{ marginBottom: '32px' }}>
        <Typography variant="h1" sx={{ marginBottom: '8px' }}>
          My Tasks
        </Typography>
        <Typography variant="body2" sx={{ color: '#666' }}>
          {incompleteCount} incomplete, {completedCount} completed
        </Typography>
      </Box>

      {/* Error message */}
      {error && (
        <Alert
          severity="error"
          onClose={() => setError(null)}
          sx={{ marginBottom: '16px' }}
        >
          {error}
        </Alert>
      )}

      {/* Success message */}
      {successMessage && (
        <Alert
          severity="success"
          onClose={() => setSuccessMessage('')}
          sx={{ marginBottom: '16px' }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Create button */}
      <Box sx={{ marginBottom: '24px' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateTask}
          size="large"
          sx={{ height: '44px' }}
        >
          Create New Task
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ padding: '16px', marginBottom: '24px', backgroundColor: '#F5F5F5' }}>
        <Stack spacing={2}>
          {/* Search bar */}
          <TextField
            fullWidth
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            variant="outlined"
            size="small"
          />

          {/* Filter buttons */}
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: '8px' }}>
            <Button
              size="small"
              variant={filterStatus === 'all' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setFilterStatus('all')}
            >
              All Tasks
            </Button>
            <Button
              size="small"
              variant={filterStatus === 'incomplete' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setFilterStatus('incomplete')}
            >
              Incomplete
            </Button>
            <Button
              size="small"
              variant={filterStatus === 'completed' ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setFilterStatus('completed')}
            >
              Completed
            </Button>

            {/* Priority filters */}
            <Button
              size="small"
              variant={filterPriority === 'all' ? 'outlined' : 'text'}
              color="primary"
              onClick={() => setFilterPriority('all')}
            >
              All Priorities
            </Button>
            <Button
              size="small"
              variant={filterPriority === 'high' ? 'contained' : 'outlined'}
              color="error"
              onClick={() => setFilterPriority('high')}
            >
              High
            </Button>
            <Button
              size="small"
              variant={filterPriority === 'medium' ? 'contained' : 'outlined'}
              color="info"
              onClick={() => setFilterPriority('medium')}
            >
              Medium
            </Button>
            <Button
              size="small"
              variant={filterPriority === 'low' ? 'contained' : 'outlined'}
              color="secondary"
              onClick={() => setFilterPriority('low')}
            >
              Low
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Loading state */}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <CircularProgress />
        </Box>
      ) : filteredTasks.length === 0 ? (
        // Empty state
        <Paper sx={{ padding: '32px', textAlign: 'center', backgroundColor: '#F5F5F5' }}>
          <Typography variant="h3" sx={{ marginBottom: '8px', color: '#999' }}>
            {searchQuery || filterPriority !== 'all' || filterStatus !== 'all'
              ? 'No tasks found'
              : 'No tasks yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#999' }}>
            {searchQuery || filterPriority !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first task to get started'}
          </Typography>
        </Paper>
      ) : (
        // Task list
        <Box>
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onComplete={handleCompleteTask}
              onDelete={handleDeleteClick}
              onEdit={handleEditTask}
            />
          ))}
        </Box>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={formOpen}
        task={selectedTask}
        onSubmit={handleFormSubmit}
        onClose={() => {
          setFormOpen(false);
          setSelectedTask(null);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Task?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this task? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskList;
