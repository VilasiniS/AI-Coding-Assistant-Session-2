import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Stack,
  Alert
} from '@mui/material';

const TaskForm = ({ open, task, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    category: ''
  });

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with task data when dialog opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        priority: task.priority || 'medium',
        category: task.category || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        category: ''
      });
    }
    setErrors([]);
  }, [task, open]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = [];
    
    if (!formData.title || formData.title.trim() === '') {
      newErrors.push('Task title is required');
    }
    
    if (formData.title && formData.title.length > 255) {
      newErrors.push('Task title must be less than 255 characters');
    }
    
    if (formData.priority && !['low', 'medium', 'high'].includes(formData.priority)) {
      newErrors.push('Please select a valid priority');
    }
    
    if (formData.dueDate && isNaN(new Date(formData.dueDate))) {
      newErrors.push('Please enter a valid due date');
    }
    
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async () => {
    const newErrors = validateForm();
    
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      setErrors([error.message || 'Failed to save task']);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      category: ''
    });
    setErrors([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '20px' }}>
        {task ? 'Edit Task' : 'Create New Task'}
      </DialogTitle>

      <DialogContent sx={{ paddingTop: '16px' }}>
        {/* Error messages */}
        {errors.length > 0 && (
          <Alert severity="error" sx={{ marginBottom: '16px' }}>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Form fields */}
        <Stack spacing={3}>
          {/* Title field */}
          <TextField
            autoFocus
            fullWidth
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            variant="outlined"
            error={errors.some(e => e.includes('title'))}
            disabled={isLoading}
            helperText={errors.find(e => e.includes('title')) || `${formData.title.length}/255`}
          />

          {/* Description field */}
          <TextField
            fullWidth
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            variant="outlined"
            multiline
            rows={3}
            disabled={isLoading}
          />

          {/* Due date field */}
          <TextField
            fullWidth
            type="date"
            label="Due Date (Optional)"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            disabled={isLoading}
            error={errors.some(e => e.includes('due date'))}
          />

          {/* Priority dropdown */}
          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              label="Priority"
              disabled={isLoading}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          {/* Category field */}
          <TextField
            fullWidth
            label="Category (Optional)"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g., Work, Personal, Shopping"
            variant="outlined"
            disabled={isLoading}
          />
        </Stack>
      </DialogContent>

      {/* Dialog actions */}
      <DialogActions sx={{ padding: '16px' }}>
        <Button
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
