import { cn } from '@/lib/utils'

export function Button({ children, className, variant = 'primary', disabled, ...props }) {
  const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500',
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white',
        className
      )}
      {...props}
    />
  )
}

export function Label({ children, className, ...props }) {
  return (
    <label
      className={cn('block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1', className)}
      {...props}
    >
      {children}
    </label>
  )
}

export function Card({ children, className, ...props }) {
  return (
    <div
      className={cn('bg-white dark:bg-gray-800 rounded-lg shadow-md p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
