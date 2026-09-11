-- Milestone 12: add is_default flag to addresses and ensure proper CRUD policies

-- Add is_default column to addresses
alter table public.addresses
add column if not exists is_default boolean not null default false;

-- Create unique partial index to ensure at most one default address per user
create unique index if not exists addresses_user_id_is_default_unique_idx
on public.addresses (user_id)
where is_default = true;

-- Add UPDATE and DELETE policies for addresses (currently missing)
drop policy if exists "Users can update own addresses" on public.addresses;
create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own addresses" on public.addresses;
create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- Ensure new addresses get proper user_id
drop policy if exists "Users can create own addresses" on public.addresses;
create policy "Users can create own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

-- Function to automatically manage default addresses
create or replace function public.handle_address_default()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If new address is set as default, unset any existing default for the same user
  if new.is_default = true and new.user_id is not null then
    update public.addresses
    set is_default = false
    where user_id = new.user_id
      and id != new.id
      and is_default = true;
  end if;
  return new;
end;
$$;

create trigger addresses_before_insert_or_update
  before insert or update on public.addresses
  for each row
  execute function public.handle_address_default();

-- Comment
comment on column public.addresses.is_default is 'Whether this is the user''s default shipping address';
