// src/app/page.tsx  — Server Component (SSR / ISR)
import Image from 'next/image';
import Link from 'next/link';
import TilawaCard from '@/components/tilawa/TilawaCard';
import type { HomeData } from '@/types';


async function getHomeData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home`, {
    next: { revalidate: 600 },
  });

  const text = await res.text(); // read body once

  if (!res.ok) throw new Error('Failed to fetch home data');
  return JSON.parse(text); // parse from the saved string
}

export default async function HomePage() {
  const { featured_tilawat, top_qaris, recent_tilawat, popular_tilawat } = await getHomeData();

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[420px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/minshawy_hero.png"
            alt="Hero"
            fill
            className="object-cover object-top opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07070f]/60 via-[#07070f]/40 to-[#07070f]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            <span className="text-[#c9a153]">مُجَوَّد</span>
          </h1>
          <p className="text-lg text-white/60 max-w-xl mb-8">
            A curated library of the finest Quran recitations by world-renowned qaris.
          </p>
          <div className="flex gap-3">
            <Link
              href="/qaris"
              className="bg-[#c9a153] text-black font-semibold px-6 py-3 rounded-xl hover:bg-[#b8923e] transition"
            >
              Browse Qaris
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-14 py-12">
        {/* Featured */}
        {featured_tilawat.length > 0 && (
          <Section title="Featured Recitations">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featured_tilawat.map((t) => <TilawaCard key={t.id} tilawa={t} />)}
            </div>
          </Section>
        )}

        {/* Top Qaris */}
        {top_qaris.length > 0 && (
          <Section title="Top Qaris" href="/qaris">
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {top_qaris.map((q) => (
                <Link
                  key={q.id}
                  href={`/qaris/${q.slug}`}
                  className="flex-shrink-0 snap-start group text-center w-28"
                >
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#c9a153] transition">
                    <Image src={q.image_url} alt={q.name} fill className="object-cover" />
                  </div>
                  <p className="mt-2 text-xs text-white/70 group-hover:text-[#c9a153] transition line-clamp-2">{q.name}</p>
                  {q.tilawat_count !== undefined && (
                    <p className="text-[10px] text-white/30">{q.tilawat_count} recitations</p>
                  )}
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* Recent */}
        {recent_tilawat.length > 0 && (
          <Section title="Recently Added">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recent_tilawat.map((t) => <TilawaCard key={t.id} tilawa={t} />)}
            </div>
          </Section>
        )}

        {/* Popular */}
        {popular_tilawat.length > 0 && (
          <Section title="Most Liked">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {popular_tilawat.map((t) => <TilawaCard key={t.id} tilawa={t} />)}
            </div>
          </Section>
        )}
      </div>
    </>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {href && (
          <Link href={href} className="text-sm text-[#c9a153] hover:underline">
            View all →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
