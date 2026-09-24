-- =====================================================
-- SCHEMA DATABASE — Pesantren Yatim Al-Hanif
-- Jalankan file ini di: Supabase → SQL Editor → Run
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────
-- 1. TABEL PENDAFTARAN SANTRI BARU (PSB)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pendaftaran_psb (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  no_registrasi         TEXT UNIQUE NOT NULL,

  -- Data Calon Santri
  nama_lengkap          TEXT NOT NULL,
  nama_panggilan        TEXT,
  jenis_kelamin         CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
  tempat_lahir          TEXT,
  tanggal_lahir         DATE,
  nik                   TEXT,
  nisn                  TEXT,
  asal_sekolah          TEXT,
  tahun_lulus           INTEGER,
  jenjang               TEXT CHECK (jenjang IN ('mts', 'ma')),
  gelombang             TEXT CHECK (gelombang IN ('gel-1', 'gel-2')),
  juz_hafalan           INTEGER DEFAULT 0,
  surah_hafalan         TEXT,
  status_asuh           TEXT CHECK (status_asuh IN ('yatim-piatu', 'yatim', 'dhuafa')),
  alamat                TEXT,
  provinsi              TEXT,
  kode_pos              TEXT,

  -- Data Orang Tua
  nama_ayah             TEXT,
  pekerjaan_ayah        TEXT,
  status_ayah           TEXT CHECK (status_ayah IN ('hidup', 'meninggal')),
  hp_ayah               TEXT,
  penghasilan_ayah      TEXT,
  nama_ibu              TEXT,
  pekerjaan_ibu         TEXT,
  status_ibu            TEXT CHECK (status_ibu IN ('hidup', 'meninggal')),
  hp_ibu                TEXT,

  -- Data Wali (opsional)
  nama_wali             TEXT,
  hub_wali              TEXT,
  hp_wali               TEXT,
  alamat_wali           TEXT,

  -- Kontak Darurat
  kontak_darurat_nama   TEXT,
  kontak_darurat_hp     TEXT,

  -- Catatan
  catatan_tambahan      TEXT,

  -- Status & Audit
  status_pendaftaran    TEXT DEFAULT 'menunggu'
                        CHECK (status_pendaftaran IN ('menunggu', 'diproses', 'diterima', 'ditolak', 'cadangan')),
  catatan_admin         TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 2. TABEL DATA SANTRI (Aktif)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS santri (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nis               TEXT UNIQUE,         -- Nomor Induk Santri internal
  nama_lengkap      TEXT NOT NULL,
  nama_panggilan    TEXT,
  jenis_kelamin     CHAR(1) CHECK (jenis_kelamin IN ('L', 'P')),
  tempat_lahir      TEXT,
  tanggal_lahir     DATE,
  nik               TEXT,
  asal_daerah       TEXT,
  provinsi          TEXT,

  -- Pendidikan
  jenjang           TEXT CHECK (jenjang IN ('mts', 'ma')),
  kelas             TEXT,               -- cth: "VII-A", "X-B"
  tahun_masuk       INTEGER,
  angkatan          TEXT,               -- cth: "2024"

  -- Asrama
  kamar             TEXT,
  status_mukim      TEXT DEFAULT 'mukim' CHECK (status_mukim IN ('mukim', 'non-mukim')),

  -- Tahfidz
  juz_hafalan       INTEGER DEFAULT 0,
  target_juz        INTEGER DEFAULT 30,

  -- Status
  status            TEXT DEFAULT 'aktif'
                    CHECK (status IN ('aktif', 'tidak_aktif', 'alumni', 'keluar')),

  -- Keluarga
  nama_ayah         TEXT,
  nama_ibu          TEXT,
  wali_hp           TEXT,
  status_asuh       TEXT CHECK (status_asuh IN ('yatim-piatu', 'yatim', 'dhuafa')),

  -- Referensi ke pendaftaran asal
  pendaftaran_id    UUID REFERENCES pendaftaran_psb(id),

  -- Audit
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 3. TABEL PRESENSI
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS presensi (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santri_id     UUID REFERENCES santri(id) ON DELETE CASCADE,
  tanggal       DATE NOT NULL,
  sesi          TEXT NOT NULL,          -- cth: 'subuh', 'dzuhur', 'ashar', 'maghrib', 'isya', 'halaqah', 'sekolah'
  status        TEXT NOT NULL           -- 'hadir', 'tidak_hadir', 'izin', 'sakit'
                CHECK (status IN ('hadir', 'tidak_hadir', 'izin', 'sakit')),
  keterangan    TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 4. TABEL SETORAN TAHFIDZ
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS setoran_tahfidz (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santri_id     UUID REFERENCES santri(id) ON DELETE CASCADE,
  tanggal       DATE NOT NULL,
  jenis         TEXT CHECK (jenis IN ('ziyadah', 'muraja_ah')),
  surah_dari    TEXT,
  ayat_dari     INTEGER,
  surah_sampai  TEXT,
  ayat_sampai   INTEGER,
  jumlah_halaman NUMERIC(4,1),
  nilai         TEXT CHECK (nilai IN ('A', 'B', 'C', 'ulang')),
  ustadz        TEXT,
  catatan       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 5. TABEL PERIZINAN
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS perizinan (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  santri_id       UUID REFERENCES santri(id) ON DELETE CASCADE,
  jenis_izin      TEXT CHECK (jenis_izin IN ('pulang', 'keluar_kota', 'kegiatan', 'lainnya')),
  tanggal_mulai   DATE NOT NULL,
  tanggal_kembali DATE NOT NULL,
  keperluan       TEXT,
  alamat_tujuan   TEXT,
  wali_penjemput  TEXT,
  hp_wali         TEXT,
  status          TEXT DEFAULT 'menunggu'
                  CHECK (status IN ('menunggu', 'disetujui', 'ditolak')),
  catatan_admin   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 6. TABEL DOKUMEN / BERKAS PSB (Supabase Storage)
-- ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS dokumen_psb (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pendaftaran_id    UUID REFERENCES pendaftaran_psb(id) ON DELETE CASCADE,
  jenis_dokumen     TEXT NOT NULL,      -- 'akte', 'kk', 'ijazah', 'ktp', 'foto', 'sk_yatim', 'sk_sehat', 'tahfidz'
  file_name         TEXT NOT NULL,
  file_path         TEXT NOT NULL,      -- path di Supabase Storage
  file_size         INTEGER,
  mime_type         TEXT,
  uploaded_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────
-- 7. AUTO-UPDATE updated_at trigger
-- ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_pendaftaran_updated_at
  BEFORE UPDATE ON pendaftaran_psb
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trig_santri_updated_at
  BEFORE UPDATE ON santri
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────────
-- 8. ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────────
-- Aktifkan RLS di semua tabel
ALTER TABLE pendaftaran_psb ENABLE ROW LEVEL SECURITY;
ALTER TABLE santri ENABLE ROW LEVEL SECURITY;
ALTER TABLE presensi ENABLE ROW LEVEL SECURITY;
ALTER TABLE setoran_tahfidz ENABLE ROW LEVEL SECURITY;
ALTER TABLE perizinan ENABLE ROW LEVEL SECURITY;
ALTER TABLE dokumen_psb ENABLE ROW LEVEL SECURITY;

-- PENDAFTARAN PSB: Siapapun bisa INSERT (publik), hanya admin bisa baca semua
CREATE POLICY "publik_bisa_daftar" ON pendaftaran_psb
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "publik_bisa_cek_status_sendiri" ON pendaftaran_psb
  FOR SELECT TO anon
  USING (true); -- Nanti bisa dibatasi berdasarkan no_registrasi

-- SANTRI: Hanya authenticated (admin) yang bisa akses
CREATE POLICY "admin_bisa_baca_santri" ON santri
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_bisa_ubah_santri" ON santri
  FOR ALL TO authenticated USING (true);

-- DOKUMEN: Publik bisa upload saat mendaftar
CREATE POLICY "publik_bisa_upload_dokumen" ON dokumen_psb
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "admin_bisa_baca_dokumen" ON dokumen_psb
  FOR SELECT TO authenticated USING (true);

-- ─────────────────────────────────────────────────
-- 9. SAMPLE DATA (Opsional — untuk testing)
-- ─────────────────────────────────────────────────
-- Uncomment untuk insert data contoh:
/*
INSERT INTO pendaftaran_psb (no_registrasi, nama_lengkap, jenis_kelamin, jenjang, gelombang, status_asuh, status_pendaftaran)
VALUES
  ('PSB-TEST01', 'Ahmad Fauzi', 'L', 'mts', 'gel-1', 'yatim', 'menunggu'),
  ('PSB-TEST02', 'Siti Fatimah', 'P', 'ma', 'gel-1', 'dhuafa', 'diterima');
*/

-- ─────────────────────────────────────────────────
-- SELESAI ✓
-- ─────────────────────────────────────────────────
SELECT 'Schema Al-Hanif berhasil dibuat!' AS status;
