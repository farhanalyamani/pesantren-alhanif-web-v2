// Supabase Edge Function: create-user
// Digunakan oleh Admin untuk membuat akun asatidz & staf
// Deploy: supabase functions deploy create-user

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verifikasi bahwa yang memanggil adalah admin yang sudah login
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Buat Supabase client dengan service role (bisa create user)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verifikasi token user yang memanggil
    const { data: { user: caller }, error: authErr } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authErr || !caller) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { email, password, nama, jabatan, hp, sendInvite } = await req.json();

    if (!email || !nama) {
      return new Response(JSON.stringify({ error: 'Email dan nama wajib diisi.' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;

    if (sendInvite) {
      // Kirim magic link invite ke email asatidz
      result = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        data: { nama, jabatan, hp, role: 'staf' },
        redirectTo: `${Deno.env.get('SITE_URL') ?? 'https://pesantren-alhanif-web-v2.vercel.app'}/login`,
      });
    } else {
      // Buat akun langsung dengan password
      result = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { nama, jabatan, hp, role: 'staf' },
      });
    }

    if (result.error) {
      return new Response(JSON.stringify({ error: result.error.message }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      user: result.data.user,
      message: sendInvite
        ? `Undangan dikirim ke ${email}`
        : `Akun ${nama} berhasil dibuat`,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
