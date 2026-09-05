// ========================================
// LATIHAN BEGINNER 3 — PRODUK TOKO
// MATERI: 3 (PROPERTIES & DEFAULT VALUE)
// ========================================
// Konsep: trio mandatory/optional/readonly, default value,
//         readonly ditimpa constructor (vs final Dart)
// Program: katalog produk dengan kombinasi field bervariasi.

// ========================================
// SOAL
// ========================================
// 1. Buat class Produk dengan field: nama (string WAJIB diisi
//    lewat constructor), berat (number OPSIONAL), stok (number
//    default 0), kategori (READONLY string default "umum").
// 2. Constructor menerima parameter kedua OPSIONAL untuk menimpa
//    kategori — buktikan produk "TV LED" bisa masuk sebagai
//    kategori "elektronik" lewat constructor.
// 3. Buat method status(): string → "nama — kategori — stok n".
//    Cetak dua produk + field berat yang belum diisi.
// 4. RAMAL DULU: apa yang terjadi kalau...
//    a. field baru ditambahkan dari luar: p.merek = "Kilo";
//    b. method berisi return this.berat * 2; (berat optional)

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) TRIO PROPERTY + READONLY DITIMPA CONSTRUCTOR.
//     (Jika di Dart seperti ini: final kategori = "umum" — DITOLAK
//     ditimpa constructor (assignment_to_final);
//     → di TypeScript jadi seperti ini: readonly BOLEH ditimpa
//     selama MASIH di dalam constructor — PERBEDAAN NYATA)
// ------------------------------------------------------------------
class Produk {
  readonly kategori: string = "umum";
  nama: string;
  berat?: number;
  stok: number = 0;

  constructor(nama: string, kategoriBaru?: string) {
    this.nama = nama;
    if (kategoriBaru !== undefined) {
      this.kategori = kategoriBaru;  // SAH — masih di constructor
    }
  }

  status(): string {
    return this.nama + " — " + this.kategori + " — stok " + this.stok;
  }
}

const kopiB3 = new Produk("Kopi Gayo");
const tvB3 = new Produk("TV LED", "elektronik");

console.log(kopiB3.status());  // Kopi Gayo — umum — stok 0
console.log(tvB3.status());    // TV LED — elektronik — stok 0
console.log(kopiB3.berat);     // undefined  (optional belum diisi)

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU (a) — menambah field dari luar class:
// ------------------------------------------------------------------
// const salah = new Produk("Kopi");
// salah.merek = "Kilo";
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'merek' does not exist on type 'Produk'.
//    (di JS bebas menambah atribut — TS & Dart melarang)

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU (b) — optional dipakai langsung:
// ------------------------------------------------------------------
// class SalahBerat {
//     berat?: number;
//     beratGanda(): number { return this.berat * 2; }
// }
// const salahB = new SalahBerat();
// const ganda = salahB.berat * 2;
// ❌ ERROR kalau di-uncomment:
//    error TS2532: Object is possibly 'undefined'.        (dalam
//    method, via this.)
//    error TS18048: 'salahB.berat' is possibly 'undefined'. (di
//    luar class, via objek)
//    (dua KODE berbeda untuk konteks berbeda — keduanya inti
//    masalah yang sama: optional = number | undefined;
//    solusi: ?. ?? , isi dulu, atau beri default)

// ========================================
// RANGKUMAN
// ========================================
// - Trio property: mandatory (nama), optional ? (berat), readonly
//   (kategori) — semangatnya mandatory/nullable/final di Dart.
// - readonly beku SETELAH constructor; di DALAM constructor masih
//   boleh ditimpa — PERBEDAAN NYATA vs final Dart yang langsung
//   ditolak (assignment_to_final).
// - Field baru dari luar = TS2339; optional dipakai langsung =
//   TS2532 (dalam method) / TS18048 (luar class).
