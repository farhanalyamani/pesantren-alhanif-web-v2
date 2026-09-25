import { useState, useEffect, useRef } from 'react';
import supabase from '../lib/supabase';

export default function Header({ searchQuery, onSearchChange, onNavigate }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('alhanif_role');
    if (onNavigate) onNavigate('login');
    else window.location.reload();
  };

  return (
    <header className="header">
      {/* Search */}
      <div className="header-search">
        <span className="material-symbols-outlined">search</span>
        <input
          type="text"
          placeholder="Cari NISN, nama santri, muhaffizh, atau berkas perizinan..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          id="global-search"
          aria-label="Pencarian global"
        />
      </div>

      {/* Right actions */}
      <div className="header-actions">
        {/* Date chip */}
        <div className="header-date-chip">
          <span className="material-symbols-outlined">calendar_month</span>
          <span>14 Sya'ban 1446 H &bull; {dateStr}</span>
        </div>

        {/* Notification */}
        <button className="header-icon-btn" title="Notifikasi" aria-label="Notifikasi">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notif-dot" />
        </button>

        {/* User + Dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(o => !o)}
            className="header-user"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            aria-label="Menu pengguna"
          >
            <div className="header-user-info">
              <span className="header-user-name">Ustadz Ahmad Fauzi, Lc.</span>
              <span className="header-user-role">Musyrif &amp; Wali Kelas IX A</span>
            </div>
            <div className="header-user-avatar">
              <span className="material-symbols-outlined">person</span>
            </div>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 10px)', right: 0,
              width: '220px', background: '#fff',
              borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid #F0F3FF', zIndex: 999,
              overflow: 'hidden',
            }}>
              {/* User info header */}
              <div style={{ padding: '14px 16px', background: '#F9F9FF', borderBottom: '1px solid #F0F3FF' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B' }}>Ustadz Ahmad Fauzi, Lc.</div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>Musyrif &amp; Wali Kelas IX A</div>
              </div>

              <div style={{ padding: '6px' }}>
                {[
                  { icon: 'manage_accounts', label: 'Profil Saya' },
                  { icon: 'settings',        label: 'Pengaturan' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '10px 12px', borderRadius: '8px', border: 'none',
                      background: 'none', cursor: 'pointer', fontSize: '13px',
                      fontWeight: '600', color: '#475569', textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#F0F3FF'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94A3B8' }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}

                <div style={{ height: '1px', background: '#F0F3FF', margin: '6px 0' }} />

                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px', border: 'none',
                    background: 'none', cursor: 'pointer', fontSize: '13px',
                    fontWeight: '700', color: '#DC2626', textAlign: 'left',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#FEE2E2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#DC2626' }}>logout</span>
                  Keluar dari Akun
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
