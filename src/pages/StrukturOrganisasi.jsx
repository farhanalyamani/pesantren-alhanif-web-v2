import { useState, useEffect } from 'react';
import { logoAlhanif } from '../assets/images/index.js';

/* ══════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════ */
const JABATAN_FILTERS = [
  'Semua Jabatan',
  'Pengurus Pesantren',
  'Sekretariat & Keuangan',
  'Madrasah Aliyah (MA)',
  'Madrasah Tsanawiyah (MTs)',
  'Dewan Asatidz & Guru',
];

const ANGGOTA = [
  // Pengurus Pesantren
  {
    id: 1, kategori: 'Pengurus Pesantren',
    jabatan: "Pengasuh & Pendiri",
    nama: "KH. Ahmad Jazuli",
    pendidikan: "Pengasuh Utama & Pimpinan Yayasan Pondok Pesantren Yatim Al-Hanif",
    quote: '"Mendidik anak yatim adalah amanah terbesar yang Allah titipkan kepada kita. Di sini, setiap santri adalah bagian dari keluarga besar yang saling menjaga dan mendukung satu sama lain."',
    mapel: '',
    featured: true,
    highlightColor: '#145A32',
  },
  {
    id: 2, kategori: 'Sekretariat & Keuangan',
    jabatan: "Sekretaris Umum",
    nama: "Ustadz H. Salman Al-Farisi, S.Pd.I.",
    pendidikan: "Sekretaris Umum & Notulensor Kegiatan Lembaga",
    mapel: '',
    featured: false,
  },
  {
    id: 3, kategori: 'Sekretariat & Keuangan',
    jabatan: "Bendahara Umum",
    nama: "Ustadz Hendra Saputra, S.E., M.M.",
    pendidikan: "Pengelola Keuangan Yayasan & Kordinator Program Donasi 100% untuk Santri Yatim",
    mapel: '',
    featured: false,
  },
  // Madrasah Aliyah
  {
    id: 4, kategori: 'Madrasah Aliyah (MA)',
    jabatan: "Kepala Madrasah Aliyah",
    nama: "Ustadz Muhyiddin Syah, M.Ag.",
    pendidikan: "S2 Pendidikan Islam — UIKA Bogor",
    mapel: '',
    featured: false,
  },
  {
    id: 5, kategori: 'Madrasah Aliyah (MA)',
    jabatan: "Waka Kurikulum MA",
    nama: "Ustadz Syaifuddin Ali, S.Pd.",
    pendidikan: "S1 Pendidikan — UPI Bandung",
    mapel: '',
    featured: false,
  },
  {
    id: 6, kategori: 'Madrasah Aliyah (MA)',
    jabatan: "Waka Kesiswaan MA",
    nama: "Ustadz Fadhil Rahman, S.Pd.",
    pendidikan: "S1 Pendidikan Islam",
    mapel: '',
    featured: false,
  },
  // Madrasah Tsanawiyah
  {
    id: 7, kategori: 'Madrasah Tsanawiyah (MTs)',
    jabatan: "Kepala Madrasah Tsanawiyah",
    nama: "Ustadz Hasan Bisri, M.Pd.",
    pendidikan: "S2 Manajemen Pendidikan — IPB",
    mapel: '',
    featured: false,
  },
  {
    id: 8, kategori: 'Madrasah Tsanawiyah (MTs)',
    jabatan: "Waka Kurikulum MTs",
    nama: "Ustadz Zainuddin Haris, S.Pd.",
    pendidikan: "S1 Pendidikan Agama Islam",
    mapel: '',
    featured: false,
  },
  {
    id: 9, kategori: 'Madrasah Tsanawiyah (MTs)',
    jabatan: "Waka Kesiswaan MTs",
    nama: "Ustadz Irfan Maulana, S.Pd.",
    pendidikan: "S1 Bimbingan Konseling",
    mapel: '',
    featured: false,
  },
  // Asatidz
  {
    id: 10, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Abdul Hafidz, Lc.",
    pendidikan: "Al-Azhar University",
    mapel: "Tahfidz Al-Qur'an",
    featured: false,
  },
  {
    id: 11, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Nurul Hasan, S.Ag.",
    pendidikan: "UIN Jakarta",
    mapel: "Fiqh & Ushul Fiqh",
    featured: false,
  },
  {
    id: 12, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Khoirul Umam, S.Pd.",
    pendidikan: "STAI Al-Hikmah",
    mapel: "Bahasa Arab",
    featured: false,
  },
  {
    id: 13, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Izzuddin, M.Pd.",
    pendidikan: "UIN Sunan Gunung Djati",
    mapel: "Nahwu & Shorof",
    featured: false,
  },
  {
    id: 14, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Taufiqurrahman, S.Pd.",
    pendidikan: "IPB University",
    mapel: "Matematika & Sains",
    featured: false,
  },
  {
    id: 15, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Habibullah, Lc.",
    pendidikan: "Universitas Madinah",
    mapel: "Hadits & Tafsir",
    featured: false,
  },
  {
    id: 16, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Syamsuddin, S.Pd.I.",
    pendidikan: "STAI Miftahul Ulum",
    mapel: "Akidah Akhlak",
    featured: false,
  },
  {
    id: 17, kategori: 'Dewan Asatidz & Guru',
    jabatan: "Asatidz / Pengajar",
    nama: "Ust. Anwar Sadat, S.Pd.",
    pendidikan: "IKIP PGRI",
    mapel: "Bahasa Inggris",
    featured: false,
  },
];

/* ══════════════════════════════════════════════════════
   AVATAR COMPONENT
══════════════════════════════════════════════════════ */
function Avatar({ size = 80, light = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: light
        ? 'rgba(255,255,255,0.15)'
        : 'linear-gradient(145deg, #e8f5ed 0%, #c8e6d4 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span className="material-symbols-outlined" style={{
        fontSize: size * 0.5,
        color: light ? 'rgba(255,255,255,0.7)' : '#145A32',
      }}>person</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FEATURED CARD (Pengasuh)
══════════════════════════════════════════════════════ */
function FeaturedCard({ person, isMobile }) {
  return (
    <div style={{
      borderRadius: '20px',
      background: 'linear-gradient(135deg, #0d3320 0%, #145A32 60%, #1c7040 100%)',
      padding: isMobile ? '24px 20px' : '36px 40px',
      display: 'flex', flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? '20px' : '36px',
      alignItems: isMobile ? 'flex-start' : 'center',
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 16px 48px rgba(20,90,50,0.3)',
      border: '1px solid rgba(212,175,55,0.25)',
      marginBottom: '12px',
    }}>
      {/* Geometric decoration */}
      <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(212,175,55,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', left: '-20px', bottom: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

      {/* Photo placeholder */}
      <div style={{
        width: isMobile ? '80px' : '120px', height: isMobile ? '80px' : '120px',
        borderRadius: '50%', flexShrink: 0, position: 'relative', zIndex: 1,
        border: '3px solid rgba(212,175,55,0.6)',
        boxShadow: '0 0 0 6px rgba(212,175,55,0.12)',
        overflow: 'hidden',
      }}>
        <Avatar size={isMobile ? 80 : 120} light />
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 12px', borderRadius: '999px', background: 'rgba(212,175,55,0.2)', border: '1px solid rgba(212,175,55,0.4)', marginBottom: '10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#D4AF37' }}>star</span>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pimpinan Tertinggi Pesantren</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#fff', marginBottom: '6px', lineHeight: 1.25 }}>{person.nama}</h2>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '14px', fontWeight: '500' }}>{person.pendidikan}</div>
        {person.quote && (
          <blockquote style={{
            fontFamily: 'var(--font-serif)', fontSize: isMobile ? '13px' : '14px',
            color: 'rgba(255,255,255,0.82)', lineHeight: '1.7',
            borderLeft: '3px solid rgba(212,175,55,0.6)', paddingLeft: '14px',
            margin: 0, fontStyle: 'italic',
          }}>
            {person.quote}
          </blockquote>
        )}
        <div style={{ display: 'flex', gap: '10px', marginTop: '18px', flexWrap: 'wrap' }}>
          {[
            { icon: 'location_on', text: 'Cisarua, Bogor' },
            { icon: 'school', text: 'Pidato Sanad Pesantren' },
            { icon: 'share', text: 'Ikuti Pengajian' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: '999px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PERSON CARD
══════════════════════════════════════════════════════ */
function PersonCard({ person, isMobile }) {
  return (
    <div style={{
      borderRadius: '16px',
      background: '#fff',
      border: '1px solid rgba(20,90,50,0.08)',
      boxShadow: '0 4px 20px -2px rgba(20,90,50,0.05)',
      padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px -4px rgba(20,90,50,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px -2px rgba(20,90,50,0.05)'; }}
    >
      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
          border: '2px solid rgba(20,90,50,0.15)',
          overflow: 'hidden',
        }}>
          <Avatar size={56} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: '700',
            color: 'var(--color-primary)', lineHeight: 1.3, marginBottom: '3px',
          }}>{person.nama}</h3>
          <div style={{
            display: 'inline-block', padding: '2px 8px', borderRadius: '999px',
            background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)',
            fontSize: '10px', fontWeight: '700', letterSpacing: '0.05em',
            textTransform: 'uppercase', marginBottom: '4px',
          }}>
            {person.jabatan}
          </div>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6', margin: 0 }}>
        {person.pendidikan}
      </p>

      {person.mapel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', borderRadius: '10px', background: 'var(--color-surface-container-low)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-tertiary)' }}>auto_stories</span>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{person.mapel}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
        <a href="#" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '7px', borderRadius: '10px', background: 'var(--color-surface-container)', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '12px', fontWeight: '600', border: '1px solid var(--color-outline-variant)', transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-container)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-container)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>info</span>
          Lihat Profil
        </a>
        <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', padding: '7px 12px', borderRadius: '10px', background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', textDecoration: 'none', fontSize: '12px', fontWeight: '600', border: '1px solid var(--color-outline-variant)', transition: 'all 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--color-secondary-container)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-container)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>chat</span>
          Hubungi
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════ */
export default function StrukturOrganisasi({ onNavigate }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeFilter, setActiveFilter] = useState('Semua Jabatan');

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const pengasuh = ANGGOTA.find(a => a.featured);
  const filtered = activeFilter === 'Semua Jabatan'
    ? ANGGOTA.filter(a => !a.featured)
    : ANGGOTA.filter(a => a.kategori === activeFilter && !a.featured);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ════ NAVBAR ════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(249,249,255,0.97)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-outline-variant)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        {/* Top info bar */}
        <div style={{ background: 'var(--color-primary)', color: '#fff', padding: '6px clamp(16px,3vw,48px)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-tertiary-fixed)' }}>call</span>
              +62 812-3456-7890
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.12)', padding: '2px 10px', borderRadius: '999px', fontWeight: '600' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#D4AF37', flexShrink: 0 }} />
              Tahun Ajaran 2025/2026
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 clamp(16px,3vw,48px)', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Logo */}
          <button onClick={() => onNavigate('beranda')} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
            <img src={logoAlhanif} alt="Logo Al-Hanif" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--color-secondary-container)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '15px' : '20px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.1 }}>Al-Hanif</div>
              {!isMobile && <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pondok Pesantren Yatim</div>}
            </div>
          </button>

          {/* Nav links — desktop only */}
          {!isMobile && (
            <nav style={{ display: 'flex', gap: '24px', flex: 1, justifyContent: 'center' }}>
              {[
                { label: 'Beranda', page: 'beranda' },
                { label: 'Struktur Organisasi', page: null, active: true },
                { label: 'Berita', page: null },
                { label: 'Pendaftaran (PSB)', page: 'pendaftaran' },
                { label: 'Kontak & Donasi', page: null },
              ].map(({ label, page, active }) => (
                <a key={label} href="#"
                  onClick={e => { e.preventDefault(); if (page) onNavigate(page); }}
                  style={{
                    fontSize: '13px', fontWeight: active ? '700' : '500',
                    color: active ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    textDecoration: 'none', whiteSpace: 'nowrap',
                    borderBottom: active ? '2px solid var(--color-tertiary)' : '2px solid transparent',
                    paddingBottom: '2px', transition: 'color 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--color-primary)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--color-on-surface-variant)'; }}
                >{label}</a>
              ))}
            </nav>
          )}

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <a href="#" onClick={e => { e.preventDefault(); onNavigate('pendaftaran'); }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: isMobile ? '7px 12px' : '9px 18px',
                borderRadius: '10px', background: 'var(--color-primary)', color: '#fff',
                fontWeight: '700', fontSize: isMobile ? '12px' : '13px', textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(20,90,50,0.25)',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>how_to_reg</span>
              {isMobile ? 'PMB' : 'PMB Online'}
            </a>
            <button onClick={() => onNavigate('login')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: isMobile ? '7px 10px' : '9px 16px',
                borderRadius: '10px', background: 'var(--color-surface-container)',
                border: '1.5px solid var(--color-outline-variant)', cursor: 'pointer',
                fontWeight: '600', fontSize: isMobile ? '12px' : '13px', color: 'var(--color-on-surface)',
              }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
              {!isMobile && 'Portal Santri'}
            </button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div style={{ background: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)', padding: '8px clamp(16px,3vw,48px)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
            <button onClick={() => onNavigate('beranda')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: '600', fontSize: '12px', padding: 0 }}>Beranda</button>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span>Profil &amp; Lembaga</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
            <span style={{ fontWeight: '600', color: 'var(--color-on-surface)' }}>Struktur Organisasi</span>
          </div>
        </div>
      </header>

      {/* ════ HERO SECTION ════ */}
      <div style={{
        background: 'linear-gradient(135deg, #0a2418 0%, #145A32 50%, #1c7040 100%)',
        padding: isMobile ? '36px 20px' : '56px 48px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(212,175,55,0.05)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
            <div style={{ padding: '3px 12px', borderRadius: '999px', background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', fontSize: '11px', fontWeight: '700', color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Tata Kelola Kepemimpinan
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '26px' : '42px', fontWeight: '700', color: '#fff', marginBottom: '12px', lineHeight: 1.2 }}>
            Struktur Organisasi &amp;<br />Dewan Kepengurusan
          </h1>
          <p style={{ fontSize: isMobile ? '14px' : '16px', color: 'rgba(255,255,255,0.72)', maxWidth: '560px', lineHeight: 1.75, marginBottom: '24px' }}>
            Pondok Pesantren Yatim Al-Hanif dikelola oleh tim pengurus dan para asatidz yang berpengalaman, berdedikasi, dan mulia dalam menggembleng santri agar senantiasa berakhlak dan berprestasi.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '12px', background: '#D4AF37', color: '#1a2e00', fontWeight: '700', fontSize: '14px', border: 'none', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>school</span>
              Bagian Akademik
            </button>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', borderRadius: '12px', background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: '700', fontSize: '14px', border: '1.5px solid rgba(255,255,255,0.25)', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>chat</span>
              Hubungi Pengasuh
            </button>
          </div>
        </div>
      </div>

      {/* ════ MAIN CONTENT ════ */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '28px 16px 60px' : '48px 48px 80px' }}>

        {/* Featured — Pengasuh */}
        {pengasuh && <FeaturedCard person={pengasuh} isMobile={isMobile} />}

        {/* Section divider */}
        <div style={{ margin: isMobile ? '28px 0 20px' : '40px 0 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>groups</span>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sekretariat &amp; Pengurus</span>
          </div>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-outline-variant)' }} />
        </div>

        {/* Filter tabs */}
        <div style={{
          display: 'flex', gap: '8px', flexWrap: isMobile ? 'nowrap' : 'wrap',
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? '8px' : '0',
          marginBottom: '24px',
          scrollbarWidth: 'none',
        }}>
          {JABATAN_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: isMobile ? '7px 14px' : '8px 18px',
                borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: activeFilter === f ? 'var(--color-primary)' : '#fff',
                color: activeFilter === f ? '#fff' : 'var(--color-on-surface-variant)',
                fontWeight: '600', fontSize: isMobile ? '12px' : '13px',
                boxShadow: activeFilter === f ? '0 4px 12px rgba(20,90,50,0.25)' : '0 1px 4px rgba(0,0,0,0.06)',
                border: `1.5px solid ${activeFilter === f ? 'transparent' : 'var(--color-outline-variant)'}`,
                transition: 'all 0.15s',
                flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >{f}</button>
          ))}
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: isMobile ? '12px' : '20px',
        }}>
          {filtered.map(person => (
            <PersonCard key={person.id} person={person} isMobile={isMobile} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px', opacity: 0.4 }}>person_search</span>
            <p>Belum ada data untuk kategori ini.</p>
          </div>
        )}
      </div>

      {/* ════ FOOTER ════ */}
      <footer style={{ background: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '40px 20px 28px' : '64px 48px 40px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '4fr 3fr 5fr',
            gap: isMobile ? '32px' : '48px',
            paddingBottom: isMobile ? '32px' : '48px',
            borderBottom: '1px solid var(--color-outline-variant)',
          }}>
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <img src={logoAlhanif} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>Pesantren Yatim Al-Hanif</div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Lembaga Pendidikan Islam</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: '1.7', marginBottom: '16px' }}>
                Membentuk generasi qur'ani yang berakhlak mulia, berwawasan global, dan berprestasi tinggi.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface-container-lowest)', padding: '6px 14px', borderRadius: '999px', boxShadow: 'var(--shadow-card)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)' }}>verified</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>Terakreditasi B — BAN S/M</span>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px' }}>Halaman Lainnya</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Beranda', page: 'beranda' },
                  { label: 'Struktur Organisasi', page: null },
                  { label: 'Pendaftaran Santri Baru', page: 'pendaftaran' },
                  { label: 'Portal Santri & Wali', page: 'login' },
                  { label: 'Kontak & Donasi', page: null },
                ].map(({ label, page }) => (
                  <li key={label}>
                    <a href="#" onClick={e => { e.preventDefault(); if (page) onNavigate(page); }}
                      style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', textDecoration: 'none', transition: 'color 0.15s', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px' }}>Alamat &amp; Kontak</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                {[
                  { icon: 'location_on', text: 'Jl. Pesantren Luhur No. 45, Cisarua, Bogor, Jawa Barat 16750' },
                  { icon: 'chat', text: 'WhatsApp PMB: +62 812-3456-7890' },
                  { icon: 'call', text: 'Telp: (0251) 8251234' },
                  { icon: 'mail', text: 'info@pesantren-alhanif.id' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                {['play_circle', 'photo_camera', 'public', 'smart_display'].map((icon, i) => (
                  <a key={i} href="#" style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: 'var(--color-surface-container-lowest)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-primary)', boxShadow: 'var(--shadow-card)',
                    transition: 'all 0.15s', textDecoration: 'none', border: '1px solid var(--color-outline-variant)',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-surface-container-lowest)'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div style={{
            paddingTop: '24px', display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center',
            gap: '12px', fontSize: '13px', color: 'var(--color-on-surface-variant)',
          }}>
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
