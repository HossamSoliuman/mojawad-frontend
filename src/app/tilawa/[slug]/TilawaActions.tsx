'use client';

// src/app/tilawa/[slug]/TilawaActions.tsx
import { useState } from 'react';
import { Heart, Bookmark, Play } from 'lucide-react';
import type { Tilawa } from '@/types';
import { usePlayerStore } from '@/lib/playerStore';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Props {
  tilawa: Tilawa;
  initialLiked: boolean;
  initialSaved: boolean;
}

export default function TilawaActions({ tilawa, initialLiked, initialSaved }: Props) {
  const { play, currentTilawa, isPlaying, pause } = usePlayerStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [liked, setLiked] = useState(initialLiked);
  const [saved, setSaved] = useState(initialSaved);
  const [likesCount, setLikesCount] = useState(tilawa.likes_count);

  const isActive = currentTilawa?.id === tilawa.id;

  const handlePlay = () => {
    if (isActive && isPlaying) { pause(); return; }
    play(tilawa);
  };

  const handleLike = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      const { liked: newLiked, count } = await apiClient.toggleLike(tilawa.id);
      setLiked(newLiked);
      setLikesCount(count);
    } catch {}
  };

  const handleSave = async () => {
    if (!user) { router.push('/login'); return; }
    try {
      const { saved: newSaved } = await apiClient.toggleSave(tilawa.id);
      setSaved(newSaved);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 w-full max-w-[280px] justify-center">
      {/* Main play button */}
      <button
        onClick={handlePlay}
        className="flex-1 flex items-center justify-center gap-2 bg-[#c9a153] text-black font-semibold py-3 rounded-xl hover:bg-[#b8923e] transition"
      >
        <Play size={18} className="ml-0.5" />
        {isActive && isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Like */}
      <button
        onClick={handleLike}
        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition ${
          liked
            ? 'bg-red-500/20 border-red-500/40 text-red-400'
            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
        }`}
      >
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
      </button>

      {/* Save */}
      <button
        onClick={handleSave}
        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition ${
          saved
            ? 'bg-[#c9a153]/20 border-[#c9a153]/40 text-[#c9a153]'
            : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
        }`}
      >
        <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
