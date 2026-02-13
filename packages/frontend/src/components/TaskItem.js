import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Checkbox,
  IconButton,
  Chip,
  Box,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const TaskItem = ({ task, onComplete, onDelete, onEdit }) => {
  // Determine the appropriate styling based on task status
  const getTaskStyling = () => {
    if (task.completed) {
      return {
        backgroundColor: '#F5F5F5',
        opacity: 0.7
      };
    }
    
    // Color code by priority
    switch (task.priority) {
      case 'high':
        return { borderLeftColor: '#FFD4E5', borderLeftWidth: 4, borderLeftStyle: 'solid' };
      case 'medium':
        return { borderLeftColor: '#A8D8FF', borderLeftWidth: 4, borderLeftStyle: 'solid' };
      case 'low':
        return { borderLeftColor: '#D4A5FF', borderLeftWidth: 4, borderLeftStyle: 'solid' };
      default:
        return {};
    }
  };

  // Format the due date for display
  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'info';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card
      sx={{
        marginBottom: '8px',
        ...getTaskStyling(),
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <CardContent sx={{ paddingBottom: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          {/* Checkbox for completion */}
          <Checkbox
            checked={task.completed}
            onChange={() => onComplete(task.id, !task.completed)}
            aria-label={`Mark task "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
            sx={{ marginTop: '4px' }}
          />

          {/* Task content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Title */}
            <Typography
              variant="body1"
              sx={{
                fontWeight: task.completed ? 400 : 500,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? '#999' : '#333',
                marginBottom: '4px',
                wordBreak: 'break-word'
              }}
            >
              {task.title}
            </Typography>

            {/* Description */}
            {task.description && (
              <Typography
                variant="body2"
                sx={{
                  color: '#666',
                  marginBottom: '8px',
                  wordBreak: 'break-word'
                }}
              >
                {task.description}
              </Typography>
            )}

            {/* Metadata and tags */}
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {/* Priority chip */}
              <Chip
                label={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                color={getPriorityColor()}
                size="small"
                variant="outlined"
              />

              {/* Due date chip */}
              {task.dueDate && (
                <Chip
                  label={formatDueDate(task.dueDate)}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: isOverdue() ? '#FFD4E5' : '#D0D0D0',
                    color: isOverdue() ? '#FF6B6B' : '#666',
                    fontWeight: isOverdue() ? 500 : 400
                  }}
                />
              )}

              {/* Category chip */}
              {task.category && (
                <Chip
                  label={task.category}
                  size="small"
                  variant="filled"
                  sx={{
                    backgroundColor: '#E5F5FF',
                    color: '#0066CC'
                  }}
                />
              )}

              {/* Completion status chip */}
              {task.completed && (
                <Chip
                  label="Done"
                  color="success"
                  size="small"
                  variant="filled"
                />
              )}
            </Stack>
          </Box>
        </Box>
      </CardContent>

      {/* Action buttons */}
      <CardActions sx={{ paddingTop: '0', justifyContent: 'flex-end', gap: '4px' }}>
        <IconButton
          size="small"
          onClick={() => onEdit(task)}
          aria-label={`Edit task "${task.title}"`}
          sx={{
            color: '#A8D8FF',
            '&:hover': { backgroundColor: 'rgba(168, 216, 255, 0.1)' }
          }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete task "${task.title}"`}
          sx={{
            color: '#FFD4E5',
            '&:hover': { backgroundColor: 'rgba(255, 212, 229, 0.1)' }
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TaskItem;
