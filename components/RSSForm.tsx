'use client';

import { useState, FormEvent } from 'react';

interface RSSFormProps {
  onSubmit: (url: string) => void;
  isLoading?: boolean;
}

export default function RSSForm({ onSubmit, isLoading = false }: RSSFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 w-full">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="rss-url" className="sr-only">
            RSS Feed URL
          </label>
          <input
            id="rss-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter RSS feed URL (e.g., https://www1.cbn.com/rss-cbn-news)"
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
            required
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            💡 Tip: Use an actual RSS feed URL (ends with .xml or contains /rss/), not a webpage URL
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
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
              Parsing...
            </span>
          ) : (
            'Parse RSS Feed'
          )}
        </button>
      </div>
    </form>
  );
}

