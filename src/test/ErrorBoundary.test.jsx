import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorBoundary from '../components/ErrorBoundary';

// Component that throws during render
function ThrowingComponent({ shouldThrow = true }) {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div>Rendered successfully</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress React's error boundary console.error noise in test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Hello World</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('should display error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Simulator Error')).toBeInTheDocument();
    expect(
      screen.getByText(/encountered an unexpected error/)
    ).toBeInTheDocument();
  });

  it('should show a "Try Again" button in error state', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should recover when "Try Again" is clicked', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function ConditionalThrower() {
      if (shouldThrow) throw new Error('boom');
      return <div>Rendered successfully</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Simulator Error')).toBeInTheDocument();

    // Stop throwing, then click Try Again to reset
    shouldThrow = false;
    await user.click(screen.getByText('Try Again'));

    // Re-render to trigger the recovered state
    rerender(
      <ErrorBoundary>
        <ConditionalThrower />
      </ErrorBoundary>
    );
    expect(screen.getByText('Rendered successfully')).toBeInTheDocument();
  });

  it('should reset error state when children prop changes', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Simulator Error')).toBeInTheDocument();

    // Rerender with different children
    rerender(
      <ErrorBoundary>
        <div>New child</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('New child')).toBeInTheDocument();
  });
});
