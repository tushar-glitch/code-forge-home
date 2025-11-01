import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../src/Counter';
import '@testing-library/jest-dom';

test('renders counter with initial count of 0', () => {
  render(<Counter />);
  expect(screen.getByText('Count: 0')).toBeInTheDocument();
});

test('increments counter when Increment button is clicked', () => {
  render(<Counter />);
  const incrementButton = screen.getByText('Increment');
  fireEvent.click(incrementButton);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});

test('decrements counter when Decrement button is clicked', () => {
  render(<Counter />);
  const decrementButton = screen.getByText('Decrement');
  fireEvent.click(decrementButton);
  expect(screen.getByText('Count: -1')).toBeInTheDocument();
});

test('increments and decrements work together', () => {
  render(<Counter />);
  const incrementButton = screen.getByText('Increment');
  const decrementButton = screen.getByText('Decrement');
  
  // Increment twice
  fireEvent.click(incrementButton);
  fireEvent.click(incrementButton);
  expect(screen.getByText('Count: 2')).toBeInTheDocument();
  
  // Decrement once
  fireEvent.click(decrementButton);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
