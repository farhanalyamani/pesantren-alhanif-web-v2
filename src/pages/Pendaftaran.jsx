import { useState } from 'react';
import supabase from '../lib/supabase';

/* ── Constants ── */
const STEPS = [
  { id: 1, icon: 'person', label: 'Data Calon Santri' },
  { id: 2, icon: 'family_restroom', label: 'Data Orang Tua / Wali' },
  { id: 3, icon: 'upload_file', label: 'Berkas & Dokumen' },
  { id: 4, icon: 'check_circle', label: 'Konfirmasi' },
];

const JENJANG_OPTIONS = [
  { value: '', label: '— Pilih Jenjang —' },
  { value: 'mts', label: 'MTs Al-Hanif (Setara SMP, Kelas 7–9)' },
  { value: 'ma', label: 'MA Al-Hanif (Setara SMA, Kelas 10–12)' },
];

const GELOMBANG_OPTIONS = [
  { value: 'gel-1', label: 'Gelombang I — Pendaftaran s.d. 30 Juni 2025' },
  { value: 'gel-2', label: 'Gelombang II — Pendaftaran s.d. 31 Agustus 2025' },
];

const PROVINSI_OPTIONS = [
  '', 'Aceh', 'Bali', 'Banten', 'Bengkulu', 'DI Yogyakarta', 'DKI Jakarta',
  'Gorontalo', 'Jambi', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur',
  'Kalimantan Barat', 'Kalimantan Selatan', 'Kalimantan Tengah', 'Kalimantan Timur',
  'Kalimantan Utara', 'Kepulauan Bangka Belitung', 'Kepulauan Riau',
  'Lampung', 'Maluku', 'Maluku Utara', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur',
  'Papua', 'Papua Barat', 'Riau', 'Sulawesi Barat', 'Sulawesi Selatan',
  'Sulawesi Tengah', 'Sulawesi Tenggara', 'Sulawesi Utara', 'Sumatera Barat',
  'Sumatera Selatan', 'Sumatera Utara',
];

const TIMELINE = [
  { date: '1 Apr – 30 Jun', label: 'Pendaftaran Gelombang I', active: true },
  { date: '14–16 Jul', label: 'Ujian Seleksi Gel. I', active: false },
  { date: '18 Jul', label: 'Pengumuman Hasil Gel. I', active: false },
  { date: '1 Jul – 31 Agt', label: 'Pendaftaran Gelombang II', active: false },
  { date: '11–13 Sep', label: 'Ujian Seleksi Gel. II', active: false },
  { date: '15 Sep', label: 'Pengumuman Hasil Gel. II', active: false },
  { date: '6 Okt', label: 'Tahun Ajaran Baru Dimulai', active: false },
];

const PERSYARATAN = [
  { icon: 'description', text: 'Fotokopi Akte Kelahiran (2 lembar)' },
  { icon: 'badge', text: 'Fotokopi KK & KTP Orang Tua/Wali' },
  { icon: 'school', text: 'Fotokopi Ijazah/SKHUN SD/MI (legalisir)' },
  { icon: 'photo_camera', text: 'Pas Foto 3×4 (background putih, 4 lembar)' },
  { icon: 'health_and_safety', text: 'Surat Keterangan Sehat dari Puskesmas/Dokter' },
  { icon: 'volunteer_activism', text: 'Surat Keterangan Yatim/Dhuafa dari Desa/Kelurahan' },
  { icon: 'menu_book', text: 'Sertifikat Hafalan Al-Qur\'an (jika ada)' },
];

const KEUNGGULAN = [
  { icon: 'payments', title: '100% Gratis', sub: 'Tanpa biaya SPP, asrama, makan & kitab' },
  { icon: 'menu_book', title: 'Tahfidz 30 Juz', sub: 'Target hafal penuh bersanad muttashil' },
  { icon: 'school', title: 'Berakreditasi A', sub: 'MTs & MA diakui Kemenag RI' },
  { icon: 'public', title: 'Bilingual', sub: 'Aktif berbahasa Arab & Inggris sehari-hari' },
];

/* ── Input field helper ── */
function Field({ label, required, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>
        {label} {required && <span style={{ color: 'var(--color-error)' }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>{hint}</span>}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--color-outline-variant)',
  background: 'var(--color-surface-container-lowest)',
  fontSize: '14px',
  color: 'var(--color-on-surface)',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-sans)',
  transition: 'border-color 0.15s',
};

const selectStyle = { ...inputStyle, cursor: 'pointer', appearance: 'none' };

function Input(props) {
  return (
    <input
      style={inputStyle}
      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
      onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
      {...props}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        style={selectStyle}
        onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
        onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
        {...props}
      >
        {children}
      </select>
      <span className="material-symbols-outlined" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: 'var(--color-on-surface-variant)', pointerEvents: 'none' }}>
        expand_more
      </span>
    </div>
  );
}

function Textarea(props) {
  return (
    <textarea
      rows={3}
      style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
      onFocus={e => e.target.style.borderColor = 'var(--color-primary)'}
      onBlur={e => e.target.style.borderColor = 'var(--color-outline-variant)'}
      {...props}
    />
  );
}

/* ── Upload Drop Zone ── */
function UploadZone({ label, hint, id }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (f) => {
    if (f) setFile(f);
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
      style={{
        border: `2px dashed ${dragging ? 'var(--color-primary)' : file ? 'var(--color-secondary)' : 'var(--color-outline-variant)'}`,
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        background: dragging ? 'rgba(173,242,189,0.1)' : file ? 'rgba(173,242,189,0.05)' : 'var(--color-surface-container-low)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onClick={() => document.getElementById(id)?.click()}
    >
      <input id={id} type="file" style={{ display: 'none' }} accept=".jpg,.jpeg,.png,.pdf"
        onChange={e => handleFile(e.target.files[0])} />

      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-secondary)' }}>check_circle</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-secondary)' }}>{file.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)' }}>
              {(file.size / 1024).toFixed(0)} KB • Klik untuk ganti
            </div>
          </div>
        </div>
      ) : (
        <div>
          <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-outline)', display: 'block', marginBottom: '8px' }}>cloud_upload</span>
          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{label}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            {hint || 'Drag & drop atau klik untuk pilih file (JPG, PNG, PDF — maks. 2MB)'}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Step Components ── */
function Step1({ data, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="Nama Lengkap Calon Santri" required>
          <Input id="nama-lengkap" placeholder="Sesuai Akte Kelahiran"
            value={data.namaLengkap} onChange={e => onChange('namaLengkap', e.target.value)} />
        </Field>
        <Field label="Nama Panggilan">
          <Input id="nama-panggilan" placeholder="Nama yang biasa dipanggil"
            value={data.namaPanggilan} onChange={e => onChange('namaPanggilan', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <Field label="Jenis Kelamin" required>
          <Select id="jenis-kelamin" value={data.jenisKelamin} onChange={e => onChange('jenisKelamin', e.target.value)}>
            <option value="">— Pilih —</option>
            <option value="L">Laki-laki (Putra)</option>
            <option value="P">Perempuan (Putri)</option>
          </Select>
        </Field>
        <Field label="Tempat Lahir" required>
          <Input id="tempat-lahir" placeholder="Kota/Kabupaten"
            value={data.tempatLahir} onChange={e => onChange('tempatLahir', e.target.value)} />
        </Field>
        <Field label="Tanggal Lahir" required>
          <Input id="tanggal-lahir" type="date"
            value={data.tanggalLahir} onChange={e => onChange('tanggalLahir', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="NISN (Nomor Induk Siswa Nasional)" hint="Kosongkan jika belum memiliki">
          <Input id="nisn" placeholder="10 digit angka" maxLength={10}
            value={data.nisn} onChange={e => onChange('nisn', e.target.value)} />
        </Field>
        <Field label="NIK (Nomor Induk Kependudukan)" required>
          <Input id="nik" placeholder="16 digit angka sesuai KK" maxLength={16}
            value={data.nik} onChange={e => onChange('nik', e.target.value)} />
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <Field label="Asal Sekolah Terakhir" required>
          <Input id="asal-sekolah" placeholder="Nama SD/MI/SMP/MTs asal"
            value={data.asalSekolah} onChange={e => onChange('asalSekolah', e.target.value)} />
        </Field>
        <Field label="Tahun Lulus" required>
          <Select id="tahun-lulus" value={data.tahunLulus} onChange={e => onChange('tahunLulus', e.target.value)}>
            <option value="">— Pilih —</option>
            {[2025, 2024, 2023, 2022].map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </Field>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="Jenjang yang Dituju" required>
          <Select id="jenjang" value={data.jenjang} onChange={e => onChange('jenjang', e.target.value)}>
            {JENJANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Gelombang Pendaftaran" required>
          <Select id="gelombang" value={data.gelombang} onChange={e => onChange('gelombang', e.target.value)}>
            <option value="">— Pilih Gelombang —</option>
            {GELOMBANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>

      {/* Hafalan */}
      <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(173,242,189,0.12)', border: '1px solid var(--color-secondary-container)' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>menu_book</span>
          Capaian Hafalan Al-Qur'an (opsional, nilai plus seleksi)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Field label="Jumlah Juz Hafalan">
            <Select id="juz-hafalan" value={data.juzHafalan} onChange={e => onChange('juzHafalan', e.target.value)}>
              <option value="0">Belum hafal</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
                <option key={j} value={j}>{j} Juz</option>
              ))}
            </Select>
          </Field>
          <Field label="Surah Terakhir Dihafal">
            <Input id="surah-hafalan" placeholder="cth: Al-Mulk, Al-Kahfi..."
              value={data.surahHafalan} onChange={e => onChange('surahHafalan', e.target.value)} />
          </Field>
        </div>
      </div>

      <Field label="Status Yatim / Dhuafa" required>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { value: 'yatim-piatu', label: 'Yatim Piatu (Ayah & Ibu telah meninggal dunia)' },
            { value: 'yatim', label: 'Yatim (Ayah atau Ibu telah meninggal dunia)' },
            { value: 'dhuafa', label: 'Dhuafa Berprestasi (Keluarga kurang mampu secara ekonomi)' },
          ].map(opt => (
            <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--color-on-surface)' }}>
              <input type="radio" name="status-asuh" value={opt.value}
                checked={data.statusAsuh === opt.value}
                onChange={e => onChange('statusAsuh', e.target.value)}
                style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px' }} />
              {opt.label}
            </label>
          ))}
        </div>
      </Field>

      <Field label="Alamat Lengkap Asal" required>
        <Textarea id="alamat" placeholder="Jl., RT/RW, Kelurahan/Desa, Kecamatan, Kab/Kota"
          value={data.alamat} onChange={e => onChange('alamat', e.target.value)} />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        <Field label="Provinsi" required>
          <Select id="provinsi" value={data.provinsi} onChange={e => onChange('provinsi', e.target.value)}>
            {PROVINSI_OPTIONS.map(p => <option key={p} value={p}>{p || '— Pilih Provinsi —'}</option>)}
          </Select>
        </Field>
        <Field label="Kode Pos">
          <Input id="kode-pos" placeholder="5 digit" maxLength={5}
            value={data.kodePos} onChange={e => onChange('kodePos', e.target.value)} />
        </Field>
      </div>
    </div>
  );
}

function Step2({ data, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Ayah */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--color-surface-container-low)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>man</span>
          Data Ayah Kandung
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Nama Lengkap Ayah" required>
              <Input id="nama-ayah" placeholder="Nama sesuai KTP"
                value={data.namaAyah} onChange={e => onChange('namaAyah', e.target.value)} />
            </Field>
            <Field label="Pekerjaan Ayah">
              <Input id="pekerjaan-ayah" placeholder="cth: Petani, Buruh, dll."
                value={data.pekerjaanAyah} onChange={e => onChange('pekerjaanAyah', e.target.value)} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <Field label="Status Ayah" required>
              <Select id="status-ayah" value={data.statusAyah} onChange={e => onChange('statusAyah', e.target.value)}>
                <option value="">— Pilih —</option>
                <option value="hidup">Masih Hidup</option>
                <option value="meninggal">Sudah Meninggal</option>
              </Select>
            </Field>
            <Field label="No. HP / WhatsApp Ayah">
              <Input id="hp-ayah" placeholder="08xxxxxxxxxx" type="tel"
                value={data.hpAyah} onChange={e => onChange('hpAyah', e.target.value)} />
            </Field>
            <Field label="Penghasilan Bulanan">
              <Select id="penghasilan-ayah" value={data.penghasilanAyah} onChange={e => onChange('penghasilanAyah', e.target.value)}>
                <option value="">— Pilih —</option>
                <option value="0">Tidak ada penghasilan</option>
                <option value="&lt;1jt">Di bawah Rp 1.000.000</option>
                <option value="1-3jt">Rp 1.000.000 – Rp 3.000.000</option>
                <option value="3-5jt">Rp 3.000.000 – Rp 5.000.000</option>
                <option value="&gt;5jt">Di atas Rp 5.000.000</option>
              </Select>
            </Field>
          </div>
        </div>
      </div>

      {/* Ibu */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--color-surface-container-low)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>woman</span>
          Data Ibu Kandung
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Nama Lengkap Ibu" required>
              <Input id="nama-ibu" placeholder="Nama sesuai KTP"
                value={data.namaIbu} onChange={e => onChange('namaIbu', e.target.value)} />
            </Field>
            <Field label="Pekerjaan Ibu">
              <Input id="pekerjaan-ibu" placeholder="cth: Ibu Rumah Tangga, dll."
                value={data.pekerjaanIbu} onChange={e => onChange('pekerjaanIbu', e.target.value)} />
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Status Ibu" required>
              <Select id="status-ibu" value={data.statusIbu} onChange={e => onChange('statusIbu', e.target.value)}>
                <option value="">— Pilih —</option>
                <option value="hidup">Masih Hidup</option>
                <option value="meninggal">Sudah Meninggal</option>
              </Select>
            </Field>
            <Field label="No. HP / WhatsApp Ibu">
              <Input id="hp-ibu" placeholder="08xxxxxxxxxx" type="tel"
                value={data.hpIbu} onChange={e => onChange('hpIbu', e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      {/* Wali */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--color-surface-container-low)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>supervisor_account</span>
          Data Wali / Penanggung Jawab (jika bukan Orang Tua)
          <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--color-on-surface-variant)', marginLeft: 'auto' }}>Opsional</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <Field label="Nama Lengkap Wali">
              <Input id="nama-wali" placeholder="Nama wali/pengasuh"
                value={data.namaWali} onChange={e => onChange('namaWali', e.target.value)} />
            </Field>
            <Field label="Hubungan dengan Santri">
              <Select id="hub-wali" value={data.hubWali} onChange={e => onChange('hubWali', e.target.value)}>
                <option value="">— Pilih —</option>
                <option value="kakek-nenek">Kakek / Nenek</option>
                <option value="paman-bibi">Paman / Bibi</option>
                <option value="saudara">Saudara Kandung</option>
                <option value="lembaga">Lembaga / Yayasan</option>
                <option value="lain">Lainnya</option>
              </Select>
            </Field>
            <Field label="No. HP / WhatsApp Wali">
              <Input id="hp-wali" placeholder="08xxxxxxxxxx" type="tel"
                value={data.hpWali} onChange={e => onChange('hpWali', e.target.value)} />
            </Field>
          </div>
          <Field label="Alamat Lengkap Wali" hint="Isi jika berbeda dari alamat calon santri">
            <Textarea id="alamat-wali" placeholder="Alamat wali jika berbeda..."
              value={data.alamatWali} onChange={e => onChange('alamatWali', e.target.value)} />
          </Field>
        </div>
      </div>

      <div>
        <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '10px', borderBottom: '1px solid var(--color-surface-container-low)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>contact_phone</span>
          Kontak Darurat
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Nama Kontak Darurat" required>
            <Input id="kontak-darurat-nama" placeholder="Yang bisa dihubungi 24 jam"
              value={data.kontakDaruratNama} onChange={e => onChange('kontakDaruratNama', e.target.value)} />
          </Field>
          <Field label="No. HP Kontak Darurat" required>
            <Input id="kontak-darurat-hp" placeholder="08xxxxxxxxxx" type="tel"
              value={data.kontakDaruratHp} onChange={e => onChange('kontakDaruratHp', e.target.value)} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Step3() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,224,136,0.2)', border: '1px solid rgba(115,92,0,0.2)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-tertiary)', flexShrink: 0, marginTop: '1px' }}>info</span>
        <div style={{ fontSize: '13px', color: 'var(--color-on-tertiary-container)' }}>
          <strong>Petunjuk Upload:</strong> Semua berkas dalam format JPG, PNG, atau PDF dengan ukuran maksimal 2MB per file. Pastikan file terbaca dengan jelas dan tidak buram.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Field label="Akte Kelahiran" required>
          <UploadZone id="upload-akte" label="Upload Akte Kelahiran" />
        </Field>
        <Field label="Kartu Keluarga (KK)" required>
          <UploadZone id="upload-kk" label="Upload Kartu Keluarga" />
        </Field>
        <Field label="Ijazah / SKHUN SD / MI" required>
          <UploadZone id="upload-ijazah" label="Upload Ijazah Terakhir" />
        </Field>
        <Field label="KTP Orang Tua / Wali" required>
          <UploadZone id="upload-ktp" label="Upload KTP Orang Tua/Wali" />
        </Field>
        <Field label="Pas Foto 3×4 (background putih)" required>
          <UploadZone id="upload-foto" label="Upload Pas Foto Terbaru" hint="Format JPG/PNG, background putih" />
        </Field>
        <Field label="Surat Keterangan Yatim / Tidak Mampu" required>
          <UploadZone id="upload-sk-yatim" label="Upload Surat Keterangan" hint="Dari RT/RW, Desa, atau Kelurahan" />
        </Field>
        <Field label="Surat Keterangan Sehat">
          <UploadZone id="upload-sk-sehat" label="Upload SKS dari Puskesmas/Dokter" />
        </Field>
        <Field label="Sertifikat Hafalan Al-Qur'an" hint="Opsional — jika ada, nilai plus seleksi">
          <UploadZone id="upload-tahfidz" label="Upload Sertifikat Hafalan" />
        </Field>
      </div>

      <Field label="Catatan Tambahan / Kebutuhan Khusus">
        <Textarea id="catatan-tambahan" placeholder="Sampaikan jika ada kondisi kesehatan khusus, kebutuhan khusus, atau informasi lain yang perlu diketahui panitia..." />
      </Field>
    </div>
  );
}

function Step4({ step1Data, step2Data }) {
  const rows = [
    ['Nama Lengkap', step1Data.namaLengkap || '—'],
    ['Jenis Kelamin', step1Data.jenisKelamin === 'L' ? 'Laki-laki (Putra)' : step1Data.jenisKelamin === 'P' ? 'Perempuan (Putri)' : '—'],
    ['Tempat / Tgl Lahir', [step1Data.tempatLahir, step1Data.tanggalLahir].filter(Boolean).join(', ') || '—'],
    ['NIK', step1Data.nik || '—'],
    ['Jenjang Dituju', step1Data.jenjang === 'mts' ? 'MTs Al-Hanif' : step1Data.jenjang === 'ma' ? 'MA Al-Hanif' : '—'],
    ['Gelombang', GELOMBANG_OPTIONS.find(g => g.value === step1Data.gelombang)?.label || '—'],
    ['Asal Sekolah', step1Data.asalSekolah || '—'],
    ['Status Asuh', step1Data.statusAsuh ? { 'yatim-piatu': 'Yatim Piatu', 'yatim': 'Yatim', 'dhuafa': 'Dhuafa Berprestasi' }[step1Data.statusAsuh] : '—'],
    ['Provinsi', step1Data.provinsi || '—'],
    ['Nama Ayah', step2Data.namaAyah || '—'],
    ['Nama Ibu', step2Data.namaIbu || '—'],
    ['Kontak Darurat', step2Data.kontakDaruratHp || '—'],
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Summary */}
      <div style={{ padding: '20px', borderRadius: '16px', background: 'rgba(173,242,189,0.12)', border: '1px solid var(--color-secondary-container)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-primary)' }}>fact_check</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '700', color: 'var(--color-primary)' }}>
            Ringkasan Data Pendaftaran
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {rows.map(([label, value], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: i % 2 === 0 ? 'rgba(255,255,255,0.6)' : 'transparent', fontSize: '13px' }}>
              <span style={{ color: 'var(--color-on-surface-variant)', fontWeight: '500' }}>{label}</span>
              <span style={{ color: 'var(--color-on-surface)', fontWeight: '600', textAlign: 'right', maxWidth: '55%' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pernyataan */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          'Saya menyatakan bahwa seluruh data yang diisi adalah benar dan dapat dipertanggungjawabkan.',
          'Saya bersedia mengikuti seluruh proses seleksi dan menaati peraturan yang berlaku.',
          'Saya memahami bahwa pendaftaran ini tidak menjamin diterimanya calon santri tanpa melalui proses seleksi.',
          'Saya menyetujui untuk dihubungi oleh panitia PSB Al-Hanif terkait proses pendaftaran ini.',
        ].map((text, i) => (
          <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-on-surface)', lineHeight: '1.5' }}>
            <input type="checkbox" style={{ accentColor: 'var(--color-primary)', width: '16px', height: '16px', marginTop: '2px', flexShrink: 0 }} />
            {text}
          </label>
        ))}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--color-surface-container-low)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-tertiary)', flexShrink: 0 }}>campaign</span>
        <div style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>
          Setelah submit, Anda akan menerima <strong>email konfirmasi</strong> berisi nomor pendaftaran dan jadwal ujian seleksi. Simpan nomor pendaftaran tersebut untuk keperluan verifikasi lebih lanjut.
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   Main Pendaftaran Page
══════════════════════════════════════════════════════ */

export default function Pendaftaran({ onNavigate }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [noReg] = useState(() => 'PSB-' + Math.random().toString(36).slice(2, 8).toUpperCase());

  const [step1, setStep1] = useState({
    namaLengkap: '', namaPanggilan: '', jenisKelamin: '',
    tempatLahir: '', tanggalLahir: '', nisn: '', nik: '',
    asalSekolah: '', tahunLulus: '', jenjang: '', gelombang: '',
    juzHafalan: '0', surahHafalan: '', statusAsuh: '',
    alamat: '', provinsi: '', kodePos: '',
  });

  const [step2, setStep2] = useState({
    namaAyah: '', pekerjaanAyah: '', statusAyah: '', hpAyah: '', penghasilanAyah: '',
    namaIbu: '', pekerjaanIbu: '', statusIbu: '', hpIbu: '',
    namaWali: '', hubWali: '', hpWali: '', alamatWali: '',
    kontakDaruratNama: '', kontakDaruratHp: '',
  });

  const updateStep1 = (key, val) => setStep1(p => ({ ...p, [key]: val }));
  const updateStep2 = (key, val) => setStep2(p => ({ ...p, [key]: val }));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleNext = async () => {
    if (step < 4) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 4: kirim ke Supabase
    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      no_registrasi: noReg,
      // Step 1 — Data Santri
      nama_lengkap:      step1.namaLengkap,
      nama_panggilan:    step1.namaPanggilan,
      jenis_kelamin:     step1.jenisKelamin,
      tempat_lahir:      step1.tempatLahir,
      tanggal_lahir:     step1.tanggalLahir || null,
      nik:               step1.nik,
      nisn:              step1.nisn,
      asal_sekolah:      step1.asalSekolah,
      tahun_lulus:       step1.tahunLulus ? parseInt(step1.tahunLulus) : null,
      jenjang:           step1.jenjang,
      gelombang:         step1.gelombang,
      juz_hafalan:       parseInt(step1.juzHafalan) || 0,
      surah_hafalan:     step1.surahHafalan,
      status_asuh:       step1.statusAsuh,
      alamat:            step1.alamat,
      provinsi:          step1.provinsi,
      kode_pos:          step1.kodePos,
      // Step 2 — Data Orang Tua
      nama_ayah:         step2.namaAyah,
      pekerjaan_ayah:    step2.pekerjaanAyah,
      status_ayah:       step2.statusAyah,
      hp_ayah:           step2.hpAyah,
      penghasilan_ayah:  step2.penghasilanAyah,
      nama_ibu:          step2.namaIbu,
      pekerjaan_ibu:     step2.pekerjaanIbu,
      status_ibu:        step2.statusIbu,
      hp_ibu:            step2.hpIbu,
      nama_wali:         step2.namaWali,
      hub_wali:          step2.hubWali,
      hp_wali:           step2.hpWali,
      alamat_wali:       step2.alamatWali,
      kontak_darurat_nama: step2.kontakDaruratNama,
      kontak_darurat_hp:   step2.kontakDaruratHp,
    };

    const { error } = await supabase
      .from('pendaftaran_psb')
      .insert([payload]);

    setIsSubmitting(false);

    if (error) {
      console.error('[Supabase] Insert error:', error);
      setSubmitError(
        'Gagal mengirim pendaftaran. Periksa koneksi internet dan coba lagi. ' +
        (error.message || '')
      );
      return;
    }

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Success Screen ── */
  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '520px', width: '100%' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'rgba(173,242,189,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '52px', color: 'var(--color-secondary)' }}>check_circle</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '12px' }}>
            Pendaftaran Berhasil Dikirim!
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--color-on-surface-variant)', lineHeight: '1.7', marginBottom: '24px' }}>
            Alhamdulillah, formulir pendaftaran Anda telah berhasil diterima oleh Panitia PSB Al-Hanif 2025/2026.
          </p>
          <div style={{ padding: '20px 24px', borderRadius: '16px', background: 'var(--color-primary)', color: 'white', marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', opacity: 0.8, marginBottom: '6px' }}>Nomor Registrasi Anda</div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', letterSpacing: '0.06em' }}>{noReg}</div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>Simpan nomor ini untuk keperluan verifikasi</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--color-on-surface-variant)', marginBottom: '32px', textAlign: 'left', padding: '16px', borderRadius: '12px', background: 'var(--color-surface-container-low)' }}>
            {[
              { icon: 'email', text: 'Email konfirmasi telah dikirim ke alamat yang didaftarkan' },
              { icon: 'calendar_month', text: 'Jadwal ujian seleksi akan diumumkan H-7 sebelum pelaksanaan' },
              { icon: 'phone', text: 'Panitia akan menghubungi via WhatsApp: +62 812-3456-7890' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '1px' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => onNavigate('beranda')}
              style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>home</span>
              Kembali ke Beranda
            </button>
            <button
              onClick={() => window.print()}
              style={{ padding: '12px 24px', borderRadius: '12px', background: 'var(--color-surface-container)', color: 'var(--color-on-surface)', border: 'none', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>print</span>
              Cetak Bukti
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--color-surface)', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>

      {/* ── Compact Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(249,249,255,0.96)', backdropFilter: 'blur(16px)', boxShadow: '0 1px 8px rgba(0,0,0,0.06)', borderBottom: '1px solid var(--color-outline-variant)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 48px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => onNavigate('beranda')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-on-primary)', fontSize: '20px' }}>mosque</span>
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '700', color: 'var(--color-primary)', lineHeight: 1.1 }}>Al-Hanif</div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pondok Pesantren Yatim</div>
            </div>
          </button>

          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>
            Formulir Penerimaan Santri Baru 2025/2026
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface-variant)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)' }}>headset_mic</span>
            Bantuan: +62 812-3456-7890
          </div>
        </div>
      </header>

      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #1a5c3a 100%)', padding: '40px 48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-80px', top: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '40%', bottom: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(212,175,55,0.08)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'var(--color-tertiary-fixed)', color: 'var(--color-on-tertiary-container)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-tertiary)' }}>star</span>
              Penerimaan Santri Baru (PSB) 2025/2026
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '8px' }}>
              Formulir Pendaftaran Online
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>
              Isi formulir dengan lengkap dan benar. Seluruh pendidikan 100% gratis untuk santri yatim & dhuafa.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {KEUNGGULAN.map((k, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-tertiary-fixed)' }}>{k.icon}</span>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff' }}>{k.title}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>{k.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Step Indicator ── */}
      <div style={{ background: 'var(--color-surface-container-lowest)', borderBottom: '1px solid var(--color-outline-variant)', padding: '0 48px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
                <button
                  onClick={() => s.id < step && setStep(s.id)}
                  disabled={s.id > step}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px', padding: '16px 0',
                    background: 'none', border: 'none', cursor: s.id <= step ? 'pointer' : 'default',
                    opacity: s.id > step ? 0.4 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: s.id < step ? 'var(--color-secondary)' : s.id === step ? 'var(--color-primary)' : 'var(--color-surface-container)',
                    color: s.id <= step ? '#fff' : 'var(--color-on-surface-variant)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    boxShadow: s.id === step ? '0 4px 12px rgba(0,65,32,0.3)' : 'none',
                    transition: 'all 0.3s',
                  }}>
                    {s.id < step
                      ? <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check</span>
                      : <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{s.icon}</span>
                    }
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '10px', color: 'var(--color-on-surface-variant)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Langkah {s.id}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: s.id === step ? '700' : '500', color: s.id === step ? 'var(--color-primary)' : 'var(--color-on-surface-variant)' }}>
                      {s.label}
                    </div>
                  </div>
                </button>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', margin: '0 12px', background: step > s.id ? 'var(--color-secondary)' : 'var(--color-outline-variant)', transition: 'background 0.3s' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 48px 64px', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start' }}>

        {/* ── Form Card ── */}
        <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: '20px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid var(--color-outline-variant)', overflow: 'hidden' }}>
          {/* Card header */}
          <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-surface-container-low)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(173,242,189,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: 'var(--color-primary)' }}>{STEPS[step - 1].icon}</span>
            </div>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Langkah {step} dari 4</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)' }}>{STEPS[step - 1].label}</div>
            </div>
            {/* Progress bar */}
            <div style={{ flex: 1, marginLeft: 'auto' }}>
              <div style={{ height: '4px', borderRadius: '999px', background: 'var(--color-surface-container)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(step / 4) * 100}%`, background: 'var(--color-primary)', borderRadius: '999px', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--color-on-surface-variant)', marginTop: '4px', textAlign: 'right' }}>{Math.round((step / 4) * 100)}% selesai</div>
            </div>
          </div>

          {/* Form body */}
          <div style={{ padding: '28px' }}>
            {step === 1 && <Step1 data={step1} onChange={updateStep1} />}
            {step === 2 && <Step2 data={step2} onChange={updateStep2} />}
            {step === 3 && <Step3 />}
            {step === 4 && <Step4 step1Data={step1} step2Data={step2} />}
          </div>

          {/* Navigation buttons */}
          <div style={{ padding: '20px 28px', borderTop: '1px solid var(--color-surface-container-low)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handleBack}
              disabled={step === 1}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 20px', borderRadius: '12px',
                background: step === 1 ? 'transparent' : 'var(--color-surface-container)',
                color: step === 1 ? 'var(--color-outline)' : 'var(--color-on-surface)',
                border: 'none', cursor: step === 1 ? 'not-allowed' : 'pointer',
                fontWeight: '600', fontSize: '14px', transition: 'all 0.15s',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Kembali
            </button>
            <div style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
              Langkah {step} / 4
            </div>
            <button
              onClick={handleNext}
              disabled={isSubmitting}
              id={step === 4 ? 'btn-submit-form' : `btn-next-step-${step}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', borderRadius: '12px',
                background: isSubmitting ? 'var(--color-surface-container)' : 'var(--color-primary)',
                color: isSubmitting ? 'var(--color-on-surface-variant)' : '#fff',
                border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: '700', fontSize: '14px',
                boxShadow: isSubmitting ? 'none' : '0 4px 16px rgba(0,65,32,0.25)',
                transition: 'all 0.15s',
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                  Mengirim...
                </>
              ) : step === 4 ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>send</span>
                  Kirim Pendaftaran
                </>
              ) : (
                <>
                  Lanjut
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                </>
              )}
            </button>
          </div>

          {/* Error message */}
          {submitError && (
            <div style={{ margin: '0 28px 16px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(186,26,26,0.08)', border: '1px solid rgba(186,26,26,0.2)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-error)', flexShrink: 0 }}>error</span>
              <span style={{ fontSize: '13px', color: 'var(--color-error)', lineHeight: '1.5' }}>{submitError}</span>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '80px' }}>

          {/* Timeline */}
          <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid var(--color-outline-variant)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-container-low)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary)' }}>event</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>Jadwal Seleksi PSB 2025</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {TIMELINE.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                    background: t.active ? 'var(--color-secondary)' : 'var(--color-outline-variant)',
                    boxShadow: t.active ? '0 0 0 3px rgba(27,109,36,0.15)' : 'none',
                  }} />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: t.active ? 'var(--color-primary)' : 'var(--color-on-surface)', lineHeight: 1.3 }}>{t.label}</div>
                    <div style={{ fontSize: '11px', color: t.active ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)', marginTop: '2px' }}>{t.date}</div>
                  </div>
                  {t.active && (
                    <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: '700', color: 'var(--color-secondary)', background: 'rgba(27,109,36,0.1)', padding: '2px 8px', borderRadius: '999px', flexShrink: 0 }}>
                      Buka
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Persyaratan */}
          <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid var(--color-outline-variant)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-surface-container-low)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary)' }}>checklist</span>
              <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-primary)' }}>Berkas Persyaratan</span>
            </div>
            <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PERSYARATAN.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>{p.icon}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-on-surface)', lineHeight: '1.5' }}>{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div style={{ padding: '16px 20px', borderRadius: '16px', background: 'var(--color-primary)', color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary-fixed)' }}>support_agent</span>
              <span style={{ fontWeight: '700', fontSize: '14px' }}>Butuh Bantuan?</span>
            </div>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '14px' }}>
              Panitia PSB siap membantu Anda setiap hari Senin–Sabtu, pukul 08.00–17.00 WIB.
            </p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600', marginBottom: '8px', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary-fixed)' }}>chat</span>
              WhatsApp: +62 812-3456-7890
            </a>
            <a href="mailto:psb@pesantren-alhanif.id"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-tertiary-fixed)' }}>mail</span>
              psb@pesantren-alhanif.id
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
