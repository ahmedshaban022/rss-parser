/**
 * Validation utilities for article fields
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates if a title is not empty
 */
export function validateTitle(title: string): ValidationError | null {
  if (!title || !title.trim()) {
    return {
      field: 'title',
      message: 'Title cannot be empty',
    };
  }
  return null;
}

/**
 * Validates if an image URL is valid (if provided)
 */
export function validateImageUrl(imageUrl: string): ValidationError | null {
  if (!imageUrl || !imageUrl.trim()) {
    // Image URL is optional, so empty is fine
    return null;
  }

  try {
    const url = new URL(imageUrl);
    // Check if it's http or https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return {
        field: 'image',
        message: 'Image URL must use http:// or https://',
      };
    }
  } catch {
    return {
      field: 'image',
      message: 'Invalid URL format',
    };
  }

  return null;
}

/**
 * Validates an entire article
 */
export function validateArticle(article: {
  title: string;
  image: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  const titleError = validateTitle(article.title);
  if (titleError) {
    errors.push(titleError);
  }

  const imageError = validateImageUrl(article.image);
  if (imageError) {
    errors.push(imageError);
  }

  return errors;
}

