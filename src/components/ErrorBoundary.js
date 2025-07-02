import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#ffe6e6',
          fontFamily: 'monospace',
          color: '#333'
        }}>
          <h2 style={{ color: '#d63031', marginTop: 0 }}>🚨 Application Error</h2>
          
          <details style={{ marginBottom: '16px' }}>
            <summary style={{ 
              cursor: 'pointer', 
              fontWeight: 'bold',
              padding: '8px 0',
              borderBottom: '1px solid #ddd'
            }}>
              Error Details (click to expand)
            </summary>
            
            <div style={{ 
              marginTop: '12px',
              padding: '12px',
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              <strong>Error:</strong>
              <pre style={{ whiteSpace: 'pre-wrap', color: '#d63031' }}>
                {this.state.error && this.state.error.toString()}
              </pre>
              
              <strong>Stack Trace:</strong>
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontSize: '12px',
                color: '#666',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </div>
          </details>

          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#0984e3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              🔄 Reload Page
            </button>
            
            <button 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              style={{
                padding: '8px 16px',
                backgroundColor: '#00b894',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔧 Try Again
            </button>
          </div>

          <div style={{ 
            marginTop: '16px', 
            fontSize: '14px', 
            color: '#666',
            fontStyle: 'italic'
          }}>
            💡 Check the browser console for additional details
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;