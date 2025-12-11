import { Article } from '@/types/article';

/**
 * Generates XML string from articles array
 * Uses the custom news-topic format as shown in the assignment
 */
export function generateRSSXML(articles: Article[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<rss>\n';
  const xmlFooter = '</rss>';

  const articlesXML = articles
    .map((article) => {
      return `  <news-topic>
    <article-title>${escapeXML(article.title)}</article-title>
    <article-details>${escapeXML(article.details)}</article-details>
    <article-image>${escapeXML(article.image)}</article-image>
    <article-publish-date>${escapeXML(article.publishDate)}</article-publish-date>
  </news-topic>`;
    })
    .join('\n');

  return xmlHeader + articlesXML + '\n' + xmlFooter;
}

/**
 * Escapes XML special characters
 */
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Downloads XML content as a file
 */
export function downloadXML(xmlContent: string, filename: string = 'rss-feed.xml'): void {
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

