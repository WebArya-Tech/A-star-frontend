import type { ChangeEventHandler, InputHTMLAttributes, MouseEventHandler, ReactNode, TextareaHTMLAttributes } from 'react';

type CardProps = {
  children?: ReactNode;
  className?: string;
  hover?: boolean;
};

type BadgeProps = {
  children?: ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  className?: string;
};

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
};

type ButtonProps = {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
};

type TagBadgeProps = {
  tag: string;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  className?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
};

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  className?: string;
  rows?: number;
};

export const Card = ({ children, className = '', hover = false }: CardProps) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${hover ? 'hover:shadow-md transition-all cursor-pointer' : ''} ${className}`}>
    {children}
  </div>
);

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    default: 'bg-blue-100 text-blue-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
};

export const Spinner = ({ size = 'md' }: SpinnerProps) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' };
  return (
    <div className={`flex justify-center items-center ${size === 'lg' ? 'py-16' : 'py-4'}`}>
      <div className={`${sizes[size] || sizes.md} animate-spin rounded-full border-2 border-gray-200 border-t-blue-600`} />
    </div>
  );
};

export const Button = ({ children, variant = 'primary', className = '', disabled, type = 'button', onClick }: ButtonProps) => {
  const variants = {
    primary: 'bg-blue-900 text-white hover:bg-blue-800 active:bg-blue-950',
    secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </button>
  );
};

export const Pagination = ({ page, totalPages, onPageChange, pageSize, onPageSizeChange, pageSizeOptions = [] }: PaginationProps) => {
  if (totalPages <= 1 && pageSizeOptions.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-8 pt-6 border-t border-gray-100">
      <div className="flex items-center gap-2">
        <button
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >← Prev</button>
        <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
        <button
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
        >Next →</button>
      </div>
      {pageSizeOptions.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Per page:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none"
          >
            {pageSizeOptions.map((sizeOption) => <option key={sizeOption} value={sizeOption}>{sizeOption}</option>)}
          </select>
        </div>
      )}
    </div>
  );
};

export const TagBadge = ({ tag }: TagBadgeProps) => (
  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
    #{tag}
  </span>
);

export const Input = ({ label, className = '', ...props }: InputProps) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors ${className}`}
      {...props}
    />
  </div>
);

export const TextArea = ({ label, className = '', rows = 4, ...props }: TextAreaProps) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      rows={rows}
      className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-colors resize-y ${className}`}
      {...props}
    />
  </div>
);
