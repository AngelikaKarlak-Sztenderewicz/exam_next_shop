'use client';

import { ButtonHTMLAttributes } from 'react';

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: ButtonSize;
};

export default function Button({
  className = '',
  size = 'md',
  type = 'button',
  ...props
}: Props) {
  const sizeClasses: Record<ButtonSize, string> = {
    xs: 'py-1.5 px-5 text-xs',
    sm: 'py-2 px-5 text-sm',
    md: 'py-3.5 px-5 text-base',
    lg: 'py-4 px-5 text-lg',
  };

  return (
    <button
      type={type}
      {...props}
      className={` w-full rounded-md transition text-bold bg-submitButtonColor hover:opacity-90 ${sizeClasses[size]} ${className}`}
    />
  );
}
