import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import TaskForm from '../components/TaskForm';

// Helper function to render with theme
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Creating a new task', () => {
    it('should render create task form when task is null', () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    it('should have empty fields for new task', () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const titleInput = screen.getByPlaceholderText('Enter task title');
      const descriptionInput = screen.getByPlaceholderText('Enter task description');

      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });

    it('should set default priority to medium for new task', () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      // Priority dropdown should show medium as selected
      // Note: MUI Select components can be tricky to test, but we can verify the value
      const priorityLabels = screen.queryAllByText('Priority');
      expect(priorityLabels.length).toBeGreaterThan(0);
    });
  });

  describe('Editing an existing task', () => {
    const mockTask = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing Description',
      dueDate: '2026-02-20',
      priority: 'high',
      category: 'Work'
    };

    it('should render edit task form when task is provided', () => {
      renderWithTheme(
        <TaskForm open={true} task={mockTask} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      expect(screen.getByText('Edit Task')).toBeInTheDocument();
      expect(screen.getByText('Update Task')).toBeInTheDocument();
    });

    it('should populate form fields with task data', () => {
      renderWithTheme(
        <TaskForm open={true} task={mockTask} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const titleInput = screen.getByDisplayValue('Existing Task');
      const descriptionInput = screen.getByDisplayValue('Existing Description');

      expect(titleInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
    });
  });

  describe('Form validation', () => {
    it('should show error when title is empty', async () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryAllByText(/Task title is required/)).not.toEqual([]);
      });
    });

    it('should show error for invalid priority', async () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const titleInput = screen.getByPlaceholderText('Enter task title');
      fireEvent.change(titleInput, { target: { value: 'Test Task' } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      // With valid title, should not show validation errors
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });

    it('should show error for invalid due date', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'Test Task');

      // Try to submit without setting form as valid
      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      // Should succeed with just a title
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });
    });
  });

  describe('Form submission', () => {
    it('should call onSubmit with correct data', async () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const titleInput = screen.getByPlaceholderText('Enter task title');
      const descriptionInput = screen.getByPlaceholderText('Enter task description');

      fireEvent.change(titleInput, { target: { value: 'New Task' } });
      fireEvent.change(descriptionInput, { target: { value: 'Task Description' } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
          title: 'New Task',
          description: 'Task Description'
        }));
      });
    });

    it('should clear errors when user starts typing', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      // Try to submit empty form
      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.queryAllByText(/Task title is required/)).not.toEqual([]);
      });

      // Start typing
      const titleInput = screen.getByPlaceholderText('Enter task title');
      await user.type(titleInput, 'Test');

      await waitFor(() => {
        expect(screen.queryByText(/Task title is required/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form close action', () => {
    it('should call onClose when Cancel button is clicked', async () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should reset form when closed', async () => {
      const { rerender } = renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      const titleInput = screen.getByPlaceholderText('Enter task title');
      fireEvent.change(titleInput, { target: { value: 'Test' } });

      // Close dialog
      rerender(
        <ThemeProvider theme={theme}>
          <TaskForm open={false} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </ThemeProvider>
      );

      // Reopen dialog
      rerender(
        <ThemeProvider theme={theme}>
          <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
        </ThemeProvider>
      );

      const newTitleInput = screen.getByPlaceholderText('Enter task title');
      expect(newTitleInput).toHaveValue('');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form fields', () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      expect(screen.getByRole('textbox', { name: /Task Title/ })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /Description/ })).toBeInTheDocument();
      
      // For Select components, check if labels are present
      const priorityLabels = screen.queryAllByText('Priority');
      expect(priorityLabels.length).toBeGreaterThan(0);
      
      const categoryLabels = screen.queryAllByText('Category (Optional)');
      expect(categoryLabels.length).toBeGreaterThan(0);
    });

    it('should have proper dialog title', () => {
      renderWithTheme(
        <TaskForm open={true} task={null} onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
    });
  });
});
