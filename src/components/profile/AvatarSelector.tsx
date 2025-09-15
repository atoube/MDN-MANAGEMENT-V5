import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { cn } from '../../lib/utils';

interface UserAvatarProps {
  avatar?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  photoUrl?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg'
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  name,
  size = 'md',
  className,
  photoUrl
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-teal-500'
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <Avatar className={cn('relative flex shrink-0 overflow-hidden rounded-full', sizeClasses[size], className)}>
      {photoUrl ? (
        <AvatarImage
          src={photoUrl}
          alt={name || 'Avatar'}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className={cn(
          'flex h-full w-full items-center justify-center rounded-full text-white font-medium',
          getAvatarColor(name || 'default')
        )}>
          {name ? getInitials(name) : '?'}
        </div>
      )}
      <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full bg-muted">
        {name ? getInitials(name) : '?'}
      </AvatarFallback>
    </Avatar>
  );
};
