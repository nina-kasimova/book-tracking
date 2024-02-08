import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


const supabaseUrl = process.env.NEXT_DB_URL
const supabaseKey = process.env.NEXT_DB_KEY
//export const supabase = createClient(supabaseUrl, supabaseKey)
export const supabase = createClientComponentClient();
