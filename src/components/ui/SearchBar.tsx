'use client';

// src/components/ui/SearchBar.tsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { SearchResult } from '@/types';

interface Props {
  onClose: () => void;
}

export default function SearchBar({ onClose }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length < 2) { setResults(null); return; }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await apiClient.search(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = results && (results.qaris.length > 0 || results.tilawat.length > 0);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-xl bg-[#0e0e1c] border border-[#c9a153]/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
          <Search size={18} className="text-white/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search qaris or tilawat…"
            className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
          />
          {loading && <span className="text-xs text-white/30">Searching…</span>}
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        {hasResults && (
          <div className="max-h-96 overflow-y-auto">
            {results!.qaris.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-[#c9a153] uppercase tracking-wider">Qaris</p>
                {results!.qaris.map((q) => (
                  <Link
                    key={q.id}
                    href={`/qaris/${q.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition"
                  >
                    <Image src={q.image_url} alt={q.name} width={32} height={32} className="rounded-full" />
                    <span className="text-sm text-white">{q.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {results!.tilawat.length > 0 && (
              <div className="border-t border-white/5">
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-[#c9a153] uppercase tracking-wider">Tilawat</p>
                {results!.tilawat.map((t) => (
                  <Link
                    key={t.id}
                    href={`/tilawa/${t.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition"
                  >
                    <Image src={t.cover_url} alt={t.title} width={32} height={32} className="rounded object-cover" />
                    <div className="min-w-0">
                      <p className="text-sm text-white truncate">{t.title}</p>
                      <p className="text-xs text-[#c9a153] truncate">{t.qari} · {t.duration}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length >= 2 && !loading && !hasResults && (
          <p className="px-4 py-6 text-center text-sm text-white/30">No results found.</p>
        )}
      </div>
    </div>
  );
}
