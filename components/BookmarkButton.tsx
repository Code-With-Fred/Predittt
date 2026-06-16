'use client';

import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/lib/BookmarkContext';
import { cn } from '@/lib/utils';

interface Props {
  id: string;
  className?: string;
}

export default function BookmarkButton({ id, className }: Props) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(id);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      aria-label={saved ? 'Remove bookmark' : 'Bookmark this pick'}
      className={cn(
        'p-1.5 rounded-lg transition-all active:scale-90',
        saved ? 'text-[#AAFF00]' : 'text-muted-foreground hover:text-white',
        className
      )}
      style={saved ? { background: 'rgba(170,255,0,0.1)' } : {}}
    >
      <Bookmark className="w-4 h-4" fill={saved ? '#AAFF00' : 'none'} />
    </button>
  );
}
