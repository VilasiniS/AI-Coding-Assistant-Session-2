import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

// Mock the TaskList component since it requires API calls
jest.mock('../components/TaskList', () => {
  return function MockTaskList() {
    return <div>TaskList Component</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('renders TaskList component', () => {
    const { getByText } = render(<App />);
    expect(getByText('TaskList Component')).toBeInTheDocument();
  });
});
