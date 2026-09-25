import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

/* ══════════════════════════════════════════════════
   Halaman Admin — Manajemen Akun Asatidz & Staf
══════════════════════════════════════════════════ */

const JABATAN_OPTIONS = [
  'Musyrif / Murabbiy',
  'Muhaffizh / Muhaffizhah',
  'Guru Mata Pelajaran',
  'Wali Kelas',
  'Kepala Sekolah / Mudirrasah',
  'Tata Usaha (TU)',
  'Kesehatan / UKS',
  'Keamanan / Satpam',
  'Konsumsi / Dapur',
  'Keuangan',
  'Humas & Publikasi',
  'Lainnya',
];

const MOCK_ACCOUNTS = [
  { id: 1, nama: 'Ust. Ahmad Fauzi, Lc.', email: 'ahmad.fauzi@alhanif.id', jabatan: 'Musyrif / Murabbiy', hp: '0812-3456-7890', status: 'aktif', createdAt: '2024-08-01' },
  { id: 2, nama: 'Ust. M. Ridwan, S.Pd.I.', email: 'm.ridwan@alhanif.id', jabatan: 'Muhaffizh / Muhaffizhah', hp: '0813-2233-4455', status: 'aktif', createdAt: '2024-08-01' },
  { id: 3, nama: 'Ustadzah Rina Lestari, S.Ag.', email: 'rina.lestari@alhanif.id', jabatan: 'Guru Mata Pelajaran', hp: '0814-5566-7788', status: 'aktif', createdAt: '2024-09-10' },
  { id: 4, nama: 'Ust. Habibi, S.Pd.', email: 'habibi@alhanif.id', jabatan: 'Wali Kelas', hp: '0815-9900-1122', status: 'nonaktif', createdAt: '2024-09-15' },
  { id: 5, nama: 'Ustadzah Hana Pratiwi, S.Pd.I.', email: 'hana.pratiwi@alhanif.id', jabatan: 'Muhaffizh / Muhaffizhah', hp: '0816-3344-5566', status: 'aktif', createdAt: '2024-10-01' },
];

const EMPTY_FORM = { nama: '', email: '', jabatan: JABATAN_OPTIONS[0], hp: '', password: '', sendInvite: true };

function StatusBadge({ status }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '700',
      background: status === 'aktif' ? 'rgba(160,243,153,0.3)' : '#F1F5F9',
      color: status === 'aktif' ? '#1b6d24' : '#64748B',
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status === 'aktif' ? '#1b6d24' : '#94A3B8' }} />
      {status === 'aktif' ? 'Aktif' : 'Nonaktif'}
    </span>
  );
}

export default function ManajemenAkun() {
  const [accounts, setAccounts] = useState(MOCK_ACCOUNTS);
  const [search, setSearch] = useState('');
  const [filterJabatan, setFilterJabatan] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', msg }
  const [showPass, setShowPass] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = accounts.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.nama.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.jabatan.toLowerCase().includes(q);
    const matchJabatan = filterJabatan === 'Semua' || a.jabatan === filterJabatan;
    return matchSearch && matchJabatan;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (acc) => {
    setEditingId(acc.id);
    setForm({ nama: acc.nama, email: acc.email, jabatan: acc.jabatan, hp: acc.hp, password: '', sendInvite: false });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.email.trim()) return;
    setLoading(true);

    try {
      if (editingId) {
        // Update lokal (nanti konek ke tabel profiles Supabase)
        setAccounts(prev => prev.map(a => a.id === editingId
          ? { ...a, nama: form.nama, jabatan: form.jabatan, hp: form.hp }
          : a
        ));
        showToast('success', `Data akun ${form.nama} berhasil diperbarui.`);
      } else {
        // Panggil Edge Function create-user
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;

        const res = await supabase.functions.invoke('create-user', {
          body: {
            email: form.email.trim(),
            password: form.sendInvite ? undefined : form.password,
            nama: form.nama.trim(),
            jabatan: form.jabatan,
            hp: form.hp.trim(),
            sendInvite: form.sendInvite,
          },
        });

        if (res.error || res.data?.error) {
          throw new Error(res.data?.error || res.error?.message || 'Gagal membuat akun.');
        }

        showToast('success', res.data?.message || `Akun ${form.nama} berhasil dibuat.`);

        const newAcc = {
          id: Date.now(),
          nama: form.nama.trim(),
          email: form.email.trim(),
          jabatan: form.jabatan,
          hp: form.hp.trim(),
          status: 'aktif',
          createdAt: new Date().toISOString().split('T')[0],
        };
        setAccounts(prev => [newAcc, ...prev]);
      }
    } catch (err) {
      showToast('error', err.message || 'Terjadi kesalahan.');
    }

    setLoading(false);
    setShowModal(false);
  };

  const toggleStatus = (id) => {
    setAccounts(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'aktif' ? 'nonaktif' : 'aktif' } : a));
  };

  const handleDelete = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
    showToast('success', 'Akun berhasil dihapus.');
  };

  const resetPassword = (acc) => {
    showToast('success', `Link reset password dikirim ke ${acc.email}.`);
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1.5px solid #E2E8F0', background: '#F8FAFC',
    fontSize: '14px', color: '#1E293B', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };

  return (
    <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '24px', fontFamily: "'Plus Jakarta Sans','Inter',sans-serif" }}>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '14px 20px', borderRadius: '12px',
          background: toast.type === 'success' ? '#145A32' : '#DC2626',
          color: '#fff', fontSize: '13px', fontWeight: '600',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxWidth: '360px',
        }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
            {toast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: '26px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' }}>
            Manajemen Akun Asatidz & Staf
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
            Kelola akun login portal internal pesantren untuk seluruh asatidz dan staf.
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', borderRadius: '12px',
            background: 'var(--color-primary)', color: '#fff',
            border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '700',
            boxShadow: '0 4px 16px rgba(20,90,50,0.2)',
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
          Buat Akun Baru
        </button>
      </div>

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { label: 'Total Akun', value: accounts.length, icon: 'group', bg: 'rgba(173,242,189,0.3)', color: '#004120' },
          { label: 'Akun Aktif', value: accounts.filter(a => a.status === 'aktif').length, icon: 'verified_user', bg: 'rgba(160,243,153,0.25)', color: '#1b6d24' },
          { label: 'Akun Nonaktif', value: accounts.filter(a => a.status === 'nonaktif').length, icon: 'person_off', bg: '#F1F5F9', color: '#64748B' },
          { label: 'Jabatan', value: [...new Set(accounts.map(a => a.jabatan))].length, icon: 'badge', bg: 'rgba(255,224,136,0.3)', color: '#735c00' },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', borderRadius: '16px', padding: '20px', border: '1px solid #DEE8FF', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: card.color }}>{card.icon}</span>
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: card.color, lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '4px', fontWeight: '600' }}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table section */}
      <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #DEE8FF', boxShadow: '0 1px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {/* Table toolbar */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F3FF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94A3B8' }}>search</span>
              <input
                type="text"
                placeholder="Cari nama, email, jabatan..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ ...inputStyle, paddingLeft: '40px', padding: '10px 14px 10px 40px' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={filterJabatan}
              onChange={e => setFilterJabatan(e.target.value)}
              style={{ ...inputStyle, width: 'auto', padding: '9px 14px', cursor: 'pointer' }}
            >
              <option value="Semua">Semua Jabatan</option>
              {JABATAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '600', whiteSpace: 'nowrap' }}>
              {filtered.length} akun
            </span>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F9F9FF', color: '#64748B', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 20px', textAlign: 'left' }}>Nama Asatidz / Staf</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email Login</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Jabatan</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>No. HP</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Bergabung</th>
                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(acc => (
                <tr key={acc.id} style={{ borderBottom: '1px solid #F0F3FF' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9F9FF'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                          {acc.nama.replace(/^(Ust\.|Ustadzah|Ust)\s*/i, '').charAt(0)}
                        </span>
                      </div>
                      <span style={{ fontWeight: '700', color: '#1E293B' }}>{acc.nama}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{acc.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: '6px', background: '#F0F3FF', color: '#475569', fontSize: '12px', fontWeight: '600' }}>{acc.jabatan}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#475569' }}>{acc.hp}</td>
                  <td style={{ padding: '14px 16px' }}><StatusBadge status={acc.status} /></td>
                  <td style={{ padding: '14px 16px', color: '#94A3B8', fontSize: '12px' }}>
                    {new Date(acc.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button onClick={() => openEdit(acc)} title="Edit"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#475569' }}>edit</span>
                      </button>
                      <button onClick={() => resetPassword(acc)} title="Reset Password"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#735c00' }}>lock_reset</span>
                      </button>
                      <button onClick={() => toggleStatus(acc.id)} title={acc.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: acc.status === 'aktif' ? '#DC2626' : '#1b6d24' }}>
                          {acc.status === 'aktif' ? 'person_off' : 'person_check'}
                        </span>
                      </button>
                      <button onClick={() => setShowDeleteConfirm(acc.id)} title="Hapus"
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #FEE2E2', background: '#FFF5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#DC2626' }}>delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '14px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', display: 'block', marginBottom: '8px' }}>manage_search</span>
                    Tidak ada akun yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL BUAT / EDIT AKUN ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.2)', overflow: 'hidden' }}>
            {/* Modal header */}
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #F0F3FF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(20,90,50,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#145A32' }}>{editingId ? 'manage_accounts' : 'person_add'}</span>
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>{editingId ? 'Edit Akun Asatidz' : 'Buat Akun Baru'}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{editingId ? 'Perbarui informasi akun' : 'Tambah asatidz atau staf baru'}</div>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94A3B8' }}>close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Nama */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>Nama Lengkap (+ Gelar)</label>
                  <input required value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
                    placeholder="Ust. Ahmad Fauzi, Lc." style={inputStyle} />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>Email (untuk login)</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="nama@alhanif.id" style={inputStyle} disabled={!!editingId} />
                  {!editingId && <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Email digunakan sebagai akun login asatidz</div>}
                </div>

                {/* Jabatan */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>Jabatan</label>
                  <select value={form.jabatan} onChange={e => setForm(f => ({ ...f, jabatan: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                    {JABATAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>

                {/* No HP */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>Nomor HP / WhatsApp</label>
                  <input value={form.hp} onChange={e => setForm(f => ({ ...f, hp: e.target.value }))}
                    placeholder="0812-3456-7890" style={inputStyle} />
                </div>

                {/* Password / Invite (hanya saat create) */}
                {!editingId && (
                  <div style={{ background: '#F9F9FF', borderRadius: '12px', padding: '16px', border: '1px solid #DEE8FF' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>Metode Aktivasi Akun</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input type="radio" checked={form.sendInvite} onChange={() => setForm(f => ({ ...f, sendInvite: true }))} style={{ marginTop: '3px' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>Kirim Link Undangan via Email</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>Asatidz akan menerima email untuk mengatur password sendiri (Direkomendasikan)</div>
                        </div>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input type="radio" checked={!form.sendInvite} onChange={() => setForm(f => ({ ...f, sendInvite: false }))} style={{ marginTop: '3px' }} />
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>Set Password Langsung</div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>Admin mengatur password, asatidz bisa ganti nanti</div>
                        </div>
                      </label>
                    </div>

                    {!form.sendInvite && (
                      <div style={{ marginTop: '12px', position: 'relative' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#1E293B', marginBottom: '6px' }}>Password</label>
                        <input
                          type={showPass ? 'text' : 'password'}
                          value={form.password}
                          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                          placeholder="Minimal 8 karakter"
                          style={{ ...inputStyle, paddingRight: '44px' }}
                          minLength={8}
                          required={!form.sendInvite}
                        />
                        <button type="button" onClick={() => setShowPass(s => !s)}
                          style={{ position: 'absolute', right: '12px', bottom: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#94A3B8' }}>
                            {showPass ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal footer */}
              <div style={{ padding: '16px 28px 24px', display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #F0F3FF' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                  Batal
                </button>
                <button type="submit" disabled={loading}
                  style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: loading ? '#94A3B8' : '#145A32', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? (
                    <><span className="material-symbols-outlined" style={{ fontSize: '16px', animation: 'spin 1s linear infinite' }}>refresh</span> Menyimpan...</>
                  ) : (
                    <><span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{editingId ? 'save' : 'person_add'}</span> {editingId ? 'Simpan Perubahan' : 'Buat Akun'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', width: '360px', boxShadow: '0 16px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#DC2626' }}>delete_forever</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B', textAlign: 'center', marginBottom: '8px' }}>Hapus Akun?</div>
            <div style={{ fontSize: '13px', color: '#64748B', textAlign: 'center', marginBottom: '24px' }}>
              Akun asatidz ini akan dihapus permanen dari sistem. Tindakan ini tidak bisa dibatalkan.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowDeleteConfirm(null)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1.5px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
                Batal
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#DC2626', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
