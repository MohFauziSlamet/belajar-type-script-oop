// ========================================
// LATIHAN BEGINNER 2 — TIKET BIOSKOP
// MATERI: 2 (CONSTRUCTOR)
// ========================================
// Konsep: constructor + new, parameter default, body assignment,
//         SATU constructor vs named constructor Dart
// Program: mencetak tiket bioskop dengan beberapa variasi isi.

// ========================================
// SOAL
// ========================================
// 1. Buat class TiketBioskop dengan field film (string), kursi
//    (string), harga (number). Constructor menerima film WAJIB;
//    kursi dan harga BOLEH tidak dikirim (default "Reguler" dan
//    40000).
// 2. Buat method info(): string berbentuk "film — kursi — Rpharga".
// 3. Buat 3 tiket: (a) lengkap, (b) tanpa harga, (c) hanya film —
//    cetak info ketiganya.
// 4. RAMAL DULU: error APA yang muncul kalau...
//    a. const t = new TiketBioskop(); (tanpa argumen sama sekali)
//    b. class ditulis dengan DUA constructor berbody

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) SATU CONSTRUCTOR + PARAMETER DEFAULT — tiga variasi new.
//     (Jika di Dart seperti ini: TiketBioskop(this.film,
//     [this.kursi = "Reguler", this.harga = 40000]);
//     → di TypeScript jadi seperti ini: default ditulis di
//     signature constructor dengan tanda =)
// ------------------------------------------------------------------
class TiketBioskop {
  film: string;
  kursi: string;
  harga: number;

  constructor(film: string, kursi: string = "Reguler",
              harga: number = 40000) {
    this.film = film;    // body assignment — sah, dan "menyembuhkan"
    this.kursi = kursi;  // field tanpa default (TS2564 tidak
    this.harga = harga;  // muncul karena terisi di constructor)
  }

  info(): string {
    return this.film + " — " + this.kursi + " — Rp" + this.harga;
  }
}

// Couple — lengkap (3 argumen)
console.log(new TiketBioskop("Spider-Man", "Couple", 75000).info());
// Spider-Man — Couple — Rp75000
// VIP — tanpa harga (harga default)
console.log(new TiketBioskop("Spider-Man", "VIP").info());
// Spider-Man — VIP — Rp40000
// Reguler — hanya film (kursi & harga default)
console.log(new TiketBioskop("Spider-Man").info());
// Spider-Man — Reguler — Rp40000

// ------------------------------------------------------------------
// (2) NAMED CONSTRUCTOR DART → SATU CONSTRUCTOR + DEFAULT DI TS.
//     (Jika di Dart seperti ini: TiketBioskop.vip(this.film)
//     : kursi = "VIP", harga = 100000;
//     → di TypeScript jadi seperti ini: cukup new TiketBioskop(
//     "film", "VIP", 100000) — satu constructor menangani semua
//     lewat parameter; TS tidak mengenal banyak constructor —
//     PERBEDAAN NYATA)
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// const t = new TiketBioskop();
// ❌ ERROR kalau di-uncomment:
//    error TS2554: Expected 1-3 arguments, but got 0.
//    (rentang 1-3: film wajib, kursi & harga opsional karena
//    default — film tetap tidak boleh dikosongkan)
//
// class DuaCtor {
//     x: number = 0;
//     constructor() {}
//     constructor(x: number) { this.x = x; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2392: Multiple constructor implementations are not
//    allowed.
//    (muncul 2× — di tiap baris constructor berbody; TS hanya
//    boleh SATU constructor, penggantinya parameter default)

// ========================================
// RANGKUMAN
// ========================================
// - Constructor jalan lewat new; body assignment sah dan
//   menyembuhkan field tanpa init (TS2564 tidak muncul).
// - TS hanya SATU constructor (TS2392); Dart boleh banyak —
//   named constructor Dart digantikan parameter default di TS.
// - Argumen wajib tidak bisa dikosongkan (TS2554) meski parameter
//   setelahnya punya default.
