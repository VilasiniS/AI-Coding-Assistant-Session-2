# Coding Guidelines - TODO App

## Overview
This document outlines the coding style, quality principles, and best practices for the TODO app project. These guidelines ensure consistency, maintainability, and high code quality across the entire codebase. All developers working on this project should adhere to these standards.

## Philosophy
Our coding approach emphasizes **clarity, consistency, and maintainability**. We believe that well-written code is not only functionally correct but also easy to read, understand, and modify. By following these guidelines, we create a codebase that serves as documentation itself, reducing the need for excessive comments and making collaborative development more efficient.

## General Formatting Rules

### Indentation
- **Use spaces, never tabs**: 2 spaces per indentation level for JavaScript/frontend code
- **Consistent indentation**: Maintain the same indentation style throughout the entire codebase
- **Indentation examples**:
  ```javascript
  function calculateTotal(items) {
    return items.reduce((sum, item) => {
      return sum + item.price;
    }, 0);
  }
  ```

### Line Length
- **Maximum line length**: 120 characters
- **Rationale**: Helps with readability on most devices and in side-by-side editing
- **Breaking long lines**: Split long statements across multiple lines for clarity
  ```javascript
  // Good: Line broken at logical point
  const isTaskOverdue = 
    task.dueDate && 
    task.dueDate < new Date() && 
    !task.completed;

  // Avoid: Single long line
  const isTaskOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;
  ```

### Spacing
- **Blank lines between functions**: Use one blank line to separate function and method definitions
- **Blank lines within functions**: Use sparingly to separate logical sections
- **Space around operators**: Add spaces around binary operators (`=`, `+`, `-`, `*`, `/`, etc.)
- **Space in control structures**: Add space before opening parenthesis in if/for/while statements
  ```javascript
  // Good spacing
  if (task.completed === true) {
    console.log('Task done');
  }

  const sum = a + b;
  const name = firstName + ' ' + lastName;
  ```

### Semicolons
- **Include semicolons**: Always use semicolons to terminate statements
- **Consistency**: Enforced by ESLint to avoid ambiguity

### Trailing Whitespace
- **Remove all trailing whitespace** at the end of lines
- Enforced by linter and pre-commit hooks

## Import Organization

### Import Structure
Organize all imports at the top of the file in the following order, separated by blank lines:

1. **Standard library and built-in modules** (Node.js core modules)
2. **Third-party dependencies** (installed via npm)
3. **Local modules and project files** (relative imports)

### Import Examples
```javascript
// Standard library
import fs from 'fs';
import path from 'path';

// Third-party dependencies
import React from 'react';
import axios from 'axios';
import { render } from '@testing-library/react';

// Local modules
import TaskService from '../services/taskService';
import { formatDate } from '../utils/dateHelpers';
import styles from './TaskItem.css';
```

### Alphabetical Ordering
- Within each group, sort imports alphabetically
- Non-default imports from the same module can be grouped together
  ```javascript
  import { useState, useEffect } from 'react';
  import { createTask, deleteTask, updateTask } from '../services/taskService';
  ```

### Named vs. Default Imports
- Use named imports for utilities and helper functions
- Use default imports for classes, components, and modules
  ```javascript
  // Utilities - use named imports
  import { calculateDueDate, formatDate } from '../utils/dateHelpers';

  // Components - use default imports
  import TaskItem from '../components/TaskItem';
  ```

### Avoiding Unused Imports
- Remove all unused imports before committing
- ESLint will flag unused imports with warnings

## Linter Usage

### Linting Tools
- **ESLint**: Primary linter for JavaScript code quality
- **Configuration**: Project ESLint configuration in `.eslintrc.json` defines rules and standards
- **Plugins**: May include plugins for React, Jest, and other frameworks

### Running the Linter
```bash
# Check for linting errors
npm run lint

# Automatically fix fixable issues
npm run lint:fix
```

### Integration with Development
- **IDE Integration**: Configure your editor to show ESLint errors in real-time
- **Pre-commit Hooks**: Linting is run automatically before commits (via husky or similar)
- **CI/CD Pipeline**: Linting must pass as part of the build process
- **Code Review**: Linting errors must be resolved before code is merged

### Common ESLint Rules
- No unused variables
- Consistent naming conventions
- No reassignment of function parameters
- No implicit type coercion
- Proper error handling
- No console statements in production code (with exceptions)

### Addressing Linting Issues
- **Fix automatically**: Use `npm run lint:fix` for issues that can be auto-corrected
- **Address manually**: Resolve rule violations that require code changes
- **Disable sparingly**: Only disable rules with `// eslint-disable-line` comments when absolutely necessary and with justification
  ```javascript
  // Use sparingly and with comments
  console.log('Debug info'); // eslint-disable-line no-console
  ```

## Best Practices

### 1. DRY Principle (Don't Repeat Yourself)

#### Purpose
Eliminate code duplication by abstracting common functionality into reusable functions, utilities, or components. This principle promotes maintainability and reduces the risk of bugs.

#### Benefits
- **Single Source of Truth**: Logic exists in one place, making updates easier
- **Reduced Bugs**: Fixing a bug in shared logic fixes it everywhere
- **Easier Maintenance**: Changes cascade consistently across the codebase
- **Improved Readability**: Reusable functions often have meaningful names that clarify intent

#### Implementation Strategies

**Extract Common Logic**:
```javascript
// Avoid: Repeated validation logic
function createTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new Error('Task title is required');
  }
  // ... create logic
}

function updateTask(task) {
  if (!task.title || task.title.trim() === '') {
    throw new Error('Task title is required');
  }
  // ... update logic
}

// Better: Extract validation into reusable function
function validateTaskTitle(title) {
  if (!title || title.trim() === '') {
    throw new Error('Task title is required');
  }
}

function createTask(task) {
  validateTaskTitle(task.title);
  // ... create logic
}

function updateTask(task) {
  validateTaskTitle(task.title);
  // ... update logic
}
```

**Create Utility Functions**:
```javascript
// utils/dateHelpers.js
export function isTaskOverdue(task) {
  return task.dueDate && task.dueDate < new Date() && !task.completed;
}

export function isDueToday(task) {
  const today = new Date();
  return task.dueDate && 
    task.dueDate.toDateString() === today.toDateString();
}

// In multiple files
import { isTaskOverdue, isDueToday } from '../utils/dateHelpers';
```

**Build Reusable Components**:
```javascript
// components/Button.js - Generic, reusable button component
export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) {
  return (
    <button 
      onClick={onClick} 
      className={`button button--${variant}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Reuse in multiple places
<Button onClick={handleCreate} variant="primary">Create Task</Button>
<Button onClick={handleDelete} variant="danger">Delete Task</Button>
```

### 2. Meaningful Naming

#### Purpose
Use clear, descriptive names for variables, functions, classes, and files. Good naming makes code self-documenting and reduces cognitive load.

#### Guidelines

**Variables and Constants**:
- Use clear, descriptive names that indicate what the variable represents
- Use camelCase for variables and functions in JavaScript
- Use UPPER_SNAKE_CASE for constants
  ```javascript
  // Good naming
  const todoItems = getTodos();
  const isTaskCompleted = task.status === 'completed';
  const DEFAULT_PRIORITY = 'medium';
  const MAX_TITLE_LENGTH = 100;

  // Avoid: Unclear names
  const items = getTodos(); // What items?
  const flag = task.status === 'completed'; // What does this flag mean?
  const x = 100; // What is x?
  ```

**Function Names**:
- Use verbs that describe the action
- Be specific about what the function does
  ```javascript
  // Good: Clear action indicated
  function calculateTaskDaysRemaining(task) { }
  function validateUserInput(input) { }
  function formatTaskTitle(title) { }
  function fetchTasksFromAPI() { }

  // Avoid: Vague names
  function process(data) { }
  function handle(task) { }
  function get() { }
  ```

**Component Names**:
- Use PascalCase for component names
- Use names that describe what the component renders
  ```javascript
  // Good: Clear component purpose
  export default function TaskList({ tasks }) { }
  export default function TaskItem({ task, onComplete }) { }
  export default function TaskForm({ onSubmit }) { }

  // Avoid: Vague names
  export default function Item() { }
  export default function Container() { }
  ```

**File and Directory Names**:
- Use kebab-case for file names in most projects, or match your framework convention
- Match file names to component/function names when appropriate
  ```
  src/
  ├── components/
  │   ├── task-list.js
  │   ├── task-item.js
  │   └── task-form.js
  ├── services/
  │   └── task-service.js
  └── utils/
      └── date-helpers.js
  ```

**Boolean Variables**:
- Prefix with `is`, `has`, or `can` to indicate boolean nature
  ```javascript
  const isTaskCompleted = true;
  const hasValidTitle = title && title.length > 0;
  const canDeleteTask = userRole === 'admin';
  const shouldShowDeleteButton = !isTaskCompleted && userOwnsTask;
  ```

### 3. Simplicity and Focus

#### Purpose
Write simple, focused code that does one thing well. Break down complex logic into smaller, manageable pieces.

#### Single Responsibility Principle
Each function or component should have a single, well-defined responsibility:

```javascript
// Avoid: Function doing too much
function processTask(task) {
  // Validate
  if (!task.title) return;
  
  // Format
  task.title = task.title.trim().toLowerCase();
  task.dueDate = new Date(task.dueDate);
  
  // Save
  saveToDatabase(task);
  
  // Notify
  sendNotification(`Task "${task.title}" created`);
}

// Better: Separate concerns
function validateTask(task) {
  if (!task.title) throw new Error('Task title required');
  if (!task.dueDate) throw new Error('Due date required');
}

function formatTask(task) {
  return {
    ...task,
    title: task.title.trim(),
    dueDate: new Date(task.dueDate)
  };
}

async function createTask(task) {
  validateTask(task);
  const formattedTask = formatTask(task);
  await saveToDatabase(formattedTask);
  sendNotification(`Task "${formattedTask.title}" created`);
}
```

#### Function Length
- Keep functions short and focused (ideally under 30 lines)
- If a function is getting long, break it into smaller functions
- Functions should be understandable at a glance

```javascript
// Avoid: Long, complex function
function handleTaskSubmit(formData) {
  const task = { ...formData };
  const errors = [];
  if (!task.title || task.title.trim() === '') errors.push('Title required');
  if (!task.dueDate) errors.push('Due date required');
  if (task.dueDate < new Date()) errors.push('Due date must be in future');
  if (errors.length > 0) {
    setFormErrors(errors);
    return;
  }
  task.title = task.title.trim();
  task.createdAt = new Date();
  task.completed = false;
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    // ... more logic
  } catch (error) {
    // ... error handling
  }
}

// Better: Broken down into focused functions
const validateTaskForm = (task) => {
  const errors = [];
  if (!task.title?.trim()) errors.push('Title required');
  if (!task.dueDate) errors.push('Due date required');
  if (new Date(task.dueDate) < new Date()) errors.push('Due date must be in future');
  return errors;
};

const prepareTaskForCreation = (formData) => ({
  ...formData,
  title: formData.title.trim(),
  createdAt: new Date(),
  completed: false
});

const createTaskAPI = async (task) => {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  return response.json();
};

const handleTaskSubmit = async (formData) => {
  const errors = validateTaskForm(formData);
  if (errors.length > 0) {
    setFormErrors(errors);
    return;
  }
  
  try {
    const task = prepareTaskForCreation(formData);
    await createTaskAPI(task);
    resetForm();
  } catch (error) {
    setFormErrors(['Failed to create task']);
  }
};
```

#### Avoiding Nested Complexity
- Use early returns to reduce nesting
- Extract nested logic into separate functions
- Keep indentation levels shallow

```javascript
// Avoid: Deep nesting
function processTask(task) {
  if (task) {
    if (task.title) {
      if (task.dueDate) {
        if (task.dueDate > new Date()) {
          // ... actual logic
        }
      }
    }
  }
}

// Better: Early returns, minimal nesting
function processTask(task) {
  if (!task || !task.title || !task.dueDate) return;
  if (task.dueDate <= new Date()) return;
  
  // ... actual logic
}
```

### 4. Automated Testing

#### Purpose
Writing tests is fundamental to our development process. Tests ensure code reliability, facilitate refactoring, and serve as documentation.

#### Testing Philosophy
- **Test-Driven Development**: Consider writing tests before or alongside implementation
- **Comprehensive Coverage**: Aim for high coverage of critical functionality
- **Maintainable Tests**: Write tests that are easy to read and update
- **Fast Feedback**: Tests should run quickly to support rapid development

#### Test Requirements
- All new functions and components must have unit tests
- Critical workflows must have integration tests
- Major features should have end-to-end tests
- Test files are organized alongside source code in `__tests__` directories

#### Example Test Structure
```javascript
// src/services/__tests__/taskService.test.js
import TaskService from '../taskService';

describe('TaskService', () => {
  describe('createTask()', () => {
    it('should create a new task with provided data', () => {
      const taskData = { title: 'New Task', dueDate: new Date() };
      const task = TaskService.createTask(taskData);
      
      expect(task.title).toBe('New Task');
      expect(task.completed).toBe(false);
    });

    it('should throw an error if title is missing', () => {
      expect(() => {
        TaskService.createTask({ dueDate: new Date() });
      }).toThrow('Title is required');
    });
  });
});
```

#### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage
```

## Code Review Checklist

When reviewing code or submitting pull requests, verify:

- [ ] Code follows formatting rules (indentation, line length, spacing)
- [ ] Imports are organized and sorted correctly
- [ ] ESLint passes without errors or warnings
- [ ] Variable and function names are clear and descriptive
- [ ] No code duplication (DRY principle applied)
- [ ] Functions are focused and reasonably short
- [ ] Appropriate tests are included
- [ ] Code is self-documenting with minimal need for comments
- [ ] Complex logic has explanatory comments when needed
- [ ] Error handling is appropriate
- [ ] Performance implications considered

## Common Anti-Patterns to Avoid

### Magic Numbers
```javascript
// Avoid: What does 86400000 mean?
const ONE_DAY_MS = new Date().getTime() - 86400000;

// Good: Clear constant
const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
const ONE_DAY_MS = new Date().getTime() - ONE_DAY_IN_MILLISECONDS;
```

### Unnecessary Comments
```javascript
// Avoid: Comments that restate obvious code
const isComplete = task.completed === true; // Check if task is completed

// Good: Code is self-explanatory, minimal comments needed
const isComplete = task.completed === true;
```

### Global Variables
- Minimize use of global variables
- Use modules and dependency injection instead
- Make dependencies explicit and clear

### Catch-All Error Handlers
```javascript
// Avoid: Swallowing errors
try {
  await saveTask(task);
} catch (error) {
  // Silently fail - bad practice
}

// Good: Handle errors appropriately
try {
  await saveTask(task);
} catch (error) {
  console.error('Failed to save task:', error);
  showErrorMessage('Unable to save task. Please try again.');
}
```

## Tools and Automation

### Recommended Tools
- **ESLint**: Code quality and style enforcement
- **Prettier** (optional): Automatic code formatting
- **Husky**: Pre-commit hooks to run linting and tests
- **Jest**: Unit testing framework
- **Testing Library**: React component testing

### Pre-commit Hooks
Automated checks run before commit to ensure code quality:
- Linting must pass
- Tests must pass
- Code formatting requirements met

## Continuous Learning

- New team members should read these guidelines early
- Guidelines are living documents - update them as practices evolve
- Discuss code quality improvements in team meetings
- Share knowledge about patterns and best practices

## Summary

By following these coding guidelines—maintaining consistent formatting, organizing imports, using linters, applying DRY principles, employing meaningful naming, focusing on simplicity, and writing comprehensive tests—we create a codebase that is maintainable, reliable, and enjoyable to work with. These practices benefit not only individual developers but the entire team and project.
