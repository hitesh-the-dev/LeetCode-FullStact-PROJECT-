import { useState } from 'react';

const ErrorDisplay = ({ error, compilationError, errorDetails, language }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!error && !compilationError) return null;

  const getErrorIcon = (type) => {
    switch (type) {
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return '❌';
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-red-800 flex items-center">
          <span className="mr-2">🚨</span>
          Compilation Error
        </h3>
        {errorDetails && errorDetails.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      <div className="bg-red-100 p-3 rounded border-l-4 border-red-500">
        <pre className="text-sm text-red-800 whitespace-pre-wrap font-mono">
          {compilationError || error}
        </pre>
      </div>

      {showDetails && errorDetails && errorDetails.length > 0 && (
        <div className="mt-4 space-y-3">
          <h4 className="font-semibold text-red-800">Error Details:</h4>
          {errorDetails.map((errorInfo, index) => (
            <div key={index} className="bg-white p-3 rounded border border-red-200">
              <div className="flex items-start space-x-3">
                <span className="text-lg">{getErrorIcon(errorInfo.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`font-semibold ${getErrorColor(errorInfo.type)}`}>
                      {errorInfo.type.toUpperCase()}
                    </span>
                    {errorInfo.line && (
                      <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-mono">
                        Line {errorInfo.line}
                        {errorInfo.column && `, Column ${errorInfo.column}`}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 font-mono">
                    {errorInfo.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Check for syntax errors like missing semicolons, brackets, or parentheses</li>
          <li>• Verify variable names and function names are spelled correctly</li>
          <li>• Make sure all required imports are included</li>
          <li>• Check for type mismatches and undefined variables</li>
        </ul>
      </div>
    </div>
  );
};

export default ErrorDisplay;
