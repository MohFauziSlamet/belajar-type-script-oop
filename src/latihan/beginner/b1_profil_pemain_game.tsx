// ========================================
// LATIHAN BEGINNER 1 — PROFIL PEMAIN GAME
// MATERI: 1 (PENGENALAN OOP & CLASS)
// ========================================
// Konsep: class, field bertipe & default value, method + this, new
// Program: kartu status pemain game dengan method serang dan naikLevel.

// ========================================
// SOAL
// ========================================
// 1. Buat class Pemain dengan field: nama (string, wajib diisi),
//    nyawa (number, default 100), skor (number, default 0).
// 2. Buat method serang(): string yang mengembalikan "nama
//    menyerang!", dan naikLevel(): string yang menambah skor +50
//    lalu mengembalikan "nama naik level! skor sekarang: skor".
// 3. Buat DUA objek dari class yang sama dan cetak status keduanya
//    untuk membuktikan satu class = objek tanpa batas.
// 4. RAMAL DULU (tulis prediksimu sebelum mencoba): apa yang
//    terjadi kalau...
//    a. objek dibuat TANPA new: const p = Pemain("Eko");
//    b. di dalam method, field dipanggil TANPA this:
//       return "halo " + nama;

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) DEFINISI CLASS — field bertipe + default value + method.
//     (Jika di Dart seperti ini: String nama; int nyawa = 100;
//     → di TypeScript jadi seperti ini: nama: string; nyawa = 100;)
// ------------------------------------------------------------------
class Pemain {
  nama: string;
  nyawa: number = 100;
  skor: number = 0;

  constructor(nama: string) {
    this.nama = nama;
  }

  serang(): string {
    return this.nama + " menyerang!";
  }

  naikLevel(): string {
    this.skor = this.skor + 50;
    return this.nama + " naik level! skor sekarang: " + this.skor;
  }
}

const ekoB1 = new Pemain("Eko");
const budiB1 = new Pemain("Budi");

console.log(ekoB1.serang());      // Eko menyerang!
console.log(budiB1.serang());     // Budi menyerang!
console.log(ekoB1.naikLevel());   // Eko naik level! skor sekarang: 50
console.log(ekoB1.naikLevel());   // Eko naik level! skor sekarang: 100
console.log(budiB1.skor);         // 0  (objek lain tidak ikut berubah)

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — dua jebakan klasik materi 1:
// ------------------------------------------------------------------
// const p = Pemain("Eko");
// ❌ ERROR kalau di-uncomment:
//    error TS2348: Value of type 'typeof Pemain' is not callable.
//    Did you mean to include 'new'?
//    (Jika di Dart: Pemain("Eko") SAH — new opsional;
//    → di TypeScript: new WAJIB — PERBEDAAN NYATA)
//
// class SalahThis {
//     nama: string = "Eko";
//     sapa(): string { return "halo " + nama; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2663: Cannot find name 'nama'. Did you mean the
//    instance member 'this.nama'?
//    (field di dalam method WAJIB pakai this. — pesannya menolong;
//    di Dart this implisit sehingga nama telanjang sah —
//    PERBEDAAN NYATA)

// ========================================
// RANGKUMAN
// ========================================
// - new WAJIB di TS (lupa = TS2348); di Dart new opsional.
// - Field dipanggil di dalam method WAJIB pakai this. (TS2663);
//   di Dart this implisit.
// - Satu class = objek TANPA BATAS; state tiap objek terpisah
//   (skor Eko naik, skor Budi tetap 0).
