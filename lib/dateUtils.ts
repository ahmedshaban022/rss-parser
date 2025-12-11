/**
 * Date formatting and validation utilities
 */

/**
 * Formats a date string to a readable format
 * Handles various date formats including ISO, RFC 2822, etc.
 */
export function formatDate(dateString: string): string {
  if (!dateString || !dateString.trim()) {
    return dateString;
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if invalid
    }

    // Format as: "MMM DD, YYYY HH:MM"
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats a date string to ISO format
 */
export function formatDateISO(dateString: string): string {
  if (!dateString || !dateString.trim()) {
    return new Date().toISOString();
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Formats a date string to RFC 2822 format (common in RSS feeds)
 */
export function formatDateRFC2822(dateString: string): string {
  if (!dateString || !dateString.trim()) {
    return new Date().toUTCString();
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toUTCString();
    }
    return date.toUTCString();
  } catch {
    return new Date().toUTCString();
  }
}

/**
 * Validates if a string is a valid date
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString || !dateString.trim()) {
    return false;
  }

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Gets a human-readable relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString || !dateString.trim()) {
    return 'Unknown date';
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } catch {
    return 'Invalid date';
  }
}

