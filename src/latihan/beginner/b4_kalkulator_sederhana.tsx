// ========================================
// LATIHAN BEGINNER 4 — KALKULATOR SEDERHANA
// MATERI: 4 (METHOD)
// ========================================
// Konsep: anotasi tipe param & return, parameter default,
//         method dicabut = this lepas → arrow class field
// Program: kalkulator dengan method hitung dan sapaan.

// ========================================
// SOAL
// ========================================
// 1. Buat class Kalkulator dengan field nama (string, diisi lewat
//    constructor) dan method:
//    - sapa(): string → "halo, aku kalkulator nama"
//    - tambah(a: number, b: number): number
//    - pangkat(basis: number, eksponen: number = 2): number
//      (hitung dengan LOOP, bukan **)
//    - diskon(harga: number, persen: number = 10): number
// 2. Cetak semua hasil untuk angka pilihanmu.
// 3. RAMAL DULU (inti latihan ini): method DICABUT dari objek
//    lalu dipanggil —
//       const f = k.sapa;
//       f();
//    Apakah jalan, error compiler, atau crash runtime? Errornya
//    apa? Setelah menulis prediksi, lihat blok (2).

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) DEFINISI METHOD — tipe param & return eksplisit + default.
//     (Jika di Dart seperti ini: int pangkat(int basis,
//     [int eksponen = 2]) → di TypeScript jadi seperti ini:
//     pangkat(basis: number, eksponen: number = 2): number)
// ------------------------------------------------------------------
class Kalkulator {
  nama: string;

  constructor(nama: string) {
    this.nama = nama;
  }

  sapa(): string {
    return "halo, aku kalkulator " + this.nama;
  }

  tambah(a: number, b: number): number {
    return a + b;
  }

  pangkat(basis: number, eksponen: number = 2): number {
    let hasil = 1;
    for (let i = 0; i < eksponen; i++) {
      hasil = hasil * basis;
    }
    return hasil;
  }

  diskon(harga: number, persen: number = 10): number {
    return harga - (harga * persen) / 100;
  }
}

const kalkB4 = new Kalkulator("Casio");

console.log(kalkB4.sapa());            // halo, aku kalkulator Casio
console.log(kalkB4.tambah(2, 3));      // 5
console.log(kalkB4.pangkat(3));        // 9   (eksponen default 2)
console.log(kalkB4.pangkat(2, 3));     // 8
console.log(kalkB4.diskon(50000));     // 45000
console.log(kalkB4.diskon(50000, 50)); // 25000

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — tsc --noEmit DIAM, tapi RUNTIME CRASH:
// ------------------------------------------------------------------
// const f = kalkB4.sapa;
// f();
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM):
//    TypeError: Cannot read properties of undefined (reading 'nama')
//    (method biasa kehilangan this saat dicabut dari objeknya —
//    jebakan senyap: compiler tidak menolong)

// ------------------------------------------------------------------
// (3) OBATNYA: ARROW CLASS FIELD — this terikat permanen.
//     (Jika di Dart seperti ini: tear-off `final f = k.sapa; f();`
//     SELALU aman karena this tidak pernah lepas;
//     → di TypeScript jadi seperti ini: method yang bakal dicabut
//     ditulis sebagai arrow class field)
// ------------------------------------------------------------------
class KalkulatorAman {
  nama: string;
  sapa = (): string => "halo, aku kalkulator " + this.nama;

  constructor(nama: string) {
    this.nama = nama;
  }
}

const kalkAmanB4 = new KalkulatorAman("Sharp");
const fAmanB4 = kalkAmanB4.sapa;
// dicabut lalu dipanggil 2× — tetap aman:
console.log(fAmanB4());  // halo, aku kalkulator Sharp
console.log(fAmanB4());  // halo, aku kalkulator Sharp

// ========================================
// RANGKUMAN
// ========================================
// - Method = function dalam class; tipe param & return ditulis
//   eksplisit; parameter default menggantikan overloading kecil.
// - Method dicabut kehilangan this → TypeError SENYAP (tsc diam)
//   — PERBEDAAN NYATA vs tear-off Dart yang selalu aman.
// - Obatnya: arrow class field `sapa = (): string => ...`.
