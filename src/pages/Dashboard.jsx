import { santriData } from '../data/mockData';

const summaryCards = [
  {
    icon: 'diversity_3',
    title: 'Total Santri Aktif',
    value: '324',
    sub: '168 Putra • 156 Putri',
    color: 'var(--color-primary)',
    bg: 'rgba(173, 242, 189, 0.2)',
  },
  {
    icon: 'auto_stories',
    title: 'Hafidz ≥20 Juz',
    value: '84',
    sub: '26% dari total santri',
    color: 'var(--color-tertiary)',
    bg: 'rgba(255, 224, 136, 0.2)',
  },
  {
    icon: 'volunteer_activism',
    title: 'Donatur Aktif',
    value: '143',
    sub: 'Individu & Lembaga',
    color: 'var(--color-secondary)',
    bg: 'rgba(163, 246, 156, 0.2)',
  },
  {
    icon: 'fact_check',
    title: 'Kehadiran Hari Ini',
    value: '98.2%',
    sub: '5 santri tidak hadir',
    color: 'var(--color-primary)',
    bg: 'rgba(173, 242, 189, 0.2)',
  },
];

const recentActivities = [
  { icon: 'person_add', text: 'Santri baru: M. Ridho Al-Kautsar didaftarkan', time: '1 jam lalu', color: 'var(--color-primary)' },
  { icon: 'auto_stories', text: 'Ahmad Dzikrullah Hakim khatam 30 Juz', time: '3 jam lalu', color: 'var(--color-tertiary)' },
  { icon: 'door_sliding', text: 'Perizinan pulang: Siti Khodijah (2 hari)', time: '5 jam lalu', color: 'var(--color-secondary)' },
  { icon: 'medical_services', text: 'Muhammad Ikhwan masuk UKS (demam)', time: '7 jam lalu', color: 'var(--color-error)' },
  { icon: 'volunteer_activism', text: 'Donasi masuk: Rp 5.000.000 dari Bpk. Hasan', time: 'Kemarin', color: 'var(--color-secondary)' },
];

export default function Dashboard() {
  const topHafidz = [...santriData]
    .sort((a, b) => b.tahfidzJuz - a.tahfidzJuz)
    .slice(0, 4);

  return (
    <div className="page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <div className="page-breadcrumb-icon">
              <span className="material-symbols-outlined">grid_view</span>
            </div>
            <span className="page-breadcrumb-category">Ringkasan Pesantren</span>
          </div>
          <h1 className="page-title">Dashboard Ringkasan</h1>
          <p className="page-description">
            Selamat datang, Ustadz Ahmad Fauzi. Berikut ringkasan aktivitas dan kondisi pesantren hari ini.
          </p>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="quote-banner">
        <div className="quote-arabic">
          وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
        </div>
        <div className="quote-translation">
          "Dan barangsiapa bertakwa kepada Allah, niscaya Dia akan membukakan jalan keluar baginya"
        </div>
        <div className="quote-source">QS. At-Talaq: 2</div>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid" style={{ marginBottom: 'var(--space-lg)' }}>
        {summaryCards.map((card, i) => (
          <div
            key={i}
            className="kpi-card animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="kpi-card-top">
              <div>
                <div className="kpi-label">{card.title}</div>
                <div className="kpi-value-row">
                  <span className="kpi-value" style={{ color: card.color }}>{card.value}</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                  {card.sub}
                </div>
              </div>
              <div className="kpi-icon" style={{ background: card.bg, color: card.color }}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Top Hafidz */}
        <div className="data-table-container" style={{ padding: '0' }}>
          <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--color-surface-container-low)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '20px' }}>auto_stories</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>
                Top Progres Tahfidz
              </span>
            </div>
          </div>
          <div style={{ padding: 'var(--space-sm) 0' }}>
            {topHafidz.map((s, i) => {
              const pct = Math.round((s.tahfidzJuz / 30) * 100);
              return (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px var(--space-md)',
                    borderBottom: i < topHafidz.length - 1 ? '1px solid var(--color-surface-container-low)' : 'none',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: i === 0 ? 'var(--color-tertiary-fixed)' : 'var(--color-surface-container)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: i === 0 ? 'var(--color-tertiary)' : 'var(--color-on-surface-variant)',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </div>
                  <div className="santri-avatar-fallback" style={{ width: '36px', height: '36px', fontSize: '12px' }}>
                    {s.inisial}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {s.nama}
                    </div>
                    <div className="td-tahfidz" style={{ marginTop: '4px' }}>
                      <div className="tahfidz-header">
                        <span style={{ color: 'var(--color-primary)', fontSize: '12px' }}>{s.tahfidzJuz} / 30 Juz</span>
                        <span style={{ color: 'var(--color-on-surface-variant)', fontSize: '12px' }}>{pct}%</span>
                      </div>
                      <div className="tahfidz-progress-bar" style={{ height: '4px' }}>
                        <div
                          className="tahfidz-progress-fill"
                          style={{
                            width: `${pct}%`,
                            background: pct === 100 ? 'var(--color-tertiary-container)' : 'var(--color-primary-container)',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="data-table-container" style={{ padding: '0' }}>
          <div style={{ padding: 'var(--space-md)', borderBottom: '1px solid var(--color-surface-container-low)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary-container)', fontSize: '20px' }}>notifications_active</span>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>
                Aktivitas Terkini
              </span>
            </div>
          </div>
          <div style={{ padding: 'var(--space-sm) 0' }}>
            {recentActivities.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px var(--space-md)',
                  borderBottom: i < recentActivities.length - 1 ? '1px solid var(--color-surface-container-low)' : 'none',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-xl)',
                  background: `${a.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: a.color }}>
                    {a.icon}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', color: 'var(--color-on-surface)', lineHeight: '1.4' }}>
                    {a.text}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                    {a.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
