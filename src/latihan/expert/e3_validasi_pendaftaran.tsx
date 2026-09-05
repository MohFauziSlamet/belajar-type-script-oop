// ========================================
// LATIHAN EXPERT 3 — VALIDASI PENDAFTARAN
// MATERI: 19 (ERROR HANDLING)
// ========================================
// Konsep: custom error extends Error + name, catch unknown +
//         instanceof narrowing, finally, uncaught di akhir file
// Program: pendaftaran akun dengan validasi nama & umur.

// ========================================
// SOAL
// ========================================
// 1. Buat class ErrorValidasi extends Error (constructor kirim
//    super(pesan) lalu this.name = "ErrorValidasi") dan
//    ErrorUmur extends Error (name "ErrorUmur").
// 2. Buat function daftar(nama: string, umur: number): string —
//    nama kosong → throw ErrorValidasi("nama kosong"); umur < 17
//    → throw ErrorUmur("umur X di bawah 17"); lolos →
//    "nama terdaftar".
// 3. Buat BLOK try-catch-finish: panggil daftar("", 20) —
//    di catch, pilah dengan instanceof ErrorValidasi /
//    ErrorUmur (else: error lain), cetak pesannya; finally
//    cetak "proses selesai". Ulangi untuk daftar("Eko", 15) dan
//    daftar("Budi", 25).
// 4. RAMAL DULU:
//    a. catch (e) langsung berisi console.log(e.message) TANPA
//       narrowing — error apa? (kenapa?)
//    b. Kalau ErrorValidasi sengaja dilempar TANPA try-catch —
//       seperti apa bentuk crash-nya di terminal? (petunjuk:
//       lihat name yang kamu set)

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) CUSTOM ERROR — idiom TS: extends Error + super + name.
//     (Jika di Dart seperti ini: class ErrorValidasi implements
//     Exception + toString override, ditangkap on-clause per tipe
//     → di TypeScript jadi seperti ini: extends Error lalu
//     dipilah instanceof di catch tunggal — PERBEDAAN NYATA)
// ------------------------------------------------------------------
class ErrorValidasi extends Error {
  constructor(pesan: string) {
    super(pesan);
    this.name = "ErrorValidasi";
  }
}

class ErrorUmur extends Error {
  constructor(pesan: string) {
    super(pesan);
    this.name = "ErrorUmur";
  }
}

function daftar(nama: string, umur: number): string {
  if (nama === "") {
    throw new ErrorValidasi("nama kosong");
  }
  if (umur < 17) {
    throw new ErrorUmur("umur " + umur + " di bawah 17");
  }
  return nama + " terdaftar";
}

// ------------------------------------------------------------------
// (2) TRY-CATCH-FINALLY + NARROWING instanceof:
// ------------------------------------------------------------------
function proses(nama: string, umur: number): void {
  try {
    console.log(daftar(nama, umur));
  } catch (e) {
    if (e instanceof ErrorValidasi) {
      console.log("ditolak validasi: " + e.message);
    } else if (e instanceof ErrorUmur) {
      console.log("ditolak umur: " + e.message);
    } else {
      console.log("error lain: " + String(e));
    }
  } finally {
    console.log("proses selesai");
  }
}

proses("", 20);      // ditolak validasi: nama kosong
// proses selesai
proses("Eko", 15);   // ditolak umur: umur 15 di bawah 17
// proses selesai
proses("Budi", 25);  // Budi terdaftar
// proses selesai

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU (a) — catch strict: e = unknown:
// ------------------------------------------------------------------
// try {
//     throw new ErrorValidasi("nama kosong");
// } catch (e) {
//     console.log(e.message);
// }
// ❌ ERROR kalau di-uncomment:
//    error TS18046: 'e' is of type 'unknown'.
//    (catch tidak tahu apa yang masuk — WAJIB narrowing
//    instanceof / typeof dulu; String(e) atau lempar ulang juga
//    sah sebagai jalur keluar)

// ------------------------------------------------------------------
// (4) JAWABAN RAMAL DULU (b) — uncaught crash memakai name:
//     pesan terminalnya mengikuti persis format
//     <NamaError>: <pesan> — lihat blok terakhir di bawah.
//     Blok itu sengaja PALING AKHIR FILE: throw menghentikan
//     seluruh program.
// ------------------------------------------------------------------
// daftar("", 30);
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM):
//    ErrorValidasi: nama kosong

// ========================================
// RANGKUMAN
// ========================================
// - Custom error TS: extends Error + super(pesan) + this.name —
//   name ikut tampil saat crash; finally selalu jalan.
// - catch strict: e unknown — akses member tanpa narrowing =
//   TS18046; pilah dengan instanceof lalu baca e.message.
// - Dart: implements Exception + on-clause per tipe & rethrow;
//   TS: satu catch + instanceof — PERBEDAAN NYATA idiom.
