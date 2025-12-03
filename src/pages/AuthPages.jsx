// src/pages/AuthPages.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthPages = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading, error: authError } = useAuth();
  
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateSignIn = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const validateSignUp = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = isSignIn ? validateSignIn() : validateSignUp();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      let result;
      
      if (isSignIn) {
        // Sign In with real API - call with email and password
        result = await signIn(formData.email, formData.password);
      } else {
        // Sign Up with real API - call with name, email, and password
        result = await signUp(formData.name, formData.email, formData.password);
      }
      
      if (result.success) {
        // Success! Clear form and navigate to home page
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        setErrors({});
        navigate('/');
      } else {
        // Show error message from server
        setErrors({ submit: result.error || 'Authentication failed' });
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Something went wrong' });
    }
  };

  const toggleAuthMode = () => {
    setIsSignIn(!isSignIn);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  const handleSocialAuth = (provider) => {
    console.log(`Authenticating with ${provider}`);
    // TODO: Implement OAuth
    setErrors({ submit: `${provider} authentication coming soon!` });
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <div className="hidden lg:block">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
                <ChefHat className="w-16 h-16 text-orange-600" />
                <h1 className="text-4xl font-bold text-gray-900">RecipeShare</h1>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {isSignIn ? 'Welcome Back!' : 'Join Our Community'}
              </h2>
              
              <p className="text-lg text-gray-600 mb-8">
                {isSignIn 
                  ? 'Sign in to access your favorite recipes and continue your culinary journey.'
                  : 'Create an account to share your recipes and connect with food lovers worldwide.'
                }
              </p>

              {/* Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <ChefHat className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Share Your Recipes</h3>
                    <p className="text-sm text-gray-600">Upload and share your favorite dishes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <User className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Connect with Chefs</h3>
                    <p className="text-sm text-gray-600">Follow your favorite food creators</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">Get Inspired</h3>
                    <p className="text-sm text-gray-600">Discover new recipes daily</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl font-bold text-orange-600">10K+</div>
                  <div className="text-sm text-gray-600">Recipes</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">5K+</div>
                  <div className="text-sm text-gray-600">Members</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600">50+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="w-full">
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
                <ChefHat className="w-10 h-10 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1>
              </div>

              {/* Back Button */}
              <button 
                onClick={handleBackToHome}
                className="flex items-center text-gray-600 hover:text-orange-600 mb-6 transition"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </button>

              {/* Tab Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setIsSignIn(true)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    isSignIn 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsSignIn(false)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    !isSignIn 
                      ? 'bg-white text-orange-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isSignIn ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="text-gray-600 mb-6">
                {isSignIn 
                  ? "Don't have an account? " 
                  : 'Already have an account? '}
                <button 
                  onClick={toggleAuthMode}
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  {isSignIn ? 'Sign up' : 'Sign in'}
                </button>
              </p>

              {/* Error Message */}
              {(errors.submit || authError) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit || authError}</p>
                </div>
              )}

              {/* Social Auth Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialAuth('Google')}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-semibold text-gray-700">Continue with Google</span>
                </button>

                <button
                  onClick={() => handleSocialAuth('Facebook')}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="font-semibold text-gray-700">Continue with Facebook</span>
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Auth Form */}
              <div className="space-y-4">
                {/* Name field (Sign Up only) */}
                {!isSignIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                )}

                {/* Email field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password field (Sign Up only) */}
                {!isSignIn && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
                          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                )}

                {/* Remember Me / Forgot Password (Sign In only) */}
                {isSignIn && (
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remember me</span>
                    </label>
                    <button
                      type="button"
                      className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Terms (Sign Up only) */}
                {!isSignIn && (
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      {isSignIn ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : (
                    isSignIn ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPages;




// import React, { useState } from 'react';
// import { ChefHat, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// const AuthPages = () => {
//   const [isSignIn, setIsSignIn] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
//   // Form state
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });
  
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     // Clear error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: ''
//       }));
//     }
//   };

//   const validateSignIn = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     return newErrors;
//   };

//   const validateSignUp = () => {
//     const newErrors = {};
    
//     if (!formData.name) {
//       newErrors.name = 'Name is required';
//     } else if (formData.name.length < 2) {
//       newErrors.name = 'Name must be at least 2 characters';
//     }
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const validationErrors = isSignIn ? validateSignIn() : validateSignUp();
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
    
//     setIsLoading(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       setIsLoading(false);
//       console.log(isSignIn ? 'Signing in...' : 'Signing up...', formData);
//       alert(`${isSignIn ? 'Sign In' : 'Sign Up'} successful! (Demo)`);
//     }, 1500);
//   };

//   const toggleAuthMode = () => {
//     setIsSignIn(!isSignIn);
//     setFormData({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: ''
//     });
//     setErrors({});
//   };

//   const handleSocialAuth = (provider) => {
//     console.log(`Authenticating with ${provider}`);
//     alert(`${provider} authentication coming soon!`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
//       {/* Background Pattern */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
//       </div>

//       <div className="w-full max-w-6xl relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
//           {/* Left Side - Branding & Info */}
//           <div className="hidden lg:block">
//             <div className="text-center lg:text-left">
//               <div className="flex items-center justify-center lg:justify-start space-x-3 mb-6">
//                 <ChefHat className="w-16 h-16 text-orange-600" />
//                 <h1 className="text-4xl font-bold text-gray-900">RecipeShare</h1>
//               </div>
              
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                 {isSignIn ? 'Welcome Back!' : 'Join Our Community'}
//               </h2>
              
//               <p className="text-lg text-gray-600 mb-8">
//                 {isSignIn 
//                   ? 'Sign in to access your favorite recipes and continue your culinary journey.'
//                   : 'Create an account to share your recipes and connect with food lovers worldwide.'
//                 }
//               </p>

//               {/* Features */}
//               <div className="space-y-4">
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-orange-100 p-2 rounded-lg">
//                     <ChefHat className="w-6 h-6 text-orange-600" />
//                   </div>
//                   <div className="text-left">
//                     <h3 className="font-semibold text-gray-900">Share Your Recipes</h3>
//                     <p className="text-sm text-gray-600">Upload and share your favorite dishes</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-orange-100 p-2 rounded-lg">
//                     <User className="w-6 h-6 text-orange-600" />
//                   </div>
//                   <div className="text-left">
//                     <h3 className="font-semibold text-gray-900">Connect with Chefs</h3>
//                     <p className="text-sm text-gray-600">Follow your favorite food creators</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center space-x-3">
//                   <div className="bg-orange-100 p-2 rounded-lg">
//                     <Mail className="w-6 h-6 text-orange-600" />
//                   </div>
//                   <div className="text-left">
//                     <h3 className="font-semibold text-gray-900">Get Inspired</h3>
//                     <p className="text-sm text-gray-600">Discover new recipes daily</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats */}
//               <div className="mt-12 grid grid-cols-3 gap-4 text-center">
//                 <div>
//                   <div className="text-3xl font-bold text-orange-600">10K+</div>
//                   <div className="text-sm text-gray-600">Recipes</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-orange-600">5K+</div>
//                   <div className="text-sm text-gray-600">Members</div>
//                 </div>
//                 <div>
//                   <div className="text-3xl font-bold text-orange-600">50+</div>
//                   <div className="text-sm text-gray-600">Countries</div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Auth Form */}
//           <div className="w-full">
//             <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
//               {/* Mobile Logo */}
//               <div className="lg:hidden flex items-center justify-center space-x-2 mb-6">
//                 <ChefHat className="w-10 h-10 text-orange-600" />
//                 <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1>
//               </div>

//               {/* Back Button */}
//               <button className="flex items-center text-gray-600 hover:text-orange-600 mb-6 transition">
//                 <ArrowLeft className="w-5 h-5 mr-2" />
//                 Back to Home
//               </button>

//               {/* Tab Switcher */}
//               <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
//                 <button
//                   onClick={() => setIsSignIn(true)}
//                   className={`flex-1 py-2 rounded-lg font-semibold transition ${
//                     isSignIn 
//                       ? 'bg-white text-orange-600 shadow-sm' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Sign In
//                 </button>
//                 <button
//                   onClick={() => setIsSignIn(false)}
//                   className={`flex-1 py-2 rounded-lg font-semibold transition ${
//                     !isSignIn 
//                       ? 'bg-white text-orange-600 shadow-sm' 
//                       : 'text-gray-600 hover:text-gray-900'
//                   }`}
//                 >
//                   Sign Up
//                 </button>
//               </div>

//               <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                 {isSignIn ? 'Sign in to your account' : 'Create your account'}
//               </h2>
//               <p className="text-gray-600 mb-6">
//                 {isSignIn 
//                   ? "Don't have an account? " 
//                   : 'Already have an account? '}
//                 <button 
//                   onClick={toggleAuthMode}
//                   className="text-orange-600 hover:text-orange-700 font-semibold"
//                 >
//                   {isSignIn ? 'Sign up' : 'Sign in'}
//                 </button>
//               </p>

//               {/* Social Auth Buttons */}
//               <div className="space-y-3 mb-6">
//                 <button
//                   onClick={() => handleSocialAuth('Google')}
//                   className="w-full flex items-center justify-center space-x-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition"
//                 >
//                   <svg className="w-5 h-5" viewBox="0 0 24 24">
//                     <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                     <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                     <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                     <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                   </svg>
//                   <span className="font-semibold text-gray-700">Continue with Google</span>
//                 </button>

//                 <button
//                   onClick={() => handleSocialAuth('Facebook')}
//                   className="w-full flex items-center justify-center space-x-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition"
//                 >
//                   <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
//                     <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//                   </svg>
//                   <span className="font-semibold text-gray-700">Continue with Facebook</span>
//                 </button>
//               </div>

//               <div className="relative mb-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-200"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white text-gray-500">Or continue with email</span>
//                 </div>
//               </div>

//               {/* Auth Form */}
//               <div className="space-y-4">
//                 {/* Name field (Sign Up only) */}
//                 {!isSignIn && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Full Name
//                     </label>
//                     <div className="relative">
//                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                       <input
//                         type="text"
//                         name="name"
//                         value={formData.name}
//                         onChange={handleInputChange}
//                         placeholder="John Doe"
//                         className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
//                           errors.name ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                       />
//                     </div>
//                     {errors.name && (
//                       <p className="mt-1 text-sm text-red-600">{errors.name}</p>
//                     )}
//                   </div>
//                 )}

//                 {/* Email field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email Address
//                   </label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleInputChange}
//                       placeholder="you@example.com"
//                       className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
//                         errors.email ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                   </div>
//                   {errors.email && (
//                     <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//                   )}
//                 </div>

//                 {/* Password field */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                     <input
//                       type={showPassword ? 'text' : 'password'}
//                       name="password"
//                       value={formData.password}
//                       onChange={handleInputChange}
//                       placeholder="••••••••"
//                       className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
//                         errors.password ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                     </button>
//                   </div>
//                   {errors.password && (
//                     <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//                   )}
//                 </div>

//                 {/* Confirm Password field (Sign Up only) */}
//                 {!isSignIn && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                       <input
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleInputChange}
//                         placeholder="••••••••"
//                         className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition ${
//                           errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                       </button>
//                     </div>
//                     {errors.confirmPassword && (
//                       <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
//                     )}
//                   </div>
//                 )}

//                 {/* Remember Me / Forgot Password (Sign In only) */}
//                 {isSignIn && (
//                   <div className="flex items-center justify-between">
//                     <label className="flex items-center">
//                       <input
//                         type="checkbox"
//                         className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Remember me</span>
//                     </label>
//                     <button
//                       type="button"
//                       className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
//                     >
//                       Forgot password?
//                     </button>
//                   </div>
//                 )}

//                 {/* Terms (Sign Up only) */}
//                 {!isSignIn && (
//                   <div className="flex items-start">
//                     <input
//                       type="checkbox"
//                       className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500 mt-1"
//                     />
//                     <label className="ml-2 text-sm text-gray-700">
//                       I agree to the{' '}
//                       <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-orange-600 hover:text-orange-700 font-semibold">
//                         Privacy Policy
//                       </a>
//                     </label>
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isLoading}
//                   className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isLoading ? (
//                     <span className="flex items-center justify-center">
//                       <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
//                       </svg>
//                       Processing...
//                     </span>
//                   ) : (
//                     isSignIn ? 'Sign In' : 'Create Account'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthPages;