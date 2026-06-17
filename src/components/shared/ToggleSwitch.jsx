import { useCallback } from 'react';

/**
 * Accessible toggle switch component.
 * Extracted from the repeated switch-control pattern used across chapters 6, 8, 14, 17, etc.
 *
 * @param {object} props
 * @param {string} props.label - The label text for the switch.
 * @param {boolean} props.value - Current on/off state.
 * @param {function} props.onChange - Callback with the new boolean value.
 * @param {string} [props.testId] - Optional data-testid attribute.
 */
export default function ToggleSwitch({ label, value, onChange, testId }) {
  const handleClick = useCallback(() => {
    onChange(!value);
  }, [value, onChange]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!value);
    }
  }, [value, onChange]);

  return (
    <button
      className={`switch-control ${value ? 'on' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={value}
      aria-label={`${label}: ${value ? 'ON' : 'OFF'}`}
      data-testid={testId}
      type="button"
    >
      <span className="switch-label">{label}</span>
      <div className={`switch-toggle ${value ? 'on' : ''}`}>
        <div className="switch-toggle-handle"></div>
      </div>
    </button>
  );
}
