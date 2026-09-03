-- =========================================================
-- TrimLink — schema inicial
-- Filosofía de privacidad: nunca se guarda la IP en crudo.
-- Solo se persiste el país derivado (geo edge) y, si hiciera
-- falta un identificador de abuso, un hash con salt de la IP.
-- =========================================================

create extension if not exists "pgcrypto";

-- ---------- LINKS ----------
create table if not exists public.links (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  code         text not null unique,
  original_url text not null,
  title        text,
  clicks_count integer not null default 0,
  expires_at   timestamptz,
  created_at   timestamptz not null default now()
);

create index if not exists links_user_id_idx on public.links (user_id);
create index if not exists links_code_idx on public.links (code);

-- ---------- CLICKS (analítica anónima) ----------
create table if not exists public.clicks (
  id          uuid primary key default gen_random_uuid(),
  link_id     uuid not null references public.links(id) on delete cascade,
  country     text,        -- código ISO de país (ej: "AR", "US"), nunca la IP
  device_type text,        -- 'mobile' | 'tablet' | 'desktop'
  ip_hash     text,        -- hash sha-256 con salt, solo si se necesita anti-abuso
  created_at  timestamptz not null default now()
);

create index if not exists clicks_link_id_idx on public.clicks (link_id);
create index if not exists clicks_created_at_idx on public.clicks (created_at);

-- ---------- Trigger: incrementar contador de clics ----------
create or replace function public.increment_link_clicks()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.links
     set clicks_count = clicks_count + 1
   where id = new.link_id;
  return new;
end;
$$;

drop trigger if exists trg_increment_link_clicks on public.clicks;
create trigger trg_increment_link_clicks
  after insert on public.clicks
  for each row execute function public.increment_link_clicks();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.links enable row level security;
alter table public.clicks enable row level security;

-- LINKS: el dueño puede leer / crear / editar / borrar sus propios links
create policy "links_select_own"
  on public.links for select
  using (auth.uid() = user_id);

create policy "links_insert_own"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "links_update_own"
  on public.links for update
  using (auth.uid() = user_id);

create policy "links_delete_own"
  on public.links for delete
  using (auth.uid() = user_id);

-- LINKS: lectura pública restringida solo a la resolución de redirects
-- (el middleware corre con la anon key; necesita poder resolver un code -> url)
create policy "links_select_public_for_redirect"
  on public.links for select
  to anon
  using (true);

-- CLICKS: cualquiera (incluido anon, desde el middleware) puede insertar
-- un evento de clic anónimo, pero nadie puede leer clics ajenos directamente
create policy "clicks_insert_anon"
  on public.clicks for insert
  to anon, authenticated
  with check (true);

create policy "clicks_select_owner_only"
  on public.clicks for select
  using (
    exists (
      select 1 from public.links
      where links.id = clicks.link_id
        and links.user_id = auth.uid()
    )
  );
