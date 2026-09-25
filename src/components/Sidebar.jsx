import { navItems } from '../data/mockData';
import { logoAlhanif } from '../assets/images/index.js';

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        {/* Brand */}
        <div className="sidebar-brand">
          <img
            src={logoAlhanif}
            alt="Logo Al-Hanif"
            className="sidebar-brand-icon"
            style={{ objectFit: 'cover' }}
          />
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-title">SIM Pesantren</span>
            <span className="sidebar-brand-sub">Yatim Al-Hanif</span>
          </div>
        </div>

        {/* Academic Year */}
        <div className="sidebar-academic-year">
          <div>
            <div className="sidebar-academic-year-label">Tahun Akademik</div>
            <div className="sidebar-academic-year-value">2024/2025 Genap</div>
          </div>
          <span className="sidebar-academic-year-dot" />
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu Utama</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="nav-item-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Prayer Widget */}
      <div className="sidebar-bottom">
        <div className="sidebar-prayer-widget">
          <div className="sidebar-prayer-info">
            <span className="material-symbols-outlined">schedule</span>
            <div>
              <div className="sidebar-prayer-label">Shalat Terdekat</div>
              <div className="sidebar-prayer-time">Ashar 15:18 WIB</div>
            </div>
          </div>
          <span className="badge-active">Aktif</span>
        </div>
      </div>
    </aside>
  );
}
