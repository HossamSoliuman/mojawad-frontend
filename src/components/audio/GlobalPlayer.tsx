'use client';

// src/components/audio/GlobalPlayer.tsx
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2, X, Download } from 'lucide-react';
import { usePlayerStore } from '@/lib/playerStore';

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function GlobalPlayer() {
  const {
    currentTilawa,
    isPlaying,
    currentTime,
    duration,
    volume,
    pause,
    resume,
    seek,
    setVolume,
    setCurrentTime,
    setDuration,
    stop,
  } = usePlayerStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create / destroy audio element
  useEffect(() => {
    if (!currentTilawa) return;

    const audio = new Audio(currentTilawa.audio_url);
    audio.volume = volume;
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('durationchange', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => pause());

    if (isPlaying) audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTilawa]);

  // Sync play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  if (!currentTilawa) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e1c] border-t border-[#c9a153]/20 px-4 py-3 flex items-center gap-4 shadow-2xl">
      {/* Cover */}
      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
        <Image src={currentTilawa.cover_url} alt={currentTilawa.title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/tilawa/${currentTilawa.slug}`}
          className="text-sm font-semibold text-white truncate block hover:text-[#c9a153]"
        >
          {currentTilawa.title}
        </Link>
        {currentTilawa.qari && (
          <Link
            href={`/qaris/${currentTilawa.qari.slug}`}
            className="text-xs text-[#c9a153] truncate block"
          >
            {currentTilawa.qari.name}
          </Link>
        )}

        {/* Progress bar */}
        <div className="mt-1 relative h-1 bg-white/10 rounded cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const newTime = pct * duration;
            seek(newTime);
            if (audioRef.current) audioRef.current.currentTime = newTime;
          }}
        >
          <div className="h-full bg-[#c9a153] rounded" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between text-[10px] text-white/40 mt-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={isPlaying ? pause : resume}
          className="w-10 h-10 rounded-full bg-[#c9a153] flex items-center justify-center hover:bg-[#b8923e] transition"
        >
          {isPlaying ? <Pause size={18} className="text-black" /> : <Play size={18} className="text-black ml-0.5" />}
        </button>

        {/* Volume */}
        <div className="hidden sm:flex items-center gap-1">
          <Volume2 size={14} className="text-white/50" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 accent-[#c9a153]"
          />
        </div>

        {/* Download */}
        <a
          href={`/api/tilawat/${currentTilawa.slug}/download`}
          className="text-white/40 hover:text-[#c9a153] transition"
          title="Download"
        >
          <Download size={16} />
        </a>

        {/* Close */}
        <button onClick={stop} className="text-white/40 hover:text-white transition">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
