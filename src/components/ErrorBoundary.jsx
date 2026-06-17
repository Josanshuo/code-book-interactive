import { Component } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

/**
 * Error boundary that catches render errors in child components.
 * Wraps each chapter's lab simulator to prevent one broken chapter
 * from crashing the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Reset error state when children change (e.g. switching chapters)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="lab-container flex-column" style={{ alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
          <AlertCircle size={48} color="var(--color-ruby)" />
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--color-ruby)', marginBottom: '0.5rem' }}>
              Simulator Error
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
              This chapter's simulator encountered an unexpected error. 
              Try resetting or switching to another chapter.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={this.handleReset}>
            <RotateCcw size={16} /> Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
