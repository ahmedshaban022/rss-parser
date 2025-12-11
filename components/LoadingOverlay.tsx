'use client';

interface LoadingOverlayProps {
  message?: string;
  subMessage?: string;
}

export default function LoadingOverlay({ message = 'Loading...', subMessage }: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="flex flex-col items-center gap-4">
          <svg
            className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {message}
            </p>
            {subMessage && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {subMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

