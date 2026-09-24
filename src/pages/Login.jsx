import { useState } from 'react';
import supabase from '../lib/supabase';

/* ── Role definitions ── */
const ROLES = [
  {
    id: 'admin',
    label: 'Admin / Pengurus',
    icon: 'admin_panel_settings',
    color: 'var(--color-primary)',
    bg: 'rgba(0,65,32,0.08)',
    border: 'var(--color-primary)',
    description: 'Akses penuh data pesantren',
    placeholder: 'Email admin',
  },
  {
    id: 'ustadz',
    label: 'Ustadz / Ustadzah',
    icon: 'menu_book',
    color: '#7B3F00',
    bg: 'rgba(123,63,0,0.08)',
    border: '#7B3F00',
    description: 'Kelola presensi & setoran tahfidz',
    placeholder: 'Email ustadz',
  },
  {
    id: 'wali',
    label: 'Wali Santri',
    icon: 'family_restroom',
    color: 'var(--color-secondary)',
    bg: 'rgba(27,109,36,0.08)',
    border: 'var(--color-secondary)',
    description: 'Pantau perkembangan putra/putri',
    placeholder: 'Nomor HP / Email wali',
  },
];

const FEATURES = {
  admin: [
    { icon: 'people', text: 'Kelola data seluruh santri' },
    { icon: 'how_to_reg', text: 'Verifikasi pendaftaran masuk' },
    { icon: 'payments', text: 'Rekap keuangan pesantren' },
    { icon: 'bar_chart', text: 'Laporan & statistik lengkap' },
  ],
  ustadz: [
    { icon: 'fact_check', text: 'Input presensi harian santri' },
    { icon: 'menu_book', text: 'Catat setoran hafalan' },
    { icon: 'grade', text: 'Input nilai & penilaian' },
    { icon: 'people', text: 'Lihat data binaan' },
  ],
  wali: [
    { icon: 'visibility', text: 'Pantau presensi & kehadiran' },
    { icon: 'menu_book', text: 'Progres hafalan real-time' },
    { icon: 'assignment', text: 'Laporan perkembangan bulanan' },
    { icon: 'chat', text: 'Komunikasi dengan ustadz' },
  ],
};

export default function Login({ onNavigate, onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const role = ROLES.find(r => r.id === selectedRole);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || (!forgotMode && !password)) return;

    setLoading(true);
    setError('');

    if (forgotMode) {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (err) {
        setError(err.message);
      } else {
        setForgotSent(true);
      }
      return;
    }

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError('Email atau password salah. Periksa kembali dan coba lagi.');
      } else if (err.message.includes('Email not confirmed')) {
        setError('Email belum diverifikasi. Cek inbox email kamu.');
      } else {
        setError(err.message);
      }
      return;
    }

    // Store role in session/localStorage
    localStorage.setItem('alhanif_role', selectedRole);
    if (onLoginSuccess) onLoginSuccess(selectedRole, data.user);
    else onNavigate('dashboard');
  };

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '12px',
    border: '1.5px solid var(--color-outline-variant)',
    background: 'var(--color-surface-container-lowest)',
    fontSize: '14px',
    color: 'var(--color-on-surface)',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0a2e1a 0%, #1a4d2e 40%, #0d3320 100%)',
      display: 'flex',
      alignItems: 'stretch',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-120px', right: '-120px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(212,175,55,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(173,242,189,0.04)', pointerEvents: 'none' }} />

      {/* ── Left Panel ── */}
      <div style={{
        flex: '0 0 420px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo */}
        <div>
          <button
            onClick={() => onNavigate('beranda')}
            style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: '48px' }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#D4AF37' }}>mosque</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: '#fff', lineHeight: 1.1 }}>Al-Hanif</div>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pondok Pesantren Yatim</div>
            </div>
          </button>

          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '12px' }}>
              Portal Sistem Informasi
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.7' }}>
              Masuk sesuai peran Anda untuk mengakses sistem manajemen pesantren Al-Hanif.
            </p>
          </div>

          {/* Features for selected role */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
              Fitur {role.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FEATURES[selectedRole].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#D4AF37', flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom info */}
        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', lineHeight: '1.6' }}>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
            Data terenkripsi & dijaga keamanannya
          </div>
          © 2025 Pesantren Yatim Al-Hanif. All rights reserved.
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 40px',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'rgba(255,255,255,0.97)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}>

          {/* Role selector tabs */}
          <div style={{ display: 'flex', background: 'var(--color-surface-container-low)', padding: '6px', gap: '4px' }}>
            {ROLES.map(r => (
              <button
                key={r.id}
                onClick={() => { setSelectedRole(r.id); setError(''); setForgotMode(false); setForgotSent(false); }}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '10px',
                  border: 'none',
                  background: selectedRole === r.id ? '#fff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: selectedRole === r.id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: selectedRole === r.id ? r.color : 'var(--color-on-surface-variant)' }}>
                  {r.icon}
                </span>
                <span style={{ fontSize: '10px', fontWeight: '700', color: selectedRole === r.id ? r.color : 'var(--color-on-surface-variant)', lineHeight: 1.2, textAlign: 'center' }}>
                  {r.id === 'admin' ? 'Admin' : r.id === 'ustadz' ? 'Ustadz' : 'Wali'}
                </span>
              </button>
            ))}
          </div>

          {/* Form content */}
          <div style={{ padding: '32px' }}>

            {/* Role badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: role.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '22px', color: role.color }}>{role.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-on-surface)', fontFamily: 'var(--font-serif)' }}>
                  {forgotMode ? 'Reset Password' : 'Masuk sebagai'}
                </div>
                <div style={{ fontSize: '13px', color: role.color, fontWeight: '600' }}>
                  {forgotMode ? 'Kirim link reset ke email' : role.label}
                </div>
              </div>
            </div>

            {/* Forgot success */}
            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(27,109,36,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--color-secondary)' }}>mark_email_read</span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--color-on-surface)', marginBottom: '8px' }}>Email Terkirim!</div>
                <div style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6', marginBottom: '24px' }}>
                  Link reset password dikirim ke <strong>{email}</strong>. Cek inbox atau folder spam kamu.
                </div>
                <button onClick={() => { setForgotMode(false); setForgotSent(false); }} style={{ width: '100%', padding: '13px', borderRadius: '12px', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}>
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Email field */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>
                    {selectedRole === 'wali' ? 'Nomor HP / Email' : 'Email'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--color-on-surface-variant)' }}>
                      {selectedRole === 'wali' ? 'phone' : 'email'}
                    </span>
                    <input
                      id="login-email"
                      type={selectedRole === 'wali' ? 'text' : 'email'}
                      placeholder={role.placeholder}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                      style={{ ...inputStyle, paddingLeft: '44px' }}
                      onFocus={e => { e.target.style.borderColor = role.color; e.target.style.boxShadow = `0 0 0 3px ${role.bg}`; }}
                      onBlur={e => { e.target.style.borderColor = 'var(--color-outline-variant)'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Password field — hidden in forgot mode */}
                {!forgotMode && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>Password</label>
                      <button
                        type="button"
                        onClick={() => { setForgotMode(true); setError(''); }}
                        style={{ fontSize: '12px', color: role.color, background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: 0 }}
                      >
                        Lupa password?
                      </button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--color-on-surface-variant)' }}>lock</span>
                      <input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        style={{ ...inputStyle, paddingLeft: '44px', paddingRight: '48px' }}
                        onFocus={e => { e.target.style.borderColor = role.color; e.target.style.boxShadow = `0 0 0 3px ${role.bg}`; }}
                        onBlur={e => { e.target.style.borderColor = 'var(--color-outline-variant)'; e.target.style.boxShadow = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-surface-variant)', display: 'flex', alignItems: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div style={{ padding: '10px 14px', borderRadius: '10px', background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: 'var(--color-error)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>error</span>
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    background: loading ? 'var(--color-surface-container)' : role.color,
                    color: loading ? 'var(--color-on-surface-variant)' : '#fff',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s',
                    marginTop: '4px',
                  }}
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                      {forgotMode ? 'Mengirim...' : 'Masuk...'}
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                        {forgotMode ? 'send' : 'login'}
                      </span>
                      {forgotMode ? 'Kirim Link Reset' : `Masuk sebagai ${role.label}`}
                    </>
                  )}
                </button>

                {forgotMode && (
                  <button
                    type="button"
                    onClick={() => { setForgotMode(false); setError(''); }}
                    style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                  >
                    Kembali ke Login
                  </button>
                )}
              </form>
            )}

            {/* Demo info for development */}
            <div style={{ marginTop: '20px', padding: '12px 14px', borderRadius: '10px', background: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                Akun dibuat via Supabase Auth
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', lineHeight: '1.5' }}>
                Hubungi admin pesantren untuk mendapatkan akun login. Belum ada akun? Daftarkan diri lewat halaman pendaftaran.
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '16px 32px', borderTop: '1px solid var(--color-outline-variant)', display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => onNavigate('beranda')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-on-surface-variant)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
