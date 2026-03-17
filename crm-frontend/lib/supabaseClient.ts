import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://dxicauquyfgqbneqyhqg.supabase.co'
const supabaseKey = 'sb_publishable_UX1-Xz09O4IRibsP43rbBg_y9VqFBlZ'

export const supabase = createClient(supabaseUrl, supabaseKey)