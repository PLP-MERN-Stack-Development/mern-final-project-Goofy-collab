// src/utils/formatters.js

/**
 * Formatting utility functions
 * Provides reusable formatters for displaying data
 */

// ============================================
// DATE & TIME FORMATTERS
// ============================================

/**
 * Format date to readable string
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Format date to short format (MM/DD/YYYY)
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDateShort = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(dateObj);
};

/**
 * Format time
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted time
 */
export const formatTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dateObj);
};

/**
 * Format date and time
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(dateObj);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';

  const now = new Date();
  const diffMs = now - dateObj;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffSec < 60) return 'just now';
  if (diffMin === 1) return '1 minute ago';
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour === 1) return '1 hour ago';
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay} days ago`;
  if (diffWeek === 1) return '1 week ago';
  if (diffWeek < 4) return `${diffWeek} weeks ago`;
  if (diffMonth === 1) return '1 month ago';
  if (diffMonth < 12) return `${diffMonth} months ago`;
  if (diffYear === 1) return '1 year ago';
  return `${diffYear} years ago`;
};

/**
 * Format duration in minutes to readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration (e.g., "1h 30m")
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

// ============================================
// NUMBER FORMATTERS
// ============================================

/**
 * Format number with thousands separator
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
export const formatNumber = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '0';

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};

/**
 * Format number to compact notation (e.g., 1.2K, 1.5M)
 * @param {number} value - Number to format
 * @returns {string} Formatted number
 */
export const formatCompactNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0';

  if (value < 1000) return value.toString();

  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  }).format(value);
};

/**
 * Format percentage
 * @param {number} value - Value to format (0-1 or 0-100)
 * @param {boolean} isDecimal - Whether value is decimal (0-1) or percentage (0-100)
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, isDecimal = true) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';

  const percentValue = isDecimal ? value * 100 : value;

  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  }).format(percentValue / 100);
};

/**
 * Format currency
 * @param {number} value - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted currency
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(value);
};

/**
 * Format rating (out of 5)
 * @param {number} rating - Rating value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted rating
 */
export const formatRating = (rating, decimals = 1) => {
  if (rating === null || rating === undefined || isNaN(rating)) return '0.0';

  return Number(rating).toFixed(decimals);
};

// ============================================
// TEXT FORMATTERS
// ============================================

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Title cased string
 */
export const titleCase = (str) => {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Convert string to URL-friendly slug
 * @param {string} str - String to convert
 * @returns {string} Slug
 */
export const slugify = (str) => {
  if (!str || typeof str !== 'string') return '';

  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncate = (text, maxLength = 100, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';
  
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length).trim() + suffix;
};

/**
 * Truncate text to specified number of words
 * @param {string} text - Text to truncate
 * @param {number} maxWords - Maximum words
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateWords = (text, maxWords = 20, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';

  const words = text.split(' ');
  
  if (words.length <= maxWords) return text;

  return words.slice(0, maxWords).join(' ') + suffix;
};

/**
 * Format text to excerpt (truncate and clean)
 * @param {string} text - Text to format
 * @param {number} maxLength - Maximum length
 * @returns {string} Excerpt
 */
export const formatExcerpt = (text, maxLength = 150) => {
  if (!text || typeof text !== 'string') return '';

  // Remove HTML tags
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  // Truncate
  return truncate(cleanText, maxLength);
};

/**
 * Pluralize word based on count
 * @param {number} count - Count
 * @param {string} singular - Singular form
 * @param {string} plural - Plural form (optional)
 * @returns {string} Pluralized text with count
 */
export const pluralize = (count, singular, plural = null) => {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
};

// ============================================
// PHONE FORMATTERS
// ============================================

/**
 * Format phone number to (XXX) XXX-XXXX
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone; // Return as-is if format unknown
};

// ============================================
// FILE SIZE FORMATTERS
// ============================================

/**
 * Format file size in bytes to human-readable format
 * @param {number} bytes - File size in bytes
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0 || !bytes) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

// ============================================
// RECIPE-SPECIFIC FORMATTERS
// ============================================

/**
 * Format cooking time (minutes to readable format)
 * @param {number} minutes - Cooking time in minutes
 * @returns {string} Formatted cooking time
 */
export const formatCookTime = (minutes) => {
  if (!minutes || minutes <= 0) return '0 min';

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (mins === 0) return `${hours} hr${hours > 1 ? 's' : ''}`;
  
  return `${hours} hr${hours > 1 ? 's' : ''} ${mins} min`;
};

/**
 * Format servings
 * @param {number} servings - Number of servings
 * @returns {string} Formatted servings
 */
export const formatServings = (servings) => {
  if (!servings || servings <= 0) return '0 servings';
  return pluralize(servings, 'serving');
};

/**
 * Format ingredient amount
 * @param {string|number} amount - Ingredient amount
 * @returns {string} Formatted amount
 */
export const formatIngredientAmount = (amount) => {
  if (!amount) return '';
  
  // Convert common fractions
  const fractions = {
    '0.25': '¼',
    '0.33': '⅓',
    '0.5': '½',
    '0.66': '⅔',
    '0.75': '¾'
  };

  const numAmount = parseFloat(amount);
  
  if (!isNaN(numAmount)) {
    const decimal = numAmount % 1;
    const whole = Math.floor(numAmount);
    
    const decimalStr = decimal.toFixed(2);
    
    if (fractions[decimalStr]) {
      return whole > 0 ? `${whole} ${fractions[decimalStr]}` : fractions[decimalStr];
    }
    
    return amount.toString();
  }

  return amount.toString();
};

/**
 * Format difficulty level with emoji
 * @param {string} difficulty - Difficulty level
 * @returns {string} Formatted difficulty
 */
export const formatDifficulty = (difficulty) => {
  const levels = {
    'Easy': '🟢 Easy',
    'Medium': '🟡 Medium',
    'Hard': '🔴 Hard'
  };

  return levels[difficulty] || difficulty;
};

/**
 * Format recipe tags as hashtags
 * @param {Array<string>} tags - Array of tags
 * @returns {string} Formatted tags
 */
export const formatTags = (tags) => {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  
  return tags.map(tag => `#${tag.replace(/\s+/g, '')}`).join(' ');
};

// ============================================
// UTILITY FORMATTERS
// ============================================

/**
 * Format array to comma-separated list
 * @param {Array} arr - Array to format
 * @param {string} conjunction - Conjunction word (default: 'and')
 * @returns {string} Formatted list
 */
export const formatList = (arr, conjunction = 'and') => {
  if (!Array.isArray(arr) || arr.length === 0) return '';
  
  if (arr.length === 1) return arr[0];
  
  if (arr.length === 2) return `${arr[0]} ${conjunction} ${arr[1]}`;
  
  return `${arr.slice(0, -1).join(', ')}, ${conjunction} ${arr[arr.length - 1]}`;
};

/**
 * Format initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const formatInitials = (name) => {
  if (!name || typeof name !== 'string') return '';

  const parts = name.trim().split(' ').filter(Boolean);
  
  if (parts.length === 0) return '';
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * Format address
 * @param {Object} address - Address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return '';

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zip,
    address.country
  ].filter(Boolean);

  return parts.join(', ');
};

/**
 * Remove HTML tags from string
 * @param {string} html - HTML string
 * @returns {string} Plain text
 */
export const stripHtml = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export const escapeHtml = (text) => {
  if (!text || typeof text !== 'string') return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
};

export default {
  formatDate,
  formatDateShort,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatNumber,
  formatCompactNumber,
  formatPercentage,
  formatCurrency,
  formatRating,
  capitalize,
  titleCase,
  slugify,
  truncate,
  truncateWords,
  formatExcerpt,
  pluralize,
  formatPhone,
  formatFileSize,
  formatCookTime,
  formatServings,
  formatIngredientAmount,
  formatDifficulty,
  formatTags,
  formatList,
  formatInitials,
  formatAddress,
  stripHtml,
  escapeHtml
};