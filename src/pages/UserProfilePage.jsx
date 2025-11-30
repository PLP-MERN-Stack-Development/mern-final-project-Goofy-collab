import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import recipeService from '../services/recipeService';
import userService from '../services/userService';
import { 
  ChefHat, ArrowLeft, Settings, MapPin, Calendar, Users, 
  Heart, Bookmark, Clock, Star, Edit, Share2, Mail,
  Instagram, Twitter, Globe, Award, TrendingUp
} from 'lucide-react';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('recipes'); // recipes, saved, followers, following

  const { user: authUser, isAuthenticated } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const profileId = userId || authUser?.id || authUser?._id;

  const [userData, setUserData] = useState(null);
  const [userRecipes, setUserRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stats, setStats] = useState({ recipes: 0, followers: 0, following: 0, likes: 0 });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

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

  // Load profile and recipes
  useEffect(() => {
    let mounted = true;
    const loadProfile = async () => {
      if (!profileId) return;
      try {
        setLoadingProfile(true);

        // Get profile info
        const profileRes = await userService.getUserById(profileId);
        if (!mounted) return;
        if (profileRes.success) {
          setUserData(profileRes.user);
        }

        // Stats
        const statsRes = await userService.getUserStats(profileId);
        if (!mounted) return;
        if (statsRes.success) {
          setStats({
            recipes: statsRes.stats.totalRecipes ?? statsRes.stats.total ?? 0,
            followers: statsRes.stats.followerCount ?? 0,
            following: statsRes.stats.followingCount ?? 0,
            likes: statsRes.stats.totalLikes ?? 0
          });
        }

        // Recipes
        setLoadingRecipes(true);
        const r = await recipeService.getUserRecipes(profileId, { limit: 50 });
        if (!mounted) return;
        if (r.success) setUserRecipes(r.recipes || []);

        // Followers / following (load small sample)
        const folRes = await userService.getFollowers(profileId, { limit: 12 });
        if (!mounted) return;
        if (folRes.success) setFollowers(folRes.followers || []);

        const followingRes = await userService.getFollowing(profileId, { limit: 12 });
        if (!mounted) return;
        if (followingRes.success) setFollowing(followingRes.following || []);

        // If this is the current user's profile, get saved recipes
        if (!userId && authUser) {
          const saved = await recipeService.getSavedRecipes();
          if (!mounted) return;
          if (saved.success) setSavedRecipes(saved.recipes || []);
        }

      } catch (err) {
        console.error('Profile load failed', err);
      } finally {
        if (mounted) {
          setLoadingProfile(false);
          setLoadingRecipes(false);
        }
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, [profileId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-md sticky top-0 z-50">
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
      </header> */}

      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-r from-orange-400 to-red-500">
        {userData?.coverImage ? (
          <img
            src={userData.coverImage}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-orange-400 to-red-500 opacity-80" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Avatar */}
          <div className="absolute -top-20 left-0">
            <div className="relative">
              <img
                src={userData?.avatar ?? authUser?.avatar}
                alt={userData?.name ?? authUser?.name}
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
                      <h2 className="text-3xl font-bold text-gray-900">{userData?.name ?? (authUser?.name ?? 'Profile')}</h2>
                      <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-gray-600 mb-3">{userData?.username ?? authUser?.username ?? ''}</p>
                
                    <p className="text-gray-700 mb-4 max-w-2xl">{userData?.bio ?? ''}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{userData?.location || ''}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Joined {userData?.joinedDate ?? ''}</span>
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
                  {userData?.social?.instagram && (
                    <a href="#" className="text-gray-600 hover:text-orange-600">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {userData?.social?.twitter && (
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
                {authUser && (String(profileId) === String(authUser.id) || String(profileId) === String(authUser._id)) ? (
                  <>
                    <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
                      Edit Profile
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                      Share Profile
                    </button>
                  </>
                ) : (
                  <>
                    <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold">
                      Follow
                    </button>
                    <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold">
                      Message
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.recipes}</div>
                <div className="text-sm text-gray-600">Recipes</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition cursor-pointer">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {stats.followers?.toLocaleString?.() ?? '0'}
                </div>
                <div className="text-sm text-gray-600">Followers</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition cursor-pointer">
                <div className="text-3xl font-bold text-orange-600 mb-1">{stats.following ?? 0}</div>
                <div className="text-sm text-gray-600">Following</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition">
                <div className="text-3xl font-bold text-orange-600 mb-1">
                  {stats.likes?.toLocaleString?.() ?? '0'}
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
              My Recipes ({loadingRecipes ? '...' : userRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'saved'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Saved ({loadingProfile ? '...' : savedRecipes.length})
            </button>
            <button
              onClick={() => setActiveTab('followers')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'followers'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Followers ({loadingProfile ? '...' : (stats.followers?.toLocaleString?.() ?? '0')})
            </button>
            <button
              onClick={() => setActiveTab('following')}
              className={`pb-4 px-2 font-semibold transition ${
                activeTab === 'following'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Following ({loadingProfile ? '...' : (stats.following ?? 0)})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="pb-12">
          {/* My Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingRecipes && (
                <div className="col-span-3 flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              )}

              {!loadingRecipes && userRecipes.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 py-12">No recipes yet</div>
              )}

              {!loadingRecipes && userRecipes.length > 0 &&
                userRecipes.map(recipe => (
                  <div key={recipe._id || recipe.id} onClick={() => navigate(`/recipes/${recipe._id || recipe.id}`)} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
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
              {loadingProfile && (
                <div className="col-span-3 flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                </div>
              )}

              {!loadingProfile && savedRecipes.length === 0 && (
                <div className="col-span-3 text-center text-gray-500 py-12">No saved recipes</div>
              )}

              {!loadingProfile && savedRecipes.length > 0 &&
                savedRecipes.map(recipe => (
                  <div key={recipe._id || recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
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
              {followers.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-8">No followers yet</div>
              ) : followers.map(follower => (
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
              {following.length === 0 ? (
                <div className="col-span-3 text-center text-gray-500 py-8">Not following anyone yet</div>
              ) : following.map(follower => (
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