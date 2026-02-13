import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material';
import theme from '../theme';
import TaskItem from '../components/TaskItem';

// Helper function to render with theme
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('TaskItem Component', () => {
  const mockTask = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2026-02-20',
    priority: 'medium',
    completed: false,
    category: 'Work'
  };

  const mockOnComplete = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task title and description', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should display task priority as a chip', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should display due date as a chip', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText(/Feb/)).toBeInTheDocument();
  });

  it('should display category as a chip', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('should call onComplete when checkbox is clicked', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockOnComplete).toHaveBeenCalledWith(1, true);
  });

  it('should call onEdit when edit button is clicked', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByLabelText(/Edit task/);
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    renderWithTheme(
      <TaskItem
        task={mockTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByLabelText(/Delete task/);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('should display task as completed with strikethrough', () => {
    const completedTask = { ...mockTask, completed: true };
    
    renderWithTheme(
      <TaskItem
        task={completedTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const titleElement = screen.getByText('Test Task');
    expect(titleElement).toHaveStyle('text-decoration: line-through');
  });

  it('should show Done chip when task is completed', () => {
    const completedTask = { ...mockTask, completed: true };
    
    renderWithTheme(
      <TaskItem
        task={completedTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should not display description when it is empty', () => {
    const taskNoDesc = { ...mockTask, description: '' };
    
    renderWithTheme(
      <TaskItem
        task={taskNoDesc}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should handle tasks with high priority correctly', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' };
    
    renderWithTheme(
      <TaskItem
        task={highPriorityTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should handle tasks with low priority correctly', () => {
    const lowPriorityTask = { ...mockTask, priority: 'low' };
    
    renderWithTheme(
      <TaskItem
        task={lowPriorityTask}
        onComplete={mockOnComplete}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});
