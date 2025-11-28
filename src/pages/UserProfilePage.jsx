import React, { useState } from 'react';
import { 
  ChefHat, ArrowLeft, Settings, MapPin, Calendar, Users, 
  Heart, Bookmark, Clock, Star, Edit, Share2, Mail,
  Instagram, Twitter, Globe, Award, TrendingUp
} from 'lucide-react';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('recipes'); // recipes, saved, followers, following

  // Mock user data
  const userData = {
    id: 1,
    name: "Chef Mario Rossi",
    username: "@chefmario",
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=300&q=80",
    coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
    bio: "Professional chef specializing in Italian cuisine. Sharing family recipes passed down through generations. 🇮🇹👨‍🍳",
    location: "Rome, Italy",
    joinedDate: "January 2023",
    website: "www.chefmario.com",
    social: {
      instagram: "@chefmario",
      twitter: "@chefmario"
    },
    stats: {
      recipes: 45,
      followers: 12500,
      following: 234,
      likes: 45200
    },
    badges: [
      { id: 1, name: "Top Chef", icon: "👨‍🍳", color: "bg-yellow-100 text-yellow-700" },
      { id: 2, name: "100 Recipes", icon: "📚", color: "bg-blue-100 text-blue-700" },
      { id: 3, name: "10K Followers", icon: "⭐", color: "bg-purple-100 text-purple-700" }
    ]
  };

  // Mock recipes data
  const userRecipes = [
    {
      id: 1,
      title: "Classic Margherita Pizza",
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&q=80",
      likes: 1234,
      comments: 89,
      cookTime: 30,
      rating: 4.8,
      status: "published"
    },
    {
      id: 2,
      title: "Homemade Pasta Carbonara",
      image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80",
      likes: 2156,
      comments: 145,
      cookTime: 25,
      rating: 4.9,
      status: "published"
    },
    {
      id: 3,
      title: "Tiramisu Dessert",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80",
      likes: 1876,
      comments: 102,
      cookTime: 45,
      rating: 4.7,
      status: "published"
    },
    {
      id: 4,
      title: "Risotto ai Funghi",
      image: "https://images.unsplash.com/photo-1476124369491-c4f1b0b3c865?w=400&q=80",
      likes: 945,
      comments: 67,
      cookTime: 40,
      rating: 4.6,
      status: "draft"
    }
  ];

  const savedRecipes = [
    {
      id: 5,
      title: "Spicy Thai Basil Chicken",
      image: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&q=80",
      author: "Chef Somchai",
      cookTime: 20,
      rating: 4.9
    },
    {
      id: 6,
      title: "Japanese Ramen Bowl",
      image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=80",
      author: "Chef Takeshi",
      cookTime: 60,
      rating: 4.8
    }
  ];

  const followers = [
    {
      id: 1,
      name: "Sarah Chen",
      username: "@sarahcooks",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
      recipesCount: 28,
      isFollowing: true
    },
    {
      id: 2,
      name: "John Smith",
      username: "@johnsmith",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
      recipesCount: 15,
      isFollowing: false
    },
    {
      id: 3,
      name: "Emma Wilson",
      username: "@emmawilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
      recipesCount: 42,
      isFollowing: true
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-orange-600">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center space-x-2">
                <ChefHat className="w-8 h-8 text-orange-600" />
                <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-orange-400 to-red-500">
        <img
          src={userData.coverImage}
          alt="Cover"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Avatar */}
          <div className="absolute -top-20 left-0">
            <div className="relative">
              <img
                src={userData.avatar}
                alt={userData.name}
                className="w-40 h-40 rounded-full border-4 border-white shadow-xl"
              />
              <button className="absolute bottom-2 right-2 bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition shadow-lg">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-24 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 mb-6 lg:mb-0">
                <div className="flex items-center space-x-3 mb-2">
                  <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <p className="text-gray-600 mb-3">{userData.username}</p>
                
                <p className="text-gray-700 mb-4 max-w-2xl">{userData.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{userData.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {userData.joinedDate}</span>
                  </div>
                  {userData.website && (
                    <a href="#" className="flex items-center text-orange-600 hover:text-orange-700">
                      <Globe className="w-4 h-4 mr-1" />
                      <span>{userData.website}</span>
                    </a>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex items-center space-x-3">
                  {userData.social.instagram && (
                    <a href="#" className="text-gray-600 hover:text-orange-600">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {userData.social.twitter && (
                    <a href="#" className="text-gray-600 hover:text-orange-600">
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  <a href="#" className="text-gray-600 hover:text-orange-600">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
                  Edit Profile
                </button>
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                  Share Profile
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-orange-600 mb-1">{userData.stats.recipes}</div>
                <div className="text-sm text-gray-600">Recipes</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition cursor-pointer">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {userData.stats.followers.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition cursor-pointer">
                <div className="text-3xl font-bold text-orange-600 mb-1">{userData.stats.following}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {userData.stats.likes.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Likes</div>
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
              <div className="flex flex-wrap gap-3">
                {userData.badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full ${badge.color} font-semibold`}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('recipes')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'recipes'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Recipes ({userRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'saved'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Saved ({savedRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'followers'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Followers ({userData.stats.followers.toLocaleString()})
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'following'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Following ({userData.stats.following})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {/* My Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    {recipe.status === 'draft' && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Draft
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex space-x-2">
                      <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition">
                        <Edit className="w-4 h-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{recipe.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1 text-red-500 fill-current" />
                          <span>{recipe.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{recipe.cookTime} min</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">{renderStars(recipe.rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Saved Recipes Tab */}
          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="relative h-48">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                    <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition">
                      <Bookmark className="w-5 h-5 text-orange-600 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{recipe.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">by {recipe.author}</p>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center">
                        <div className="flex">{renderStars(recipe.rating)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Followers Tab */}
          {activeTab === 'followers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followers.map(follower => (
                <div key={follower.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={follower.avatar}
                      alt={follower.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{follower.name}</h3>
                      <p className="text-sm text-gray-600">{follower.username}</p>
                      <p className="text-sm text-gray-500">{follower.recipesCount} recipes</p>
                    </div>
                  </div>
                  <button
                    className={`w-full py-2 rounded-lg font-semibold transition ${
                      follower.isFollowing
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {follower.isFollowing ? 'Following' : 'Follow Back'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Following Tab */}
          {activeTab === 'following' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followers.map(follower => (
                <div key={follower.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition">
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={follower.avatar}
                      alt={follower.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{follower.name}</h3>
                      <p className="text-sm text-gray-600">{follower.username}</p>
                      <p className="text-sm text-gray-500">{follower.recipesCount} recipes</p>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition">
                    Unfollow
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;