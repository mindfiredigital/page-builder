const cn = (...classes) => classes.filter(Boolean).join(' ');

export const Button = ({
  children,
  variant = 'default',
  size = 'default',
  className = '',
  onClick = null,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline:
      'border border-gray-300 bg-transparent hover:bg-gray-100 text-gray-900 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800',
    ghost:
      'hover:bg-gray-100 text-gray-900 dark:hover:bg-gray-800 dark:text-gray-100',
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
