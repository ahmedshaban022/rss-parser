'use client';

import { useState, useEffect } from 'react';
import { Article } from '@/types/article';
import { generateRSSXML, downloadXML } from '@/lib/xmlGenerator';

interface ArticleTableProps {
  articles: Article[];
  onArticlesChange?: (articles: Article[]) => void;
}

export default function ArticleTable({ articles, onArticlesChange }: ArticleTableProps) {
  const [editedArticles, setEditedArticles] = useState<Article[]>(articles);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setEditedArticles(articles);
    setHasChanges(false);
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
    onArticlesChange?.(updated);
  };

  const handleGenerateXML = () => {
    const xmlContent = generateRSSXML(editedArticles);
    downloadXML(xmlContent, 'updated-rss-feed.xml');
    setHasChanges(false);
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
            {editedArticles.map((article) => (
              <tr
                key={article.id}
                className="border-b border-gray-200 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
              >
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={article.title}
                    onChange={(e) =>
                      handleFieldChange(article.id, 'title', e.target.value)
                    }
                    className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
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
                    placeholder="Image URL"
                    className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                  {article.image && (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="mt-2 h-16 w-16 rounded object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
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
                    className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasChanges && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          * You have unsaved changes. Click &quot;Generate XML File&quot; to download the updated RSS feed.
        </p>
      )}
    </div>
  );
}

