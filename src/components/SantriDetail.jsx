export default function SantriDetail({ santri, onClose }) {
  if (!santri) {
    return (
      <div className="detail-drawer animate-slide-right" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        color: 'var(--color-on-surface-variant)',
        gap: '12px',
        textAlign: 'center',
        padding: 'var(--space-lg)',
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-outline-variant)' }}>
          person_search
        </span>
        <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface)' }}>
          Pilih Santri
        </div>
        <div style={{ fontSize: '13px' }}>
          Klik baris pada tabel untuk melihat detail profil santri
        </div>
      </div>
    );
  }

  const pct = Math.round((santri.tahfidzJuz / 30) * 100);

  const getBadgeClass = (type) => {
    switch (type) {
      case 'yatim-piatu': return 'badge badge-yatim';
      case 'yatim': return 'badge badge-yatim';
      case 'dhuafa': return 'badge badge-dhuafa';
      default: return 'badge badge-active';
    }
  };

  return (
    <div className="detail-drawer animate-slide-right">
      {/* Header */}
      <div className="detail-drawer-header">
        <span className="detail-drawer-title">Profil Santri</span>
        <button className="detail-drawer-close" onClick={onClose} aria-label="Tutup detail">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      {/* Body */}
      <div className="detail-drawer-body">
        {/* Profile */}
        <div className="detail-profile">
          <div className="detail-avatar-fallback">{santri.inisial}</div>
          <div>
            <div className="detail-name">{santri.nama}</div>
            <div className="detail-nisn">NISN: {santri.nisn} • {santri.asal}</div>
          </div>
          <div className="detail-badges">
            <span className={getBadgeClass(santri.statusAsuhType)}>
              {santri.statusAsuh}
            </span>
            {santri.tahfidzJuz === 30 && (
              <span className="badge" style={{ background: 'rgba(255,224,136,0.4)', color: 'var(--color-tertiary)' }}>
                ✦ Hafidz 30 Juz
              </span>
            )}
          </div>
        </div>

        {/* Info Akademik */}
        <div className="detail-section">
          <div className="detail-section-title">
            <span className="material-symbols-outlined">school</span>
            Informasi Akademik
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Kelas</span>
            <span className="detail-row-value">{santri.kelas}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Asrama / Kamar</span>
            <span className="detail-row-value">{santri.kamar}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Musyrif Pembina</span>
            <span className="detail-row-value">{santri.musyrif}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Tgl Masuk</span>
            <span className="detail-row-value">{santri.tanggalMasuk}</span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Nilai Madrasah</span>
            <span className="detail-row-value" style={{ color: 'var(--color-primary)' }}>
              {santri.nilaiMadrasah.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Tahfidz */}
        <div className="detail-section">
          <div className="detail-section-title">
            <span className="material-symbols-outlined">menu_book</span>
            Progres Tahfidz Al-Qur'an
          </div>
          <div className="detail-tahfidz-progress">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700' }}>
              <span style={{ color: 'var(--color-primary)' }}>{santri.tahfidzJuz} / 30 Juz</span>
              <span style={{ color: 'var(--color-on-surface-variant)' }}>{pct}%</span>
            </div>
            <div className="detail-tahfidz-bar">
              <div className="detail-tahfidz-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              {santri.tahfidzSurah}
            </div>
          </div>

          <div className="detail-tahfidz-stats">
            <div className="detail-stat-card">
              <div className="detail-stat-value">{santri.tahfidzJuz}</div>
              <div className="detail-stat-label">Juz Selesai</div>
            </div>
            <div className="detail-stat-card">
              <div className="detail-stat-value">{santri.setoran}</div>
              <div className="detail-stat-label">Setoran Rutin</div>
            </div>
          </div>
        </div>

        {/* Adab & Status */}
        <div className="detail-section">
          <div className="detail-section-title">
            <span className="material-symbols-outlined">verified_user</span>
            Suluk & Kedisiplinan
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Nilai Adab</span>
            <span className={`td-adab ${santri.adabColor}`}>
              <span className="material-symbols-outlined">{santri.adabIcon}</span>
              {santri.adab}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-row-label">Status Hadir</span>
            <span className="detail-row-value">
              {santri.hadir ? (
                <span style={{ color: 'var(--color-secondary)' }}>✓ Hadir</span>
              ) : (
                <span style={{ color: 'var(--color-error)' }}>✗ Tidak Hadir</span>
              )}
            </span>
          </div>
          {santri.catatanKhusus && (
            <div style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(255, 218, 214, 0.3)',
              border: '1px solid rgba(186, 26, 26, 0.15)',
              fontSize: '12px',
              color: 'var(--color-error)',
            }}>
              ⚠ {santri.catatanKhusus}
            </div>
          )}
          <div className="detail-row">
            <span className="detail-row-label">Wali / Asuh</span>
            <span className="detail-row-value" style={{ maxWidth: '160px', textAlign: 'right' }}>
              {santri.wali}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="detail-drawer-actions">
        <button className="btn btn-secondary" style={{ fontSize: '13px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
          Edit
        </button>
        <button className="btn btn-primary" style={{ fontSize: '13px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>description</span>
          Rekap PDF
        </button>
      </div>
    </div>
  );
}
