/**
 * Date formatting utility functions
 */

export type DateFormat = 'short' | 'medium' | 'long' | 'full' | 'time' | 'date' | 'datetime';

/**
 * Formats a date to a readable string
 * @param date - Date to format (Date object, string, or timestamp)
 * @param format - Format style (default: 'medium')
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: DateFormat = 'medium',
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Record<DateFormat, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: 'numeric', day: 'numeric' },
    medium: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: '2-digit', minute: '2-digit' },
    date: { year: 'numeric', month: '2-digit', day: '2-digit' },
    datetime: { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit' 
    },
  };

  try {
    return new Intl.DateTimeFormat(locale, formatOptions[format]).format(dateObj);
  } catch (error) {
    return dateObj.toLocaleString();
  }
};

/**
 * Formats a date to a relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - Date to format
 * @param locale - Locale string (default: 'en-US')
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: Date | string | number,
  locale: string = 'en-US'
): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // Check if we have Intl.RelativeTimeFormat support
  if (typeof Intl !== 'undefined' && 'RelativeTimeFormat' in Intl) {
    try {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

      if (Math.abs(diffInSeconds) < 60) {
        return rtf.format(-diffInSeconds, 'second');
      } else if (Math.abs(diffInSeconds) < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      } else if (Math.abs(diffInSeconds) < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      } else if (Math.abs(diffInSeconds) < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
      } else if (Math.abs(diffInSeconds) < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
      }
    } catch (error) {
      // Fallback if RelativeTimeFormat is not supported
    }
  }

  // Fallback implementation
  const absDiff = Math.abs(diffInSeconds);
  if (absDiff < 60) {
    return diffInSeconds < 0 ? `in ${absDiff} seconds` : `${absDiff} seconds ago`;
  } else if (absDiff < 3600) {
    const minutes = Math.floor(absDiff / 60);
    return diffInSeconds < 0 ? `in ${minutes} minutes` : `${minutes} minutes ago`;
  } else if (absDiff < 86400) {
    const hours = Math.floor(absDiff / 3600);
    return diffInSeconds < 0 ? `in ${hours} hours` : `${hours} hours ago`;
  } else if (absDiff < 2592000) {
    const days = Math.floor(absDiff / 86400);
    return diffInSeconds < 0 ? `in ${days} days` : `${days} days ago`;
  } else {
    return formatDate(dateObj, 'medium', locale);
  }
};

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns true if date is today, false otherwise
 */
export const isToday = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
};

/**
 * Checks if a date is in the past
 * @param date - Date to check
 * @returns true if date is in the past, false otherwise
 */
export const isPast = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return dateObj.getTime() < new Date().getTime();
};

/**
 * Checks if a date is in the future
 * @param date - Date to check
 * @returns true if date is in the future, false otherwise
 */
export const isFuture = (date: Date | string | number): boolean => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return dateObj.getTime() > new Date().getTime();
};

