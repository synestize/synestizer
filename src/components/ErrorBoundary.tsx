import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-800 text-white flex items-center justify-center p-4">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-lg">
            <h2 className="text-xl font-bold mb-4">Application Error</h2>
            <p className="mb-4">Something went wrong. Please check the console for details.</p>
            {this.state.error && (
              <details className="bg-red-800 p-3 rounded text-sm">
                <summary className="cursor-pointer font-semibold">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</pre>
              </details>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;