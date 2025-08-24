/**
 * Formats a date relative to now (e.g., "2 hours ago", "3 days ago")
 */
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
};

/**
 * Capitalizes the first letter of a string
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generates initials from a full name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';

  const words = name.split(' ').filter((word) => word.length > 0);
  if (words.length === 0) return '';

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

/**
 * Creates a debounced version of a function that delays execution until after delay milliseconds
 * have elapsed since the last time it was invoked. Returns cleanup function to cancel pending execution.
 *
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @returns Object with execute function and cleanup function
 */
export const createDebounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number,
): {
  execute: (...args: Parameters<T>) => void;
  cleanup: () => void;
  isPending: () => boolean;
} => {
  let timeoutId: NodeJS.Timeout | null = null;

  const execute = (...args: Parameters<T>) => {
    // Clear existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set new timeout
    timeoutId = setTimeout(() => {
      timeoutId = null;
      func(...args);
    }, delay);
  };

  const cleanup = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const isPending = () => timeoutId !== null;

  return { execute, cleanup, isPending };
};
