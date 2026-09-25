import { useState } from 'react';
import { logoAlhanif } from '../assets/images/index.js';

const DOKUMEN = [
  { id: 1, nama: 'Akta Kelahiran Santri', sub: 'Format: PDF / Scan Asli Berwarna', icon: 'description', tipe: 'Wajib', tipeBg: '#F1F5F9', tipeColor: '#64748B', status: 'lengkap', catatan: 'Terverifikasi cocok dengan data Disdukcapil & EMIS Kemenag.' },
  { id: 2, nama: 'Kartu Keluarga (KK)', sub: 'No. KK: 3204120803150001', icon: 'family_restroom', tipe: 'Wajib', tipeBg: '#F1F5F9', tipeColor: '#64748B', status: 'lengkap', catatan: 'Scan KK barcode aktif, data nama ibu & santri sesuai.' },
  { id: 3, nama: 'KTP Orang Tua / Wali', sub: 'e-KTP Asli Berwarna', icon: 'contact_mail', tipe: 'Wajib', tipeBg: '#F1F5F9', tipeColor: '#64748B', status: 'lengkap', catatan: 'Terverifikasi identitas wali santri sah dan domisili tercatat.' },
  { id: 4, nama: 'Pas Foto Formal Santri (3x4 Background Merah)', sub: 'Kemeja Putih Berpeci Hitam', icon: 'account_box', tipe: 'Wajib', tipeBg: '#F1F5F9', tipeColor: '#64748B', status: 'lengkap', catatan: 'Resolusi tajam, telah disinkronkan ke buku induk santri.' },
  { id: 5, nama: 'Ijazah / SKL SD/MI Asal Terakhir', sub: 'Legalisir Basah Sekolah Asal (Depan-Belakang)', icon: 'school', tipe: 'Sangat Penting', tipeBg: '#FEE2E2', tipeColor: '#DC2626', status: 'belum', catatan: 'Dibutuhkan mendesak untuk pengusulan NISN Ujian Madrasah Tsanawiyah.' },
  { id: 6, nama: 'Surat Keterangan Kematian Ayah / Kartu Yatim (KIP)', sub: 'Legalitas Penetapan Beasiswa Yatim Penuh', icon: 'card_membership', tipe: 'Berkas Beasiswa', tipeBg: '#FEF9C3', tipeColor: '#854D0E', status: 'legalisir', catatan: 'Surat keterangan lama buram. Mohon unggah ulang salinan stempel basah Desa/Kelurahan.' },
  { id: 7, nama: 'Surat Keterangan Sehat & Bebas TBC (Hasil Lab/Rontgen)', sub: 'Dari Puskesmas / RS Pemerintah', icon: 'medical_services', tipe: 'Syarat Asrama', tipeBg: '#FEE2E2', tipeColor: '#DC2626', status: 'belum', catatan: 'Wajib untuk arsip rekam medis UKS dan pemeliharaan kesehatan santri.' },
];

const STATUS_CONFIG = {
  lengkap:   { label: 'Lengkap & Sah',            bg: 'rgba(160,243,153,0.3)', color: '#1b6d24', icon: 'check_circle' },
  belum:     { label: 'Belum Diunggah',            bg: '#ffdad6',               color: '#93000a', icon: 'error' },
  legalisir: { label: 'Perlu Pembaruan Legalisir', bg: '#ffe088',               color: '#574500', icon: 'warning' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'999px', background:cfg.bg, color:cfg.color, fontSize:'12px', fontWeight:'700' }}>
      <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}

export default function PortalWali({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('berkas');

  const santri = { nama:'Muhammad Rayhan Al-Fatih', panggilan:'Rayhan', nisn:'3102948201', nik:'3204121508100003', ttl:'Bandung, 15 Agustus 2010', jenkel:'Laki-laki', golDarah:'O (Positif)', anakKe:'2 dari 3 Bersaudara', status:'Yatim (Penerima Beasiswa)', jenjang:'MTs Al-Hanif (Tingkat IX)', kelas:'Kelas IX-A MTs', kamar:'Gedung Abu Bakar No. 204', musyrif:'Ust. Ahmad Fauzi, Lc.', muhaffizh:'Ust. M. Ridwan, S.Pd.I.', tahunMasuk:'2022 (Angkatan VII)', statusAsrama:'Mukim Penuh (Boarding)' };
  const wali = { nama:'Ibu Siti Aminah', nik:'3204125805790002', hp:'0812-3456-7890', pekerjaan:'Ibu Rumah Tangga / Wirausaha', alamat:'Jl. Sukamaju No. 14 RT 03/RW 07, Baleendah, Kab. Bandung, Jawa Barat', kontakDarurat:'0813-8822-1940 (Paman)', hubungan:'Ibu Kandung' };

  const jumlahLengkap = DOKUMEN.filter(d => d.status === 'lengkap').length;
  const jumlahBelum   = DOKUMEN.filter(d => d.status === 'belum').length;
  const jumlahPending = DOKUMEN.filter(d => d.status === 'legalisir').length;
  const persen = Math.round((jumlahLengkap / DOKUMEN.length) * 100);

  const S = { // shorthand style helpers
    card: { background:'#fff', borderRadius:'20px', padding:'24px', boxShadow:'0 1px 8px rgba(0,0,0,0.06)', border:'1px solid #DEE8FF' },
    cardHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:'14px', borderBottom:'1px solid #F0F3FF', marginBottom:'16px' },
    row: { display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'8px 0', fontSize:'13px', gap:'8px' },
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'Plus Jakarta Sans','Inter',sans-serif", background:'#F9F9FF' }}>

      {/* SIDEBAR */}
      <aside style={{ width:'288px', flexShrink:0, background:'#fff', height:'100vh', position:'fixed', left:0, top:0, boxShadow:'0 1px 16px rgba(20,90,50,0.06)', display:'flex', flexDirection:'column', justifyContent:'space-between', zIndex:50 }}>
        <div style={{ overflowY:'auto' }}>
          <div style={{ height:'80px', padding:'0 24px', display:'flex', alignItems:'center', gap:'12px', background:'#F0F3FF' }}>
            <img src={logoAlhanif} alt="Logo" style={{ height:'32px', width:'auto', objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:'16px', fontWeight:'700', color:'#004120' }}>Al-Hanif</div>
              <div style={{ fontSize:'12px', color:'#64748B' }}>Pesantren Yatim</div>
            </div>
          </div>
          <div style={{ padding:'16px 12px' }}>
            <div style={{ fontSize:'11px', fontWeight:'700', color:'#94A3B8', textTransform:'uppercase', letterSpacing:'0.08em', padding:'0 8px', marginBottom:'8px' }}>Menu Utama</div>
            {[
              { id:'berkas',   icon:'badge',       label:'Profil & Berkas Santri' },
              { id:'hafalan',  icon:'menu_book',   label:"Perkembangan Hafalan" },
              { id:'nilai',    icon:'school',      label:'Rapor & Nilai' },
              { id:'presensi', icon:'fact_check',  label:'Presensi & Kedisiplinan' },
            ].map(item => (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'10px 16px', borderRadius:'12px', border:'none', cursor:'pointer', textAlign:'left', marginBottom:'4px', background: activeTab===item.id ? '#145A32' : 'transparent', color: activeTab===item.id ? '#fff' : '#1E293B', fontWeight: activeTab===item.id ? '700' : '500', fontSize:'14px', transition:'all 0.15s' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'20px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ padding:'16px', display:'flex', flexDirection:'column', gap:'10px', background:'#F0F3FF' }}>
          <div style={{ background:'#fff', padding:'14px', borderRadius:'12px', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(212,175,55,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'18px', color:'#735c00' }}>verified_user</span>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'11px', color:'#64748B' }}>Status Verifikasi</div>
              <div style={{ fontSize:'13px', fontWeight:'700', color:'#735c00' }}>Perlu Dilengkapi ({persen}%)</div>
            </div>
          </div>
          <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
            style={{ background:'#145A32', padding:'14px', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'space-between', textDecoration:'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'18px', color:'#D4AF37' }}>support_agent</span>
              <div>
                <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.7)' }}>Bantuan Administrasi</div>
                <div style={{ fontSize:'13px', fontWeight:'600', color:'#fff' }}>WhatsApp Kesantrian</div>
              </div>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize:'16px', color:'rgba(255,255,255,0.6)' }}>arrow_outward</span>
          </a>
          <button onClick={() => onNavigate('login')}
            style={{ width:'100%', padding:'10px', borderRadius:'10px', border:'1.5px solid #E2E8F0', background:'#fff', cursor:'pointer', fontSize:'13px', fontWeight:'600', color:'#64748B', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px' }}>
            <span className="material-symbols-outlined" style={{ fontSize:'16px' }}>logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft:'288px', flex:1 }}>
        {/* Header */}
        <header style={{ position:'fixed', top:0, left:'288px', right:0, height:'80px', background:'rgba(255,255,255,0.94)', backdropFilter:'blur(16px)', zIndex:40, boxShadow:'0 1px 12px rgba(20,90,50,0.05)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <img src={logoAlhanif} alt="Logo" style={{ height:'36px', objectFit:'contain' }} />
            <div>
              <div style={{ fontSize:'18px', fontWeight:'700', color:'#004120' }}>Portal Data & Dokumen Santri</div>
              <div style={{ fontSize:'12px', color:'#64748B' }}>Pondok Pesantren Yatim Al-Hanif</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'999px', background:'#F0F3FF', border:'1px solid #DEE8FF', fontSize:'12px', color:'#64748B' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'14px', color:'#735c00' }}>folder_managed</span>
              T.A. 2024/2025 Genap
            </span>
            <button style={{ position:'relative', width:'40px', height:'40px', borderRadius:'10px', background:'#F0F3FF', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize:'20px' }}>notifications</span>
              <span style={{ position:'absolute', top:'8px', right:'8px', width:'8px', height:'8px', borderRadius:'50%', background:'#BA1A1A', border:'2px solid #fff' }} />
            </button>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', paddingLeft:'16px', borderLeft:'1px solid #E2E8F0' }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:'14px', fontWeight:'700', color:'#1E293B' }}>{wali.nama}</div>
                <div style={{ fontSize:'12px', color:'#1b6d24', fontWeight:'500' }}>Wali: {santri.panggilan} (IX-A)</div>
              </div>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#145A32', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize:'18px', color:'#fff' }}>person</span>
              </div>
            </div>
          </div>
        </header>

        <main style={{ paddingTop:'100px', padding:'100px 40px 60px', display:'flex', flexDirection:'column', gap:'28px' }}>

          {/* BANNER */}
          <section style={{ ...S.card, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', right:'-64px', top:'-64px', width:'256px', height:'256px', borderRadius:'50%', background:'rgba(212,175,55,0.1)', filter:'blur(40px)', pointerEvents:'none' }} />
            <div style={{ position:'relative', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:'24px' }}>
              <div style={{ flex:1, minWidth:'280px' }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'12px' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'999px', background:'rgba(255,224,136,0.5)', color:'#574500', fontSize:'12px', fontWeight:'700' }}>
                    <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#735c00' }} /> Perlu Tindakan Wali Santri
                  </span>
                  <span style={{ fontSize:'12px', color:'#64748B', display:'flex', alignItems:'center', gap:'4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'14px', color:'#004120' }}>verified</span>
                    SIAKAD & Berkas Administrasi Al-Hanif
                  </span>
                </div>
                <h1 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'24px', fontWeight:'700', color:'#004120', marginBottom:'8px' }}>
                  Status Kelengkapan Data & Berkas Santri
                </h1>
                <p style={{ fontSize:'14px', color:'#64748B', lineHeight:'1.6', maxWidth:'560px' }}>
                  Mohon lengkapi seluruh dokumen persyaratan resmi agar legalitas kesiswaan (NISN, EMIS Kemenag, dan Beasiswa Penuh) Ananda tetap terverifikasi aktif.
                </p>
                <div style={{ marginTop:'16px', padding:'14px 18px', borderRadius:'12px', background:'#F0F3FF', border:'1px solid #DEE8FF', maxWidth:'560px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ fontSize:'13px', fontWeight:'700', color:'#1E293B' }}>Kelengkapan Berkas: {persen}%</span>
                      <span style={{ padding:'2px 8px', borderRadius:'6px', background:'#ffdad6', color:'#93000a', fontSize:'11px', fontWeight:'700' }}>{jumlahBelum + jumlahPending} Belum Lengkap</span>
                    </div>
                    <span style={{ fontSize:'12px', fontWeight:'700', color:'#1b6d24' }}>{jumlahLengkap}/{DOKUMEN.length} Terverifikasi</span>
                  </div>
                  <div style={{ width:'100%', height:'12px', borderRadius:'999px', background:'#DEE8FF', overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${persen}%`, background:'linear-gradient(to right, #1b6d24, #145A32)', borderRadius:'999px', transition:'width 0.8s ease' }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginTop:'6px', fontSize:'11px' }}>
                    <span style={{ color:'#1b6d24', display:'flex', alignItems:'center', gap:'3px' }}><span className="material-symbols-outlined" style={{ fontSize:'13px' }}>check_circle</span> {jumlahLengkap} Sah</span>
                    <span style={{ color:'#735c00', display:'flex', alignItems:'center', gap:'3px' }}><span className="material-symbols-outlined" style={{ fontSize:'13px' }}>pending</span> {jumlahPending} Legalisir</span>
                    <span style={{ color:'#BA1A1A', display:'flex', alignItems:'center', gap:'3px' }}><span className="material-symbols-outlined" style={{ fontSize:'13px' }}>error</span> {jumlahBelum} Belum</span>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                <a href="#daftar-berkas" style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 20px', borderRadius:'12px', background:'#145A32', color:'#fff', textDecoration:'none', fontWeight:'700', fontSize:'14px', boxShadow:'0 4px 16px rgba(20,90,50,0.25)' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'18px' }}>upload_file</span>
                  Lengkapi Berkas Sekarang
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                  style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 20px', borderRadius:'12px', background:'#F0F3FF', color:'#145A32', textDecoration:'none', fontWeight:'700', fontSize:'14px', border:'1.5px solid #DEE8FF' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'18px' }}>help_outline</span>
                  Bantuan Upload
                </a>
              </div>
            </div>
          </section>

          {/* DATA CARDS */}
          <section style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px' }}>
            {/* Card Santri */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(173,242,189,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'20px', color:'#004120' }}>badge</span>
                  </div>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#1E293B' }}>Data Pribadi Santri</div>
                    <div style={{ fontSize:'11px', color:'#64748B' }}>Identitas Kependudukan</div>
                  </div>
                </div>
                <span style={{ padding:'3px 10px', borderRadius:'999px', background:'rgba(160,243,153,0.3)', color:'#1b6d24', fontSize:'11px', fontWeight:'700' }}>Tervalidasi</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'10px', borderRadius:'12px', background:'#F0F3FF', marginBottom:'14px' }}>
                <div style={{ width:'48px', height:'48px', borderRadius:'10px', background:'#145A32', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'24px', color:'#fff' }}>person</span>
                </div>
                <div>
                  <div style={{ fontSize:'11px', color:'#64748B' }}>Nama Lengkap</div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:'#004120' }}>{santri.nama}</div>
                  <div style={{ fontSize:'11px', color:'#1b6d24' }}>Status: Santri Mukim (Yatim)</div>
                </div>
              </div>
              {[['NISN', santri.nisn], ['NIK Santri', santri.nik], ['Tempat, Tgl Lahir', santri.ttl], ['Jenis Kelamin', santri.jenkel], ['Golongan Darah', santri.golDarah], ['Anak Ke-', santri.anakKe]].map(([label, value], i) => (
                <div key={i} style={{ ...S.row, borderBottom:'1px solid #F0F3FF' }}>
                  <span style={{ color:'#64748B' }}>{label}</span>
                  <span style={{ fontWeight:'600', color:'#1E293B', textAlign:'right' }}>{value}</span>
                </div>
              ))}
              <div style={S.row}>
                <span style={{ color:'#64748B' }}>Status Kesantrian</span>
                <span style={{ padding:'2px 8px', borderRadius:'6px', background:'rgba(173,242,189,0.5)', color:'#004120', fontWeight:'700', fontSize:'11px' }}>{santri.status}</span>
              </div>
            </div>

            {/* Card Wali */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,224,136,0.4)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'20px', color:'#735c00' }}>escalator_warning</span>
                  </div>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#1E293B' }}>Data Orang Tua / Wali</div>
                    <div style={{ fontSize:'11px', color:'#64748B' }}>Kontak Penanggung Jawab</div>
                  </div>
                </div>
                <button style={{ display:'flex', alignItems:'center', gap:'4px', fontSize:'12px', fontWeight:'700', color:'#145A32', background:'none', border:'none', cursor:'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>edit</span> Edit
                </button>
              </div>
              {[['Nama Ibu Kandung / Wali', wali.nama, false], ['NIK Wali', wali.nik, false], ['No. HP / WA', wali.hp, true], ['Pekerjaan', wali.pekerjaan, false], ['Alamat Domisili', wali.alamat, false], ['Kontak Darurat', wali.kontakDarurat, false], ['Hubungan Wali', wali.hubungan, false]].map(([label, value, phone], i, arr) => (
                <div key={i} style={{ ...S.row, borderBottom: i < arr.length - 1 ? '1px solid #F0F3FF' : 'none' }}>
                  <span style={{ color:'#64748B', flexShrink:0 }}>{label}</span>
                  {phone
                    ? <span style={{ fontWeight:'700', color:'#145A32', display:'flex', alignItems:'center', gap:'4px' }}><span className="material-symbols-outlined" style={{ fontSize:'14px', color:'#1b6d24' }}>phone_iphone</span>{value}</span>
                    : <span style={{ fontWeight:'600', color:'#1E293B', textAlign:'right' }}>{value}</span>}
                </div>
              ))}
            </div>

            {/* Card Akademik */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                  <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(163,246,156,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize:'20px', color:'#1b6d24' }}>cottage</span>
                  </div>
                  <div>
                    <div style={{ fontSize:'15px', fontWeight:'700', color:'#1E293B' }}>Akademik & Asrama</div>
                    <div style={{ fontSize:'11px', color:'#64748B' }}>Penempatan Santri</div>
                  </div>
                </div>
                <span style={{ padding:'3px 10px', borderRadius:'999px', background:'rgba(160,243,153,0.3)', color:'#1b6d24', fontSize:'11px', fontWeight:'700' }}>Aktif</span>
              </div>
              {[['Jenjang Formal', santri.jenjang, false], ['Kelas / Rombel', santri.kelas, true], ['Kamar & Gedung', santri.kamar, false], ['Musyrif Kamar', santri.musyrif, false], ['Muhaffizh Halaqah', santri.muhaffizh, false], ['Tahun Masuk', santri.tahunMasuk, false], ['Status Asrama', santri.statusAsrama, true]].map(([label, value, hl], i, arr) => (
                <div key={i} style={{ ...S.row, borderBottom: i < arr.length - 1 ? '1px solid #F0F3FF' : 'none' }}>
                  <span style={{ color:'#64748B', flexShrink:0 }}>{label}</span>
                  <span style={{ fontWeight: hl ? '700' : '600', color: hl ? '#004120' : '#1E293B', textAlign:'right' }}>{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CHECKLIST DOKUMEN */}
          <section id="daftar-berkas" style={S.card}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:'16px', borderBottom:'1px solid #F0F3FF', marginBottom:'20px', flexWrap:'wrap', gap:'12px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'#145A32', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'22px', color:'#fff' }}>checklist_rtl</span>
                </div>
                <div>
                  <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:'20px', fontWeight:'700', color:'#004120' }}>Checklist Dokumen & Berkas Persyaratan</h2>
                  <p style={{ fontSize:'12px', color:'#64748B' }}>Pemeriksaan berkas fisik & digital oleh Bagian Tata Usaha Kesantrian</p>
                </div>
              </div>
              <div style={{ display:'flex', gap:'8px' }}>
                <button style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'8px 14px', borderRadius:'10px', background:'#F0F3FF', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600', color:'#1E293B' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'16px' }}>sync</span> Segarkan
                </button>
                <button style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'8px 16px', borderRadius:'10px', background:'#145A32', border:'none', cursor:'pointer', fontSize:'13px', fontWeight:'600', color:'#fff' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'16px' }}>cloud_upload</span> Unggah Berkas
                </button>
              </div>
            </div>

            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
                <thead>
                  <tr style={{ background:'#F0F3FF', color:'#64748B', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                    {['Nama Dokumen / Berkas', 'Tipe', 'Status Kelengkapan', 'Keterangan / Catatan', 'Aksi Dokumen'].map((th, i, arr) => (
                      <th key={i} style={{ padding:'12px 16px', textAlign: i === arr.length - 1 ? 'right' : 'left', borderRadius: i===0 ? '10px 0 0 10px' : i===arr.length-1 ? '0 10px 10px 0' : 0 }}>{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DOKUMEN.map((dok) => (
                    <tr key={dok.id} style={{ borderBottom:'1px solid #F0F3FF', background: dok.status==='belum' ? 'rgba(255,218,214,0.12)' : dok.status==='legalisir' ? 'rgba(255,224,136,0.12)' : 'transparent' }}>
                      <td style={{ padding:'14px 16px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize:'22px', color: dok.status==='lengkap' ? '#1b6d24' : dok.status==='belum' ? '#BA1A1A' : '#735c00' }}>{dok.icon}</span>
                          <div>
                            <div style={{ fontWeight:'700', color: dok.status==='belum' ? '#BA1A1A' : '#1E293B' }}>{dok.nama}</div>
                            <div style={{ fontSize:'11px', color:'#64748B', marginTop:'2px' }}>{dok.sub}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:'14px 16px' }}>
                        <span style={{ padding:'3px 8px', borderRadius:'6px', background:dok.tipeBg, color:dok.tipeColor, fontSize:'11px', fontWeight:'600' }}>{dok.tipe}</span>
                      </td>
                      <td style={{ padding:'14px 16px' }}><StatusBadge status={dok.status} /></td>
                      <td style={{ padding:'14px 16px', fontSize:'12px', color: dok.status==='belum' ? '#BA1A1A' : dok.status==='legalisir' ? '#735c00' : '#64748B', maxWidth:'240px' }}>{dok.catatan}</td>
                      <td style={{ padding:'14px 16px', textAlign:'right' }}>
                        {dok.status === 'lengkap' && (
                          <button style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'6px 12px', borderRadius:'8px', background:'#F0F3FF', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'600', color:'#145A32' }}>
                            <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>visibility</span> Lihat
                          </button>
                        )}
                        {dok.status === 'belum' && (
                          <button style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'6px 12px', borderRadius:'8px', background:'#BA1A1A', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700', color:'#fff' }}>
                            <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>upload</span> Unggah
                          </button>
                        )}
                        {dok.status === 'legalisir' && (
                          <button style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'6px 12px', borderRadius:'8px', background:'#735c00', border:'none', cursor:'pointer', fontSize:'12px', fontWeight:'700', color:'#fff' }}>
                            <span className="material-symbols-outlined" style={{ fontSize:'14px' }}>published_with_changes</span> Perbarui
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PANDUAN & HELPDESK */}
          <section style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px' }}>
            <div style={S.card}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(255,224,136,0.3)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'20px', color:'#735c00' }}>info</span>
                </div>
                <div>
                  <div style={{ fontSize:'16px', fontWeight:'700', color:'#004120' }}>Petunjuk & Ketentuan Unggah Berkas</div>
                  <div style={{ fontSize:'12px', color:'#64748B' }}>Panduan bagi Ayah/Bunda dalam melengkapi dokumen digital santri</div>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
                {[
                  { no:1, title:'Format Berkas', desc:'Gunakan file PDF atau Foto JPG/PNG beresolusi tinggi, tulisan terbaca jelas (maks. 5MB per file).' },
                  { no:2, title:'Salinan Legalisir', desc:'Untuk ijazah dan surat keterangan yatim, pastikan scan mencakup cap stempel basah instansi berwenang.' },
                  { no:3, title:'Kirim Fisik (Opsional)', desc:"Bila ada kendala scan online, dokumen fisik dapat diserahkan ke Kantor TU Ma'had saat jadwal sambangan." },
                ].map(item => (
                  <div key={item.no} style={{ padding:'14px', borderRadius:'12px', background:'#F0F3FF', border:'1px solid #DEE8FF' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'8px' }}>
                      <span style={{ width:'24px', height:'24px', borderRadius:'50%', background:'#145A32', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', flexShrink:0 }}>{item.no}</span>
                      <span style={{ fontSize:'13px', fontWeight:'700', color:'#004120' }}>{item.title}</span>
                    </div>
                    <p style={{ fontSize:'12px', color:'#64748B', lineHeight:'1.6' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background:'#145A32', borderRadius:'20px', padding:'28px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'12px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'24px', color:'#D4AF37' }}>support_agent</span>
                  <h3 style={{ fontSize:'16px', fontWeight:'700', color:'#fff' }}>Bantuan Administrasi</h3>
                </div>
                <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.7)', lineHeight:'1.6', marginBottom:'16px' }}>
                  Mengalami kesulitan saat mengunggah atau ingin memverifikasi berkas dengan staf TU Al-Hanif?
                </p>
                <div style={{ padding:'12px', borderRadius:'12px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
                  <div style={{ fontSize:'11px', color:'#D4AF37', fontWeight:'600', marginBottom:'4px' }}>Petugas Layanan Berkas:</div>
                  <div style={{ fontSize:'14px', fontWeight:'700', color:'#fff' }}>Ustadz Hendra Saputra (TU Kesantrian)</div>
                  <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)', marginTop:'2px' }}>Senin - Sabtu • 08.00 - 15.30 WIB</div>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', paddingTop:'20px' }}>
                <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
                  style={{ width:'100%', padding:'12px', borderRadius:'12px', background:'#88d982', color:'#002204', textDecoration:'none', fontWeight:'700', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize:'18px' }}>chat</span>
                  Konsultasi Via WhatsApp
                </a>
                <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.5)', textAlign:'center' }}>Respon cepat dalam jam kerja pesantren</p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
