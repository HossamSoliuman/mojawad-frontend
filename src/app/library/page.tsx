'use client';

// src/app/library/page.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/authStore';
import { apiClient } from '@/lib/api';
import TilawaCard from '@/components/tilawa/TilawaCard';
import type { Tilawa } from '@/types';

export default function LibraryPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [tilawat, setTilawat] = useState<Tilawa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    apiClient.getLibrary().then((res) => {
      setTilawat(res.data);
      setLoading(false);
    });
  }, [user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-white/30">Loading your library…</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-white mb-8">Your Library</h1>
      {tilawat.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-white/30 mb-3">Your library is empty.</p>
          <a href="/qaris" className="text-[#c9a153] text-sm hover:underline">Browse recitations →</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {tilawat.map((t) => <TilawaCard key={t.id} tilawa={t} />)}
        </div>
      )}
    </div>
  );
}
