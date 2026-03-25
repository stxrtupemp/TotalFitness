-- ============================================================
-- TotalFitness — Fix FK profiles ↔ subscriptions + PGRST200
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Eliminar FK existente si apunta a tabla incorrecta (users)
alter table public.subscriptions
  drop constraint if exists subscriptions_user_id_fkey;

-- 2. Crear FK correcta → profiles.id
alter table public.subscriptions
  add constraint subscriptions_user_id_fkey
  foreign key (user_id)
  references public.profiles(id)
  on delete cascade;

-- 3. Verificar que el índice existe
create index if not exists subscriptions_user_id_idx
  on public.subscriptions(user_id);

-- 4. Confirmar relación (debe devolver 1 fila)
select
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name  as foreign_table,
  ccu.column_name as foreign_column
from information_schema.table_constraints    tc
join information_schema.key_column_usage     kcu  on tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu on tc.constraint_name = ccu.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_name = 'subscriptions'
  and kcu.column_name = 'user_id';
