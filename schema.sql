-- =====================================================================
-- KAMPÜS EĞİTMEN – Supabase şeması
-- Supabase > SQL Editor > New query: tamamını yapıştırıp bir kere çalıştır.
-- =====================================================================
create extension if not exists pgcrypto;

-- ============================ TABLOLAR ===============================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student','tutor','admin')),
  full_name text not null default '',
  is_banned boolean not null default false,
  kvkk_accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.tutor_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  city text not null check (city in ('İstanbul','Ankara','İzmir','Bursa','Eskişehir','Antalya')),
  university text not null,
  department text not null,
  rank_text text,                                   -- eğitmenin beyanı: "YKS Sayısal İlk 5.000"
  subjects text[] not null default '{}',
  hourly_rate int not null check (hourly_rate between 0 and 10000),
  areas text[] not null default '{}',
  hours text,
  bio text check (char_length(bio) <= 1000),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  osym_verified boolean not null default false,     -- yalnızca admin onayıyla true olur
  updated_at timestamptz not null default now()
);
create index on public.tutor_profiles (city) where status = 'approved';

create table public.osym_documents (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null references public.profiles(id) on delete cascade,
  file_path text not null,                          -- storage: osym/<tutor_id>/<dosya>
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note text,
  created_at timestamptz not null default now()
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  tutor_id uuid not null,
  message text check (char_length(message) <= 500),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note text,
  created_at timestamptz not null default now(),
  decided_at timestamptz,
  constraint contact_requests_student_fk foreign key (student_id) references public.profiles(id) on delete cascade,
  constraint contact_requests_tutor_fk   foreign key (tutor_id)   references public.profiles(id) on delete cascade
);
create unique index one_pending_request on public.contact_requests (student_id, tutor_id) where status = 'pending';

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null,
  tutor_id uuid not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint conversations_student_fk foreign key (student_id) references public.profiles(id) on delete cascade,
  constraint conversations_tutor_fk   foreign key (tutor_id)   references public.profiles(id) on delete cascade,
  unique (student_id, tutor_id)
);

create table public.messages (
  id bigint generated always as identity primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index on public.messages (conversation_id, created_at);

-- ============================ FONKSİYONLAR ===========================
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and not is_banned);
$$;

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.me_banned() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_banned from public.profiles where id = auth.uid()), true);
$$;

-- Kayıt olunca profil oluştur. Rol olarak SADECE student/tutor kabul edilir; admin asla.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, kvkk_accepted_at)
  values (new.id,
          case when new.raw_user_meta_data->>'role' = 'tutor' then 'tutor' else 'student' end,
          left(coalesce(new.raw_user_meta_data->>'full_name', ''), 100),
          case when new.raw_user_meta_data->>'kvkk' = 'true' then now() end);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Kullanıcı kendi rolünü / ban durumunu değiştiremez (SQL Editor'den veya admin ise serbest).
create or replace function public.protect_profile() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.is_banned := old.is_banned;
  end if;
  return new;
end $$;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

-- Eğitmen kendi onay durumunu / ÖSYM rozetini değiştiremez.
-- Üniversite, bölüm veya derece değişirse rozet düşer ve profil yeniden onaya gider.
create or replace function public.protect_tutor() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending'; new.osym_verified := false;
    else
      new.status := old.status; new.osym_verified := old.osym_verified;
      if new.rank_text is distinct from old.rank_text
         or new.university is distinct from old.university
         or new.department is distinct from old.department then
        new.osym_verified := false; new.status := 'pending';
      elsif old.status = 'rejected' then
        new.status := 'pending';                    -- reddedilen eğitmen düzeltip yeniden gönderir
      end if;
    end if;
  end if;
  new.updated_at := now();
  return new;
end $$;
create trigger protect_tutor before insert or update on public.tutor_profiles
  for each row execute function public.protect_tutor();

-- Admin: görüşme talebini onayla/reddet. Onayda yazışma kanalı açılır.
create or replace function public.admin_decide_request(p_id uuid, p_approve boolean, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare r public.contact_requests;
begin
  if not public.is_admin() then raise exception 'Yetkisiz'; end if;
  update public.contact_requests
     set status = case when p_approve then 'approved' else 'rejected' end,
         admin_note = p_note, decided_at = now()
   where id = p_id and status = 'pending'
   returning * into r;
  if r.id is null then raise exception 'Talep bulunamadı veya zaten sonuçlanmış'; end if;
  if p_approve then
    insert into public.conversations (student_id, tutor_id) values (r.student_id, r.tutor_id)
    on conflict (student_id, tutor_id) do update set active = true;
  end if;
end $$;

-- Admin: ÖSYM belgesini onayla/reddet. Onaylı belge varsa rozet açılır.
create or replace function public.admin_decide_osym(p_id uuid, p_approve boolean, p_note text default null)
returns void language plpgsql security definer set search_path = public as $$
declare d public.osym_documents;
begin
  if not public.is_admin() then raise exception 'Yetkisiz'; end if;
  update public.osym_documents
     set status = case when p_approve then 'approved' else 'rejected' end, admin_note = p_note
   where id = p_id returning * into d;
  if d.id is null then raise exception 'Belge bulunamadı'; end if;
  update public.tutor_profiles
     set osym_verified = exists (select 1 from public.osym_documents where tutor_id = d.tutor_id and status = 'approved')
   where user_id = d.tutor_id;
end $$;

-- ============================ HERKESE AÇIK GÖRÜNÜM ===================
-- Sadece onaylı ve banlı olmayan eğitmenler, sadece güvenli sütunlar.
create view public.public_tutors as
select t.user_id, p.full_name, t.city, t.university, t.department, t.rank_text, t.subjects,
       t.hourly_rate, t.areas, t.hours, t.bio, t.osym_verified
from public.tutor_profiles t join public.profiles p on p.id = t.user_id
where t.status = 'approved' and not p.is_banned;
grant select on public.public_tutors to anon, authenticated;

create or replace function public.tutor_is_public(p_id uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.public_tutors where user_id = p_id);
$$;

-- ============================ RLS (GÜVENLİK POLİTİKALARI) ============
alter table public.profiles         enable row level security;
alter table public.tutor_profiles   enable row level security;
alter table public.osym_documents   enable row level security;
alter table public.contact_requests enable row level security;
alter table public.conversations    enable row level security;
alter table public.messages         enable row level security;

-- profiles: kendini, admin hepsini, yazışma partnerini görür
create policy p_select on public.profiles for select using (
  id = auth.uid() or public.is_admin() or exists (
    select 1 from public.conversations c
    where (c.student_id = auth.uid() and c.tutor_id = profiles.id)
       or (c.tutor_id = auth.uid() and c.student_id = profiles.id)));
create policy p_update on public.profiles for update
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

-- tutor_profiles
create policy t_select on public.tutor_profiles for select using (user_id = auth.uid() or public.is_admin());
create policy t_insert on public.tutor_profiles for insert with check (
  user_id = auth.uid() and not public.me_banned() and public.my_role() = 'tutor');
create policy t_update on public.tutor_profiles for update
  using ((user_id = auth.uid() and not public.me_banned()) or public.is_admin())
  with check ((user_id = auth.uid() and not public.me_banned()) or public.is_admin());

-- osym_documents: eğitmen yükler ve görür; onay/ret sadece admin
create policy o_select on public.osym_documents for select using (tutor_id = auth.uid() or public.is_admin());
create policy o_insert on public.osym_documents for insert with check (
  tutor_id = auth.uid() and status = 'pending' and not public.me_banned()
  and split_part(file_path, '/', 1) = auth.uid()::text and public.my_role() = 'tutor');
create policy o_admin_update on public.osym_documents for update using (public.is_admin()) with check (public.is_admin());

-- contact_requests: öğrenci onaylı eğitmene talep açar; sadece kendi taleplerini ve admin görür
create policy r_select on public.contact_requests for select using (student_id = auth.uid() or public.is_admin());
create policy r_insert on public.contact_requests for insert with check (
  student_id = auth.uid() and status = 'pending' and not public.me_banned()
  and public.my_role() = 'student'
  and public.tutor_is_public(contact_requests.tutor_id)
  and not exists (select 1 from public.conversations c
                  where c.student_id = contact_requests.student_id and c.tutor_id = contact_requests.tutor_id and c.active));
create policy r_admin_update on public.contact_requests for update using (public.is_admin()) with check (public.is_admin());

-- conversations: kanalı yalnızca admin onayıyla (RPC) açılır; katılımcılar ve admin görür
create policy c_select on public.conversations for select using (
  student_id = auth.uid() or tutor_id = auth.uid() or public.is_admin());
create policy c_admin_update on public.conversations for update using (public.is_admin()) with check (public.is_admin());

-- messages: katılımcılar ve admin okur; yalnızca aktif kanalda katılımcı yazar; admin silebilir
create policy m_select on public.messages for select using (
  public.is_admin() or exists (select 1 from public.conversations c
    where c.id = messages.conversation_id and auth.uid() in (c.student_id, c.tutor_id)));
create policy m_insert on public.messages for insert with check (
  sender_id = auth.uid() and not public.me_banned()
  and exists (select 1 from public.conversations c
    where c.id = messages.conversation_id and c.active and auth.uid() in (c.student_id, c.tutor_id)));
create policy m_admin_delete on public.messages for delete using (public.is_admin());

-- Canlı mesajlaşma
alter publication supabase_realtime add table public.messages;

-- ============================ ÖSYM BELGELERİ DEPOSU (özel) ===========
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('osym', 'osym', false, 5242880, array['application/pdf','image/jpeg','image/png'])
on conflict (id) do nothing;

create policy osym_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'osym' and (storage.foldername(name))[1] = auth.uid()::text);
create policy osym_select on storage.objects for select to authenticated
  using (bucket_id = 'osym' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- ============================ İLK ADMİN ==============================
-- Siteden normal kayıt ol, sonra bu satırı KENDİ e-postanla çalıştır:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'SENIN-EPOSTAN@ornek.com');
