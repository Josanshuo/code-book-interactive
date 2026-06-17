/**
 * Reusable value display card with monospace styling.
 * Extracted from the repeated glass-card pattern used across nearly every chapter.
 *
 * @param {object} props
 * @param {string} props.label - The label text displayed above the value.
 * @param {string|number} props.value - The value to display prominently.
 * @param {string} [props.color='var(--color-cyan)'] - CSS color for the value text.
 * @param {string} [props.fontSize='1.75rem'] - CSS font-size for the value.
 * @param {object} [props.style] - Additional inline styles for the container.
 * @param {string} [props.testId] - Optional data-testid attribute.
 */
export default function DisplayCard({
  label,
  value,
  color = 'var(--color-cyan)',
  fontSize = '1.75rem',
  style,
  testId,
}) {
  return (
    <div
      className="glass-card text-mono"
      style={{ textAlign: 'center', ...style }}
      data-testid={testId}
    >
      <div className="display-card-label">{label}</div>
      <div
        className="display-card-value"
        style={{ fontSize, color, fontWeight: 'bold', marginTop: '0.5rem' }}
      >
        {value}
      </div>
    </div>
  );
}
