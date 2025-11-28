import React from 'react';
import { ChefHat, Menu, X, Search } from 'lucide-react';


export const Navbar = ({ 
  user = null,
  onSignIn,
  onSignUp,
  onSignOut,
  onShareRecipe
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <ChefHat className="w-8 h-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-gray-900">RecipeShare</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-orange-600 font-semibold hover:text-orange-700">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-600 font-medium">
              Recipes
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-600 font-medium">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-600 font-medium">
              About
            </a>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onShareRecipe}
                >
                  Share Recipe
                </Button>
                
                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-orange-600"
                    />
                  </button>
                  
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2">
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">
                        Profile
                      </a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">
                        My Recipes
                      </a>
                      <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-orange-50">
                        Settings
                      </a>
                      <hr className="my-2" />
                      <button
                        onClick={onSignOut}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={onSignIn}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onSignUp}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-3">
              <a href="#" className="block text-orange-600 font-semibold py-2">
                Home
              </a>
              <a href="#" className="block text-gray-700 hover:text-orange-600 py-2">
                Recipes
              </a>
              <a href="#" className="block text-gray-700 hover:text-orange-600 py-2">
                Categories
              </a>
              <a href="#" className="block text-gray-700 hover:text-orange-600 py-2">
                About
              </a>
              
              <hr className="my-2" />
              
              {user ? (
                <>
                  <a href="#" className="block text-gray-700 hover:text-orange-600 py-2">
                    Profile
                  </a>
                  <a href="#" className="block text-gray-700 hover:text-orange-600 py-2">
                    My Recipes
                  </a>
                  <button
                    onClick={onShareRecipe}
                    className="w-full text-left text-orange-600 font-semibold py-2"
                  >
                    Share Recipe
                  </button>
                  <button
                    onClick={onSignOut}
                    className="w-full text-left text-red-600 py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onSignIn}
                    className="w-full text-left text-gray-700 py-2"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={onSignUp}
                    className="w-full text-left text-orange-600 font-semibold py-2"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// ============================================
// DEMO COMPONENT
// ============================================
// const CommonComponentsDemo = () => {
//   const [inputValue, setInputValue] = React.useState('');
//   const [loading, setLoading] = React.useState(false);
  
//   const mockUser = {
//     name: "John Doe",
//     avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&q=80"
//   };

//   const handleClick = () => {
//     setLoading(true);
//     setTimeout(() => setLoading(false), 2000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navbar Demo */}
//       <Navbar 
//         user={mockUser}
//         onSignIn={() => alert('Sign In clicked')}
//         onSignUp={() => alert('Sign Up clicked')}
//         onSignOut={() => alert('Sign Out clicked')}
//         onShareRecipe={() => alert('Share Recipe clicked')}
//       />
      
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
//         {/* Buttons Section */}
//         <section>
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">Button Components</h2>
          
//           <Card>
//             <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
//             <div className="flex flex-wrap gap-4">
//               <Button variant="primary">Primary Button</Button>
//               <Button variant="secondary">Secondary Button</Button>
//               <Button variant="outline">Outline Button</Button>
//               <Button variant="ghost">Ghost Button</Button>
//               <Button variant="danger">Danger Button</Button>
//             </div>
            
//             <h3 className="text-xl font-semibold mt-8 mb-4">Button Sizes</h3>
//             <div className="flex flex-wrap items-center gap-4">
//               <Button size="sm">Small</Button>
//               <Button size="md">Medium</Button>
//               <Button size="lg">Large</Button>
//             </div>
            
//             <h3 className="text-xl font-semibold mt-8 mb-4">Button States</h3>
//             <div className="flex flex-wrap gap-4">
//               <Button icon={ChefHat}>With Icon</Button>
//               <Button icon={ChefHat} iconPosition="right">Icon Right</Button>
//               <Button loading={loading} onClick={handleClick}>
//                 Click Me
//               </Button>
//               <Button disabled>Disabled</Button>
//               <Button fullWidth>Full Width Button</Button>
//             </div>
//           </Card>
//         </section>

//         {/* Input Section */}
//         <section>
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">Input Components</h2>
          
//           <Card>
//             <div className="space-y-4">
//               <Input
//                 label="Recipe Title"
//                 placeholder="Enter recipe title..."
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 required
//               />
              
//               <Input
//                 label="Search"
//                 placeholder="Search recipes..."
//                 icon={Search}
//               />
              
//               <Input
//                 label="Description"
//                 type="textarea"
//                 placeholder="Describe your recipe..."
//                 rows={4}
//               />
              
//               <Input
//                 label="Email"
//                 type="email"
//                 placeholder="you@example.com"
//                 error="Please enter a valid email address"
//               />
              
//               <Input
//                 label="Disabled Input"
//                 placeholder="This is disabled"
//                 disabled
//               />
//             </div>
//           </Card>
//         </section>

//         {/* Card Section */}
//         <section>
//           <h2 className="text-3xl font-bold text-gray-900 mb-6">Card Components</h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card>
//               <h3 className="text-xl font-bold mb-2">Default Card</h3>
//               <p className="text-gray-600">This is a standard card with default padding.</p>
//             </Card>
            
//             <Card hoverable>
//               <h3 className="text-xl font-bold mb-2">Hoverable Card</h3>
//               <p className="text-gray-600">Hover over me to see the effect!</p>
//             </Card>
            
//             <Card clickable hoverable onClick={() => alert('Card clicked!')}>
//               <h3 className="text-xl font-bold mb-2">Clickable Card</h3>
//               <p className="text-gray-600">Click me to trigger an action!</p>
//             </Card>
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//             <Card padding="sm">
//               <h3 className="text-lg font-bold mb-2">Small Padding</h3>
//               <p className="text-sm text-gray-600">Compact card.</p>
//             </Card>
            
//             <Card padding="default">
//               <h3 className="text-lg font-bold mb-2">Default Padding</h3>
//               <p className="text-sm text-gray-600">Standard spacing.</p>
//             </Card>
            
//             <Card padding="lg">
//               <h3 className="text-lg font-bold mb-2">Large Padding</h3>
//               <p className="text-sm text-gray-600">Spacious card.</p>
//             </Card>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CommonComponentsDemo;