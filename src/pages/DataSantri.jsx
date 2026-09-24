import { useState } from 'react';
import { santriData } from '../data/mockData';
import SantriDetail from '../components/SantriDetail';
import KPIGrid from '../components/KPIGrid';

const JENJANG_OPTIONS = [
  { value: '', label: 'Semua Jenjang' },
  { value: 'mts', label: 'MTs Al-Hanif (Wustha)' },
  { value: 'ma', label: 'MA Al-Hanif (Ulya)' },
];

const ASRAMA_OPTIONS = [
  { value: '', label: 'Semua Asrama / Halaqah' },
  { value: 'abu-bakar', label: 'Asrama Abu Bakar (Putra Lt. 1)' },
  { value: 'umar', label: 'Asrama Umar Bin Khattab (Putra Lt. 2)' },
  { value: 'khadijah', label: 'Asrama Khadijah (Putri)' },
  { value: 'aisyah', label: 'Asrama Aisyah (Putri)' },
];

const TAHFIDZ_OPTIONS = [
  { value: '', label: 'Capaian Tahfidz' },
  { value: '1-10', label: '1 - 10 Juz' },
  { value: '11-20', label: '11 - 20 Juz' },
  { value: '21-29', label: '21 - 29 Juz' },
  { value: '30', label: '30 Juz Mutqin (Khatam)' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Status Beasiswa' },
  { value: 'yatim-piatu', label: 'Yatim Piatu (Asuh Penuh)' },
  { value: 'yatim', label: 'Yatim (Ibu Binaan)' },
  { value: 'dhuafa', label: 'Dhuafa Berprestasi Pelosok' },
];

const ROWS_PER_PAGE = 5;

export default function DataSantri({ searchQuery }) {
  const [selectedId, setSelectedId] = useState(null);
  const [filters, setFilters] = useState({ jenjang: '', asrama: '', tahfidz: '', status: '' });
  const [localSearch, setLocalSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState(new Set([1]));

  const handleFilterChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const combinedSearch = searchQuery || localSearch;

  // Filter logic
  const filtered = santriData.filter((s) => {
    const matchSearch =
      !combinedSearch ||
      s.nama.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      s.nisn.includes(combinedSearch) ||
      s.kamar.toLowerCase().includes(combinedSearch.toLowerCase()) ||
      s.musyrif.toLowerCase().includes(combinedSearch.toLowerCase());

    const matchJenjang = !filters.jenjang || s.jenjang === filters.jenjang;
    const matchAsrama = !filters.asrama || s.asrama === filters.asrama;
    const matchStatus = !filters.status || s.statusAsuhType === filters.status;
    const matchTahfidz =
      !filters.tahfidz ||
      (filters.tahfidz === '1-10' && s.tahfidzJuz >= 1 && s.tahfidzJuz <= 10) ||
      (filters.tahfidz === '11-20' && s.tahfidzJuz >= 11 && s.tahfidzJuz <= 20) ||
      (filters.tahfidz === '21-29' && s.tahfidzJuz >= 21 && s.tahfidzJuz <= 29) ||
      (filters.tahfidz === '30' && s.tahfidzJuz === 30);

    return matchSearch && matchJenjang && matchAsrama && matchStatus && matchTahfidz;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);
  const selectedSantri = santriData.find((s) => s.id === selectedId) || null;

  const toggleCheck = (id) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const activeFilters = [];
  if (filters.jenjang) activeFilters.push({ key: 'jenjang', label: `Jenjang: ${JENJANG_OPTIONS.find(o => o.value === filters.jenjang)?.label}` });
  if (filters.asrama) activeFilters.push({ key: 'asrama', label: `Asrama: ${ASRAMA_OPTIONS.find(o => o.value === filters.asrama)?.label}` });
  if (filters.status) activeFilters.push({ key: 'status', label: `Status: ${STATUS_OPTIONS.find(o => o.value === filters.status)?.label}` });

  const getBadgeClass = (type) => {
    switch (type) {
      case 'yatim-piatu': return 'badge badge-yatim';
      case 'yatim': return 'badge badge-yatim';
      case 'dhuafa': return 'badge badge-dhuafa';
      default: return 'badge badge-active';
    }
  };

  return (
    <div className="page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-breadcrumb">
            <div className="page-breadcrumb-icon">
              <span className="material-symbols-outlined">school</span>
            </div>
            <span className="page-breadcrumb-category">Portal Akademik & Kesantrian</span>
            <span className="page-breadcrumb-divider" />
            <span className="page-breadcrumb-sub">Data Induk Pesantren</span>
          </div>
          <h1 className="page-title">Database & Direktori Santri</h1>
          <p className="page-description">
            Kelola rekam data induk santri mukim, validasi status beasiswa yatim & dhuafa, pemantauan akselerasi mutaba'ah tahfidz Al-Qur'an, serta pembinaan asrama terpadu.
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" id="btn-export">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)' }}>file_download</span>
            Unduh Rekap
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>expand_more</span>
          </button>
          <button className="btn btn-primary" id="btn-add-santri">
            <span className="material-symbols-outlined">person_add</span>
            + Tambah Santri Baru
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <KPIGrid />

      {/* Content with Drawer */}
      <div className="content-with-drawer">
        {/* Left/Center: Table */}
        <div className="content-main-area" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Filter Toolbar */}
          <div className="filter-toolbar">
            {/* Search Row */}
            <div className="filter-search-row">
              <div className="filter-search-input">
                <span className="material-symbols-outlined">search</span>
                <input
                  type="text"
                  id="santri-search-input"
                  placeholder="Cari berdasarkan NISN, nama santri, kamar, atau nama musyrif..."
                  value={localSearch}
                  onChange={(e) => { setLocalSearch(e.target.value); setCurrentPage(1); }}
                  aria-label="Cari santri"
                />
                {localSearch && (
                  <button onClick={() => setLocalSearch('')} style={{ color: 'var(--color-outline)', display: 'flex' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="filter-view-switch">
                  <button className="filter-view-btn active" title="Tampilan Tabel">
                    <span className="material-symbols-outlined">table_rows</span>
                  </button>
                  <button className="filter-view-btn" title="Tampilan Kartu">
                    <span className="material-symbols-outlined">grid_view</span>
                  </button>
                </div>
                <button className="btn btn-ghost btn-sm">
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
                  Filter Lanjutan
                </button>
              </div>
            </div>

            {/* Filter Selects */}
            <div className="filter-grid">
              <select
                className="filter-select"
                value={filters.jenjang}
                onChange={(e) => handleFilterChange('jenjang', e.target.value)}
                aria-label="Filter jenjang"
              >
                {JENJANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select
                className="filter-select"
                value={filters.asrama}
                onChange={(e) => handleFilterChange('asrama', e.target.value)}
                aria-label="Filter asrama"
              >
                {ASRAMA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select
                className="filter-select"
                value={filters.tahfidz}
                onChange={(e) => handleFilterChange('tahfidz', e.target.value)}
                aria-label="Filter tahfidz"
              >
                {TAHFIDZ_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                aria-label="Filter status beasiswa"
              >
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Active Filter Chips */}
            <div className="filter-chips-row">
              <span className="filter-chip-label">Filter Aktif:</span>
              <div className="filter-chip">
                Tahun: 2024/2025 Genap
                <span className="material-symbols-outlined">close</span>
              </div>
              <div className="filter-chip">
                Status: Aktif Mukim
                <span className="material-symbols-outlined">close</span>
              </div>
              {activeFilters.map((f) => (
                <div key={f.key} className="filter-chip">
                  {f.label}
                  <span
                    className="material-symbols-outlined"
                    onClick={() => handleFilterChange(f.key, '')}
                    style={{ cursor: 'pointer' }}
                  >close</span>
                </div>
              ))}
              {(activeFilters.length > 0 || localSearch) && (
                <button className="filter-reset-btn" onClick={() => {
                  setFilters({ jenjang: '', asrama: '', tahfidz: '', status: '' });
                  setLocalSearch('');
                  setCurrentPage(1);
                }}>
                  Reset Semua
                </button>
              )}
            </div>
          </div>

          {/* Data Table */}
          <div className="data-table-container">
            <div className="data-table-scroll">
              <table className="data-table" id="santri-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Pilih semua"
                        onChange={(e) => {
                          if (e.target.checked) setCheckedIds(new Set(paginated.map(s => s.id)));
                          else setCheckedIds(new Set());
                        }}
                      />
                    </th>
                    <th>Santri & NISN</th>
                    <th>Jenjang & Kamar</th>
                    <th>Musyrif Pembina</th>
                    <th>Progres Tahfidz</th>
                    <th>Status Asuh</th>
                    <th>Suluk / Adab</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody id="santri-table-body">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--color-on-surface-variant)' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '8px', opacity: 0.4 }}>search_off</span>
                        Tidak ada santri yang ditemukan
                      </td>
                    </tr>
                  ) : (
                    paginated.map((s) => {
                      const pct = Math.round((s.tahfidzJuz / 30) * 100);
                      return (
                        <tr
                          key={s.id}
                          className={`santri-row ${selectedId === s.id ? 'selected' : ''}`}
                          onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
                          data-id={s.id}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={checkedIds.has(s.id)}
                              onChange={() => toggleCheck(s.id)}
                              aria-label={`Pilih ${s.nama}`}
                            />
                          </td>
                          <td>
                            <div className="td-santri">
                              <div className="santri-avatar-fallback">{s.inisial}</div>
                              <div>
                                <div className="santri-name">{s.nama}</div>
                                <div className="santri-meta">
                                  <span>NISN: {s.nisn}</span>
                                  <span className="santri-meta-dot">•</span>
                                  <span>{s.asal}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: '600', fontSize: '13px' }}>{s.kelas}</div>
                            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{s.kamar}</div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-tertiary)' }}>supervised_user_circle</span>
                              <span style={{ fontSize: '13px' }}>{s.musyrif}</span>
                            </div>
                          </td>
                          <td>
                            <div className="td-tahfidz">
                              <div className="tahfidz-header">
                                <span style={{ color: 'var(--color-primary)' }}>{s.tahfidzJuz} / 30 Juz</span>
                                <span style={{ color: 'var(--color-on-surface-variant)' }}>{pct}%</span>
                              </div>
                              <div className="tahfidz-progress-bar">
                                <div
                                  className="tahfidz-progress-fill"
                                  style={{
                                    width: `${pct}%`,
                                    background: pct === 100 ? 'var(--color-tertiary-container)' : 'var(--color-primary-container)',
                                  }}
                                />
                              </div>
                              <span className="tahfidz-surah">{s.tahfidzSurah}</span>
                            </div>
                          </td>
                          <td>
                            <span className={getBadgeClass(s.statusAsuhType)}>
                              {s.statusAsuh}
                            </span>
                          </td>
                          <td>
                            <div className={`td-adab ${s.adabColor}`}>
                              <span className="material-symbols-outlined">{s.adabIcon}</span>
                              <span>{s.adab}</span>
                            </div>
                          </td>
                          <td onClick={(e) => e.stopPropagation()}>
                            <div className="td-actions">
                              <button className="action-btn" title="Lihat profil" aria-label={`Lihat profil ${s.nama}`}
                                onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}>
                                <span className="material-symbols-outlined">visibility</span>
                              </button>
                              <button className="action-btn" title="Edit data" aria-label={`Edit data ${s.nama}`}>
                                <span className="material-symbols-outlined">edit</span>
                              </button>
                              <button className="action-btn" title="Lebih lanjut" aria-label="Opsi lainnya">
                                <span className="material-symbols-outlined">more_vert</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="table-footer">
              <div className="table-footer-info">
                Menampilkan {Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(currentPage * ROWS_PER_PAGE, filtered.length)} dari {filtered.length} santri
                {combinedSearch && ` (hasil pencarian "${combinedSearch}")`}
              </div>
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Halaman sebelumnya"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`page-btn ${currentPage === p ? 'active' : ''}`}
                    onClick={() => setCurrentPage(p)}
                    aria-label={`Halaman ${p}`}
                    aria-current={currentPage === p ? 'page' : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Halaman berikutnya"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detail Drawer */}
        <SantriDetail
          santri={selectedSantri}
          onClose={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
