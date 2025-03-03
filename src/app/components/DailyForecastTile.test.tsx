import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DailyForecastTile from './DailyForecastTile';

describe('DailyForecastTile', () => {
  const defaultProps = {
    day: 'Monday',
    minTemp: 10,
    maxTemp: 20,
    icon: '/icon.png',
    onClick: jest.fn(),
    isActive: false,
  };

  test('renders the day', () => {
    render(<DailyForecastTile {...defaultProps} />);
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });

  test('renders the icon', () => {
    render(<DailyForecastTile {...defaultProps} />);
    expect(screen.getByAltText('Monday')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    render(<DailyForecastTile {...defaultProps} />);
    fireEvent.click(screen.getByText('Monday'));
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  test('applies active styles when isActive is true', () => {
    render(<DailyForecastTile {...defaultProps} isActive={true} />);
    expect(screen.getByText('Monday').parentElement).toHaveClass(
      'font-bold bg-blue-50',
    );
  });

  test('does not apply active styles when isActive is false', () => {
    render(<DailyForecastTile {...defaultProps} isActive={false} />);
    expect(screen.getByText('Monday').parentElement).not.toHaveClass(
      'font-bold bg-blue-50',
    );
  });
});
