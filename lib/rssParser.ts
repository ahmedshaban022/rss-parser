import { Article, RSSParseResult } from '@/types/article';

/**
 * Parses RSS feed XML and extracts articles
 * Handles both custom XML format and standard RSS 2.0 format
 * Uses server-side API route to avoid CORS issues
 */
export async function parseRSSFeed(url: string): Promise<RSSParseResult> {
  try {
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return {
        success: false,
        error: 'Invalid URL format. Please enter a valid RSS feed URL (e.g., https://example.com/feed.xml)',
      };
    }

    // Check if URL looks like an RSS feed
    const urlLower = url.toLowerCase();
    const isLikelyRSSFeed =
      urlLower.includes('/rss') ||
      urlLower.includes('/feed') ||
      urlLower.endsWith('.xml') ||
      urlLower.endsWith('.rss') ||
      urlLower.includes('rss.xml') ||
      urlLower.includes('feed.xml');

    if (!isLikelyRSSFeed) {
      // Warn but still try to fetch
      console.warn('URL does not appear to be an RSS feed. Make sure you are using an RSS feed URL, not a webpage URL.');
    }

    // Use API route to proxy the request (avoids CORS issues)
    const apiUrl = `/api/rss-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Failed to fetch RSS feed: ${response.status} ${response.statusText}`,
      };
    }

    const xmlText = await response.text();
    
    // Parse XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return {
        success: false,
        error: 'Invalid XML format. Please check the RSS feed URL.',
      };
    }

    const articles: Article[] = [];

    // Try custom format first (news-topic structure)
    const newsTopics = xmlDoc.querySelectorAll('news-topic');
    if (newsTopics.length > 0) {
      newsTopics.forEach((topic, index) => {
        const title = topic.querySelector('article-title')?.textContent?.trim() || '';
        const details = topic.querySelector('article-details')?.textContent?.trim() || '';
        const image = topic.querySelector('article-image')?.textContent?.trim() || '';
        const publishDate = topic.querySelector('article-publish-date')?.textContent?.trim() || '';

        if (title) {
          articles.push({
            id: `article-${index}`,
            title,
            details,
            image,
            publishDate,
          });
        }
      });
    } else {
      // Try standard RSS 2.0 format
      const items = xmlDoc.querySelectorAll('item');
      if (items.length > 0) {
        items.forEach((item, index) => {
          const title = item.querySelector('title')?.textContent?.trim() || '';
          const description = item.querySelector('description')?.textContent?.trim() || '';
          const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
          
          // Try to find image in enclosure or media:content or description
          let image = '';
          const enclosure = item.querySelector('enclosure');
          if (enclosure && enclosure.getAttribute('type')?.startsWith('image/')) {
            image = enclosure.getAttribute('url') || '';
          } else {
            const mediaContent = item.querySelector('media\\:content, content');
            if (mediaContent) {
              image = mediaContent.getAttribute('url') || '';
            } else {
              // Try to extract image from description HTML
              const descHtml = item.querySelector('description')?.textContent || '';
              const imgMatch = descHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
              if (imgMatch) {
                image = imgMatch[1];
              }
            }
          }

          if (title) {
            articles.push({
              id: `article-${index}`,
              title,
              details: description,
              image,
              publishDate: pubDate,
            });
          }
        });
      } else {
        // Try Atom format
        const entries = xmlDoc.querySelectorAll('entry');
        if (entries.length > 0) {
          entries.forEach((entry, index) => {
            const title = entry.querySelector('title')?.textContent?.trim() || '';
            const summary = entry.querySelector('summary, content')?.textContent?.trim() || '';
            const published = entry.querySelector('published, updated')?.textContent?.trim() || '';
            
            let image = '';
            const link = entry.querySelector('link[type^="image"]');
            if (link) {
              image = link.getAttribute('href') || '';
            }

            if (title) {
              articles.push({
                id: `article-${index}`,
                title,
                details: summary,
                image,
                publishDate: published,
              });
            }
          });
        }
      }
    }

    if (articles.length === 0) {
      return {
        success: false,
        error: 'No articles found in the RSS feed. Please check the feed format.',
      };
    }

    return {
      success: true,
      articles,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred while parsing the RSS feed.',
    };
  }
}

