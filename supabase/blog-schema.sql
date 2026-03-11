-- Blog posts table for Barnbook
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  featured_image_url text,
  featured_image_alt text,
  meta_title text,
  meta_description text,
  author_name text not null default 'Barnbook Team',
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute function update_updated_at_column();

-- Index for listing
create index if not exists blog_posts_status_published_at on blog_posts (status, published_at desc);
create index if not exists blog_posts_slug on blog_posts (slug);
