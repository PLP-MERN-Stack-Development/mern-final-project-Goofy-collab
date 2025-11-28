// server/server.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// NOTE: Some clients (or the current demo) send base64 encoded images inside JSON which
// can quickly exceed the default body size limit. The default `express.json()` limit is
// small (100kb). For a short-term fix we increase allowed request size — but the recommended
// long-term solution is to upload images via multipart/FormData to a dedicated endpoint or
// upload directly to a hosting provider (Cloudinary) and send only the image URL in JSON.

// Allow larger JSON / URL-encoded payloads (e.g. when clients include data URLs)
app.use(express.json({ limit: '6mb' })); // increase JSON body limit to 6MB
app.use(express.urlencoded({ extended: true, limit: '6mb' })); // increase urlencoded limit
app.use(morgan('dev')); // HTTP request logging

// API Routes
import authRoutes from './routes/authRoutes.js';
import recipeRoutes from './routes/recipeRoutes.js';
import userRoutes from './routes/userRoutes.js';
import commentRoutes from './routes/commentRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'RecipeShare API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      recipes: '/api/recipes',
      users: '/api/users',
      comments: '/api/comments'
    }
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => process.exit(1));
});

export default app;