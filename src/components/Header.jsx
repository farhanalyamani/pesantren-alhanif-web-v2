export default function Header({ searchQuery, onSearchChange }) {
  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
          <span>14 Sya'ban 1446 H • {dateStr}</span>
        </div>

        {/* Notification */}
        <button className="header-icon-btn" title="Notifikasi" aria-label="Notifikasi">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notif-dot" />
        </button>

        {/* User */}
        <div className="header-user" role="button" tabIndex={0}>
          <div className="header-user-info">
            <span className="header-user-name">Ustadz Ahmad Fauzi, Lc.</span>
            <span className="header-user-role">Musyrif & Wali Kelas IX A</span>
          </div>
          <div className="header-user-avatar">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
