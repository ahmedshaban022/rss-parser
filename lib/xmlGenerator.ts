import { Article } from '@/types/article';

interface RSSChannelMetadata {
  title?: string;
  description?: string;
  link?: string;
  language?: string;
  lastBuildDate?: string;
}

/**
 * Generates XML string from articles array
 * Uses the custom news-topic format as shown in the assignment
 * Includes RSS channel metadata for a complete RSS feed structure
 */
export function generateRSSXML(
  articles: Article[],
  channelMetadata?: RSSChannelMetadata
): string {
  const now = new Date().toUTCString();
  
  // Default channel metadata
  const channel: RSSChannelMetadata = {
    title: channelMetadata?.title || 'RSS Feed',
    description: channelMetadata?.description || 'Generated RSS Feed',
    link: channelMetadata?.link || '',
    language: channelMetadata?.language || 'en-US',
    lastBuildDate: channelMetadata?.lastBuildDate || now,
  };

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n';
  
  const channelXML = `    <title>${escapeXML(channel.title!)}</title>
    <description>${escapeXML(channel.description!)}</description>
    <link>${escapeXML(channel.link!)}</link>
    <language>${escapeXML(channel.language!)}</language>
    <lastBuildDate>${escapeXML(channel.lastBuildDate!)}</lastBuildDate>
    <generator>RSS Parser Application</generator>
`;

  const articlesXML = articles
    .map((article) => {
      return `    <news-topic>
      <article-title>${escapeXML(article.title)}</article-title>
      <article-details>${escapeXML(article.details)}</article-details>
      <article-image>${escapeXML(article.image)}</article-image>
      <article-publish-date>${escapeXML(article.publishDate)}</article-publish-date>
    </news-topic>`;
    })
    .join('\n');

  const xmlFooter = '  </channel>\n</rss>';

  return xmlHeader + channelXML + articlesXML + '\n' + xmlFooter;
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

