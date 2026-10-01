import { useState, useEffect } from 'react';
import { logoAlhanif } from '../assets/images/index.js';

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const STRUKTUR = {
  pengasuh: {
    jabatan: "Pengasuh / Mudir Ma'had",
    badge: 'Pimpinan Tertinggi',
    badgeColor: '#D4AF37',
    nama: 'KH. Abdullah Fattah, Lc., M.Ag.',
    pendidikan: 'Al-Azhar University, Cairo',
    foto: null,
    ring: '#D4AF37',
  },
  sekretariat: [
    { jabatan: 'Sekretaris Umum', nama: 'Ust. Ahmad Fauzan, S.Pd.', pendidikan: 'S1 Pendidikan Islam', foto: null },
    { jabatan: 'Bendahara Umum', nama: 'Ust. Ridwan Hakim, S.E.', pendidikan: 'S1 Ekonomi Syariah', foto: null },
  ],

  // ── Madrasah Tsanawiyah (MTs) ──
  mts: {
    kepala: { jabatan: 'Kepala Madrasah Tsanawiyah', badge: 'MTs', badgeColor: '#145A32', nama: 'Ust. Hasan Bisri, M.Pd.', pendidikan: 'S2 Manajemen Pendidikan', foto: null },
    waka: [
      { jabatan: 'Waka Kurikulum MTs', nama: 'Ust. Zainuddin, S.Pd.', pendidikan: 'S1 Pendidikan', foto: null },
      { jabatan: 'Waka Kesiswaan MTs', nama: 'Ust. Fadhil Rahman, S.Pd.', pendidikan: 'S1 Pendidikan Islam', foto: null },
      { jabatan: 'Waka Sarpras MTs', nama: 'Ust. Irfan Maulana, S.T.', pendidikan: 'S1 Teknik Sipil', foto: null },
    ],
    waliKelas: [
      { jabatan: 'Wali Kelas VII A', nama: 'Ust. Hamdan Haris, S.Pd.', foto: null },
      { jabatan: 'Wali Kelas VII B', nama: 'Ust. Miftahul Huda, S.Ag.', foto: null },
      { jabatan: 'Wali Kelas VIII A', nama: 'Ust. Badruddin, S.Pd.', foto: null },
      { jabatan: 'Wali Kelas VIII B', nama: 'Ust. Saifullah, S.Pd.', foto: null },
      { jabatan: 'Wali Kelas IX A', nama: 'Ust. Khairul Anwar, S.Pd.I.', foto: null },
      { jabatan: 'Wali Kelas IX B', nama: 'Ust. Mujahidin, S.Pd.', foto: null },
    ],
  },

  // ── Madrasah Aliyah (MA) ──
  ma: {
    kepala: { jabatan: 'Kepala Madrasah Aliyah', badge: 'MA', badgeColor: '#1a6b40', nama: 'Ust. Muhyiddin Syah, M.Ag.', pendidikan: 'S2 Pendidikan Islam', foto: null },
    waka: [
      { jabatan: 'Waka Kurikulum MA', nama: 'Ust. Syaifuddin Ali, S.Pd.', pendidikan: 'S1 Pendidikan', foto: null },
      { jabatan: 'Waka Kesiswaan MA', nama: 'Ust. Nurul Hasan, S.Ag.', pendidikan: 'S1 Pendidikan Agama', foto: null },
      { jabatan: 'Waka Sarpras MA', nama: 'Ust. Luqmanul Hakim, S.T.', pendidikan: 'S1 Teknik', foto: null },
    ],
    waliKelas: [
      { jabatan: 'Wali Kelas X A', nama: 'Ust. Khoirul Umam, S.Pd.', foto: null },
      { jabatan: 'Wali Kelas X B', nama: 'Ust. Izzuddin, M.Pd.', foto: null },
      { jabatan: 'Wali Kelas XI A', nama: 'Ust. Taufiqurrahman, S.Pd.', foto: null },
      { jabatan: 'Wali Kelas XI B', nama: 'Ust. Habibullah, Lc.', foto: null },
      { jabatan: 'Wali Kelas XII A', nama: 'Ust. Syamsuddin, S.Pd.I.', foto: null },
      { jabatan: 'Wali Kelas XII B', nama: 'Ust. Anwar Sadat, S.Pd.', foto: null },
    ],
  },

  asatidz: [
    { nama: 'Ust. Abdul Hafidz, Lc.', mapel: "Tahfidz Al-Qur'an", foto: null },
    { nama: 'Ust. Nurul Hasan, S.Ag.', mapel: 'Fiqh & Ushul Fiqh', foto: null },
    { nama: 'Ust. Khoirul Umam, S.Pd.', mapel: 'Bahasa Arab', foto: null },
    { nama: 'Ust. Izzuddin, M.Pd.', mapel: 'Nahwu & Shorof', foto: null },
    { nama: 'Ust. Taufiqurrahman, S.Pd.', mapel: 'Matematika & Sains', foto: null },
    { nama: 'Ust. Habibullah, Lc.', mapel: 'Hadits & Tafsir', foto: null },
    { nama: 'Ust. Syamsuddin, S.Pd.I.', mapel: 'Akidah Akhlak', foto: null },
    { nama: 'Ust. Anwar Sadat, S.Pd.', mapel: 'Bahasa Inggris', foto: null },
    { nama: 'Ust. Mujahidin, S.Pd.', mapel: 'IPA & Biologi', foto: null },
    { nama: 'Ust. Fathurrahman, S.Sos.', mapel: 'IPS & Sejarah Islam', foto: null },
    { nama: 'Ust. Ghazali Hasan, S.Pd.', mapel: 'PKn & Bahasa Indonesia', foto: null },
    { nama: 'Ust. Luqmanul Hakim, S.T.', mapel: 'TIK & Robotika', foto: null },
  ],
};

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════ */
function AvatarIcon({ ring, size = 80 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `3px solid ${ring || '#145A32'}`,
      boxShadow: `0 0 0 3px ${ring ? ring + '25' : 'rgba(20,90,50,0.15)'}`,
      background: 'linear-gradient(135deg, #145A32 0%, #1a7040 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <span className="material-symbols-outlined" style={{ fontSize: size * 0.45, color: 'rgba(255,255,255,0.9)' }}>person</span>
    </div>
  );
}

function PersonCard({ foto, nama, jabatan, pendidikan, badge, badgeColor, ring, size = 'md', mapel }) {
  const imgSize = size === 'lg' ? 100 : size === 'md' ? 80 : 64;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: size === 'lg' ? '24px 20px' : size === 'sm' ? '14px 12px' : '18px 14px',
      borderRadius: '20px',
      background: 'var(--color-surface-container-lowest)',
      boxShadow: size === 'lg' ? '0 8px 32px rgba(0,65,32,0.12), 0 0 0 1px rgba(212,175,55,0.3)' : '0 4px 16px rgba(0,0,0,0.06)',
      border: `1px solid ${ring ? ring + '40' : 'var(--color-outline-variant)'}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      position: 'relative', cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,65,32,0.15)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = size === 'lg' ? '0 8px 32px rgba(0,65,32,0.12), 0 0 0 1px rgba(212,175,55,0.3)' : '0 4px 16px rgba(0,0,0,0.06)'; }}
    >
      {badge && (
        <div style={{
          position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
          background: badgeColor || '#145A32', color: '#fff',
          fontSize: '10px', fontWeight: '700', padding: '2px 10px',
          borderRadius: '999px', whiteSpace: 'nowrap', letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>{badge}</div>
      )}
      <div style={{ marginBottom: '12px' }}>
        {foto ? <img src={foto} alt={nama} style={{ width: imgSize, height: imgSize, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ring || '#145A32'}` }} />
          : <AvatarIcon ring={ring} size={imgSize} />}
      </div>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: size === 'lg' ? '16px' : size === 'sm' ? '12px' : '13px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px', lineHeight: 1.3 }}>{nama}</div>
      <div style={{ fontSize: size === 'lg' ? '12px' : '10px', fontWeight: '600', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{jabatan}</div>
      {(pendidikan || mapel) && <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', lineHeight: 1.4 }}>{pendidikan || mapel}</div>}
    </div>
  );
}

function Connector() {
  return <div style={{ width: '2px', height: '28px', background: 'linear-gradient(to bottom, #145A32, rgba(20,90,50,0.15))', alignSelf: 'center' }} />;
}

function SectionBadge({ icon, title, subtitle, color }) {
  const styles = {
    primary: { bg: '#145A32', fg: '#fff' },
    gold: { bg: '#D4AF37', fg: '#fff' },
    light: { bg: 'var(--color-primary-container)', fg: 'var(--color-primary)' },
    soft: { bg: 'var(--color-secondary-container)', fg: 'var(--color-on-secondary-container)' },
    mts: { bg: '#145A32', fg: '#fff' },
    ma: { bg: '#1a6b40', fg: '#fff' },
  };
  const s = styles[color] || styles.soft;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '9px 20px 9px 14px', borderRadius: '999px',
        background: s.bg, color: s.fg,
        boxShadow: (color === 'primary' || color === 'mts' || color === 'ma') ? '0 4px 16px rgba(20,90,50,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
        <div>
          <div style={{ fontSize: '13px', fontWeight: '700' }}>{title}</div>
          {subtitle && <div style={{ fontSize: '10px', opacity: 0.8 }}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );
}

/* Branch column — satu jalur MTs atau MA */
function SchoolBranch({ school, branchColor, isMobile }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      flex: 1, minWidth: 0,
      padding: '20px 16px',
      borderRadius: '20px',
      background: `linear-gradient(180deg, ${branchColor}08 0%, transparent 100%)`,
      border: `1.5px solid ${branchColor}30`,
    }}>
      {/* Kepala Sekolah */}
      <SectionBadge
        icon="school"
        title={school.kepala.jabatan}
        subtitle={school.kepala.badge}
        color={school.kepala.badge === 'MTs' ? 'mts' : 'ma'}
      />
      <div style={{ maxWidth: '200px', width: '100%' }}>
        <PersonCard {...school.kepala} size="md" />
      </div>
      <Connector />

      {/* Waka */}
      <SectionBadge icon="manage_accounts" title="Wakil Kepala Sekolah" subtitle={`${school.kepala.badge}`} color="light" />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', width: '100%' }}>
        {school.waka.map((p, i) => <PersonCard key={i} {...p} size="sm" />)}
      </div>
      <Connector />

      {/* Wali Kelas */}
      <SectionBadge icon="class" title="Wali Kelas" subtitle={`Kelas ${school.kepala.badge === 'MTs' ? 'VII, VIII, IX' : 'X, XI, XII'}`} color="soft" />
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)', gap: '8px', width: '100%' }}>
        {school.waliKelas.map((p, i) => <PersonCard key={i} {...p} size="sm" />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function StrukturOrganisasi({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ════ HEADER — Stitch style ════ */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(249,249,255,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-outline-variant)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        {/* Top bar */}
        <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '5px clamp(16px,3vw,48px)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#D4AF37' }}>call</span>
              +62 812-3456-7890
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '999px', fontWeight: '600', fontSize: '11px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37', flexShrink: 0 }} />
              Tahun Ajaran 2025/2026
            </div>
          </div>
        </div>
        {/* Nav */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px,3vw,48px)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <button onClick={() => onNavigate('beranda')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <img src={logoAlhanif} alt="Logo Al-Hanif" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--color-secondary-container)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '15px' : '20px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.1 }}>Al-Hanif</div>
              {!isMobile && <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pondok Pesantren Yatim</div>}
            </div>
          </button>
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '20px', flex: 1, justifyContent: 'center' }}>
              {[{ label: 'Beranda', page: 'beranda', active: false }, { label: 'Struktur Organisasi', page: null, active: true }, { label: 'Berita', page: null, active: false }, { label: 'Pendaftaran (PSB)', page: 'pendaftaran', active: false }, { label: 'Kontak & Donasi', page: null, active: false }].map(({ label, page, active }) => (
                <a key={label} href="#" onClick={e => { e.preventDefault(); if (page) onNavigate(page); }}
                  style={{ fontSize: '13px', fontWeight: active ? '700' : '500', color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)', textDecoration: 'none', whiteSpace: 'nowrap', borderBottom: active ? '2px solid #D4AF37' : '2px solid transparent', paddingBottom: '2px', transition: 'color 0.15s' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-on-surface-variant)'; }}
                >{label}</a>
              ))}
            </nav>
          )}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate('pendaftaran'); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: isMobile ? '7px 12px' : '9px 18px', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff', fontWeight: '700', fontSize: isMobile ? '12px' : '13px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(20,90,50,0.25)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>how_to_reg</span>
              {isMobile ? 'PMB' : 'PMB Online'}
            </a>
            <button onClick={() => onNavigate('login')}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: isMobile ? '7px 10px' : '9px 16px', borderRadius: '10px', background: 'var(--color-surface-container)', border: '1.5px solid var(--color-outline-variant)', cursor: 'pointer', fontWeight: '600', fontSize: isMobile ? '12px' : '13px', color: 'var(--color-on-surface)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
              {!isMobile && 'Portal Santri'}
            </button>
          </div>
        </div>
        {/* Breadcrumb */}
        <div style={{ background: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)', padding: '8px clamp(16px,3vw,48px)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-on-surface-variant)', flexWrap: 'wrap' }}>
            <button onClick={() => onNavigate('beranda')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: '600', fontSize: '12px', padding: 0 }}>Beranda</button>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span>Profil &amp; Lembaga</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span style={{ fontWeight: '600', color: 'var(--color-on-surface)' }}>Struktur Organisasi</span>
          </div>
        </div>
      </header>

      {/* ════ HERO ════ */}
      <div style={{ background: 'linear-gradient(135deg, #0a2418 0%, #145A32 55%, #1c7040 100%)', padding: isMobile ? '32px 20px' : '52px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(212,175,55,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', marginBottom: '14px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#D4AF37' }}>account_tree</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tata Kelola Kepemimpinan</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '24px' : '40px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Struktur Organisasi &amp;<br />Dewan Kepengurusan
          </h1>
          <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'rgba(255,255,255,0.72)', maxWidth: '520px', margin: '0 auto 24px', lineHeight: 1.75 }}>
            Susunan pengurus dan tenaga pendidik yang berdedikasi membentuk generasi qur'ani terbaik.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '12px', background: '#D4AF37', color: '#1a2e00', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>school</span>
              Bagian Akademik
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: '700', fontSize: '14px', border: '1.5px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
              Hubungi Pengasuh
            </button>
          </div>
        </div>
      </div>

      {/* ════ ORG CHART ════ */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '28px 16px 60px' : '48px 32px 80px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* PENGASUH */}
          <SectionBadge icon="mosque" title="Pengasuh / Mudir Ma'had" color="gold" />
          <div style={{ maxWidth: '260px', width: '100%' }}>
            <PersonCard {...STRUKTUR.pengasuh} size="lg" />
          </div>
          <Connector />

          {/* SEKRETARIAT */}
          <SectionBadge icon="groups" title="Sekretaris & Bendahara" subtitle="Administrasi & Keuangan" color="primary" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 220px)', gap: isMobile ? '10px' : '24px', justifyContent: 'center' }}>
            {STRUKTUR.sekretariat.map((p, i) => <PersonCard key={i} {...p} size="md" />)}
          </div>
          <Connector />

          {/* DIVIDER label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '24px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 14px', borderRadius: '999px', background: '#145A32', color: '#fff', fontSize: '12px', fontWeight: '700' }}>MTs</span>
              <span style={{ padding: '4px 14px', borderRadius: '999px', background: '#1a6b40', color: '#fff', fontSize: '12px', fontWeight: '700' }}>MA</span>
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
          </div>

          {/* DUA BRANCH: MTs dan MA */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '24px' : '20px',
            width: '100%',
          }}>
            <SchoolBranch school={STRUKTUR.mts} branchColor="#145A32" isMobile={isMobile} />
            <SchoolBranch school={STRUKTUR.ma} branchColor="#1a6b40" isMobile={isMobile} />
          </div>

          <Connector />

          {/* ASATIDZ — dibagi */}
          <SectionBadge icon="auto_stories" title="Asatidz / Tenaga Pendidik" subtitle={`${STRUKTUR.asatidz.length} Pengajar Aktif — MTs & MA`} color="soft" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? '8px' : '14px', width: '100%' }}>
            {STRUKTUR.asatidz.map((p, i) => (
              <PersonCard key={i} nama={p.nama} jabatan={p.mapel} foto={p.foto} size="sm" />
            ))}
          </div>
        </div>

        {/* Info note */}
        <div style={{ marginTop: '40px', padding: '16px 20px', borderRadius: '14px', background: 'var(--color-primary-container)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>info</span>
          <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: 1.7, margin: 0 }}>
            Foto dan data struktur organisasi bersifat informatif. Untuk pembaruan atau koreksi, hubungi Sekretariat melalui WhatsApp: <strong>+62 812-3456-7890</strong>.
          </p>
        </div>
      </div>

      {/* ════ FOOTER ════ */}
      <footer style={{ background: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '40px 20px 28px' : '64px 48px 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '4fr 3fr 5fr', gap: isMobile ? '32px' : '48px', paddingBottom: isMobile ? '32px' : '48px', borderBottom: '1px solid var(--color-outline-variant)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src={logoAlhanif} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.1 }}>Pesantren Yatim Al-Hanif</div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Lembaga Pendidikan Islam</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: '1.7', marginBottom: '16px' }}>Membentuk generasi qur'ani yang berakhlak mulia, berwawasan global, dan berprestasi tinggi.</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 14px', borderRadius: '999px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid var(--color-outline-variant)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#D4AF37' }}>verified</span>
                <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)' }}>Terakreditasi B — BAN S/M</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Halaman</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[{ label: 'Beranda', page: 'beranda' }, { label: 'Struktur Organisasi', page: null }, { label: 'Pendaftaran Santri Baru', page: 'pendaftaran' }, { label: 'Portal Santri & Wali', page: 'login' }, { label: 'Kontak & Donasi', page: null }].map(({ label, page }) => (
                  <li key={label}><a href="#" onClick={e => { e.preventDefault(); if (page) onNavigate(page); }}
                    style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
                  ><span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Alamat &amp; Kontak</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                {[{ icon: 'location_on', text: 'Jl. Pesantren Luhur No. 45, Cisarua, Bogor, Jawa Barat 16750' }, { icon: 'chat', text: 'WhatsApp PMB: +62 812-3456-7890' }, { icon: 'call', text: 'Telp: (0251) 8251234' }, { icon: 'mail', text: 'info@pesantren-alhanif.id' }].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '17px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                    <span style={{ lineHeight: 1.6 }}>{c.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {['play_circle', 'photo_camera', 'public', 'smart_display'].map((icon, i) => (
                  <a key={i} href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', border: '1px solid var(--color-outline-variant)', transition: 'all 0.15s', textDecoration: 'none', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  ><span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span></a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ paddingTop: '24px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
            <span>© 2025 Pondok Pesantren Yatim Al-Hanif. Dilindungi Undang-Undang.</span>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Brosur Digital'].map(link => (
                <a key={link} href="#" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-on-surface)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
                >{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
