import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';


export const Header = ({ 
  user = null,
  onNavigate,
  transparent = false
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const headerClass = transparent 
    ? 'bg-transparent absolute top-0 left-0 right-0 z-50' 
    : 'bg-white shadow-md sticky top-0 z-50';

  const textClass = transparent ? 'text-white' : 'text-gray-700';
  const logoClass = transparent ? 'text-white' : 'text-orange-600';

  const routerNavigate = useNavigate();

  const go = (path) => {
    if (onNavigate) return onNavigate(path);
    routerNavigate(path);
  };

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
            <button 
              onClick={() => go('/')}
            className="flex items-center space-x-2"
          >
            <ChefHat className={`w-8 h-8 ${logoClass}`} />
            <h1 className={`text-2xl font-bold ${textClass}`}>RecipeShare</h1>
          </button>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => go('/')}
              className={`${textClass} font-semibold hover:text-orange-600 transition`}
            >
              Home
            </button>
            <button 
              onClick={() => go('/recipes')}
              className={`${textClass} hover:text-orange-600 font-medium transition`}
            >
              Recipes
            </button>
            <button 
              onClick={() => go('/categories')}
              className={`${textClass} hover:text-orange-600 font-medium transition`}
            >
              Categories
            </button>
            <button 
              onClick={() => go('/about')}
              className={`${textClass} hover:text-orange-600 font-medium transition`}
            >
              About
            </button>
          </nav>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => go('/create')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-semibold"
                >
                  Share Recipe
                </button>
                <button onClick={() => go('/profile')}>
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80"}
                    alt={user.name}
                    className="w-10 h-10 rounded-full border-2 border-orange-600"
                  />
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => go('/signin')}
                  className={`${textClass} hover:text-orange-600 font-medium`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => go('/signup')}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden ${textClass}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-3">
              <button 
                onClick={() => go('/')}
                className="block w-full text-left text-gray-700 hover:text-orange-600 py-2"
              >
                Home
              </button>
              <button 
                onClick={() => go('/recipes')}
                className="block w-full text-left text-gray-700 hover:text-orange-600 py-2"
              >
                Recipes
              </button>
              <button 
                onClick={() => go('/categories')}
                className="block w-full text-left text-gray-700 hover:text-orange-600 py-2"
              >
                Categories
              </button>
              <button 
                onClick={() => go('/about')}
                className="block w-full text-left text-gray-700 hover:text-orange-600 py-2"
              >
                About
              </button>
              <hr />
              {user ? (
                <>
                  <button 
                    onClick={() => go('/profile')}
                    className="block w-full text-left text-gray-700 hover:text-orange-600 py-2"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={() => go('/create')}
                    className="block w-full text-left text-orange-600 font-semibold py-2"
                  >
                    Share Recipe
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => go('/signin')}
                    className="block w-full text-left text-gray-700 py-2"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => go('/signup')}
                    className="block w-full text-left text-orange-600 font-semibold py-2"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};