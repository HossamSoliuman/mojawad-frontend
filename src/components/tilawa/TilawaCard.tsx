'use client';

// src/components/tilawa/TilawaCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Play, Heart, Clock } from 'lucide-react';
import type { Tilawa } from '@/types';
import { usePlayerStore } from '@/lib/playerStore';

interface Props {
  tilawa: Tilawa;
}

export default function TilawaCard({ tilawa }: Props) {
  const play = usePlayerStore((s) => s.play);
  const currentTilawa = usePlayerStore((s) => s.currentTilawa);
  const isActive = currentTilawa?.id === tilawa.id;

  return (
    <div className={`group relative bg-[#0e0e1c] rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 ${isActive ? 'border-[#c9a153]/60' : 'border-white/5 hover:border-[#c9a153]/30'}`}>
      {/* Cover */}
      <div className="relative aspect-square">
        <Image
          src={tilawa.cover_url}
          alt={tilawa.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        {/* Play button overlay */}
        <button
          onClick={() => play(tilawa)}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
        >
          <div className="w-12 h-12 rounded-full bg-[#c9a153] flex items-center justify-center shadow-lg">
            <Play size={22} className="text-black ml-1" />
          </div>
        </button>

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 text-[10px] bg-black/60 text-white/70 px-1.5 py-0.5 rounded flex items-center gap-1">
          <Clock size={9} /> {tilawa.duration_label}
        </span>

        {tilawa.is_featured && (
          <span className="absolute top-2 left-2 text-[10px] bg-[#c9a153] text-black font-bold px-2 py-0.5 rounded">
            Featured
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <Link
          href={`/tilawa/${tilawa.slug}`}
          className="text-sm font-semibold text-white line-clamp-1 hover:text-[#c9a153] transition"
        >
          {tilawa.title}
        </Link>

        {tilawa.qari && (
          <Link
            href={`/qaris/${tilawa.qari.slug}`}
            className="text-xs text-[#c9a153] mt-0.5 block hover:underline"
          >
            {tilawa.qari.name}
          </Link>
        )}

        <div className="flex items-center gap-1 mt-1 text-[11px] text-white/30">
          <Heart size={10} /> {tilawa.likes_count.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
