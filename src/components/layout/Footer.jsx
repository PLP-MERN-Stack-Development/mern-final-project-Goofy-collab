import React from 'react';
import { ChefHat, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';


export const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ChefHat className="w-6 h-6 text-orange-600" />
              <h4 className="text-xl font-bold">RecipeShare</h4>
            </div>
            <p className="text-gray-400 mb-4">
              Share your culinary creations with the world and discover amazing recipes from passionate cooks.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Explore Links */}
          <div>
            <h5 className="font-semibold mb-4">Explore</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/recipes')}
                  className="hover:text-orange-500 transition"
                >
                  Popular Recipes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/recipes/new')}
                  className="hover:text-orange-500 transition"
                >
                  New Recipes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/categories')}
                  className="hover:text-orange-500 transition"
                >
                  Categories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/cuisines')}
                  className="hover:text-orange-500 transition"
                >
                  Cuisines
                </button>
              </li>
            </ul>
          </div>
          
          {/* Community Links */}
          <div>
            <h5 className="font-semibold mb-4">Community</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/signup')}
                  className="hover:text-orange-500 transition"
                >
                  Join Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/blog')}
                  className="hover:text-orange-500 transition"
                >
                  Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/forum')}
                  className="hover:text-orange-500 transition"
                >
                  Forum
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/chefs')}
                  className="hover:text-orange-500 transition"
                >
                  Featured Chefs
                </button>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h5 className="font-semibold mb-4">Support</h5>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/help')}
                  className="hover:text-orange-500 transition"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/contact')}
                  className="hover:text-orange-500 transition"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/privacy')}
                  className="hover:text-orange-500 transition"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('/terms')}
                  className="hover:text-orange-500 transition"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h5 className="font-semibold mb-2">Subscribe to our Newsletter</h5>
              <p className="text-gray-400 text-sm">Get weekly recipes and cooking tips</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-white"
              />
              <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-semibold">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p className="flex items-center justify-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500 fill-current" /> by RecipeShare Team
          </p>
          <p className="mt-2">&copy; {currentYear} RecipeShare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
