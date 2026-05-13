// src/app/qaris/[slug]/page.tsx
import Image from 'next/image';
import TilawaCard from '@/components/tilawa/TilawaCard';
import type { Qari, Tilawa } from '@/types';

async function getData(slug: string): Promise<{ qari: Qari; tilawat: Tilawa[] }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qaris/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export default async function QariPage({ params }: { params: { slug: string } }) {
  const { qari, tilawat } = await getData(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Qari header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
        <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#c9a153]/30 flex-shrink-0">
          <Image src={qari.image_url} alt={qari.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{qari.name}</h1>
          {qari.tilawat_count !== undefined && (
            <p className="text-[#c9a153] text-sm mt-1">{qari.tilawat_count} recitations</p>
          )}
          {qari.biography && (
            <p className="text-white/50 text-sm mt-3 max-w-prose leading-relaxed">{qari.biography}</p>
          )}
        </div>
      </div>

      {/* Tilawat grid */}
      <h2 className="text-lg font-semibold text-white mb-4">Recitations</h2>
      {tilawat.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {tilawat.map((t) => <TilawaCard key={t.id} tilawa={t} />)}
        </div>
      ) : (
        <p className="text-white/30 text-center py-16">No recitations available yet.</p>
      )}
    </div>
  );
}