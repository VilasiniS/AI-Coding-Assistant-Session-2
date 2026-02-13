# Testing Guidelines - TODO App

## Overview
This document outlines the testing strategy and guidelines for the TODO app. A comprehensive testing approach ensures code quality, reliability, and maintainability across all components and features.

## Testing Philosophy

### Core Principles
- **Test-Driven Development (TDD)**: Write tests before or alongside implementation
- **Comprehensive Coverage**: Test all critical functionality and edge cases
- **Maintainability**: Tests should be easy to read, understand, and update
- **Fast Feedback**: Tests should run quickly to support rapid development
- **Clear Intent**: Test names and assertions should clearly communicate what is being tested
- **DRY (Don't Repeat Yourself)**: Reuse test utilities and helpers to minimize duplication

## Testing Pyramid

### Test Distribution
The testing pyramid guides our testing strategy:

```
        /\
       /E2E\
      /------\
     /Integration\
    /---------------\
   /    Unit Tests    \
  /---------------------\
```

- **Unit Tests (70%)**: Foundation layer, fastest, most numerous
- **Integration Tests (20%)**: Test component interactions and API integration
- **End-to-End Tests (10%)**: Test complete user workflows

## Unit Tests

### Purpose
Unit tests verify individual functions, methods, and components in isolation. They should test a single piece of functionality without external dependencies.

### Scope
- Pure functions and utility functions
- Component logic and state management
- Service methods
- Helper functions

### Best Practices
- **One assertion per test** (or related assertions testing one behavior)
- **Arrange-Act-Assert pattern**: Setup data, perform action, verify results
- **Avoid dependencies**: Mock or stub external dependencies
- **Test edge cases**: Null values, empty arrays, error conditions
- **Clear naming**: Use descriptive test names following `should_<action>_<expected_result>` pattern

### Example Structure
```javascript
describe('TodoItem', () => {
  describe('markComplete()', () => {
    it('should mark task as complete when method is called', () => {
      // Arrange
      const task = new TodoItem({ title: 'Test', completed: false });
      
      // Act
      task.markComplete();
      
      // Assert
      expect(task.completed).toBe(true);
    });

    it('should not change already completed tasks', () => {
      // Arrange
      const task = new TodoItem({ title: 'Test', completed: true });
      
      // Act
      task.markComplete();
      
      // Assert
      expect(task.completed).toBe(true);
    });
  });
});
```

### Coverage Goals
- Aim for **80% code coverage** minimum for unit tests
- Focus on critical paths and business logic
- Line coverage is less important than branch/decision coverage
- Test public APIs, not implementation details

## Integration Tests

### Purpose
Integration tests verify that different components work together correctly. They test the interaction between units and external services.

### Scope
- API endpoints and HTTP requests
- State management with data fetching
- Database operations
- Multiple components working together
- Service integrations

### Test Environment
- Use test databases or in-memory databases
- Mock external APIs and services
- Use test fixtures and seed data
- Clean up data between tests

### Best Practices
- **Test realistic scenarios**: Mirror actual user workflows
- **Use meaningful test data**: Use data that reflects real-world usage
- **Test error cases**: Invalid responses, network failures, data inconsistencies
- **Isolate tests**: Each test should be independent and not rely on test order
- **Setup and teardown**: Clean up resources before and after tests

### Example Structure
```javascript
describe('Task API Integration', () => {
  let testDb;
  
  beforeEach(() => {
    // Setup test database
    testDb = createTestDatabase();
  });

  afterEach(() => {
    // Cleanup
    testDb.close();
  });

  it('should create a task and retrieve it from the database', async () => {
    // Arrange
    const taskData = { title: 'Integration Test', dueDate: new Date() };
    
    // Act
    const createdTask = await taskApi.createTask(taskData);
    const retrievedTask = await taskApi.getTask(createdTask.id);
    
    // Assert
    expect(retrievedTask.title).toBe('Integration Test');
  });

  it('should handle database connection errors gracefully', async () => {
    // Arrange
    testDb.simulateError('Connection refused');
    
    // Act & Assert
    await expect(taskApi.getTasks()).rejects.toThrow();
  });
});
```

### Coverage Goals
- Test **all critical workflows**
- Focus on data flow between components
- Test error handling and edge cases
- Aim for 50-60% overall code coverage with integration tests

## End-to-End Tests

### Purpose
E2E tests verify complete user interactions from UI to backend. They test the entire application flow in a realistic environment.

### Scope
- User workflows (create, edit, delete tasks)
- Navigation between pages or views
- Form submissions and validation
- Notification and feedback messages
- Real browser interactions

### Tools & Setup
- Use tools like Playwright, Cypress, or Selenium
- Test against real or staging servers
- Run against multiple browsers (Chrome, Firefox, Safari)
- Headless mode for CI/CD pipelines

### Best Practices
- **Use Page Object Model**: Encapsulate UI interactions in reusable objects
- **Avoid implementation details**: Test user-visible behavior, not HTML structure
- **Test critical paths only**: Focus on key user workflows
- **Wait for elements**: Use explicit waits, not fixed delays
- **Take screenshots on failure**: Aid in debugging test failures
- **Clear and specific selectors**: Use data attributes or semantic selectors

### Example Structure
```javascript
describe('TODO App - Task Management', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('user should be able to create and complete a task', () => {
    // Create task
    cy.get('[data-testid="task-input"]').type('Buy groceries');
    cy.get('[data-testid="add-button"]').click();
    
    // Verify task appears
    cy.get('[data-testid="task-list"]').should('contain', 'Buy groceries');
    
    // Complete task
    cy.get('[data-testid="task-item"]:first').within(() => {
      cy.get('[data-testid="complete-button"]').click();
    });
    
    // Verify completion
    cy.get('[data-testid="task-item"]:first')
      .should('have.class', 'completed');
  });

  it('user should be able to edit an existing task', () => {
    // Create initial task
    cy.get('[data-testid="task-input"]').type('Original title');
    cy.get('[data-testid="add-button"]').click();
    
    // Edit task
    cy.get('[data-testid="task-item"]:first').within(() => {
      cy.get('[data-testid="edit-button"]').click();
    });
    cy.get('[data-testid="task-input"]').clear().type('Updated title');
    cy.get('[data-testid="save-button"]').click();
    
    // Verify update
    cy.get('[data-testid="task-list"]').should('contain', 'Updated title');
    cy.get('[data-testid="task-list"]').should('not.contain', 'Original title');
  });
});
```

### Coverage Goals
- Test **all critical user workflows**
- Focus on happy path and common error scenarios
- Aim for 20-30% code coverage with E2E tests
- Tests should be stable and reliable

## Test Organization

### Directory Structure
```
project/
├── src/
│   ├── components/
│   │   ├── TaskItem.js
│   │   └── __tests__/
│   │       └── TaskItem.test.js
│   ├── services/
│   │   ├── taskService.js
│   │   └── __tests__/
│   │       └── taskService.test.js
│   └── utils/
│       ├── helpers.js
│       └── __tests__/
│           └── helpers.test.js
├── __tests__/
│   ├── integration/
│   │   └── taskAPI.test.js
│   └── e2e/
│       └── taskManagement.spec.js
├── package.json
└── jest.config.js
```

### Naming Conventions
- **Test file names**: `<component>.test.js` or `<component>.spec.js`
- **Test descriptions**: Use clear, readable language
- **Test groups**: Use `describe()` blocks to organize related tests
- **Test cases**: Use `it()` or `test()` with descriptive names

## Required Tests for New Features

### Checklist
Every new feature or modification must include:

- [ ] **Unit tests** for all new functions and components
- [ ] **Edge case tests** for boundary conditions
- [ ] **Error handling tests** for failure scenarios
- [ ] **Integration tests** for API calls or inter-component communication
- [ ] **E2E test** for the complete user workflow (if applicable)
- [ ] **Accessibility tests** to ensure WCAG compliance
- [ ] **Documentation** of test cases and assumptions

### Review Criteria
Before merging, verify:
- All tests pass locally and in CI/CD
- Code coverage meets or exceeds project minimums
- Tests are clear and maintainable
- No tests are skipped (`xit`, `xdescribe`, `pending`)
- Test names clearly describe what is being tested

## Test Maintenance

### Keeping Tests Maintainable

#### Code Organization
- Group related tests with `describe()` blocks
- Use `beforeEach()` and `afterEach()` for setup/teardown
- Extract common test utilities into helper functions
- Avoid hardcoding values; use constants and fixtures

#### Avoiding Common Pitfalls
- **Don't test implementation details**: Test behavior, not how it works
- **Avoid test interdependence**: Tests should run independently
- **Don't use long timeouts**: Use explicit waits instead of delays
- **Avoid snapshot tests**: Prefer explicit assertions for clarity
- **Keep tests focused**: One behavior per test

#### Refactoring Tests
- Update tests when requirements change
- Refactor duplicate test code into helpers
- Keep test setup simple and readable
- Remove obsolete or unreliable tests

### Test Utilities and Fixtures

#### Create Reusable Helpers
```javascript
// testHelpers.js
export const createTestTask = (overrides = {}) => ({
  id: 'test-123',
  title: 'Test Task',
  completed: false,
  dueDate: new Date(),
  ...overrides,
});

export const mockTaskApi = () => ({
  getTasks: jest.fn().mockResolvedValue([createTestTask()]),
  createTask: jest.fn().mockResolvedValue(createTestTask()),
  updateTask: jest.fn().mockResolvedValue(createTestTask()),
  deleteTask: jest.fn().mockResolvedValue(null),
});
```

#### Use Fixtures for Complex Data
```javascript
// fixtures/tasks.json
[
  {
    "id": "1",
    "title": "Complete project",
    "completed": false,
    "dueDate": "2026-02-20"
  },
  {
    "id": "2",
    "title": "Review PR",
    "completed": true,
    "dueDate": "2026-02-15"
  }
]
```

## Running Tests

### Local Development
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- TaskItem.test.js

# Run tests with coverage
npm test -- --coverage
```

### Continuous Integration
- Tests must pass before merging to main branch
- Code coverage reports generated with each build
- E2E tests run on staging environment
- Automated notifications for test failures

## Accessibility Testing

### Principles
- Test keyboard navigation
- Verify screen reader compatibility
- Test color contrast compliance
- Verify focus indicators and management
- Test with actual assistive technologies

### Tools
- `axe-core` for automated accessibility testing
- `jest-axe` for integration with unit tests
- WebAIM validators
- Manual testing with screen readers

## Performance Testing

### Considerations
- Test component rendering performance
- Monitor memory leaks in components
- Track API response times
- Load test the application at scale

## Test Coverage Goals

| Test Type | Coverage Target | Priority |
|-----------|-----------------|----------|
| Unit Tests | 80%+ | High |
| Integration Tests | 50%+ | High |
| E2E Tests | Key workflows | Medium |
| Overall Code Coverage | 70%+ | High |

## Summary
A robust testing strategy ensures the TODO app remains reliable, maintainable, and user-friendly. By following these guidelines—writing unit, integration, and end-to-end tests; requiring tests for all new features; and maintaining test quality—we create a strong foundation for continuous improvement and confident refactoring.
