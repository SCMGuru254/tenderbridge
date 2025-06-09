import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = (): void => {
    // Reset the error state and try again
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    // Force a refresh of the component
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Check if a custom fallback was provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <div className="max-w-md mx-auto bg-card p-6 rounded-lg shadow-lg border border-border">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            
            <div className="mb-4 text-muted-foreground">
              <p>We're experiencing some technical difficulties.</p>
              <p className="mt-2">This could be due to:</p>
              <ul className="list-disc list-inside text-left mt-2">
                <li>Temporary service disruption</li>
                <li>Network connectivity issues</li>
                <li>Server maintenance</li>
              </ul>
            </div>

            {this.state.error && (
              <div className="mb-4 p-3 bg-muted rounded text-left overflow-auto max-h-32 text-xs">
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}

            <Button 
              onClick={this.handleRetry} 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
