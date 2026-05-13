// src/app/tilawa/[slug]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import TilawaActions from './TilawaActions';
import TilawaCard from '@/components/tilawa/TilawaCard';
import type { Tilawa } from '@/types';

interface PageData {
  tilawa: Tilawa;
  related: Tilawa[];
  liked: boolean;
  saved: boolean;
}

async function getData(slug: string): Promise<PageData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tilawat/${slug}`, {
    cache: 'no-store', // needs auth context for liked/saved
  });
  if (!res.ok) throw new Error('Not found');
  return res.json();
}

export default async function TilawaPage({ params }: { params: { slug: string } }) {
  const { tilawa, related, liked, saved } = await getData(params.slug);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-[280px_1fr] gap-8">
        {/* Cover */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50">
            <Image src={tilawa.cover_url} alt={tilawa.title} fill className="object-cover" />
          </div>

          <TilawaActions tilawa={tilawa} initialLiked={liked} initialSaved={saved} />
        </div>

        {/* Details */}
        <div>
          {tilawa.qari && (
            <Link
              href={`/qaris/${tilawa.qari.slug}`}
              className="text-[#c9a153] text-sm hover:underline"
            >
              ← {tilawa.qari.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-white mt-2 mb-1">{tilawa.title}</h1>

          <div className="flex flex-wrap gap-3 text-xs text-white/40 mt-3 mb-6">
            <span>{tilawa.duration_label}</span>
            {tilawa.recorded_place && <span>· {tilawa.recorded_place}</span>}
            {tilawa.recorded_at && <span>· {tilawa.recorded_at}</span>}
            <span>· {tilawa.likes_count.toLocaleString()} likes</span>
            <span>· {tilawa.downloads_count.toLocaleString()} downloads</span>
          </div>

          {tilawa.description && (
            <p className="text-white/60 text-sm leading-relaxed mb-8">{tilawa.description}</p>
          )}

          <a
            href={`/api/tilawat/${tilawa.slug}/download`}
            className="inline-flex items-center gap-2 bg-[#c9a153]/10 border border-[#c9a153]/30 text-[#c9a153] text-sm px-5 py-2 rounded-xl hover:bg-[#c9a153]/20 transition"
          >
            ⬇ Download MP3
          </a>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-lg font-bold text-white mb-4">More from {tilawa.qari?.name}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map((t) => <TilawaCard key={t.id} tilawa={t} />)}
          </div>
        </section>
      )}
    </div>
  );
}
