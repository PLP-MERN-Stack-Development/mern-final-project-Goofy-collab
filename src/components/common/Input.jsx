import React from 'react';
import { ChefHat, Menu, X, Search } from 'lucide-react';


export const Input = ({ 
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  label,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  rows = 3
}) => {
  const baseStyles = 'w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition';
  const errorStyles = error ? 'border-red-500' : 'border-gray-300';
  const iconPadding = Icon ? 'pl-10' : '';
  
  const InputElement = type === 'textarea' ? 'textarea' : 'input';
  
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        )}
        <InputElement
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          rows={type === 'textarea' ? rows : undefined}
          className={`${baseStyles} ${errorStyles} ${iconPadding} disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};