'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { generateRSSXML, downloadXML } from '@/lib/xmlGenerator';
import { validateArticle, ValidationError } from '@/lib/validation';
import { formatDate, isValidDate } from '@/lib/dateUtils';
import ImageModal from '@/components/ImageModal';

interface ArticleTableProps {
  articles: Article[];
  onArticlesChange?: (articles: Article[]) => void;
  rssFeedUrl?: string;
}

export default function ArticleTable({ articles, onArticlesChange, rssFeedUrl }: ArticleTableProps) {
  const [editedArticles, setEditedArticles] = useState<Article[]>(articles);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError[]>>({});
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    setEditedArticles(articles);
    setHasChanges(false);
    setValidationErrors({});
  }, [articles]);

  const handleFieldChange = (
    id: string,
    field: keyof Article,
    value: string
  ) => {
    const updated = editedArticles.map((article) =>
      article.id === id ? { ...article, [field]: value } : article
    );
    setEditedArticles(updated);
    setHasChanges(true);
    
    // Validate the updated article
    const updatedArticle = updated.find((a) => a.id === id);
    if (updatedArticle) {
      const errors = validateArticle(updatedArticle);
      setValidationErrors((prev) => ({
        ...prev,
        [id]: errors,
      }));
    }
    
    onArticlesChange?.(updated);
  };

  const handleGenerateXML = () => {
    // Validate all articles before generating XML
    const allErrors: Record<string, ValidationError[]> = {};
    let hasErrors = false;

    editedArticles.forEach((article) => {
      const errors = validateArticle(article);
      if (errors.length > 0) {
        allErrors[article.id] = errors;
        hasErrors = true;
      }
    });

    setValidationErrors(allErrors);

    if (hasErrors) {
      // Scroll to first error
      const firstErrorId = Object.keys(allErrors)[0];
      const element = document.querySelector(`[data-article-id="${firstErrorId}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Extract domain from RSS feed URL for channel metadata
    let channelLink = '';
    try {
      if (rssFeedUrl) {
        const url = new URL(rssFeedUrl);
        channelLink = `${url.protocol}//${url.host}`;
      }
    } catch {
      // If URL parsing fails, use empty string
    }

    const xmlContent = generateRSSXML(editedArticles, {
      title: 'Updated RSS Feed',
      description: `RSS Feed with ${editedArticles.length} article(s)`,
      link: channelLink,
      language: 'en-US',
    });
    downloadXML(xmlContent, 'updated-rss-feed.xml');
    setHasChanges(false);
    setValidationErrors({});
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Articles ({editedArticles.length})
        </h2>
        <button
          onClick={handleGenerateXML}
          className="rounded-lg bg-green-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
        >
          Generate XML File
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Details
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Image URL
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                Publish Date
              </th>
            </tr>
          </thead>
          <tbody>
            {editedArticles.map((article) => {
              const errors = validationErrors[article.id] || [];
              const titleError = errors.find((e) => e.field === 'title');
              const imageError = errors.find((e) => e.field === 'image');
              const hasRowError = errors.length > 0;

              return (
                <tr
                  key={article.id}
                  data-article-id={article.id}
                  className={`border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 ${
                    hasRowError ? 'bg-red-50/50 dark:bg-red-900/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) =>
                        handleFieldChange(article.id, 'title', e.target.value)
                      }
                      className={`w-full rounded border px-2 py-1 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 ${
                        titleError
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                      }`}
                      required
                    />
                    {titleError && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {titleError.message}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      value={article.details}
                      onChange={(e) =>
                        handleFieldChange(article.id, 'details', e.target.value)
                      }
                      rows={2}
                      className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="url"
                      value={article.image}
                      onChange={(e) =>
                        handleFieldChange(article.id, 'image', e.target.value)
                      }
                      placeholder="Image URL (optional)"
                      className={`w-full rounded border px-2 py-1 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 ${
                        imageError
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                      }`}
                    />
                    {imageError && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                        {imageError.message}
                      </p>
                    )}
                    {article.image && !imageError && (
                      <div className="mt-2">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-16 w-16 cursor-pointer rounded object-cover transition-transform hover:scale-105"
                          onClick={() => setSelectedImage({ url: article.image, alt: article.title })}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                          title="Click to view full size"
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={article.publishDate}
                      onChange={(e) =>
                        handleFieldChange(
                          article.id,
                          'publishDate',
                          e.target.value
                        )
                      }
                      placeholder="e.g., 2024-01-15 or Mon, 15 Jan 2024 12:00:00 GMT"
                      className={`w-full rounded border px-2 py-1 text-sm bg-white text-gray-900 focus:outline-none focus:ring-1 dark:bg-gray-800 dark:text-gray-100 ${
                        article.publishDate && !isValidDate(article.publishDate)
                          ? 'border-amber-500 focus:border-amber-500 focus:ring-amber-500'
                          : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600'
                      }`}
                    />
                    {article.publishDate && (
                      <div className="mt-1 text-xs">
                        {isValidDate(article.publishDate) ? (
                          <span className="text-gray-600 dark:text-gray-400">
                            {formatDate(article.publishDate)}
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">
                            ⚠️ Invalid date format
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {hasChanges && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          * You have unsaved changes. Click &quot;Generate XML File&quot; to download the updated RSS feed.
        </p>
      )}
      {Object.keys(validationErrors).length > 0 && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            ⚠️ Please fix validation errors before generating XML file.
          </p>
        </div>
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          imageAlt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

