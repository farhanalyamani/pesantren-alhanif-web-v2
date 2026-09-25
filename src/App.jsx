import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Beranda from './pages/Beranda';
import Pendaftaran from './pages/Pendaftaran';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataSantri from './pages/DataSantri';
import Placeholder from './pages/Placeholder';
import PortalWali from './pages/PortalWali';
import ManajemenAkun from './pages/ManajemenAkun';
import AdminPanel from './pages/AdminPanel';

// Pages that show inside the admin shell (sidebar + header)
const ADMIN_PAGES = {
  dashboard: { component: Dashboard },
  'data-santri': { component: DataSantri },
  'manajemen-akun': { component: ManajemenAkun },
  tahfidz: {
    component: () => (
      <Placeholder
        icon="menu_book"
        title="Mutaba'ah & Setoran Tahfidz"
        description="Halaman ini menampilkan progress setoran harian, jadwal halaqah, dan rekapitulasi mutaba'ah seluruh santri."
      />
    ),
  },
  presensi: {
    component: () => (
      <Placeholder
        icon="fact_check"
        title="Presensi & Kedisiplinan"
        description="Rekap kehadiran shalat jama'i, halaqah pagi, dan laporan pelanggaran kedisiplinan asrama."
      />
    ),
  },
  nilai: {
    component: () => (
      <Placeholder
        icon="school"
        title="Nilai Madrasah"
        description="Rapor akademik, nilai ujian, dan perkembangan prestasi seluruh santri per semester."
      />
    ),
  },
  perizinan: {
    component: () => (
      <Placeholder
        icon="door_sliding"
        title="Perizinan Santri"
        description="Pengajuan, persetujuan, dan pemantauan perizinan keluar pesantren untuk santri."
      />
    ),
  },
  keuangan: {
    component: () => (
      <Placeholder
        icon="volunteer_activism"
        title="Keuangan & Donatur Asuh"
        description="Manajemen donatur, distribusi beasiswa, laporan keuangan, dan program kafalah yatim."
      />
    ),
  },
  laporan: {
    component: () => (
      <Placeholder
        icon="summarize"
        title="Laporan Santri"
        description="Cetak dan unduh laporan komprehensif perkembangan santri untuk wali & yayasan."
      />
    ),
  },
};

export default function App() {
  // Start on beranda (public homepage)
  const [activePage, setActivePage] = useState('beranda');
  const [searchQuery, setSearchQuery] = useState('');

  const handleNavigate = (pageId) => {
    setActivePage(pageId);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Public pages (full-width, no admin shell) ──
  if (activePage === 'beranda') {
    return <Beranda onNavigate={handleNavigate} />;
  }

  if (activePage === 'pendaftaran') {
    return <Pendaftaran onNavigate={handleNavigate} />;
  }

  if (activePage === 'login') {
    return (
      <Login
        onNavigate={handleNavigate}
        onLoginSuccess={(role, user) => {
          console.log('[Login] Masuk sebagai', role, user?.email);
          if (role === 'wali')  handleNavigate('portal-wali');
          else if (role === 'admin') handleNavigate('admin-panel');
          else handleNavigate('dashboard'); // staf
        }}
      />
    );
  }

  // ── Portal Wali Santri ──
  if (activePage === 'portal-wali') {
    return <PortalWali onNavigate={handleNavigate} />;
  }

  // ── Admin Panel (layout tersendiri) ──
  if (activePage === 'admin-panel') {
    return <AdminPanel onNavigate={handleNavigate} />;
  }

  // ── Admin shell layout ──
  const pageConfig = ADMIN_PAGES[activePage] || ADMIN_PAGES['dashboard'];
  const PageComponent = pageConfig.component;

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onNavigate={handleNavigate} />
        <main className="main-content">
          {/* Back to website button */}
          <div style={{ paddingTop: 'var(--space-lg)', paddingBottom: 0, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => handleNavigate('beranda')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '6px 14px', borderRadius: 'var(--radius-full)',
                background: 'var(--color-surface-container-low)',
                color: 'var(--color-on-surface-variant)',
                fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--color-surface-container)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-surface-container-low)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>public</span>
              Ke Website Publik
            </button>
          </div>
          <PageComponent searchQuery={searchQuery} />
        </main>
      </div>
    </div>
  );
}
