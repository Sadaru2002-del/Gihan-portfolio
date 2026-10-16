import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';
const storageBucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'portfolio';

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project') &&
    supabaseAnonKey.length > 20
  );
};

// Intelligent fetch wrapper:
// - Storage operations (image uploads): native fetch with NO timeout so large files upload smoothly.
// - Database queries: 15s timeout safeguard (prevents infinite hanging while allowing normal network latency).
const customFetch = (input, init = {}) => {
  const urlStr = typeof input === 'string' ? input : (input?.url || '');
  const isStorage = urlStr.includes('/storage/v1/');

  if (isStorage) {
    return fetch(input, init);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new DOMException('Database request timed out after 15s', 'AbortError'));
  }, 15000);

  return fetch(input, {
    ...init,
    signal: init?.signal || controller.signal
  }).finally(() => clearTimeout(timeoutId));
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      global: { fetch: customFetch }
    })
  : createClient(
      supabaseUrl || 'https://placeholder.supabase.co',
      supabaseAnonKey || 'placeholder-anon-key'
    );

export const supabaseAdmin = isSupabaseConfigured() && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      global: { fetch: customFetch },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storageKey: 'sb-admin-auth-token'
      }
    })
  : supabase;

/**
 * Upload a file to Supabase Storage
 * @param {File} file - The file to upload
 * @param {string} folder - Destination folder inside bucket (e.g. 'projects', 'certificates', 'blogs')
 * @param {string} bucket - The Supabase storage bucket name
 * @returns {Promise<{ publicUrl: string, path: string }>}
 */
export const uploadToSupabaseStorage = async (file, folder = 'uploads', bucket = storageBucket) => {
  if (!isSupabaseConfigured()) {
    // If Supabase is not configured yet, generate a local blob URL for instant preview & testing
    console.warn('⚠️ Supabase credentials not found. Using local Object URL fallback for file upload preview.');
    const previewUrl = URL.createObjectURL(file);
    return {
      publicUrl: previewUrl,
      path: `local/${file.name}`,
      isLocal: true,
      message: 'Preview mode. Add Supabase keys to .env for cloud storage.'
    };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const client = (serviceRoleKey && supabaseAdmin) ? supabaseAdmin : (supabaseAdmin || supabase);
    const { data, error } = await client.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || 'application/octet-stream'
      });

    if (error) {
      throw error;
    }

    const { data: publicData } = client.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      publicUrl: publicData.publicUrl,
      path: data.path,
      isLocal: false
    };
  } catch (error) {
    console.error('❌ Supabase storage upload error:', error);
    throw new Error(error.message || 'Failed to upload file to Supabase Storage', { cause: error });
  }
};

/**
 * Delete a file from Supabase Storage (supports relative path or full Supabase public URL)
 */
export const deleteFromSupabaseStorage = async (filePathOrUrl, bucket = storageBucket) => {
  if (!isSupabaseConfigured() || !filePathOrUrl || filePathOrUrl.startsWith('blob:')) {
    return { success: true };
  }

  try {
    let cleanPath = filePathOrUrl;
    // If a full Supabase URL was passed
    if (filePathOrUrl.includes(`/storage/v1/object/public/${bucket}/`)) {
      cleanPath = filePathOrUrl.split(`/storage/v1/object/public/${bucket}/`)[1];
    } else if (filePathOrUrl.includes('/storage/v1/object/public/')) {
      const parts = filePathOrUrl.split('/storage/v1/object/public/')[1].split('/');
      parts.shift(); // remove bucket name
      cleanPath = parts.join('/');
    } else if (filePathOrUrl.startsWith('http://') || filePathOrUrl.startsWith('https://')) {
      // External image from Unsplash, Imgur, etc.
      return { success: true };
    }

    const client = (serviceRoleKey && supabaseAdmin) ? supabaseAdmin : (supabaseAdmin || supabase);
    const { error } = await client.storage.from(bucket).remove([cleanPath]);
    if (error) {
      console.warn('Supabase storage remove notice:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, path: cleanPath };
  } catch (error) {
    console.error('❌ Supabase storage delete error:', error);
    return { success: false, error: error.message };
  }
};
