// src/services/api.js

/**
 * Base API configuration and utilities
 * Handles HTTP requests, authentication, and error handling
 */

// API base URL - change this to your backend URL in production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * HTTP Methods enum
 */
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

/**
 * API Error class for custom error handling
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Set authentication token in localStorage
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Build headers for API requests
 * @param {Object} customHeaders - Additional headers
 * @param {boolean} includeAuth - Include authorization header
 * @returns {Object} Headers object
 */
const buildHeaders = (customHeaders = {}, includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Build full URL with query parameters
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Query parameters
 * @returns {string} Full URL with query string
 */
const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });

  return url.toString();
};

/**
 * Handle API response
 * @param {Response} response - Fetch response object
 * @returns {Promise<any>} Parsed response data
 * @throws {ApiError} If response is not ok
 */
const handleResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');

  let data;
  if (isJson) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    // Handle specific error status codes
    if (response.status === 401) {
      // Unauthorized - token might be expired
      removeAuthToken();
      window.location.href = '/signin';
      throw new ApiError('Unauthorized. Please sign in again.', response.status, data);
    }

    if (response.status === 403) {
      throw new ApiError('Forbidden. You do not have permission.', response.status, data);
    }

    if (response.status === 404) {
      throw new ApiError('Resource not found.', response.status, data);
    }

    if (response.status >= 500) {
      throw new ApiError('Server error. Please try again later.', response.status, data);
    }

    // Generic error
    const errorMessage = data?.message || data?.error || 'An error occurred';
    throw new ApiError(errorMessage, response.status, data);
  }

  return data;
};

/**
 * Make HTTP request to API
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 * @returns {Promise<any>} Response data
 */
const request = async (endpoint, options = {}) => {
  const {
    method = HTTP_METHODS.GET,
    body = null,
    params = {},
    headers = {},
    includeAuth = true,
    signal = null
  } = options;

  try {
    const url = buildUrl(endpoint, params);
    const config = {
      method,
      headers: buildHeaders(headers, includeAuth),
      signal
    };

    // Add body for POST, PUT, PATCH requests
    if (body && method !== HTTP_METHODS.GET) {
      if (body instanceof FormData) {
        // For file uploads, remove Content-Type to let browser set it with boundary
        delete config.headers['Content-Type'];
        config.body = body;
      } else {
        config.body = JSON.stringify(body);
      }
    }

    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    // Handle network errors
    if (error.name === 'AbortError') {
      throw new ApiError('Request was cancelled', 0);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Generic network error
    throw new ApiError(
      error.message || 'Network error. Please check your connection.',
      0,
      null
    );
  }
};

/**
 * API service object with HTTP methods
 */
const api = {
  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  get: (endpoint, params = {}, options = {}) => {
    return request(endpoint, {
      method: HTTP_METHODS.GET,
      params,
      ...options
    });
  },

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  post: (endpoint, body = {}, options = {}) => {
    return request(endpoint, {
      method: HTTP_METHODS.POST,
      body,
      ...options
    });
  },

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  put: (endpoint, body = {}, options = {}) => {
    return request(endpoint, {
      method: HTTP_METHODS.PUT,
      body,
      ...options
    });
  },

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  patch: (endpoint, body = {}, options = {}) => {
    return request(endpoint, {
      method: HTTP_METHODS.PATCH,
      body,
      ...options
    });
  },

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  delete: (endpoint, options = {}) => {
    return request(endpoint, {
      method: HTTP_METHODS.DELETE,
      ...options
    });
  },

  /**
   * Upload file(s)
   * @param {string} endpoint - API endpoint
   * @param {FormData} formData - Form data with files
   * @param {Object} options - Additional options
   * @returns {Promise<any>} Response data
   */
  upload: (endpoint, formData, options = {}) => {
    return request(endpoint, {
      method: HTTP_METHODS.POST,
      body: formData,
      ...options
    });
  }
};

/**
 * Create an AbortController for cancellable requests
 * @returns {AbortController} AbortController instance
 */
export const createAbortController = () => {
  return new AbortController();
};

/**
 * Helper to check if error is an ApiError
 * @param {Error} error - Error object
 * @returns {boolean} True if ApiError
 */
export const isApiError = (error) => {
  return error instanceof ApiError;
};

/**
 * Helper to extract error message from any error
 * @param {Error} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (isApiError(error)) {
    return error.message;
  }
  
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
};

/**
 * Interceptor for request logging (development only)
 */
if (import.meta.env.DEV) {
  const originalRequest = request;
  const wrappedRequest = async (...args) => {
    console.log('[API Request]', args[0], args[1]);
    try {
      const response = await originalRequest(...args);
      console.log('[API Response]', args[0], response);
      return response;
    } catch (error) {
      console.error('[API Error]', args[0], error);
      throw error;
    }
  };
  // Note: In production, you might want to use this for analytics
}

export default api;