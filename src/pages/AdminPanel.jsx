import { useState } from 'react';
import supabase from '../lib/supabase';
import { logoAlhanif } from '../assets/images/index.js';

/* ══════════════════════════════════════════════════
   Halaman Admin Panel — Layout tersendiri
   Tidak pakai sidebar asatidz
══════════════════════════════════════════════════ */

const JABATAN_OPTIONS = [
  'Musyrif / Murabbiy','Muhaffizh / Muhaffizhah','Guru Mata Pelajaran',
  'Wali Kelas','Kepala Sekolah / Mudirrasah','Tata Usaha (TU)',
  'Kesehatan / UKS','Keamanan / Satpam','Konsumsi / Dapur',
  'Keuangan','Humas & Publikasi','Lainnya',
];

const EMPTY_FORM = { nama:'', email:'', jabatan:JABATAN_OPTIONS[0], hp:'', password:'', sendInvite:true };

const MOCK_ACCOUNTS = [
  { id:1, nama:'Ust. Ahmad Fauzi, Lc.',       email:'ahmad.fauzi@alhanif.id',  jabatan:'Musyrif / Murabbiy',        hp:'0812-3456-7890', status:'aktif',    createdAt:'2024-08-01' },
  { id:2, nama:'Ust. M. Ridwan, S.Pd.I.',      email:'m.ridwan@alhanif.id',     jabatan:'Muhaffizh / Muhaffizhah',   hp:'0813-2233-4455', status:'aktif',    createdAt:'2024-08-01' },
  { id:3, nama:'Ustadzah Rina Lestari, S.Ag.', email:'rina.lestari@alhanif.id', jabatan:'Guru Mata Pelajaran',       hp:'0814-5566-7788', status:'aktif',    createdAt:'2024-09-10' },
  { id:4, nama:'Ust. Habibi, S.Pd.',           email:'habibi@alhanif.id',       jabatan:'Wali Kelas',               hp:'0815-9900-1122', status:'nonaktif', createdAt:'2024-09-15' },
  { id:5, nama:'Ustadzah Hana Pratiwi, S.Pd.I.',email:'hana.pratiwi@alhanif.id',jabatan:'Muhaffizh / Muhaffizhah',  hp:'0816-3344-5566', status:'aktif',    createdAt:'2024-10-01' },
];

function Badge({ status }) {
  const aktif = status === 'aktif';
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'3px 10px', borderRadius:999, fontSize:12, fontWeight:700,
      background: aktif ? 'rgba(16,185,129,0.12)' : '#F1F5F9', color: aktif ? '#065F46' : '#64748B' }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background: aktif ? '#10B981' : '#94A3B8' }} />
      {aktif ? 'Aktif' : 'Nonaktif'}
    </span>
  );
}

export default function AdminPanel({ onNavigate }) {
  const [accounts, setAccounts]       = useState(MOCK_ACCOUNTS);
  const [search, setSearch]           = useState('');
  const [filterJabatan, setFilterJabatan] = useState('Semua');
  const [showModal, setShowModal]     = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [form, setForm]               = useState(EMPTY_FORM);
  const [loading, setLoading]         = useState(false);
  const [showPass, setShowPass]       = useState(false);
  const [toast, setToast]             = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const showToast = (type, msg) => { setToast({ type, msg }); setTimeout(() => setToast(null), 4000); };

  const filtered = accounts.filter(a => {
    const q = search.toLowerCase();
    return (!q || a.nama.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.jabatan.toLowerCase().includes(q))
      && (filterJabatan === 'Semua' || a.jabatan === filterJabatan);
  });

  const openCreate = () => { setEditingId(null); setForm(EMPTY_FORM); setShowModal(true); };
  const openEdit   = (a) => { setEditingId(a.id); setForm({ nama:a.nama, email:a.email, jabatan:a.jabatan, hp:a.hp, password:'', sendInvite:false }); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama.trim() || !form.email.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        setAccounts(prev => prev.map(a => a.id === editingId ? { ...a, nama:form.nama, jabatan:form.jabatan, hp:form.hp } : a));
        showToast('success', `Data ${form.nama} diperbarui.`);
      } else {
        const res = await supabase.functions.invoke('create-user', {
          body: { email:form.email.trim(), password:form.sendInvite ? undefined : form.password, nama:form.nama.trim(), jabatan:form.jabatan, hp:form.hp.trim(), sendInvite:form.sendInvite },
        });
        if (res.error || res.data?.error) throw new Error(res.data?.error || res.error?.message);
        showToast('success', res.data?.message || `Akun ${form.nama} berhasil dibuat.`);
        setAccounts(prev => [{ id:Date.now(), nama:form.nama.trim(), email:form.email.trim(), jabatan:form.jabatan, hp:form.hp.trim(), status:'aktif', createdAt:new Date().toISOString().split('T')[0] }, ...prev]);
      }
    } catch(err) { showToast('error', err.message || 'Gagal.'); }
    setLoading(false); setShowModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('alhanif_role');
    onNavigate('login');
  };

  const inp = { width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#F8FAFC', fontSize:14, color:'#1E293B', outline:'none', boxSizing:'border-box', fontFamily:'inherit' };

  return (
    <div style={{ minHeight:'100vh', background:'#F1F5F9', fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", display:'flex' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:9999, display:'flex', alignItems:'center', gap:10,
          padding:'14px 20px', borderRadius:12, background:toast.type==='success'?'#065F46':'#DC2626',
          color:'#fff', fontSize:13, fontWeight:600, boxShadow:'0 8px 24px rgba(0,0,0,0.15)', maxWidth:360 }}>
          <span className="material-symbols-outlined" style={{fontSize:18}}>{toast.type==='success'?'check_circle':'error'}</span>
          {toast.msg}
        </div>
      )}

      {/* ── SIDEBAR ADMIN ── */}
      <aside style={{ width:260, flexShrink:0, background:'#0F172A', minHeight:'100vh', display:'flex', flexDirection:'column', position:'fixed', left:0, top:0, bottom:0, zIndex:40 }}>
        {/* Brand */}
        <div style={{ padding:'28px 24px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
            <img src={logoAlhanif} alt="Logo" style={{ width:40, height:40, borderRadius:10, objectFit:'cover' }} />
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:'#fff', letterSpacing:'-0.01em' }}>Al-Hanif</div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>Admin Panel</div>
            </div>
          </div>
          <div style={{ padding:'8px 12px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Login sebagai</div>
            <div style={{ fontSize:13, color:'#fff', fontWeight:700, marginTop:2 }}>Administrator</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:1 }}>admin@alhanif.id</div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'16px 12px' }}>
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.3)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:8, paddingLeft:12 }}>Menu Admin</div>
          {[
            { icon:'manage_accounts', label:'Manajemen Akun', active:true },
            { icon:'settings',        label:'Pengaturan Sistem', active:false },
          ].map(item => (
            <div key={item.label} style={{
              display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, marginBottom:4,
              background: item.active ? 'rgba(255,255,255,0.1)' : 'none',
              cursor:'pointer', color: item.active ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize:14, fontWeight: item.active ? 700 : 500,
            }}>
              <span className="material-symbols-outlined" style={{fontSize:20}}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding:'16px 12px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => onNavigate('beranda')}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10,
              border:'none', background:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)', fontSize:13, fontWeight:600, marginBottom:4 }}>
            <span className="material-symbols-outlined" style={{fontSize:18}}>language</span>
            Ke Website Publik
          </button>
          <button onClick={handleLogout}
            style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10,
              border:'none', background:'rgba(239,68,68,0.1)', cursor:'pointer', color:'#F87171', fontSize:13, fontWeight:700 }}>
            <span className="material-symbols-outlined" style={{fontSize:18}}>logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex:1, marginLeft:260, display:'flex', flexDirection:'column' }}>

        {/* Top header */}
        <header style={{ background:'#fff', borderBottom:'1px solid #E2E8F0', padding:'0 36px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:30 }}>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:'#0F172A', margin:0 }}>Manajemen Akun Asatidz & Staf</h1>
            <p style={{ fontSize:12, color:'#64748B', margin:0 }}>Kelola akun login portal internal pesantren</p>
          </div>
          <button onClick={openCreate} style={{
            display:'inline-flex', alignItems:'center', gap:8, padding:'10px 20px', borderRadius:10,
            background:'#0F172A', color:'#fff', border:'none', cursor:'pointer', fontSize:14, fontWeight:700,
            boxShadow:'0 4px 12px rgba(15,23,42,0.2)',
          }}>
            <span className="material-symbols-outlined" style={{fontSize:18}}>person_add</span>
            Buat Akun Baru
          </button>
        </header>

        <main style={{ padding:'32px 36px', flex:1 }}>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
            {[
              { label:'Total Akun',     value:accounts.length,                               icon:'group',          bg:'#EFF6FF', color:'#1D4ED8' },
              { label:'Akun Aktif',     value:accounts.filter(a=>a.status==='aktif').length,  icon:'verified_user',  bg:'#ECFDF5', color:'#065F46' },
              { label:'Akun Nonaktif',  value:accounts.filter(a=>a.status==='nonaktif').length,icon:'person_off',    bg:'#FEF2F2', color:'#991B1B' },
              { label:'Jabatan',        value:[...new Set(accounts.map(a=>a.jabatan))].length, icon:'badge',         bg:'#FFFBEB', color:'#92400E' },
            ].map(c => (
              <div key={c.label} style={{ background:'#fff', borderRadius:16, padding:'20px 24px', border:'1px solid #E2E8F0', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:c.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span className="material-symbols-outlined" style={{fontSize:22, color:c.color}}>{c.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize:28, fontWeight:800, color:'#0F172A', lineHeight:1 }}>{c.value}</div>
                  <div style={{ fontSize:12, color:'#64748B', fontWeight:600, marginTop:2 }}>{c.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Table card */}
          <div style={{ background:'#fff', borderRadius:20, border:'1px solid #E2E8F0', overflow:'hidden' }}>
            {/* Toolbar */}
            <div style={{ padding:'16px 24px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
              <div style={{ position:'relative', flex:1, maxWidth:360 }}>
                <span className="material-symbols-outlined" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:18, color:'#94A3B8' }}>search</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama, email, jabatan..."
                  style={{ ...inp, paddingLeft:40, padding:'9px 14px 9px 40px' }} />
              </div>
              <select value={filterJabatan} onChange={e=>setFilterJabatan(e.target.value)} style={{ ...inp, width:'auto', padding:'9px 14px', cursor:'pointer' }}>
                <option value="Semua">Semua Jabatan</option>
                {JABATAN_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
              </select>
              <span style={{ fontSize:12, color:'#94A3B8', fontWeight:600, whiteSpace:'nowrap' }}>{filtered.length} akun</span>
            </div>

            {/* Table */}
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'#F8FAFC', color:'#94A3B8', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.04em' }}>
                  {['Nama','Email Login','Jabatan','No. HP','Status','Bergabung','Aksi'].map(h => (
                    <th key={h} style={{ padding:'12px 20px', textAlign: h==='Aksi' ? 'right' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} style={{ borderTop:'1px solid #F1F5F9' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#FAFAFA'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:'50%', background:'#0F172A', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <span style={{ fontSize:14, fontWeight:700, color:'#fff' }}>
                            {a.nama.replace(/^(Ust\.|Ustadzah)\s*/i,'').charAt(0)}
                          </span>
                        </div>
                        <span style={{ fontWeight:700, color:'#0F172A' }}>{a.nama}</span>
                      </div>
                    </td>
                    <td style={{ padding:'14px 20px', color:'#475569' }}>{a.email}</td>
                    <td style={{ padding:'14px 20px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:6, background:'#F1F5F9', color:'#475569', fontSize:12, fontWeight:600 }}>{a.jabatan}</span>
                    </td>
                    <td style={{ padding:'14px 20px', color:'#475569' }}>{a.hp}</td>
                    <td style={{ padding:'14px 20px' }}><Badge status={a.status} /></td>
                    <td style={{ padding:'14px 20px', color:'#94A3B8', fontSize:12 }}>
                      {new Date(a.createdAt).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}
                    </td>
                    <td style={{ padding:'14px 20px', textAlign:'right' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6 }}>
                        {[
                          { icon:'edit', title:'Edit', color:'#475569', action:()=>openEdit(a) },
                          { icon:'lock_reset', title:'Reset Password', color:'#D97706', action:()=>showToast('success',`Link reset dikirim ke ${a.email}`) },
                          { icon:a.status==='aktif'?'person_off':'person_check', title:a.status==='aktif'?'Nonaktifkan':'Aktifkan',
                            color:a.status==='aktif'?'#DC2626':'#10B981',
                            action:()=>setAccounts(prev=>prev.map(x=>x.id===a.id?{...x,status:x.status==='aktif'?'nonaktif':'aktif'}:x)) },
                        ].map(btn => (
                          <button key={btn.icon} onClick={btn.action} title={btn.title}
                            style={{ width:32, height:32, borderRadius:8, border:'1px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span className="material-symbols-outlined" style={{fontSize:16, color:btn.color}}>{btn.icon}</span>
                          </button>
                        ))}
                        <button onClick={()=>setConfirmDelete(a.id)} title="Hapus"
                          style={{ width:32, height:32, borderRadius:8, border:'1px solid #FEE2E2', background:'#FFF5F5', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          <span className="material-symbols-outlined" style={{fontSize:16, color:'#DC2626'}}>delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#94A3B8' }}>
                    <span className="material-symbols-outlined" style={{fontSize:40, display:'block', marginBottom:8}}>manage_search</span>
                    Tidak ada akun ditemukan.
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* ── MODAL BUAT/EDIT AKUN ── */}
      {showModal && (
        <div onClick={e=>{if(e.target===e.currentTarget)setShowModal(false)}}
          style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'#fff', borderRadius:20, width:'100%', maxWidth:520, boxShadow:'0 24px 64px rgba(0,0,0,0.2)', overflow:'hidden' }}>
            <div style={{ padding:'24px 28px', borderBottom:'1px solid #F1F5F9', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:12, background:'#F1F5F9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{fontSize:22, color:'#0F172A'}}>{editingId?'manage_accounts':'person_add'}</span>
                </div>
                <div>
                  <div style={{ fontSize:16, fontWeight:700, color:'#0F172A' }}>{editingId ? 'Edit Akun' : 'Buat Akun Baru'}</div>
                  <div style={{ fontSize:12, color:'#64748B' }}>{editingId ? 'Perbarui informasi akun asatidz' : 'Tambah asatidz atau staf baru'}</div>
                </div>
              </div>
              <button onClick={()=>setShowModal(false)} style={{ width:32, height:32, borderRadius:8, border:'1px solid #E2E8F0', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{fontSize:18, color:'#94A3B8'}}>close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ padding:'24px 28px', display:'flex', flexDirection:'column', gap:16 }}>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:6 }}>Nama Lengkap (+ Gelar)</label>
                  <input required value={form.nama} onChange={e=>setForm(f=>({...f,nama:e.target.value}))} placeholder="Ust. Ahmad Fauzi, Lc." style={inp} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:6 }}>Email (untuk login)</label>
                  <input required type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="nama@alhanif.id" style={inp} disabled={!!editingId} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:6 }}>Jabatan</label>
                  <select value={form.jabatan} onChange={e=>setForm(f=>({...f,jabatan:e.target.value}))} style={{ ...inp, cursor:'pointer' }}>
                    {JABATAN_OPTIONS.map(j=><option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:6 }}>Nomor HP / WhatsApp</label>
                  <input value={form.hp} onChange={e=>setForm(f=>({...f,hp:e.target.value}))} placeholder="0812-3456-7890" style={inp} />
                </div>
                {!editingId && (
                  <div style={{ background:'#F8FAFC', borderRadius:12, padding:16, border:'1px solid #E2E8F0' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#0F172A', marginBottom:12 }}>Metode Aktivasi</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                      {[
                        { value:true,  title:'Kirim Link Undangan via Email', desc:'Asatidz atur password sendiri (Direkomendasikan)' },
                        { value:false, title:'Set Password Langsung',         desc:'Admin tentukan password, asatidz bisa ganti nanti' },
                      ].map(opt => (
                        <label key={String(opt.value)} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer' }}>
                          <input type="radio" checked={form.sendInvite===opt.value} onChange={()=>setForm(f=>({...f,sendInvite:opt.value}))} style={{ marginTop:3 }} />
                          <div>
                            <div style={{ fontSize:13, fontWeight:600, color:'#0F172A' }}>{opt.title}</div>
                            <div style={{ fontSize:12, color:'#64748B' }}>{opt.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    {!form.sendInvite && (
                      <div style={{ marginTop:12, position:'relative' }}>
                        <label style={{ display:'block', fontSize:13, fontWeight:600, color:'#0F172A', marginBottom:6 }}>Password</label>
                        <input type={showPass?'text':'password'} value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}
                          placeholder="Minimal 8 karakter" style={{ ...inp, paddingRight:44 }} minLength={8} required={!form.sendInvite} />
                        <button type="button" onClick={()=>setShowPass(s=>!s)}
                          style={{ position:'absolute', right:12, bottom:11, background:'none', border:'none', cursor:'pointer' }}>
                          <span className="material-symbols-outlined" style={{fontSize:18, color:'#94A3B8'}}>{showPass?'visibility_off':'visibility'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ padding:'16px 28px 24px', display:'flex', gap:10, justifyContent:'flex-end', borderTop:'1px solid #F1F5F9' }}>
                <button type="button" onClick={()=>setShowModal(false)}
                  style={{ padding:'10px 20px', borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', fontSize:13, fontWeight:600 }}>Batal</button>
                <button type="submit" disabled={loading}
                  style={{ padding:'10px 24px', borderRadius:10, border:'none', background:loading?'#94A3B8':'#0F172A', color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                  <span className="material-symbols-outlined" style={{fontSize:16}}>{editingId?'save':'person_add'}</span>
                  {loading ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Akun'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {confirmDelete && (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,42,0.6)', zIndex:1001, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:360, boxShadow:'0 16px 48px rgba(0,0,0,0.2)' }}>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'#FEE2E2', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
              <span className="material-symbols-outlined" style={{fontSize:24, color:'#DC2626'}}>delete_forever</span>
            </div>
            <div style={{ fontSize:16, fontWeight:700, color:'#0F172A', textAlign:'center', marginBottom:8 }}>Hapus Akun?</div>
            <div style={{ fontSize:13, color:'#64748B', textAlign:'center', marginBottom:24 }}>Akun ini akan dihapus permanen. Tindakan tidak bisa dibatalkan.</div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setConfirmDelete(null)} style={{ flex:1, padding:10, borderRadius:10, border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', fontSize:13, fontWeight:600 }}>Batal</button>
              <button onClick={()=>{ setAccounts(prev=>prev.filter(a=>a.id!==confirmDelete)); setConfirmDelete(null); showToast('success','Akun dihapus.'); }}
                style={{ flex:1, padding:10, borderRadius:10, border:'none', background:'#DC2626', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:700 }}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
