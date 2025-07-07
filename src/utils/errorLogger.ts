
interface ErrorLog {
  timestamp: string;
  error: string;
  stack?: string;
  userAgent: string;
  url: string;
  userId?: string;
}

class ErrorLogger {
  private errors: ErrorLog[] = [];

  log(error: Error | string, userId?: string) {
    console.log('ErrorLogger.log called with:', error);
    
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId
    };

    this.errors.push(errorLog);
    console.error('Error logged:', errorLog);

    // Keep only last 100 errors to prevent memory issues
    if (this.errors.length > 100) {
      this.errors = this.errors.slice(-100);
    }

    // In a real app, you'd send this to a logging service
    this.sendToLoggingService(errorLog);
  }

  private sendToLoggingService(errorLog: ErrorLog) {
    // This would typically send to a service like Sentry, LogRocket, etc.
    // For now, we'll just store it locally
    try {
      const existingLogs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      existingLogs.push(errorLog);
      localStorage.setItem('errorLogs', JSON.stringify(existingLogs.slice(-50))); // Keep last 50
      console.log('Error stored to localStorage');
    } catch (e) {
      console.error('Failed to store error log:', e);
    }
  }

  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  getStoredErrors(): ErrorLog[] {
    try {
      const stored = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      console.log('Retrieved stored errors:', stored.length);
      return stored;
    } catch {
      return [];
    }
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem('errorLogs');
    console.log('Errors cleared');
  }
}

export const errorLogger = new ErrorLogger();

// Global error handler
window.addEventListener('error', (event) => {
  console.log('Global error handler triggered:', event);
  errorLogger.log(event.error || event.message);
});

window.addEventListener('unhandledrejection', (event) => {
  console.log('Unhandled promise rejection:', event);
  errorLogger.log(event.reason instanceof Error ? event.reason : String(event.reason));
});

console.log('Error logger initialized');
