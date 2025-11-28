// server/utils/jwtUtils.js
import jwt from 'jsonwebtoken';

/**
 * Generate JWT token
 * @param {Object} payload - Data to encode in token
 * @param {String} expiresIn - Token expiration time
 * @returns {String} JWT token
 */
export const generateToken = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate access token
 * @param {String} userId - User ID
 * @returns {String} Access token
 */
export const generateAccessToken = (userId) => {
  return generateToken({ userId }, process.env.JWT_ACCESS_EXPIRES || '15m');
};

/**
 * Generate refresh token
 * @param {String} userId - User ID
 * @returns {String} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return generateToken({ userId }, process.env.JWT_REFRESH_EXPIRES || '7d');
};

/**
 * Generate auth tokens (access + refresh)
 * @param {String} userId - User ID
 * @returns {Object} Tokens object
 */
export const generateAuthTokens = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId)
  };
};