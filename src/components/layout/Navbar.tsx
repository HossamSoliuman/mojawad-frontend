'use client';

// src/components/layout/Navbar.tsx
import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, User, LogOut, BookMarked, Settings } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-[#07070f]/95 backdrop-blur border-b border-[#c9a153]/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="text-[#c9a153] font-bold text-xl tracking-tight flex-shrink-0">
            مُجَوَّد
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <Link href="/" className="hover:text-[#c9a153] transition">Home</Link>
            <Link href="/qaris" className="hover:text-[#c9a153] transition">Qaris</Link>
            {user && (
              <Link href="/library" className="hover:text-[#c9a153] transition">Library</Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/60 hover:text-[#c9a153] transition"
            >
              <Search size={20} />
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full"
                >
                  <Image
                    src={user.avatar_url}
                    alt={user.name}
                    width={34}
                    height={34}
                    className="rounded-full border-2 border-[#c9a153]/40"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0e0e1c] border border-[#c9a153]/20 rounded-xl shadow-2xl py-2 text-sm">
                    <div className="px-4 py-2 border-b border-white/5">
                      <p className="font-semibold text-white truncate">{user.name}</p>
                      <p className="text-white/40 text-xs truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/library"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-[#c9a153] hover:bg-white/5 transition"
                    >
                      <BookMarked size={14} /> Library
                    </Link>
                    {user.roles.includes('admin') || user.roles.includes('creator') ? (
                      <a
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-[#c9a153] hover:bg-white/5 transition"
                      >
                        <Settings size={14} /> Admin Panel
                      </a>
                    ) : null}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/5 transition"
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm text-white/70 hover:text-white transition px-3 py-1.5"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-[#c9a153] text-black font-semibold px-4 py-1.5 rounded-lg hover:bg-[#b8923e] transition"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-white/60"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#07070f] px-4 py-4 flex flex-col gap-3 text-sm">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-white/70">Home</Link>
            <Link href="/qaris" onClick={() => setMenuOpen(false)} className="text-white/70">Qaris</Link>
            {user ? (
              <>
                <Link href="/library" onClick={() => setMenuOpen(false)} className="text-white/70">Library</Link>
                <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-white/70">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-[#c9a153] font-semibold">Sign up</Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Search modal */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}
