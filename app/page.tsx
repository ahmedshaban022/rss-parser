'use client';

import { useState } from 'react';
import RSSForm from '@/components/RSSForm';
import ArticleTable from '@/components/ArticleTable';
import ErrorMessage from '@/components/ErrorMessage';
import LoadingOverlay from '@/components/LoadingOverlay';
import { parseRSSFeed } from '@/lib/rssParser';
import { Article } from '@/types/article';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('Parsing RSS feed...');
  const [rssFeedUrl, setRssFeedUrl] = useState<string>('');
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleRSSSubmit = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setArticles([]);
    setRssFeedUrl(url);
    setLoadingMessage('Fetching RSS feed...');

    try {
      // Update loading message after a short delay
      const timeout1 = setTimeout(() => {
        setLoadingMessage('Parsing XML content...');
      }, 500);

      const result = await parseRSSFeed(url);
      clearTimeout(timeout1);

      setLoadingMessage('Processing articles...');

      if (result.success && result.articles) {
        setArticles(result.articles);
        setError(null);
        setLoadingMessage(`Successfully loaded ${result.articles.length} article(s)`);
        // Keep message visible briefly before hiding overlay
        await new Promise((resolve) => setTimeout(resolve, 800));
      } else {
        setError(result.error || 'Failed to parse RSS feed');
        setArticles([]);
        setRssFeedUrl('');
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while parsing the RSS feed.'
      );
      setArticles([]);
      setRssFeedUrl('');
    } finally {
      setIsLoading(false);
      setLoadingMessage('Parsing RSS feed...');
    }
  };

  const handleArticlesChange = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
  };

  const handleClear = () => {
    setArticles([]);
    setError(null);
    setRssFeedUrl('');
    setIsLoading(false);
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
      {isLoading && (
        <LoadingOverlay
          message={loadingMessage}
          subMessage="This may take a few moments for large feeds..."
        />
      )}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            RSS Feed Parser
          </h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Parse RSS feeds, edit articles, and generate updated XML files
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-end gap-2">
            {(articles.length > 0 || error) && (
              <button
                onClick={handleClear}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                type="button"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear
                </span>
              </button>
            )}
          </div>
          <RSSForm onSubmit={handleRSSSubmit} isLoading={isLoading} resetTrigger={resetTrigger} />

          {error && (
            <ErrorMessage
              message={error}
              onDismiss={() => setError(null)}
            />
          )}

          {articles.length > 0 && (
            <ArticleTable
              articles={articles}
              onArticlesChange={handleArticlesChange}
              rssFeedUrl={rssFeedUrl}
            />
          )}

          {!isLoading && articles.length === 0 && !error && (
            <div className="rounded-lg border border-gray-200 bg-white p-8 dark:border-gray-700 dark:bg-gray-800">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                  No articles loaded
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter an RSS feed URL above to get started
                </p>
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Example RSS Feed URLs to try:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>
                    <span className="font-mono text-xs">• https://www1.cbn.com/rss-cbn-news</span>
                    <span className="ml-2 text-xs text-gray-500">(CBN News)</span>
                  </li>
                  <li>
                    <span className="font-mono text-xs">• http://feeds.bbci.co.uk/news/world/rss.xml</span>
                    <span className="ml-2 text-xs text-gray-500">(BBC World News)</span>
                  </li>
                  <li>
                    <span className="font-mono text-xs">• https://rss.cnn.com/rss/edition.rss</span>
                    <span className="ml-2 text-xs text-gray-500">(CNN)</span>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-amber-600 dark:text-amber-400">
                  ⚠️ Note: Make sure to use the actual RSS feed URL (usually ends with .xml or contains /rss/), not a webpage URL.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
