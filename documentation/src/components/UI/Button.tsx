import React, { useEffect, useState } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const getClientTheme = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }
  return document.documentElement.getAttribute('data-theme') || undefined;
};

export const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick = null,
  ...props
}) => {
  const [theme, setTheme] = useState<string | undefined>(getClientTheme());

  useEffect(() => {
    setTheme(getClientTheme());
    const observer = new MutationObserver(() => setTheme(getClientTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);
  const currentTheme = theme || 'light';

  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 cursor-pointer';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',

    outline: cn(
      'border bg-transparent',
      currentTheme === 'dark'
        ? 'border-gray-600 text-gray-100 hover:bg-gray-800'
        : 'border-gray-300 text-gray-900 hover:bg-gray-100'
    ),

    ghost: cn(
      currentTheme === 'dark'
        ? 'hover:bg-gray-800 text-gray-100'
        : 'hover:bg-gray-100 text-gray-900'
    ),
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8',
    xl: 'h-12 rounded-lg px-10 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};