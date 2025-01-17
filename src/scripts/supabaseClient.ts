import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)






export async function getUserPost(user_id: string) {
  let { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .eq("user_id", user_id)
  return { posts, error }
}


export async function createPost(post_data: { title: string, content: string, tags: string, user_id: string, is_published: boolean }) {
  const { data, error } = await supabase
    .from('posts')
    .insert([post_data])
    .select()
  return { data, error }
}


export async function uploadImage(file: File, bucket_name: string, file_path: string) {
  const { data, error } = await supabase.storage.from(bucket_name).upload(file_path, file, {
    contentType: file.type,
  })
  return { data, error }
}


export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })
  return { data, error }
}

export async function signIn<AuthInfo>(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getRecentPosts(limit = 5) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data, error }
}

