import { useState, useEffect, useRef } from 'react';
import {
  heroSlide1, heroSlide2, heroSlide3, heroSlide4, heroSlide5,
  kyaiProfile,
  gallery1, gallery2, gallery3, gallery4, gallery5, gallery6,
  news1, news2, news3,
  logoAlhanif,
} from '../assets/images/index.js';

/* ── Slide data ── */
const SLIDES = [
  {
    img: heroSlide1,
    icon: 'mosque', iconBg: 'var(--color-primary)',
    title: 'Kajian & Halaqah Santri',
    sub: "Bimbingan Langsung Asatidz & Mursyid Ma\u2019had",
  },
  {
    img: heroSlide2,
    icon: 'school', iconBg: 'var(--color-primary-container)',
    title: 'Pembelajaran Kelas Aktif',
    sub: 'Kurikulum Terpadu Diniyah & Formal Sains',
  },
  {
    img: heroSlide3,
    icon: 'workspace_premium', iconBg: 'var(--color-primary)',
    title: 'Wisuda & Haflah Ikhtitam',
    sub: 'Meluluskan Generasi Berprestasi & Berakhlak',
  },
  {
    img: heroSlide4,
    icon: 'apartment', iconBg: 'var(--color-secondary-container)',
    title: 'Gedung Kampus Terpadu',
    sub: 'Arsitektur Hijau Asri, Nyaman & Berkah',
  },
  {
    img: heroSlide5,
    icon: 'menu_book', iconBg: 'var(--color-primary)',
    title: 'Kajian Kitab & Literasi',
    sub: "Memperdalam Khazanah Kitab Kuning Salaf",
  },
];

const STATS = [
  { icon: 'group', value: '1.250+', label: 'Santri Aktif Mukim', sub: 'Berasal dari 34 Provinsi & Mancanegara' },
  { icon: 'menu_book', value: '300+', label: 'Hafizh/Hafizhah 30 Juz', sub: 'Lulus bersanad muttashil rasmi' },
  { icon: 'school', value: '50+', label: 'Dewan Asatidz & Mursyid', sub: 'Alumni Al-Azhar, Hadramaut, & PTN' },
  { icon: 'payments', value: 'Rp 0,-', label: '100% Bebas Biaya', sub: 'SPP, Asrama & Makan 3x Gratis' },
];

const GALLERY_ITEMS = [
  {
    img: gallery1,
    tag: 'Tahfidz & Halaqah', tagStyle: { background: 'var(--color-tertiary-fixed)', color: 'var(--color-on-tertiary-container)' },
    title: "Halaqah Pagi Muraja'ah Tahfidz di Serambi Masjid Jami'",
  },
  {
    img: gallery2,
    tag: 'Kajian Kitab', tagStyle: { background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
    title: 'Kajian Sorogan Kitab Fathul Qorib bersama Asatidz',
  },
  {
    img: gallery3,
    tag: 'Bahasa & Kepemimpinan', tagStyle: { background: 'var(--color-surface-container-highest)', color: 'var(--color-primary)' },
    title: 'Latihan Pidato Tiga Bahasa (Muhadharah Akbar Khitobah)',
  },
  {
    img: gallery4,
    tag: 'Sains & Riset', tagStyle: { background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' },
    title: 'Praktikum Laboratorium Komputer & Coding Robotika Santri',
  },
  {
    img: gallery5,
    tag: 'Kemandirian & Ekskul', tagStyle: { background: 'var(--color-tertiary-fixed)', color: 'var(--color-on-tertiary-container)' },
    title: 'Kejuaraan Panahan & Bela Diri Tapak Suci Santri Putra',
  },
  {
    img: gallery6,
    tag: 'Seni Islam', tagStyle: { background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' },
    title: 'Seni Hadroh Al-Banjari & Kaligrafi Kontemporer',
  },
];

const NEWS_ITEMS = [
  {
    img: news1,
    tag: 'Prestasi', tagBg: 'var(--color-primary)', tagColor: 'var(--color-on-primary)',
    date: '18 Mei 2025', author: 'Humas Al-Hanif',
    title: "Pesantren Al-Hanif Raih Juara Umum MQK (Musabaqah Qira'atil Kutub) Tingkat Nasional 2024",
    excerpt: "Kafilah santri Al-Hanif berhasil mendominasi cabang Fiqh, Nahwu Sharaf, dan Hadits dalam ajang perlombaan kitab kuning paling bergengsi se-Indonesia.",
  },
  {
    img: news2,
    tag: 'Informasi PSB', tagBg: 'var(--color-tertiary-fixed)', tagColor: 'var(--color-on-tertiary-container)',
    date: '12 Mei 2025', author: 'Panitia PSB 2025',
    title: 'Sosialisasi Penerimaan Santri Baru (PSB) Tahun Ajaran 2025/2026 Gelombang I Telah Dibuka',
    excerpt: 'Pendaftaran online dapat diakses melalui portal resmi dengan sistem seleksi tes baca Al-Qur\'an, akademik, dan wawancara komitmen orang tua wali santri.',
  },
  {
    img: news3,
    tag: 'Akademik', tagBg: 'var(--color-secondary-container)', tagColor: 'var(--color-on-secondary-container)',
    date: '04 Mei 2025', author: 'Biro Kerjasama',
    title: 'Semarak Dauroh Bahasa Arab Intensif Bersama Syaikh Tamu dari Univ. Al-Azhar Mesir',
    excerpt: 'Program dauroh selama dua pekan ini memantapkan kelancaran muhadatsah fasihah santri kelas akhir sebelum menempuh ujian sanad dan seleksi beasiswa luar negeri.',
  },
];

const GALLERY_FILTERS = ['Semua', 'Tahfidz & Halaqah', 'Kajian Kitab', 'Kemandirian & Ekskul', 'Fasilitas Kampus'];
const PRAYER_TIMES_BASE = [
  { name: 'Subuh', time: '04:38', h: 4, m: 38 },
  { name: 'Dzuhur', time: '11:54', h: 11, m: 54 },
  { name: 'Ashar', time: '15:16', h: 15, m: 16 },
  { name: 'Maghrib', time: '17:49', h: 17, m: 49 },
  { name: 'Isya', time: '19:02', h: 19, m: 2 },
];

function getPrayerTimes() {
  // Waktu sekarang dalam WIB (UTC+7)
  const now = new Date();
  const wibMinutes = (now.getUTCHours() + 7) % 24 * 60 + now.getUTCMinutes();

  // Cari waktu shalat yang sudah lewat paling akhir = yang sedang aktif
  let activeIdx = 0;
  for (let i = 0; i < PRAYER_TIMES_BASE.length; i++) {
    const pMin = PRAYER_TIMES_BASE[i].h * 60 + PRAYER_TIMES_BASE[i].m;
    if (wibMinutes >= pMin) activeIdx = i;
  }

  return PRAYER_TIMES_BASE.map((p, i) => ({ ...p, active: i === activeIdx }));
}

/* ══════════════════════════════════════════════════════
   Sub-components
══════════════════════════════════════════════════════ */

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const go = (idx) => setCurrent(((idx % SLIDES.length) + SLIDES.length) % SLIDES.length);

  const startAuto = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(p => (p + 1) % SLIDES.length), 4500);
  };

  useEffect(() => {
    startAuto();
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = SLIDES[current];

  return (
    <div style={{ position: 'relative' }}>

      {/* Badge Terakreditasi — DI LUAR carousel overflow:hidden, pojok kanan atas */}
      <div style={{
        position: 'absolute', top: '-14px', right: '-14px',
        background: 'white', padding: '12px 16px 12px 12px',
        borderRadius: '16px', zIndex: 30,
        boxShadow: '0 8px 24px rgba(0,0,0,0.13)',
        border: '2px solid var(--color-secondary-container)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--color-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>verified</span>
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.2 }}>Terakreditasi B</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', lineHeight: 1.3 }}>BAN S/M & Kemenag RI</div>
        </div>
      </div>

      {/* Carousel — overflow:hidden tetap di sini, badge sudah di luar */}
      <div
        style={{
          position: 'relative',
          borderRadius: '120px 120px 24px 24px',
          overflow: 'hidden',
          background: 'var(--color-surface-container)',
          boxShadow: '0 24px 64px -8px rgba(20,90,50,0.25)',
        }}
        onMouseEnter={() => clearInterval(timerRef.current)}
        onMouseLeave={startAuto}
      >
        {/* Slides */}
        <div className="beranda-slider-height" style={{ position: 'relative', width: '100%' }}>
          {SLIDES.map((s, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', inset: 0,
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.7s ease',
                pointerEvents: i === current ? 'auto' : 'none',
              }}
            >
              <img src={s.img} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,65,32,0.9) 0%, rgba(0,65,32,0.3) 50%, transparent 100%)' }} />
            </div>
          ))}

          {/* Caption card */}
          <div style={{
            position: 'absolute',
            bottom: isMobile ? '28px' : '48px',
            left: isMobile ? '12px' : '20px',
            right: isMobile ? '12px' : '20px',
            padding: isMobile ? '10px 12px' : '16px',
            borderRadius: isMobile ? '12px' : '16px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '12px',
          }}>
            <div style={{ width: isMobile ? '34px' : '48px', height: isMobile ? '34px' : '48px', borderRadius: '10px', background: slide.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-symbols-outlined" style={{ fontSize: isMobile ? '18px' : '26px', color: '#fff' }}>{slide.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: isMobile ? '12px' : '15px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.3 }}>{slide.title}</div>
              <div style={{ fontSize: isMobile ? '11px' : '13px', color: 'var(--color-on-surface-variant)', lineHeight: 1.3 }}>{slide.sub}</div>
            </div>
          </div>

          {/* Arrows */}
          <button
            aria-label="Slide sebelumnya"
            onClick={() => { go(current - 1); startAuto(); }}
            style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            aria-label="Slide berikutnya"
            onClick={() => { go(current + 1); startAuto(); }}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(8px)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: 'var(--color-primary)' }}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>

          {/* Dots */}
          <div style={{ position: 'absolute', bottom: '12px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                aria-label={`Ke slide ${i + 1}`}
                onClick={() => { go(i); startAuto(); }}
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px', borderRadius: '999px', border: 'none', cursor: 'pointer',
                  background: i === current ? 'var(--color-secondary)' : 'rgba(255,255,255,0.7)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




/* ═══════════════════════════════════════════════════
   BerandaFooter — Mobile: 1-col | Desktop: 3-col
═══════════════════════════════════════════════════ */
function BerandaFooter({ isMobile }) {
  return (
    <footer style={{ background: 'var(--color-surface-container-low)', padding: isMobile ? '36px 16px 24px' : '64px 48px 40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '4fr 3fr 5fr',
          gap: isMobile ? '28px' : '40px',
          paddingBottom: isMobile ? '28px' : '48px',
          borderBottom: '1px solid var(--color-outline-variant)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary)', fontSize: '22px' }}>mosque</span>
              </div>
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
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>Terakreditasi B — BAN S/M & Kemenag RI</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px' }}>Program Unggulan</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {["Tahfidz 30 Juz Al-Qur'an", 'Kajian Kitab Kuning Turats', 'Madrasah Diniyah Salafiyah', 'Bilingual (Arab & Inggris)', 'Sains & Riset Teknologi'].map(link => (
                <li key={link}><a href="#" style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--color-on-surface-variant)'}
                >{link}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px' }}>Alamat & Kontak</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
              {[
                { icon: 'location_on', text: 'Jl. Pesantren Luhur No. 45, Cisarua, Bogor, Jawa Barat 16750' },
                { icon: 'chat',        text: 'WhatsApp PMB: +62 812-3456-7890' },
                { icon: 'call',        text: 'Telp: (0251) 8251234' },
                { icon: 'mail',        text: 'info@pesantren-alhanif.id' },
              ].map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>{c.icon}</span>
                  <span>{c.text}</span>
                </div>
              ))}
            </div>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {['play_circle', 'photo_camera', 'public', 'smart_display'].map((icon, i) => (
                <a key={i} href="#" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-surface-container-lowest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', boxShadow: 'var(--shadow-card)', transition: 'all 0.15s', textDecoration: 'none' }}
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
          paddingTop: '24px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '12px',
          fontSize: '13px',
          color: 'var(--color-on-surface-variant)',
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
  );
}

/* ═══════════════════════════════════════════════════
   GallerySection — Mobile: 2-col | Desktop: 3-col
═══════════════════════════════════════════════════ */
function GallerySection({ activeFilter, setActiveFilter }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const filtered = activeFilter === 'Semua'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(g => g.tag === activeFilter);

  return (
    <section style={{ background: 'var(--color-surface-container-low)', padding: isMobile ? '40px 0' : '80px 48px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 16px' : '0' }}>
        {/* Header */}
        <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Kehidupan Santri</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '8px' }}>Lentera Aktivitas & Kehidupan Santri</h2>
          <p style={{ fontSize: isMobile ? '13px' : '15px', color: 'var(--color-on-surface-variant)' }}>Merekam jejak kedisiplinan, ukhuwah, keceriaan, dan dedikasi santri menuntut ilmu selama 24 jam di ma'had.</p>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', overflowX: isMobile ? 'auto' : 'visible', flexWrap: 'nowrap', paddingBottom: isMobile ? '4px' : '0' }}>
          {GALLERY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                padding: isMobile ? '6px 14px' : '8px 16px',
                borderRadius: '999px', border: 'none', cursor: 'pointer',
                background: activeFilter === f ? 'var(--color-primary)' : 'var(--color-surface-container-lowest)',
                color: activeFilter === f ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
                fontWeight: '600', fontSize: isMobile ? '12px' : '13px',
                boxShadow: activeFilter === f ? '0 4px 12px rgba(0,65,32,0.2)' : 'none',
                transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Gallery grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: isMobile ? '12px' : '24px',
        }}>
          {filtered.map((item, i) => (
            <div key={i} style={{ position: 'relative', borderRadius: isMobile ? '16px' : '24px', overflow: 'hidden', background: 'var(--color-surface-container)', boxShadow: 'var(--shadow-card)' }}>
              <img
                src={item.img}
                alt={item.title}
                style={{ width: '100%', height: isMobile ? '160px' : '288px', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,65,32,0.9) 0%, rgba(0,65,32,0.3) 50%, transparent 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: isMobile ? '10px' : '20px', left: isMobile ? '10px' : '20px', right: isMobile ? '10px' : '20px', color: 'white' }}>
                <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: '999px', fontSize: isMobile ? '10px' : '12px', fontWeight: '600', marginBottom: '4px', ...item.tagStyle }}>{item.tag}</span>
                <h4 style={{ fontSize: isMobile ? '12px' : '15px', fontWeight: '700', lineHeight: 1.3 }}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: isMobile ? '20px' : '32px' }}>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px', background: 'var(--color-surface-container-lowest)', color: 'var(--color-primary)', fontWeight: '600', textDecoration: 'none', boxShadow: 'var(--shadow-card)', fontSize: isMobile ? '13px' : '14px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>photo_library</span>
            Jelajahi Arsip Foto & Video Lainnya
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   NewsSection — Mobile: horizontal swipe | Desktop: 3-col
═══════════════════════════════════════════════════ */
function NewsSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const idx = Math.round(el.scrollLeft / (el.clientWidth * 0.85));
    setActiveIdx(Math.min(idx, NEWS_ITEMS.length - 1));
  };

  return (
    <section style={{ background: 'var(--color-surface)', padding: isMobile ? '40px 0' : '80px 48px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '0 16px' : '0' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: isMobile ? '20px' : '40px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Informasi Terkini</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '24px' : '32px', fontWeight: '700', color: 'var(--color-primary)' }}>Kabar Pesantren & Opini Santri</h2>
          </div>
          <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '13px', flexShrink: 0 }}>
            Lihat Semua <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
          </a>
        </div>

        {/* Cards */}
        {isMobile ? (
          <div>
            <div
              ref={trackRef}
              onScroll={handleScroll}
              style={{
                display: 'flex', overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                gap: '14px',
                paddingBottom: '8px',
                margin: '0 -16px', padding: '0 16px 8px',
              }}
            >
              {NEWS_ITEMS.map((item, i) => (
                <article key={i} style={{
                  minWidth: '80vw', maxWidth: '80vw',
                  scrollSnapAlign: 'start', flexShrink: 0,
                  borderRadius: '20px', background: 'var(--color-surface-container-lowest)',
                  overflow: 'hidden', boxShadow: 'var(--shadow-card)',
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{ position: 'relative', height: '160px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: '600', background: item.tagBg, color: item.tagColor }}>{item.tag}</span>
                    </div>
                  </div>
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-tertiary)' }}>calendar_today</span>
                      {item.date} • {item.author}
                    </div>
                    <h3 style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{item.excerpt}</p>
                    <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '13px', marginTop: '4px' }}>
                      Baca Selengkapnya <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
              {NEWS_ITEMS.map((_, i) => (
                <span key={i} style={{ width: i === activeIdx ? '24px' : '8px', height: '8px', borderRadius: '999px', background: i === activeIdx ? 'var(--color-primary)' : 'var(--color-outline-variant)', transition: 'all 0.3s', display: 'inline-block' }} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {NEWS_ITEMS.map((item, i) => (
              <article key={i} style={{ borderRadius: '24px', background: 'var(--color-surface-container-lowest)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '208px', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', background: item.tagBg, color: item.tagColor }}>{item.tag}</span>
                  </div>
                </div>
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-tertiary)' }}>calendar_today</span>
                    {item.date} • {item.author}
                  </div>
                  <h3 style={{ fontWeight: '700', fontSize: '15px', color: 'var(--color-primary)', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1 }}>{item.excerpt}</p>
                  <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: 'var(--color-primary)', textDecoration: 'none', fontSize: '13px' }}>
                    Baca Selengkapnya <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   ProgramSection — Mobile-aware swipe slider
═══════════════════════════════════════════════════ */
const PROGRAM_CARDS = [
  {
    icon: 'menu_book',
    iconBg: 'var(--color-primary-container)',
    iconColor: 'var(--color-tertiary-fixed)',
    badge: 'Sanad Muttashil Rasmi',
    badgeBg: 'var(--color-secondary-container)',
    badgeColor: 'var(--color-on-secondary-container)',
    title: "Tahfidzul Qur'an & Qira'ati",
    desc: "Bimbingan tahfidz intensif bersanad muttashil dengan target hafalan 30 Juz mutqin, talaqqi makharijul huruf, serta pemahaman tafsir amali.",
    features: ["Metode Ziyadah & Muraja'ah terukur harian", "Halaqah Tahfidz Eksklusif (1 Ustadz : 10 Santri)", "Wisuda Khotmil Qur'an Akbar Tahunan"],
    linkText: 'Pelajari Program Tahfidz',
    featured: false,
  },
  {
    icon: 'school',
    iconBg: 'var(--color-surface-container-lowest)',
    iconColor: 'var(--color-primary)',
    badge: 'MTs & MA Terakreditasi B',
    badgeBg: 'var(--color-tertiary-fixed)',
    badgeColor: 'var(--color-on-tertiary-container)',
    title: 'Madrasah Diniyah & Salafiyah',
    desc: "Pendidikan formal berjenjang MTs & MA yang terintegrasi dengan penguatan akidah akhlak, syariah, kurikulum nasional, dan kurikulum Cambridge.",
    features: ['Bilingual Harian Aktif (Bahasa Arab & Inggris)', 'Laboratorium Sains & Multimedia Komputer', 'Ekstrakurikuler Riset Ilmiah & Robotika Santri'],
    linkText: 'Pelajari Madrasah Formal',
    featured: true,
  },
  {
    icon: 'history_edu',
    iconBg: 'var(--color-surface-container-high)',
    iconColor: 'var(--color-tertiary)',
    badge: 'Khasanah Intelektual Islam',
    badgeBg: 'var(--color-surface-container)',
    badgeColor: 'var(--color-primary)',
    title: 'Kajian Kitab Kuning (Turats)',
    desc: "Penempaan literasi keilmuan Islam mendalam dengan mengkaji kitab-kitab muktabar karya ulama salafus shalih dalam nahwu, fiqh Syafi'i, hadits, & tasawuf.",
    features: ["Metode Bandongan & Sorogan Tradisional Matang", "Ijazah Sanad Keilmuan Bersambung ke Mu'allif", "Bahtsul Masail & Diskusi Fiqhiyah Santri Rutin"],
    linkText: 'Pelajari Kajian Turats',
    featured: false,
  },
];

function ProgramSection() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeIdx, setActiveIdx] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track scroll to update active dot
  const handleScroll = () => {
    if (!trackRef.current) return;
    const el = trackRef.current;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActiveIdx(Math.min(idx, PROGRAM_CARDS.length - 1));
  };

  const scrollTo = (idx) => {
    if (!trackRef.current) return;
    trackRef.current.scrollTo({ left: idx * trackRef.current.clientWidth, behavior: 'smooth' });
    setActiveIdx(idx);
  };

  return (
    <section style={{ background: 'var(--color-surface)', padding: isMobile ? '40px 0' : '80px 48px', overflow: 'hidden' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '28px' : '48px', padding: isMobile ? '0 20px' : '0' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Kurikulum Komprehensif Terpadu</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '26px' : '36px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '16px', lineHeight: 1.2 }}>Program Pendidikan Berkelanjutan</h2>
          <p style={{ fontSize: isMobile ? '14px' : '17px', color: 'var(--color-on-surface-variant)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
            Mengintegrasikan kedalaman keilmuan Islam klasik (Turats), hafalan kalamullah, dan keunggulan sains terapan abad ke-21.
          </p>
        </div>

        {/* Cards — Mobile: horizontal swipe | Desktop: 3-col grid */}
        {isMobile ? (
          <div>
            <div
              ref={trackRef}
              onScroll={handleScroll}
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                gap: '16px',
                padding: '8px 20px 16px',
              }}
            >
              {PROGRAM_CARDS.map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    minWidth: 'calc(85vw)',
                    maxWidth: 'calc(85vw)',
                    scrollSnapAlign: 'start',
                    flexShrink: 0,
                    padding: '24px',
                    borderRadius: '20px',
                    background: card.featured ? 'var(--color-primary)' : 'var(--color-surface-container-lowest)',
                    boxShadow: card.featured ? '0 12px 32px -8px rgba(0,65,32,0.4)' : 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '26px', color: card.iconColor }}>{card.icon}</span>
                  </div>
                  <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '999px', background: card.badgeBg, color: card.badgeColor, fontSize: '11px', fontWeight: '600', marginBottom: '10px', alignSelf: 'flex-start' }}>{card.badge}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: '700', color: card.featured ? '#fff' : 'var(--color-primary)', marginBottom: '10px', lineHeight: 1.3 }}>{card.title}</h3>
                  <p style={{ fontSize: '13px', color: card.featured ? 'rgba(255,255,255,0.8)' : 'var(--color-on-surface-variant)', lineHeight: '1.6', marginBottom: '14px', flex: 1 }}>{card.desc}</p>
                  {card.features.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: card.featured ? 'var(--color-tertiary-fixed)' : 'var(--color-secondary)', flexShrink: 0, marginTop: '1px' }}>check_circle</span>
                      <span style={{ fontSize: '12px', color: card.featured ? 'rgba(255,255,255,0.85)' : 'var(--color-on-surface)' }}>{t}</span>
                    </div>
                  ))}
                  <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '700', color: card.featured ? 'var(--color-tertiary-fixed)' : 'var(--color-primary)', textDecoration: 'none', fontSize: '13px', marginTop: '16px' }}>
                    {card.linkText} <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
                  </a>
                </div>
              ))}
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
              {PROGRAM_CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  style={{
                    width: i === activeIdx ? '24px' : '8px', height: '8px',
                    borderRadius: '999px', border: 'none', cursor: 'pointer',
                    background: i === activeIdx ? 'var(--color-primary)' : 'var(--color-outline-variant)',
                    transition: 'all 0.3s ease', padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {PROGRAM_CARDS.map((card, idx) => (
              <div
                key={idx}
                style={{
                  padding: '32px', borderRadius: '24px',
                  background: card.featured ? 'var(--color-primary)' : 'var(--color-surface-container-lowest)',
                  boxShadow: card.featured ? '0 16px 40px -8px rgba(0,65,32,0.4)' : 'var(--shadow-card)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                  position: 'relative', overflow: 'hidden', transition: 'all 0.3s',
                }}
              >
                {card.featured && <div style={{ position: 'absolute', right: '-32px', top: '-32px', width: '128px', height: '128px', borderRadius: '50%', background: 'rgba(27,109,36,0.3)', pointerEvents: 'none' }} />}
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '32px', color: card.iconColor }}>{card.icon}</span>
                  </div>
                  <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: card.badgeBg, color: card.badgeColor, fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>{card.badge}</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700', color: card.featured ? '#fff' : 'var(--color-primary)', marginBottom: '12px' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: card.featured ? 'var(--color-on-primary-container)' : 'var(--color-on-surface-variant)', lineHeight: '1.7', marginBottom: '16px' }}>{card.desc}</p>
                  {card.features.map((t, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: card.featured ? 'var(--color-tertiary-fixed)' : 'var(--color-secondary)', flexShrink: 0, marginTop: '2px' }}>check_circle</span>
                      <span style={{ fontSize: '13px', color: card.featured ? 'rgba(255,255,255,0.9)' : 'var(--color-on-surface)' }}>{t}</span>
                    </div>
                  ))}
                </div>
                <a href="#" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: card.featured ? '12px 20px' : '0',
                  borderRadius: card.featured ? '12px' : '0',
                  background: card.featured ? 'var(--color-secondary-container)' : 'none',
                  color: card.featured ? 'var(--color-on-secondary-container)' : 'var(--color-primary)',
                  fontWeight: '700', fontSize: '14px', textDecoration: 'none',
                  marginTop: '24px', alignSelf: 'flex-start', zIndex: 1, position: 'relative',
                }}>
                  {card.linkText} <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   Main Beranda Page
══════════════════════════════════════════════════════ */

export default function Beranda({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth <= 768);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return (
    <div style={{ width: '100%', background: 'var(--color-surface)' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        boxShadow: 'var(--shadow-nav)',
      }}>
        {/* Top bar */}
        <div style={{ background: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
          <div className="beranda-topbar-inner">
            <div className="beranda-topbar-contacts" style={{ fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--color-tertiary-fixed)' }}>call</span>
                +62 812-3456-7890
              </div>
              <div className="beranda-topbar-email">
                <span className="material-symbols-outlined" style={{ fontSize: '15px', color: 'var(--color-tertiary-fixed)' }}>mail</span>
                <span style={{marginLeft:6}}>info@pesantren-alhanif.id</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', background: 'var(--color-primary-container)', padding: '3px 12px', borderRadius: '999px', color: 'var(--color-on-primary-container)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-tertiary-fixed)' }} />
              Tahun Ajaran 2025/2026
            </div>
          </div>
        </div>

        {/* Main nav */}
        <div style={{ background: 'rgba(249,249,255,0.96)', backdropFilter: 'blur(16px)' }}>
          <div className="beranda-nav-inner">
            {/* Logo + Brand — selalu tampil */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              <img
                src={logoAlhanif}
                alt="Logo Al-Hanif"
                style={{ width: isMobile ? '34px' : '44px', height: isMobile ? '34px' : '44px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--color-secondary-container)', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: isMobile ? '15px' : '22px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.1 }}>Al-Hanif</div>
                <div style={{ fontSize: isMobile ? '9px' : '10px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>Pondok Pesantren Yatim</div>
              </div>
            </div>

            <nav className="beranda-nav-links">
              {['Beranda', 'Profil', 'Pendidikan', 'Pendaftaran', 'Galeri', 'Berita'].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: '14px', fontWeight: item === 'Beranda' ? '700' : '500',
                    color: item === 'Beranda' ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                    transition: 'color 0.15s',
                    textDecoration: 'none',
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px', flexShrink: 0 }}>
              <a
                href="#"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: isMobile ? '7px 12px' : '10px 20px',
                  borderRadius: '10px', background: 'var(--color-primary)', color: 'var(--color-on-primary)',
                  fontWeight: '600', fontSize: isMobile ? '12px' : '14px', textDecoration: 'none',
                  boxShadow: '0 4px 20px -2px rgba(20,90,50,0.2)',
                  transition: 'background 0.15s', whiteSpace: 'nowrap',
                }}
                onClick={() => onNavigate('pendaftaran')}
              >
                {isMobile ? 'Daftar' : 'Pendaftaran Santri Baru'}
              </a>
              <button
                onClick={() => onNavigate('login')}
                style={{
                  display: 'flex', alignItems: 'center', gap: isMobile ? '0' : '6px',
                  padding: isMobile ? '7px 10px' : '10px 16px', borderRadius: '10px',
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface)',
                  border: '1.5px solid var(--color-outline-variant)',
                  cursor: 'pointer', fontWeight: '600', fontSize: isMobile ? '12px' : '14px',
                  transition: 'all 0.15s',
                }}
                title="Masuk Portal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>login</span>
                {!isMobile && 'Masuk Portal'}
              </button>

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileMenuOpen(m => !m)}
                style={{ display: isMobile ? 'flex' : 'none', background: 'none', border: '1.5px solid var(--color-outline-variant)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', alignItems: 'center' }}
                aria-label="Buka menu"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-primary)' }}>
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* ── Mobile dropdown menu ── */}
        {mobileMenuOpen && (
          <div style={{
            background: 'rgba(249,249,255,0.98)',
            borderTop: '1px solid var(--color-outline-variant)',
            padding: '12px 16px 16px',
            display: 'flex', flexDirection: 'column', gap: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}>
            {['Beranda', 'Profil', 'Pendidikan', 'Galeri', 'Berita'].map(item => (
              <a key={item} href="#" onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '11px 14px', borderRadius: 10, fontSize: 14,
                  fontWeight: item === 'Beranda' ? 700 : 500,
                  color: item === 'Beranda' ? 'var(--color-primary)' : 'var(--color-on-surface)',
                  textDecoration: 'none',
                  background: item === 'Beranda' ? 'var(--color-secondary-container)' : 'transparent',
                }}>
                {item}
              </a>
            ))}
            <div style={{ borderTop: '1px solid var(--color-outline-variant)', marginTop: 8, paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="#" onClick={() => { setMobileMenuOpen(false); onNavigate('pendaftaran'); }}
                style={{
                  padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                  background: 'var(--color-primary)', color: '#fff',
                  textDecoration: 'none', textAlign: 'center',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>how_to_reg</span>
                Pendaftaran Santri Baru
              </a>
              <button onClick={() => { setMobileMenuOpen(false); onNavigate('login'); }}
                style={{
                  padding: '12px 14px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                  background: 'var(--color-surface-container)',
                  color: 'var(--color-on-surface)',
                  border: '1.5px solid var(--color-outline-variant)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>login</span>
                Masuk Portal SIM
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main — pt for double header (40+72=112px) */}
      <main className="beranda-main-pad">

        {/* ── Prayer Time Bar ── */}
        <section style={{ background: 'var(--color-surface-container-low)', padding: '12px 0' }}>
          <div className="beranda-prayer-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#fff' }}>schedule</span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Jadwal Ibadah Pesantren Al-Hanif</span>
              <span style={{ color: 'var(--color-outline-variant)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Waktu Indonesia Barat (WIB)</span>
            </div>
            <div className="beranda-prayer-times">
              {getPrayerTimes().map((p) => (
                <div key={p.name} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '4px 12px', borderRadius: '999px',
                  background: p.active ? 'var(--color-primary-container)' : 'var(--color-surface-container-lowest)',
                  color: p.active ? 'var(--color-on-primary)' : undefined,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  {p.active && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-tertiary-fixed)', animation: 'pulse 2s infinite' }} />}
                  <span style={{ fontSize: '13px', fontWeight: '500', color: p.active ? 'rgba(255,255,255,0.85)' : 'var(--color-on-surface-variant)' }}>{p.name}</span>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: p.active ? '#fff' : 'var(--color-primary)' }}>{p.time}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hero Section ── */}
        <section className="beranda-hero-section" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(to bottom, var(--color-surface-container-low), var(--color-surface) 60%)' }}>
          {/* Islamic geometry watermarks */}
          <div style={{ position: 'absolute', right: '-96px', top: '-96px', width: '384px', height: '384px', opacity: 0.04, pointerEvents: 'none', color: 'var(--color-primary)' }}>
            <svg viewBox="0 0 200 200" fill="currentColor"><polygon points="100,0 123,47 175,25 153,77 200,100 153,123 175,175 123,153 100,200 77,153 25,175 47,123 0,100 47,77 25,25 77,47" /></svg>
          </div>

          <div className="beranda-hero-grid">
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', alignSelf: 'flex-start', padding: '8px 16px', borderRadius: '999px', background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', border: '1px solid rgba(27,109,36,0.3)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--color-secondary)', animation: 'ping 1.5s infinite' }} />
                  <span style={{ fontSize: '13px', fontWeight: '700' }}>Penerimaan Santri Baru (PSB) 2025/2026 Dibuka</span>
                </div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '999px', background: 'var(--color-tertiary-fixed)', color: 'var(--color-on-tertiary-container)', border: '1px solid rgba(115,92,0,0.2)', fontSize: '12px', fontWeight: '700' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)' }}>volunteer_activism</span>
                  100% Gratis — Bebas Biaya SPP, Asrama & Konsumsi Sepenuhnya
                </div>
              </div>

              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '40px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Membentuk Generasi Qur'ani, Berakhlak Mulia & Berwawasan Global
              </h1>

              <p style={{ fontSize: '17px', color: 'var(--color-on-surface-variant)', lineHeight: '1.7', maxWidth: '580px' }}>
                Pondok Pesantren Yatim Al-Hanif memadukan kedalaman ilmu salafiyah, tahfidzul Qur'an bersanad, dan kurikulum sains unggulan. <strong>100% Gratis tanpa dipungut biaya</strong> — seluruh santri yatim &amp; dhuafa dibebaskan dari SPP, tempat tinggal asrama, serta konsumsi harian. <em>Biaya kitab, seragam, lemari &amp; kasur pribadi ditanggung mandiri.</em>
              </p>

              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '16px 32px', borderRadius: '14px', background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontWeight: '700', fontSize: '16px', textDecoration: 'none', boxShadow: '0 12px 32px -4px rgba(0,65,32,0.3)', transition: 'all 0.2s' }}>
                  Pendaftaran Santri Baru (PSB)
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                </a>
                <a href="#" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 24px', borderRadius: '14px', background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontWeight: '600', fontSize: '14px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>download</span>
                  Unduh Brosur Informasi
                </a>
              </div>

              {/* Alert */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '14px', background: 'rgba(255,224,136,0.3)', alignSelf: 'flex-start' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '22px' }}>card_giftcard</span>
                <p style={{ fontSize: '13px', color: 'var(--color-on-tertiary-container)' }}>
                  <strong>Beasiswa Penuh 100%:</strong> Kuota Gelombang I Terbatas untuk 150 Santri Putra & 150 Santri Putri Yatim/Dhuafa. Pendaftaran ditutup 30 Juni 2025.
                </p>
              </div>
            </div>

            {/* Right: Slider */}
            <div style={{ position: 'relative' }}>
              <HeroSlider />
            </div>
          </div>

          {/* Stats bar */}
          <div className="beranda-stats-grid">
            {STATS.map((s, i) => (
              <div key={i} style={{ padding: '24px', borderRadius: '16px', background: 'var(--color-surface-container-lowest)', boxShadow: 'var(--shadow-card)', borderBottom: '4px solid var(--color-secondary-container)', transition: 'box-shadow 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-secondary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-on-secondary-container)' }}>{s.icon}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)' }}>{s.value}</span>
                </div>
                <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--color-on-surface)' }}>{s.label}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Free Education Banner ── */}
        <section className="beranda-section-pad" style={{ background: 'var(--color-surface-container)', borderTop: '1px solid rgba(192,201,190,0.3)', borderBottom: '1px solid rgba(192,201,190,0.3)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: '24px', padding: '40px', boxShadow: 'var(--shadow-card)', border: '1px solid var(--color-secondary-container)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: '-48px', top: '-48px', width: '192px', height: '192px', background: 'rgba(160,243,153,0.4)', borderRadius: '50%', filter: 'blur(32px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
                <div style={{ maxWidth: '560px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontSize: '12px', fontWeight: '700', marginBottom: '12px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                    Pendidikan Mulia Bebas Biaya
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '12px' }}>Pendidikan Berkualitas 100% Bebas Biaya (Gratis)</h3>
                  <p style={{ fontSize: '15px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
                    Sebagai wujud khidmat amanah ummat dan lembaga wakaf, seluruh biaya hidup dan operasional pendidikan santri yatim dan dhuafa ditanggung penuh oleh pondok.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    { icon: 'school', title: 'Bebas SPP', sub: 'Formal & Diniyah' },
                    { icon: 'cottage', title: 'Asrama Gratis', sub: 'Hunian Bersih & Nyaman' },
                    { icon: 'restaurant', title: 'Makan 3x Sehari', sub: 'Menu Bergizi Terjamin' },
                    { icon: 'menu_book', title: 'Kitab & Seragam', sub: 'Bayar Mandiri (Terjangkau)' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '16px', borderRadius: '16px', background: 'var(--color-surface-container-low)', textAlign: 'center', border: '1px solid rgba(192,201,190,0.2)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'var(--color-secondary)', display: 'block', marginBottom: '4px' }}>{item.icon}</span>
                      <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--color-primary)' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Kyai Profile ── */}
        <section className="beranda-section-pad" style={{ background: 'var(--color-surface-container-lowest)', position: 'relative', overflow: 'hidden' }}>
          <div className="beranda-kyai-grid" style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'min(40%,480px) 1fr', gap: '48px', alignItems: 'center' }}>
            {/* Photo */}
            <div style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 24px 48px -8px rgba(0,65,32,0.2)' }}>
              <img
                src={kyaiProfile}
                alt="KH. Ahmad Jazuli"
                style={{ width: '100%', height: '520px', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,65,32,0.85) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', color: 'white' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: '700' }}>KH. Ahmad Jazuli</div>
                <div style={{ fontSize: '13px', color: 'var(--color-tertiary-fixed)', fontWeight: '600', marginTop: '4px' }}>Pengasuh Utama & Khadimul Ma’had</div>
              </div>
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start', padding: '6px 14px', borderRadius: '999px', background: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-tertiary-fixed)' }}>auto_stories</span>
                  Kalam Pengasuh & Khadimul Ma’had
                </div>
              </div>

              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.2 }}>
                Menjaga Kemurnian Salaf, Merengkuh Kemajuan Zaman
              </h2>

              <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--color-surface-container-low)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '36px', flexShrink: 0 }}>format_quote</span>
                  <div>
                    <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '17px', fontStyle: 'italic', color: 'var(--color-primary)', lineHeight: 1.8 }}>
                      "Pesantren bukan sekadar tempat menuntut ilmu fiqih dan menghafal ayat, melainkan kawah candradimuka yang menanamkan adab, kemandirian jiwa, dan ketulusan niat berkhidmat bagi umat dan bangsa."
                    </blockquote>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontWeight: '700', color: 'var(--color-tertiary)', fontSize: '14px' }}>— KH. Ahmad Jazuli</span>
                      <span style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--color-primary)', opacity: 0.6 }}>أحمد جزولي</span>
                    </div>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '15px', color: 'var(--color-on-surface-variant)', lineHeight: '1.7' }}>
                Sejak didirikan pada tahun 2012, Pondok Pesantren Yatim Al-Hanif berkomitmen mencetak insan mukmin yang berjiwa ikhlas, teguh berpegang pada ajaran Ahlussunnah wal Jama'ah, serta cakap memimpin perubahan dengan penguasaan sains, teknologi, dan kemandirian berkah.
              </p>

              {/* Panca Jiwa */}
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)', marginBottom: '12px' }}>Panca Jiwa Pondok Pesantren Yatim Al-Hanif:</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                  {[
                    { icon: 'volunteer_activism', label: 'Keikhlasan' },
                    { icon: 'spa', label: 'Kesederhanaan' },
                    { icon: 'person_play', label: 'Berdikari' },
                    { icon: 'diversity_1', label: 'Ukhuwah' },
                    { icon: 'psychology', label: 'Bebas Berpikir' },
                  ].map((v, i) => (
                    <div key={i} style={{ padding: '12px 8px', borderRadius: '12px', background: 'var(--color-surface-container)', textAlign: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-secondary)', display: 'block', marginBottom: '4px' }}>{v.icon}</span>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>{v.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ── Program Cards ── */}
        <ProgramSection />


        <GallerySection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />


        <NewsSection />

                {/* ── CTA Banner ── */}
        <section style={{ background: 'var(--color-primary-container)', color: 'var(--color-on-primary)', padding: '64px 48px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: '-64px', bottom: '-64px', width: '320px', height: '320px', opacity: 0.1, pointerEvents: 'none', color: 'var(--color-tertiary-fixed)' }}>
            <svg viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
              <polygon points="50,10 60,35 85,35 65,50 72,75 50,60 28,75 35,50 15,35 40,35" />
            </svg>
          </div>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '32px', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: '560px' }}>
              <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '999px', background: 'var(--color-tertiary-fixed)', color: 'var(--color-on-tertiary-container)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '16px' }}>
                Penerimaan Santri Baru 2025/2026
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', lineHeight: 1.2, marginBottom: '16px' }}>
                Mulailah Ikhtiar Mulia Bersama Al-Hanif — 100% Beasiswa Penuh Santri Yatim
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--color-on-primary-container)', lineHeight: '1.7' }}>
                Daftarkan ananda yatim & dhuafa untuk menerima program beasiswa pendidikan komprehensif tanpa biaya apapun. Tim panitia siap mendampingi proses pendaftaran.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" style={{ padding: '16px 32px', borderRadius: '14px', background: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontWeight: '700', fontSize: '16px', textDecoration: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.2)', textAlign: 'center', transition: 'all 0.2s' }}>
                Daftar Beasiswa Santri Gratis
              </a>
              <a href="#" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 28px', borderRadius: '14px', background: 'var(--color-surface-container-lowest)', color: 'var(--color-primary)', fontWeight: '700', fontSize: '14px', textDecoration: 'none', boxShadow: 'var(--shadow-card)', transition: 'all 0.2s' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)' }}>chat</span>
                Konsultasi WhatsApp
              </a>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <BerandaFooter isMobile={isMobile} />
            </main>

      {/* Pulse animation */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
