import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Auth ──────────────────────────────────────────────────────────────────────

export const signUp = async (email, password) => {
  // El trigger handle_new_user() crea el perfil automáticamente
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      subscriptions (*)
    `);

  if (error) throw error;

  // Supabase devuelve subscriptions como objeto (no array) por la relación 1-a-1
  // Lo normalizamos a array para que Admin.jsx funcione con ?.[0]
  return data.map(user => ({
    ...user,
    subscriptions: user.subscriptions
      ? [user.subscriptions]   // objeto → array de un elemento
      : [],                    // null → array vacío
  }));
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const getSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}

export const createSubscription = async (userId, plan) => {
  const start = new Date()
  const end   = new Date()
  end.setMonth(end.getMonth() + (plan === 'annual' ? 12 : 1))

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert({
      user_id:    userId,
      status:     'active',
      plan,
      start_date: start.toISOString(),
      end_date:   end.toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export const cancelSubscription = async (userId) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({ status: 'inactive' })
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ─── Site Config ──────────────────────────────────────────────────────────────
/*
  Required Supabase table (run once in SQL editor):

  create table if not exists site_config (
    key   text primary key,
    value text not null default ''
  );
  alter table site_config enable row level security;
  create policy "public read"  on site_config for select using (true);
  create policy "admin write"  on site_config for all
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

  -- Seed default values:
  insert into site_config (key, value) values
    ('section_promos',       'true'),
    ('section_features',     'true'),
    ('section_pricing',      'true'),
    ('section_classes',      'true'),
    ('section_testimonials', 'true'),
    ('section_cta',          'true'),
    ('section_map',          'true'),
    ('hero_eyebrow',         'El gimnasio que te transforma'),
    ('hero_title',           'ENTRENA.\nSUPÉRATE.\nSIN LÍMITES.'),
    ('hero_desc',            'Instalaciones premium, entrenadores de élite y tecnología de punta. Tu mejor versión comienza hoy.'),
    ('cta_title',            '¿Listo para empezar?'),
    ('cta_subtitle',         'Únete hoy y transforma tu cuerpo y tu mente. Sin excusas.')
  on conflict (key) do nothing;
*/

export const getSiteConfig = async () => {
  const { data, error } = await supabase.from('site_config').select('key, value')
  if (error) throw error
  return Object.fromEntries(data.map(r => [r.key, r.value]))
}

export const setSiteConfig = async (key, value) => {
  const { error } = await supabase
    .from('site_config')
    .upsert({ key, value }, { onConflict: 'key' })
  if (error) throw error
}

export const setSiteConfigBatch = async (entries) => {
  const rows = Object.entries(entries).map(([key, value]) => ({ key, value: String(value) }))
  const { error } = await supabase
    .from('site_config')
    .upsert(rows, { onConflict: 'key' })
  if (error) throw error
}

// ─── Password Reset ────────────────────────────────────────────────────────────

export const resetPasswordForEmail = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}

export const updatePassword = async (newPassword) => {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

export const updateSubscriptionAdmin = async (userId, updates) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}
