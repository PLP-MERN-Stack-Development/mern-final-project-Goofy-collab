import React from 'react';
import { ChefHat, Menu, X, Search } from 'lucide-react';


export const Card = ({ 
  children, 
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  padding = 'default' // default, none, sm, lg
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };
  
  const hoverStyles = hoverable ? 'hover:shadow-xl transform hover:-translate-y-1' : '';
  const clickableStyles = clickable ? 'cursor-pointer' : '';
  
  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`bg-white rounded-xl shadow-md transition-all duration-300 ${hoverStyles} ${clickableStyles} ${paddingStyles[padding]} ${className}`}
    >
      {children}
    </div>
  );
};