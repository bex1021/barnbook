-- Update role constraint to support admin, rider, owner
alter table users drop constraint if exists users_role_check;
alter table users add constraint users_role_check check (role in ('admin', 'rider', 'owner', 'user'));

-- Migrate existing 'user' roles to 'rider'
update users set role = 'rider' where role = 'user';

-- Set roles for known accounts
update users set role = 'admin' where email = 'rebecca.leung671@gmail.com';
update users set role = 'owner' where email = 'bernard.j.huang@gmail.com';

-- Rider profiles table
create table if not exists rider_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  bio text,
  disciplines text[] not null default '{}',
  looking_for text,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger rider_profiles_updated_at
  before update on rider_profiles
  for each row execute function update_updated_at_column();
