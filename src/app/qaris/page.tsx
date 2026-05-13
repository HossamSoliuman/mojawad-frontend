// src/app/qaris/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import type { PaginatedResponse, Qari } from '@/types';

async function getQaris(page = 1): Promise<PaginatedResponse<Qari>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/qaris?page=${page}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to load qaris');
  return res.json();
}

export default async function QarisPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page ?? 1);
  const { data: qaris, meta } = await getQaris(page);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-white mb-8">Qaris</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {qaris.map((q) => (
          <Link
            key={q.id}
            href={`/qaris/${q.slug}`}
            className="group text-center"
          >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-[#c9a153]/40 transition">
              <Image src={q.image_url} alt={q.name} fill className="object-cover group-hover:scale-105 transition duration-300" />
              {q.is_featured && (
                <span className="absolute top-2 right-2 text-[9px] bg-[#c9a153] text-black font-bold px-1.5 py-0.5 rounded">★</span>
              )}
            </div>
            <p className="mt-2 text-sm text-white group-hover:text-[#c9a153] transition line-clamp-2">{q.name}</p>
            {q.tilawat_count !== undefined && (
              <p className="text-xs text-white/30">{q.tilawat_count} recitations</p>
            )}
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {meta.last_page > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/qaris?page=${p}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition ${
                p === meta.current_page
                  ? 'bg-[#c9a153] text-black font-bold'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
