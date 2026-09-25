import { useState } from 'react';
import supabase from '../lib/supabase';
import { logoAlhanif } from '../assets/images/index.js';

/* ── Stitch Design: Login Portal Santri & Wali ── */

const FEATURES = [
  {
    icon: 'menu_book',
    iconBg: 'rgba(212,175,55,0.2)',
    iconColor: '#D4AF37',
    title: "Pemantauan Tahfidz & Tasmi' 30 Juz",
    desc: 'Laporan setoran juz, kelancaran tajwid, dan riwayat mutaba\'ah harian.',
  },
  {
    icon: 'school',
    iconBg: 'rgba(255,255,255,0.1)',
    iconColor: '#fff',
    title: 'Rapor Diniyah & Madrasah Formal',
    desc: 'Transkrip akademik MTs & MA terintegrasi Kemenag secara berkala.',
  },
  {
    icon: 'favorite',
    iconBg: 'rgba(255,255,255,0.1)',
    iconColor: '#fff',
    title: 'Pembinaan Karakter & Kesehatan',
    desc: 'Pencatatan kedisiplinan asrama, adab, serta rekam medis santri.',
  },
];

const inputStyle = {
  width: '100%',
  padding: '13px 16px 13px 44px',
  borderRadius: '10px',
  border: '1.5px solid #E2E8F0',
  background: '#F8FAFC',
  fontSize: '14px',
  color: '#1E293B',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

export default function Login({ onNavigate, onLoginSuccess }) {
  const [role, setRole] = useState('wali'); // 'wali' | 'staf' | 'admin'
  const [nisn, setNisn]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [otpMode, setOtpMode]     = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Wali: NISN@portal.alhanif.local | Staf & Admin: email langsung
    const loginEmail = role === 'wali'
      ? `${nisn.trim()}@portal.alhanif.local`
      : email.trim();

    if (forgotMode) {
      const { error: err } = await supabase.auth.resetPasswordForEmail(loginEmail, {
        redirectTo: `${window.location.origin}/#reset-password`,
      });
      setLoading(false);
      if (err) setError('Gagal mengirim email reset. Pastikan akun terdaftar.');
      else setForgotSent(true);
      return;
    }

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    setLoading(false);

    if (err) {
      if (err.message.includes('Invalid login credentials')) {
        setError(role === 'wali'
          ? 'NISN/NIS atau kata sandi salah. Hubungi admin jika lupa.'
          : 'Email atau kata sandi salah.');
      } else {
        setError(err.message);
      }
      return;
    }

    localStorage.setItem('alhanif_role', role);
    if (onLoginSuccess) onLoginSuccess(role, data.user);
    else onNavigate(role === 'wali' ? 'portal-wali' : 'dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'grid', gridTemplateColumns: '420px 1fr',
      fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      background: '#F1F5F9',
    }}>

      {/* ══════════════════════════════════
          LEFT PANEL — dark green
      ══════════════════════════════════ */}
      <div style={{
        background: 'linear-gradient(160deg, #0d3320 0%, #145A32 60%, #1a5c3a 100%)',
        padding: '40px 36px',
        display: 'flex', flexDirection: 'column', gap: '0',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(212,175,55,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '120px', left: '-40px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <img
            src={logoAlhanif}
            alt="Logo Al-Hanif"
            style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)', background: '#fff' }}
          />
          <div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', fontWeight: '700', color: '#fff', lineHeight: 1.1 }}>Al-Hanif</div>
            <div style={{ fontSize: '10px', fontWeight: '600', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pondok Pesantren Yatim</div>
          </div>
        </div>

        {/* Gold badge */}
        <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '999px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', marginBottom: '28px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#D4AF37' }}>verified</span>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#D4AF37' }}>100% Khidmat Pendidikan Santri Yatim & Dhuafa</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '32px', fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '14px' }}>
          Portal Terpadu<br />Santri & Wali
        </h1>

        {/* Description */}
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: '1.7', marginBottom: '28px' }}>
          Akses informasi perkembangan hafalan Al-Qur'an 30 Juz, mutaba'ah ibadah harian, nilai madrasah, dan laporan kepengasuhan santri secara real-time.
        </p>

        {/* Features */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: 'auto' }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: f.iconBg, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: f.iconColor }}>{f.icon}</span>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff', marginBottom: '3px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: '1.5' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Hadith quote card */}
        <div style={{ marginTop: '28px', padding: '20px', borderRadius: '16px', background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.25)' }}>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '18px', color: '#D4AF37', lineHeight: '1.7', textAlign: 'center', marginBottom: '12px', direction: 'rtl' }}>
            « مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ »
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', lineHeight: '1.6', textAlign: 'center' }}>
            "Barangsiapa menempuh jalan mencari ilmu, niscaya Allah mudahkan jalannya menuju surga."
          </div>
          <div style={{ fontSize: '11px', fontWeight: '700', color: 'rgba(212,175,55,0.8)', textAlign: 'center', marginTop: '8px', letterSpacing: '0.05em' }}>
            — HR. MUSLIM NO. 2699
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════
          RIGHT PANEL — white form
      ══════════════════════════════════ */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        background: '#fff',
        overflow: 'auto',
      }}>
        {/* Top bar */}
        <div style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9' }}>
          <button
            onClick={() => onNavigate('beranda')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#475569', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
            Kembali ke Website Utama
          </button>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', padding: '4px 12px', borderRadius: '999px', background: '#F1F5F9' }}>
            T.A. 2024/2025 Genap
          </span>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div style={{ width: '100%', maxWidth: '480px' }}>

            {/* Role selector */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
                Pilih Hak Akses Masuk
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[
                  { id: 'wali',  label: 'Wali Santri',    icon: 'family_restroom' },
                  { id: 'staf',  label: 'Asatidz / Staf', icon: 'badge' },
                  { id: 'admin', label: 'Admin',           icon: 'admin_panel_settings' },
                ].map(r => (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setError(''); setForgotMode(false); setForgotSent(false); }}
                    style={{
                      padding: '14px 8px',
                      borderRadius: '12px',
                      border: role === r.id ? '2px solid #145A32' : '2px solid #E2E8F0',
                      background: role === r.id ? 'rgba(20,90,50,0.04)' : '#fff',
                      cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: role === r.id ? '#145A32' : '#94A3B8' }}>{r.icon}</span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: role === r.id ? '#145A32' : '#64748B', textAlign: 'center', lineHeight: 1.2 }}>{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Forgot sent */}
            {forgotSent ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(20,90,50,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#145A32' }}>mark_email_read</span>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>Email Terkirim!</div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
                  Link reset password dikirim ke email Anda. Cek inbox atau folder spam.
                </div>
                <button onClick={() => { setForgotMode(false); setForgotSent(false); }} style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#145A32', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                  Kembali ke Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleLogin}>
                {/* Heading */}
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '26px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
                    {forgotMode ? 'Reset Kata Sandi' : 'Masuk ke Akun Anda'}
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6' }}>
                    {forgotMode
                      ? 'Masukkan email untuk menerima link reset kata sandi.'
                      : role === 'wali'
                        ? 'Silakan masukkan NISN/Nomor Induk Santri putra/putri Anda dan kata sandi wali santri terdaftar.'
                        : role === 'admin'
                          ? 'Masukkan email dan kata sandi akun Administrator sistem.'
                          : 'Masukkan email dan kata sandi akun Asatidz/Staf Anda.'}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* NISN or Email field */}
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>
                      {role === 'wali' ? 'NISN / Nomor Induk Santri (NIS)' : 'Email'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94A3B8' }}>
                        {role === 'wali' ? 'pin' : 'email'}
                      </span>
                      {role === 'wali' ? (
                        <input
                          id="login-nisn"
                          type="text"
                          inputMode="numeric"
                          placeholder="Contoh: 3102948210 atau 202301045"
                          value={nisn}
                          onChange={e => setNisn(e.target.value)}
                          required
                          style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = '#145A32'; e.target.style.boxShadow = '0 0 0 3px rgba(20,90,50,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                        />
                      ) : (
                        <input
                          id="login-email"
                          type="email"
                          placeholder="email@pesantren-alhanif.id"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          required
                          autoComplete="username"
                          style={inputStyle}
                          onFocus={e => { e.target.style.borderColor = '#145A32'; e.target.style.boxShadow = '0 0 0 3px rgba(20,90,50,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  {!forgotMode && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>Kata Sandi</label>
                        <button type="button" onClick={() => { setForgotMode(true); setError(''); }} style={{ fontSize: '12px', color: '#145A32', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '600', padding: 0 }}>
                          Lupa Kata Sandi?
                        </button>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <span className="material-symbols-outlined" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94A3B8' }}>lock</span>
                        <input
                          id="login-password"
                          type={showPass ? 'text' : 'password'}
                          placeholder="Masukkan kata sandi akun"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          required
                          autoComplete="current-password"
                          style={{ ...inputStyle, paddingRight: '48px' }}
                          onFocus={e => { e.target.style.borderColor = '#145A32'; e.target.style.boxShadow = '0 0 0 3px rgba(20,90,50,0.1)'; }}
                          onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                        />
                        <button type="button" onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{showPass ? 'visibility_off' : 'visibility'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember me + SSL */}
                  {!forgotMode && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: '#145A32', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: '#475569' }}>Ingat saya di perangkat ini (30 hari)</span>
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#145A32' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                        256-bit SSL
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#DC2626' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', flexShrink: 0, marginTop: '1px' }}>error</span>
                      {error}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    id="btn-login-submit"
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%', padding: '15px',
                      borderRadius: '10px',
                      background: loading ? '#94A3B8' : '#145A32',
                      color: '#fff', border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '700', fontSize: '15px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      boxShadow: loading ? 'none' : '0 4px 16px rgba(20,90,50,0.3)',
                      transition: 'all 0.15s',
                      marginTop: '4px',
                    }}
                  >
                    {loading ? (
                      <><span className="material-symbols-outlined" style={{ fontSize: '20px', animation: 'spin 1s linear infinite' }}>progress_activity</span>Memproses...</>
                    ) : (
                      <>{forgotMode ? 'Kirim Link Reset' : 'Masuk ke Portal'}<span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{forgotMode ? 'send' : 'login'}</span></>
                    )}
                  </button>

                  {forgotMode && (
                    <button type="button" onClick={() => { setForgotMode(false); setError(''); }} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#F8FAFC', color: '#475569', border: '1.5px solid #E2E8F0', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
                      Kembali ke Login
                    </button>
                  )}

                  {/* OTP WhatsApp option */}
                  {!forgotMode && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '4px 0' }}>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>atau opsi cepat</span>
                        <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                      </div>
                      <button
                        type="button"
                        style={{
                          width: '100%', padding: '13px',
                          borderRadius: '10px', border: '1.5px solid #E2E8F0',
                          background: '#F8FAFC', cursor: 'pointer',
                          fontWeight: '600', fontSize: '14px', color: '#1E293B',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        }}
                        onClick={() => setOtpMode(true)}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#25D366' }}>chat</span>
                        Masuk Cepat via Kode OTP WhatsApp
                      </button>
                    </>
                  )}
                </div>
              </form>
            )}

            {/* Bottom info */}
            {!forgotSent && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Calon santri baru tahun ajaran 2025/2026?</span>
                  <button onClick={() => onNavigate('pendaftaran')} style={{ fontSize: '12px', fontWeight: '700', color: '#145A32', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Daftar Akun Baru (PSB)
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>open_in_new</span>
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#94A3B8' }}>headset_mic</span>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>Kendala login? Hubungi Helpdesk IT:</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#145A32' }}>+62 812-3456-7890 (WA Chat)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 40px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>© 2025 Yayasan Pondok Pesantren Yatim Al-Hanif Cisarua Bogor.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ fontSize: '11px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>Kebijakan Privasi</button>
            <button style={{ fontSize: '11px', color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer' }}>Panduan Sistem</button>
          </div>
        </div>
      </div>
    </div>
  );
}
