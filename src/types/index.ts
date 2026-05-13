// src/types/index.ts

export interface Qari {
  id: number;
  name: string;
  slug: string;
  image_url: string;
  biography: string | null;
  is_featured: boolean;
  status: 'active' | 'inactive' | 'pending';
  tilawat_count?: number;
  created_at: string;
}

export interface Tilawa {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  recorded_at: string | null;
  recorded_place: string | null;
  audio_url: string;
  duration: number;
  duration_label: string;
  cover_url: string;
  is_featured: boolean;
  downloads_count: number;
  likes_count: number;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  qari?: {
    id: number;
    name: string;
    slug: string;
    image_url: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string;
  roles: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface HomeData {
  featured_tilawat: Tilawa[];
  top_qaris: Qari[];
  recent_tilawat: Tilawa[];
  popular_tilawat: Tilawa[];
}

export interface SearchResult {
  qaris: Array<{
    id: number;
    name: string;
    slug: string;
    image_url: string;
  }>;
  tilawat: Array<{
    id: number;
    title: string;
    slug: string;
    qari: string;
    qari_slug: string;
    cover_url: string;
    duration: string;
  }>;
}
