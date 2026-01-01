import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Copy, Smartphone } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null, copied: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Log to console for debugging
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    
    console.error('Platform:', platform);
    console.error('Is Native:', isNative);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    
    // Check if this is a chunk loading error
    const isChunkLoadError = error.message.includes('Failed to fetch dynamically imported module') ||
      error.message.includes('Loading chunk') ||
      error.message.includes('TypeError: Failed to fetch');

    if (isChunkLoadError) {
      // For chunk loading errors, clear the cache and reload
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    }

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
      errorInfo: null,
      copied: false
    });
    // Force a refresh of the component
    window.location.reload();
  };

  private handleCopyError = (): void => {
    const errorText = this.getErrorText();
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorText).then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 2000);
      });
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = errorText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  private getErrorText = (): string => {
    const platform = Capacitor.getPlatform();
    const isNative = Capacitor.isNativePlatform();
    const { error, errorInfo } = this.state;
    
    return `
Supply Chain KE - Error Report
==============================
Platform: ${platform}
Native App: ${isNative}
Timestamp: ${new Date().toISOString()}

Error Message:
${error?.message || 'Unknown error'}

Error Stack:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

User Agent:
${navigator.userAgent}
    `.trim();
  };


  public render(): ReactNode {
    if (this.state.hasError) {
      // Check if a custom fallback was provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const platform = Capacitor.getPlatform();
      const isNative = Capacitor.isNativePlatform();

      // Default error UI with enhanced mobile debugging
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
          <div className="max-w-2xl w-full mx-auto bg-card p-6 rounded-lg shadow-lg border border-border">
            <div className="flex items-center justify-between mb-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              {isNative && (
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Smartphone className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium text-primary">{platform.toUpperCase()}</span>
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-2">Application Error</h2>
            <p className="text-muted-foreground mb-4">
              The app encountered an unexpected error. {isNative ? 'Copy the error details below and report to support.' : 'Please try refreshing the page.'}
            </p>
            
            {/* Error Message */}
            {this.state.error && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 text-destructive">Error Message:</h3>
                <div className="p-3 bg-destructive/10 rounded border border-destructive/20 text-sm">
                  <p className="font-mono break-words">{this.state.error.message}</p>
                </div>
              </div>
            )}

            {/* Stack Trace - Expandable on mobile */}
            {this.state.error?.stack && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-semibold mb-2 hover:text-primary">
                  Stack Trace (click to expand)
                </summary>
                <div className="p-3 bg-muted rounded text-left overflow-auto max-h-64 text-xs">
                  <pre className="font-mono whitespace-pre-wrap break-words">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}

            {/* Component Stack */}
            {this.state.errorInfo?.componentStack && (
              <details className="mb-4">
                <summary className="cursor-pointer text-sm font-semibold mb-2 hover:text-primary">
                  Component Stack (click to expand)
                </summary>
                <div className="p-3 bg-muted rounded text-left overflow-auto max-h-64 text-xs">
                  <pre className="font-mono whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={this.handleRetry} 
                className="flex items-center justify-center gap-2 flex-1"
              >
                <RefreshCw className="h-4 w-4" />
                Reload App
              </Button>
              
              <Button 
                onClick={this.handleCopyError}
                variant="outline"
                className="flex items-center justify-center gap-2 flex-1"
              >
                <Copy className="h-4 w-4" />
                {this.state.copied ? 'Copied!' : 'Copy Error Details'}
              </Button>
            </div>

            {/* Debug Info */}
            <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
              <p>Platform: {platform} {isNative ? '(Native App)' : '(Web)'}</p>
              <p>Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
