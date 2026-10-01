import { useState, useEffect } from 'react';
import { logoAlhanif } from '../assets/images/index.js';


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
  kepalaSekolah: [
    { jabatan: 'Kepala Madrasah Tsanawiyah', badge: 'MTs', badgeColor: '#145A32', nama: 'Ust. Hasan Bisri, M.Pd.', pendidikan: 'S2 Manajemen Pendidikan', foto: null },
    { jabatan: 'Kepala Madrasah Aliyah', badge: 'MA', badgeColor: '#145A32', nama: 'Ust. Muhyiddin Syah, M.Ag.', pendidikan: 'S2 Pendidikan Islam', foto: null },
  ],
  waka: [
    { jabatan: 'Waka Kurikulum', nama: 'Ust. Syaifuddin Ali, S.Pd.', pendidikan: 'S1 Pendidikan', foto: null },
    { jabatan: 'Waka Kesiswaan', nama: 'Ust. Fadhil Rahman, S.Pd.', pendidikan: 'S1 Pendidikan Islam', foto: null },
    { jabatan: 'Waka Sarpras', nama: 'Ust. Irfan Maulana, S.T.', pendidikan: 'S1 Teknik Sipil', foto: null },
  ],
  waliKelas: [
    { jabatan: 'Wali Kelas VII A', nama: 'Ust. Zainuddin, S.Pd.', foto: null },
    { jabatan: 'Wali Kelas VII B', nama: 'Ust. Hamdan Haris, S.Pd.', foto: null },
    { jabatan: 'Wali Kelas VIII A', nama: 'Ust. Miftahul Huda, S.Ag.', foto: null },
    { jabatan: 'Wali Kelas VIII B', nama: 'Ust. Badruddin, S.Pd.', foto: null },
    { jabatan: 'Wali Kelas IX A', nama: 'Ust. Saifullah, S.Pd.', foto: null },
    { jabatan: 'Wali Kelas IX B', nama: 'Ust. Khairul Anwar, S.Pd.I.', foto: null },
  ],
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

function AvatarIcon({ ring, size = 80 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      border: `3px solid ${ring || '#145A32'}`,
      boxShadow: `0 0 0 3px ${ring ? ring + '25' : 'rgba(20,90,50,0.15)'}`,
      background: 'linear-gradient(135deg, #145A32 0%, #1a7040 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
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
        {foto
          ? <img src={foto} alt={nama} style={{ width: imgSize, height: imgSize, borderRadius: '50%', objectFit: 'cover', border: `3px solid ${ring || '#145A32'}` }} />
          : <AvatarIcon ring={ring} size={imgSize} />
        }
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
  };
  const s = styles[color] || styles.soft;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        padding: '9px 20px 9px 14px', borderRadius: '999px',
        background: s.bg, color: s.fg,
        boxShadow: color === 'primary' ? '0 4px 16px rgba(20,90,50,0.3)' : '0 2px 8px rgba(0,0,0,0.08)',
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

export default function StrukturOrganisasi({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Navbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(249,249,255,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--color-outline-variant)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 clamp(16px,3vw,32px)', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => onNavigate('beranda')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <img src={logoAlhanif} alt="Logo" style={{ width: '34px', height: '34px', borderRadius: '8px', objectFit: 'cover' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.1 }}>Al-Hanif</div>
              {!isMobile && <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pondok Pesantren Yatim</div>}
            </div>
          </button>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '14px' : '16px', fontWeight: '700', color: 'var(--color-primary)' }}>Struktur Organisasi</span>
          <button onClick={() => onNavigate('beranda')} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '7px 12px', borderRadius: '10px', background: 'var(--color-surface-container)', border: '1.5px solid var(--color-outline-variant)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: 'var(--color-on-surface)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>arrow_back</span>
            {!isMobile && 'Kembali'}
          </button>
        </div>
      </header>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0a2418 0%, #145A32 55%, #1c7040 100%)', padding: isMobile ? '32px 20px' : '52px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(212,175,55,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 14px', borderRadius: '999px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', marginBottom: '14px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px', color: '#D4AF37' }}>account_tree</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tahun Ajaran 2025/2026</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '24px' : '38px', fontWeight: '700', color: '#fff', marginBottom: '10px', lineHeight: 1.25 }}>Struktur Organisasi Pesantren</h1>
          <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'rgba(255,255,255,0.72)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            Susunan pengurus dan tenaga pendidik yang berdedikasi membentuk generasi qur'ani terbaik.
          </p>
        </div>
      </div>

      {/* Org Chart Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: isMobile ? '28px 16px 60px' : '48px 32px 80px' }}>

        {/* === PENGASUH === */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SectionBadge icon="mosque" title="Pengasuh / Mudir Ma'had" color="gold" />
          <div style={{ maxWidth: '260px', width: '100%' }}>
            <PersonCard {...STRUKTUR.pengasuh} size="lg" />
          </div>
          <Connector />

          {/* === SEKRETARIS & BENDAHARA === */}
          <SectionBadge icon="groups" title="Sekretaris & Bendahara" subtitle="Administrasi & Keuangan" color="primary" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 220px)', gap: isMobile ? '10px' : '24px', justifyContent: 'center' }}>
            {STRUKTUR.sekretariat.map((p, i) => <PersonCard key={i} {...p} size="md" />)}
          </div>
          <Connector />

          {/* === KEPALA SEKOLAH === */}
          <SectionBadge icon="school" title="Kepala Sekolah" subtitle="Madrasah Tsanawiyah & Aliyah" color="primary" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 220px)', gap: isMobile ? '10px' : '24px', justifyContent: 'center' }}>
            {STRUKTUR.kepalaSekolah.map((p, i) => <PersonCard key={i} {...p} size="md" />)}
          </div>
          <Connector />

          {/* === WAKA === */}
          <SectionBadge icon="manage_accounts" title="Wakil Kepala Sekolah" subtitle="Kurikulum · Kesiswaan · Sarpras" color="light" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 180px)', gap: isMobile ? '8px' : '16px', justifyContent: 'center', width: '100%' }}>
            {STRUKTUR.waka.map((p, i) => <PersonCard key={i} {...p} size="sm" />)}
          </div>
          <Connector />

          {/* === WALI KELAS === */}
          <SectionBadge icon="class" title="Wali Kelas" subtitle="MTs Kelas VII, VIII, IX" color="soft" />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: isMobile ? '8px' : '14px', width: '100%' }}>
            {STRUKTUR.waliKelas.map((p, i) => <PersonCard key={i} {...p} size="sm" />)}
          </div>
          <Connector />

          {/* === ASATIDZ === */}
          <SectionBadge icon="auto_stories" title="Asatidz / Tenaga Pendidik" subtitle={`${STRUKTUR.asatidz.length} Pengajar Aktif`} color="soft" />
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
    </div>
  );
}
