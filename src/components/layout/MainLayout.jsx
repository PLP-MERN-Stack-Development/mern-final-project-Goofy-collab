import React from 'react';
import { ChefHat, Mail, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import {Header} from './Header'; 
import {Footer} from './Footer'; 



export const MainLayout = ({ 
  children,
  user = null,
  showHeader = true,
  showFooter = true,
  transparentHeader = false,
  onNavigate
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && (
        <Header 
          user={user} 
          onNavigate={onNavigate}
          transparent={transparentHeader}
        />
      )}
      
      <main className="flex-1">
        {children}
      </main>
      
      {showFooter && (
        <Footer onNavigate={onNavigate} />
      )}
    </div>
  );
};

