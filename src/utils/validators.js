// src/utils/validators.js

/**
 * Validation utility functions
 * Provides reusable validators for forms and data validation
 */

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Check if value is not empty
 * @param {any} value - Value to check
 * @returns {boolean} True if not empty
 */
export const isNotEmpty = (value) => !isEmpty(value);

// ============================================
// EMAIL VALIDATORS
// ============================================

/**
 * Validate email format
 * @param {string} email - Email address
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate email with detailed check
 * @param {string} email - Email address
 * @returns {Object} Validation result with message
 */
export const validateEmail = (email) => {
  if (isEmpty(email)) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!isValidEmail(email)) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, message: '' };
};

// ============================================
// PASSWORD VALIDATORS
// ============================================

/**
 * Validate password strength
 * @param {string} password - Password
 * @returns {boolean} True if meets minimum requirements
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  return password.length >= 6;
};

/**
 * Check password strength level
 * @param {string} password - Password
 * @returns {Object} Strength level and score (0-4)
 */
export const getPasswordStrength = (password) => {
  if (!password) return { level: 'none', score: 0 };

  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Complexity checks
  if (/[a-z]/.test(password)) score++; // lowercase
  if (/[A-Z]/.test(password)) score++; // uppercase
  if (/[0-9]/.test(password)) score++; // numbers
  if (/[^A-Za-z0-9]/.test(password)) score++; // special chars

  // Normalize score to 0-4
  const normalizedScore = Math.min(4, Math.floor(score / 1.5));

  const levels = ['weak', 'weak', 'fair', 'good', 'strong'];
  
  return {
    level: levels[normalizedScore],
    score: normalizedScore
  };
};

/**
 * Validate password with requirements
 * @param {string} password - Password
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    requireUppercase = false,
    requireLowercase = false,
    requireNumber = false,
    requireSpecialChar = false
  } = options;

  if (isEmpty(password)) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < minLength) {
    return { 
      isValid: false, 
      message: `Password must be at least ${minLength} characters long` 
    };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one uppercase letter' 
    };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one lowercase letter' 
    };
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one number' 
    };
  }

  if (requireSpecialChar && !/[^A-Za-z0-9]/.test(password)) {
    return { 
      isValid: false, 
      message: 'Password must contain at least one special character' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Check if passwords match
 * @param {string} password - Password
 * @param {string} confirmPassword - Confirm password
 * @returns {Object} Validation result
 */
export const validatePasswordMatch = (password, confirmPassword) => {
  if (isEmpty(confirmPassword)) {
    return { isValid: false, message: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, message: 'Passwords do not match' };
  }

  return { isValid: true, message: '' };
};

// ============================================
// NAME VALIDATORS
// ============================================

/**
 * Validate name (letters, spaces, hyphens only)
 * @param {string} name - Name
 * @returns {boolean} True if valid
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim()) && name.trim().length >= 2;
};

/**
 * Validate name with detailed check
 * @param {string} name - Name
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateName = (name, options = {}) => {
  const { minLength = 2, maxLength = 50, fieldName = 'Name' } = options;

  if (isEmpty(name)) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < minLength) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${minLength} characters long` 
    };
  }

  if (trimmedName.length > maxLength) {
    return { 
      isValid: false, 
      message: `${fieldName} must not exceed ${maxLength} characters` 
    };
  }

  if (!isValidName(name)) {
    return { 
      isValid: false, 
      message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` 
    };
  }

  return { isValid: true, message: '' };
};

// ============================================
// URL VALIDATORS
// ============================================

/**
 * Validate URL format
 * @param {string} url - URL
 * @returns {boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate URL with detailed check
 * @param {string} url - URL
 * @returns {Object} Validation result
 */
export const validateUrl = (url) => {
  if (isEmpty(url)) {
    return { isValid: false, message: 'URL is required' };
  }

  if (!isValidUrl(url)) {
    return { isValid: false, message: 'Please enter a valid URL' };
  }

  return { isValid: true, message: '' };
};

// ============================================
// PHONE VALIDATORS
// ============================================

/**
 * Validate phone number (basic format)
 * @param {string} phone - Phone number
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it has 10-15 digits (international format)
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
};

/**
 * Validate phone number with detailed check
 * @param {string} phone - Phone number
 * @returns {Object} Validation result
 */
export const validatePhone = (phone) => {
  if (isEmpty(phone)) {
    return { isValid: false, message: 'Phone number is required' };
  }

  if (!isValidPhone(phone)) {
    return { 
      isValid: false, 
      message: 'Please enter a valid phone number' 
    };
  }

  return { isValid: true, message: '' };
};

// ============================================
// NUMBER VALIDATORS
// ============================================

/**
 * Check if value is a number
 * @param {any} value - Value to check
 * @returns {boolean} True if number
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Check if value is an integer
 * @param {any} value - Value to check
 * @returns {boolean} True if integer
 */
export const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

/**
 * Validate number within range
 * @param {number} value - Number value
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateNumber = (value, options = {}) => {
  const { 
    min, 
    max, 
    required = true,
    fieldName = 'Value',
    integer = false
  } = options;

  if (required && (value === null || value === undefined || value === '')) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (!required && (value === null || value === undefined || value === '')) {
    return { isValid: true, message: '' };
  }

  if (!isNumber(value)) {
    return { isValid: false, message: `${fieldName} must be a valid number` };
  }

  if (integer && !isInteger(value)) {
    return { isValid: false, message: `${fieldName} must be a whole number` };
  }

  const numValue = Number(value);

  if (min !== undefined && numValue < min) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${min}` 
    };
  }

  if (max !== undefined && numValue > max) {
    return { 
      isValid: false, 
      message: `${fieldName} must not exceed ${max}` 
    };
  }

  return { isValid: true, message: '' };
};

// ============================================
// FILE VALIDATORS
// ============================================

/**
 * Validate file size
 * @param {File} file - File object
 * @param {number} maxSizeMB - Maximum size in MB
 * @returns {Object} Validation result
 */
export const validateFileSize = (file, maxSizeMB = 5) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxSizeBytes) {
    return { 
      isValid: false, 
      message: `File size must not exceed ${maxSizeMB}MB` 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate file type
 * @param {File} file - File object
 * @param {Array<string>} allowedTypes - Allowed MIME types
 * @returns {Object} Validation result
 */
export const validateFileType = (file, allowedTypes = []) => {
  if (!file) {
    return { isValid: false, message: 'No file selected' };
  }

  if (allowedTypes.length === 0) {
    return { isValid: true, message: '' };
  }

  if (!allowedTypes.includes(file.type)) {
    const typesList = allowedTypes.map(t => t.split('/')[1]).join(', ');
    return { 
      isValid: false, 
      message: `Only ${typesList} files are allowed` 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate image file
 * @param {File} file - File object
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateImage = (file, options = {}) => {
  const { 
    maxSizeMB = 5, 
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  } = options;

  const sizeCheck = validateFileSize(file, maxSizeMB);
  if (!sizeCheck.isValid) return sizeCheck;

  const typeCheck = validateFileType(file, allowedTypes);
  if (!typeCheck.isValid) return typeCheck;

  return { isValid: true, message: '' };
};

// ============================================
// RECIPE VALIDATORS
// ============================================

/**
 * Validate recipe title
 * @param {string} title - Recipe title
 * @returns {Object} Validation result
 */
export const validateRecipeTitle = (title) => {
  if (isEmpty(title)) {
    return { isValid: false, message: 'Recipe title is required' };
  }

  if (title.trim().length < 3) {
    return { 
      isValid: false, 
      message: 'Recipe title must be at least 3 characters long' 
    };
  }

  if (title.trim().length > 100) {
    return { 
      isValid: false, 
      message: 'Recipe title must not exceed 100 characters' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate recipe description
 * @param {string} description - Recipe description
 * @returns {Object} Validation result
 */
export const validateRecipeDescription = (description) => {
  if (isEmpty(description)) {
    return { isValid: false, message: 'Recipe description is required' };
  }

  if (description.trim().length < 10) {
    return { 
      isValid: false, 
      message: 'Description must be at least 10 characters long' 
    };
  }

  if (description.trim().length > 500) {
    return { 
      isValid: false, 
      message: 'Description must not exceed 500 characters' 
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Validate recipe ingredients
 * @param {Array} ingredients - Array of ingredient objects
 * @returns {Object} Validation result
 */
export const validateRecipeIngredients = (ingredients) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return { 
      isValid: false, 
      message: 'At least one ingredient is required' 
    };
  }

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    
    if (isEmpty(ingredient.item)) {
      return { 
        isValid: false, 
        message: `Ingredient ${i + 1}: Item name is required` 
      };
    }

    if (isEmpty(ingredient.amount)) {
      return { 
        isValid: false, 
        message: `Ingredient ${i + 1}: Amount is required` 
      };
    }
  }

  return { isValid: true, message: '' };
};

/**
 * Validate recipe instructions
 * @param {Array} instructions - Array of instruction objects
 * @returns {Object} Validation result
 */
export const validateRecipeInstructions = (instructions) => {
  if (!Array.isArray(instructions) || instructions.length === 0) {
    return { 
      isValid: false, 
      message: 'At least one instruction step is required' 
    };
  }

  for (let i = 0; i < instructions.length; i++) {
    const instruction = instructions[i];
    
    if (isEmpty(instruction.description)) {
      return { 
        isValid: false, 
        message: `Step ${i + 1}: Description is required` 
      };
    }

    if (instruction.description.trim().length < 10) {
      return { 
        isValid: false, 
        message: `Step ${i + 1}: Description must be at least 10 characters` 
      };
    }
  }

  return { isValid: true, message: '' };
};

/**
 * Validate complete recipe data
 * @param {Object} recipeData - Recipe data object
 * @returns {Object} Validation result with all errors
 */
export const validateRecipe = (recipeData) => {
  const errors = {};

  // Title validation
  const titleCheck = validateRecipeTitle(recipeData.title);
  if (!titleCheck.isValid) errors.title = titleCheck.message;

  // Description validation
  const descCheck = validateRecipeDescription(recipeData.description);
  if (!descCheck.isValid) errors.description = descCheck.message;

  // Category validation
  if (isEmpty(recipeData.category)) {
    errors.category = 'Category is required';
  }

  // Cuisine validation
  if (isEmpty(recipeData.cuisine)) {
    errors.cuisine = 'Cuisine is required';
  }

  // Cook time validation
  const cookTimeCheck = validateNumber(recipeData.cookTime, {
    min: 1,
    fieldName: 'Cook time',
    integer: true
  });
  if (!cookTimeCheck.isValid) errors.cookTime = cookTimeCheck.message;

  // Servings validation
  const servingsCheck = validateNumber(recipeData.servings, {
    min: 1,
    max: 100,
    fieldName: 'Servings',
    integer: true
  });
  if (!servingsCheck.isValid) errors.servings = servingsCheck.message;

  // Ingredients validation
  const ingredientsCheck = validateRecipeIngredients(recipeData.ingredients);
  if (!ingredientsCheck.isValid) errors.ingredients = ingredientsCheck.message;

  // Instructions validation
  const instructionsCheck = validateRecipeInstructions(recipeData.instructions);
  if (!instructionsCheck.isValid) errors.instructions = instructionsCheck.message;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// ============================================
// UTILITY VALIDATORS
// ============================================

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (isEmpty(value)) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate string length
 * @param {string} value - String value
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateLength = (value, options = {}) => {
  const { min, max, fieldName = 'Field' } = options;

  if (typeof value !== 'string') {
    return { isValid: false, message: `${fieldName} must be a string` };
  }

  const length = value.trim().length;

  if (min !== undefined && length < min) {
    return { 
      isValid: false, 
      message: `${fieldName} must be at least ${min} characters` 
    };
  }

  if (max !== undefined && length > max) {
    return { 
      isValid: false, 
      message: `${fieldName} must not exceed ${max} characters` 
    };
  }

  return { isValid: true, message: '' };
};

export default {
  isEmpty,
  isNotEmpty,
  isValidEmail,
  validateEmail,
  isValidPassword,
  getPasswordStrength,
  validatePassword,
  validatePasswordMatch,
  isValidName,
  validateName,
  isValidUrl,
  validateUrl,
  isValidPhone,
  validatePhone,
  isNumber,
  isInteger,
  validateNumber,
  validateFileSize,
  validateFileType,
  validateImage,
  validateRecipeTitle,
  validateRecipeDescription,
  validateRecipeIngredients,
  validateRecipeInstructions,
  validateRecipe,
  validateRequired,
  validateLength
};