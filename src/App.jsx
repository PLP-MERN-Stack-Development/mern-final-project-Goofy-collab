// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RecipeProvider } from './context/RecipeContext';

// Pages
import HomePage from './pages/HomePage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CreateRecipePage from './pages/CreateRecipePage';
import AuthPages from './pages/AuthPages';
import UserProfilePage from './pages/UserProfilePage';

// Layout Components
import { MainLayout } from './components/layout/MainLayout';

// Custom hook for protected routes
import { useAuth } from './hooks/useAuth';

/**
 * Protected Route Component
 * Redirects to sign-in if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/signin" replace />;
};

/**
 * Public Only Route Component
 * Redirects to home if user is already authenticated
 */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

/**
 * Main App Component
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RecipeProvider>
          <AppRoutes />
        </RecipeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * App Routes Component
 * Separated to access context within Router
 */
function AppRoutes() {
  const { user } = useAuth();

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/recipes"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/recipes/:id"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <RecipeDetailPage />
          </MainLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/categories/:category"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/cuisines/:cuisine"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/search"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <HomePage />
          </MainLayout>
        }
      />

      {/* Auth Routes (Public Only) */}
      <Route
        path="/signin"
        element={
          <PublicOnlyRoute>
            <AuthPages />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <AuthPages />
          </PublicOnlyRoute>
        }
      />

      {/* Protected Routes (Require Authentication) */}
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <MainLayout user={user} onNavigate={handleNavigate}>
              <CreateRecipePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/recipes/:id/edit"
        element={
          <ProtectedRoute>
            <MainLayout user={user} onNavigate={handleNavigate}>
              <CreateRecipePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <MainLayout user={user} onNavigate={handleNavigate}>
              <UserProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/:userId"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <UserProfilePage />
          </MainLayout>
        }
      />

      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <MainLayout user={user} onNavigate={handleNavigate}>
              <UserProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <MainLayout user={user} onNavigate={handleNavigate}>
              <UserProfilePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <MainLayout user={user} onNavigate={handleNavigate}>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  );
}

/**
 * 404 Not Found Page Component
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-orange-600">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-4 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg hover:bg-orange-700 transition font-semibold"
        >
          Go Back Home
        </a>
      </div>
    </div>
  );
}

export default App;






