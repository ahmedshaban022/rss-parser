export interface Article {
  id: string;
  title: string;
  details: string;
  image: string;
  publishDate: string;
}

export interface RSSParseResult {
  success: boolean;
  articles?: Article[];
  error?: string;
}

