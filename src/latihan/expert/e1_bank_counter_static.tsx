// ========================================
// LATIHAN EXPERT 1 — BANK COUNTER STATIC
// MATERI: 17 (STATIC)
// ========================================
// Konsep: static = milik CLASS, private static counter, global
//         state, static diwariskan di TS (vs Dart)
// Program: bank dengan penghitung nasabah global & suku bunga.

// ========================================
// SOAL
// ========================================
// 1. Buat class BankE1: static sukuBunga = 5, PRIVATE static
//    jumlahNasabah = 0, field instance nasabah (constructor —
//    setiap kali constructor jalan, jumlahNasabah bertambah 1).
// 2. Buat static method daftarNasabah(): number (penghitung
//    bertambah tiap new — global state) dan method instance
//    bungaBerjalan(): number yang membaca sukuBunga (non-static
//    bebas membaca static).
// 3. Buat BankSyariahE1 extends BankE1 TANPA member baru — lalu
//    dari LUAR, baca BankSyariahE1.sukuBunga dan
//    BankSyariahE1.daftarNasabah() (di Dart hal ini DITOLAK).
// 4. Buat 3 nasabah (2 lewat BankE1, 1 lewat BankSyariahE1) —
//    cetak jumlahNasabah SEKALI di akhir.
// 5. RAMAL DULU:
//    a. tabungan.sukuBunga lewat INSTANCE — error apa? (pesan
//       errornya menolong — sebutkan bentuknya)
//    b. static method berisi return this.nasabah — error apa?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) STATIC = MILIK CLASS — satu slot, dibaca semua instance.
//     (Jika di Dart seperti ini: static int jumlahNasabah = 0;
//     → di TypeScript jadi seperti ini: keyword static sama —
//     KEMIRIPAN EKSTREM; tapi lihat sub (2) untuk warisannya)
// ------------------------------------------------------------------
class BankE1 {
  static sukuBunga: number = 5;
  private static jumlahNasabah: number = 0;

  nasabah: string;

  constructor(nasabah: string) {
    this.nasabah = nasabah;
    BankE1.jumlahNasabah = BankE1.jumlahNasabah + 1;
  }

  static daftarNasabah(): number {
    return BankE1.jumlahNasabah;
  }

  bungaBerjalan(): number {
    return BankE1.sukuBunga;  // non-static boleh baca static
  }
}

class BankSyariahE1 extends BankE1 {}

const n1E1 = new BankE1("Budi");
const n2E1 = new BankE1("Sari");
const n3E1 = new BankSyariahE1("Rina");
console.log(n1E1.bungaBerjalan());            // 5
console.log(BankSyariahE1.sukuBunga);         // 5  (DIWARISKAN!)
console.log(BankSyariahE1.daftarNasabah());   // 3  (counter global
// ikut menghitung nasabah subclass — satu slot bersama)

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// const t = new BankE1("Eko");
// const bunga = t.sukuBunga;
// ❌ ERROR kalau di-uncomment:
//    error TS2576: Property 'sukuBunga' does not exist on type
//    'BankE1'. Did you mean to access the static member
//    'BankE1.sukuBunga' instead?
//    (pesan errornya langsung menyarankan jalur benar)
//
// class SalahStatic {
//     nasabah: string = "Eko";
//     static cekNasabah(): string { return this.nasabah; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'nasabah' does not exist on type
//    'typeof SalahStatic'.
//    (di dalam static, this = CLASS — bukan instance; hanya
//    member static yang terbaca)

// ------------------------------------------------------------------
// (3) Catatan Dart (PERBEDAAN NYATA, terverifikasi dart analyze):
//     - static TIDAK diwariskan lewat nama child —
//       BankSyariah.sukuBunga = undefined_getter
//       (di TS: sah, seperti sub (1) di atas).
//     - this di static method = invalid_reference_to_this.
//     - static via instance menolak dengan pesan berbeda:
//       instance_access_to_static_member.
// ------------------------------------------------------------------

// ========================================
// RANGKUMAN
// ========================================
// - static = milik CLASS: satu slot memori, akses tanpa new,
//   cocok untuk counter/utility; private static terlindungi.
// - Aturan dua arah: static hanya boleh membaca static (this di
//   static = class → TS2339 typeof); non-static bebas.
// - PERBEDAAN NYATA: static DIWARISKAN di TS (child punya akses);
//   Dart menolak lewat nama child (undefined_getter); salah
//   pintu instance = TS2576 dengan pesan penolong.
