// ========================================
// LATIHAN MIDDLE 4 — ORGANISASI KAMPUS
// MATERI: 8 (SUPER CONSTRUCTOR)
// ========================================
// Konsep: super(...) pernyataan pertama, lupa super, this-sebelum-
//         super, eksplisit di TS vs implicit di Dart
// Program: data Orang yang diturunkan ke Mahasiswa dan Dosen.

// ========================================
// SOAL
// ========================================
// 1. Buat class Orang: field nama (via constructor).
// 2. Buat Mahasiswa extends Orang: tambah field nim, constructor
//    (nama, nim) yang memanggil super(nama) DULU, method info() →
//    "nama (nim)".
// 3. Buat Dosen extends Orang: tambah field mataKuliah,
//    constructor (nama, mataKuliah) + super(nama), method
//    mengajar() → "nama mengajar mataKuliah". Cetak keduanya.
// 4. RAMAL DULU: constructor child yang SAMA SEKALI tidak
//    memanggil super —
//       class LupaSuper extends Orang {
//           nim: string;
//           constructor(nama: string, nim: string) {
//               this.nim = nim;
//           }
//       }
//    Berapa error yang muncul, apa sajanya?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) SUPER DULU, BARU this.
//     (Jika di Dart seperti ini: Mahasiswa(String nama, this.nim)
//     : super(nama); → di TypeScript jadi seperti ini: super(nama)
//     ditulis sebagai PERNYATAAN PERTAMA di body constructor)
// ------------------------------------------------------------------
class Orang {
  nama: string;

  constructor(nama: string) {
    this.nama = nama;
  }
}

class Mahasiswa extends Orang {
  nim: string;

  constructor(nama: string, nim: string) {
    super(nama);  // WAJIB — pernyataan pertama
    this.nim = nim;
  }

  info(): string {
    return this.nama + " (" + this.nim + ")";
  }
}

class Dosen extends Orang {
  mataKuliah: string;

  constructor(nama: string, mataKuliah: string) {
    super(nama);
    this.mataKuliah = mataKuliah;
  }

  mengajar(): string {
    return this.nama + " mengajar " + this.mataKuliah;
  }
}

const budiM4 = new Mahasiswa("Budi", "12345");
const ekoM4 = new Dosen("Eko", "Pemrograman TS");
console.log(budiM4.info());     // Budi (12345)
console.log(ekoM4.mengajar());  // Eko mengajar Pemrograman TS

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — dua error SEKALIGUS dalam satu class:
// ------------------------------------------------------------------
// class LupaSuper extends Orang {
//     nim: string;
//     constructor(nama: string, nim: string) {
//         this.nim = nim;
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2377: Constructors for derived classes must contain
//    a 'super' call.
//    error TS17009: 'super' must be called before accessing
//    'this' in the constructor of a derived class.
//    (TS2377 = super tidak ada; TS17009 = this dipakai sebelum
//    super — keduanya hadir bersamaan di kasus ini)

// ------------------------------------------------------------------
// (3) Catatan Dart (PERBEDAAN NYATA): parent dengan constructor
//     default → anak TIDAK wajib menulis `: super()` — jalan
//     implicit SEBELUM body anak (field parent pasti sudah
//     terisi). Di TS, begitu child menulis constructor, super
//     EKSPLISIT wajib — walau constructor parent kosong.
// ------------------------------------------------------------------

// ========================================
// RANGKUMAN
// ========================================
// - Child yang menulis constructor WAJIB memanggil super(...) —
//   dan sebagai pernyataan PERTAMA sebelum this.
// - Lupa super = TS2377 + TS17009 muncul bersamaan.
// - PERBEDAAN NYATA: Dart punya implicit super; TS selalu
//   eksplisit begitu child punya constructor sendiri.
