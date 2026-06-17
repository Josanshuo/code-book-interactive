import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleSwitch from '../components/shared/ToggleSwitch';

describe('ToggleSwitch', () => {
  it('should render with the label text', () => {
    render(<ToggleSwitch label="Power" value={false} onChange={() => {}} />);
    expect(screen.getByText('Power')).toBeInTheDocument();
  });

  it('should have role="switch"', () => {
    render(<ToggleSwitch label="Power" value={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('should reflect OFF state with aria-checked="false"', () => {
    render(<ToggleSwitch label="Power" value={false} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('should reflect ON state with aria-checked="true"', () => {
    render(<ToggleSwitch label="Power" value={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('should have an accessible label including state', () => {
    render(<ToggleSwitch label="Power" value={true} onChange={() => {}} />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-label', 'Power: ON');
  });

  it('should call onChange with toggled value when clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleSwitch label="Power" value={false} onChange={onChange} />);

    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should call onChange with toggled value when ON switch is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleSwitch label="Power" value={true} onChange={onChange} />);

    await user.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('should toggle via keyboard Enter key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleSwitch label="Power" value={false} onChange={onChange} />);

    screen.getByRole('switch').focus();
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should toggle via keyboard Space key', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ToggleSwitch label="Power" value={false} onChange={onChange} />);

    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('should apply data-testid when provided', () => {
    render(
      <ToggleSwitch label="Power" value={false} onChange={() => {}} testId="my-switch" />
    );
    expect(screen.getByTestId('my-switch')).toBeInTheDocument();
  });

  it('should add "on" class when value is true', () => {
    render(<ToggleSwitch label="Power" value={true} onChange={() => {}} testId="sw" />);
    const toggle = screen.getByTestId('sw').querySelector('.switch-toggle');
    expect(toggle).toHaveClass('on');
  });

  it('should not have "on" class when value is false', () => {
    render(<ToggleSwitch label="Power" value={false} onChange={() => {}} testId="sw" />);
    const toggle = screen.getByTestId('sw').querySelector('.switch-toggle');
    expect(toggle).not.toHaveClass('on');
  });
});
