import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DisplayCard from '../components/shared/DisplayCard';

describe('DisplayCard', () => {
  it('should render label and value', () => {
    render(<DisplayCard label="Binary" value="101010" />);
    expect(screen.getByText('Binary')).toBeInTheDocument();
    expect(screen.getByText('101010')).toBeInTheDocument();
  });

  it('should apply default cyan color to value', () => {
    render(<DisplayCard label="Test" value="42" />);
    const value = screen.getByText('42');
    expect(value.style.color).toBe('var(--color-cyan)');
  });

  it('should apply custom color when provided', () => {
    render(<DisplayCard label="Test" value="42" color="var(--color-pink)" />);
    const value = screen.getByText('42');
    expect(value.style.color).toBe('var(--color-pink)');
  });

  it('should apply custom fontSize when provided', () => {
    render(<DisplayCard label="Test" value="42" fontSize="2rem" />);
    const value = screen.getByText('42');
    expect(value.style.fontSize).toBe('2rem');
  });

  it('should apply data-testid when provided', () => {
    render(<DisplayCard label="Test" value="42" testId="my-card" />);
    expect(screen.getByTestId('my-card')).toBeInTheDocument();
  });

  it('should have glass-card and text-mono classes', () => {
    render(<DisplayCard label="Test" value="42" testId="card" />);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('glass-card');
    expect(card).toHaveClass('text-mono');
  });

  it('should render numeric values', () => {
    render(<DisplayCard label="Count" value={256} />);
    expect(screen.getByText('256')).toBeInTheDocument();
  });

  it('should merge additional styles', () => {
    render(
      <DisplayCard label="Test" value="42" style={{ minWidth: '200px' }} testId="card" />
    );
    const card = screen.getByTestId('card');
    expect(card.style.minWidth).toBe('200px');
    expect(card.style.textAlign).toBe('center');
  });
});
