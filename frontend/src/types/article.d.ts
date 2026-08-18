export interface Article {
  id: number;
  title: string;
  content: string;
  featured_image?: string | null;
  image_mime_type?: string | null;
  image_url?: string | null;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
  read_time_minutes?: number;
}