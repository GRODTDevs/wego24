
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { errorLogger } from '../utils/errorLogger';

export function ErrorViewer() {
  const [errors, setErrors] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateErrors = () => {
      const allErrors = [...errorLogger.getErrors(), ...errorLogger.getStoredErrors()];
      setErrors(allErrors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    };

    updateErrors();
    const interval = setInterval(updateErrors, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          Errors ({errors.length})
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 z-50">
      <Card className="border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex justify-between items-center">
            Error Log ({errors.length})
            <div className="flex gap-2">
              <Button
                onClick={() => errorLogger.clearErrors()}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Clear
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Hide
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-64 overflow-y-auto">
          {errors.length === 0 ? (
            <p className="text-sm text-gray-500">No errors logged</p>
          ) : (
            <div className="space-y-2">
              {errors.slice(0, 10).map((error, index) => (
                <div key={index} className="text-xs bg-red-50 p-2 rounded border">
                  <div className="font-semibold text-red-800">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-red-700 break-words">{error.error}</div>
                  {error.stack && (
                    <details className="mt-1">
                      <summary className="cursor-pointer text-red-600">Stack trace</summary>
                      <pre className="text-xs mt-1 whitespace-pre-wrap">{error.stack}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
