// ========================================
// LATIHAN BEGINNER 5 — STATISTIK NILAI
// MATERI: 1, 4 (CLASS & METHOD)
// ========================================
// Konsep: field array + method agregasi via loop, TS2564 + tiga
//         jalan keluar, komentar output jujur (floating point)
// Program: statistik nilai ujian sebuah kelas kecil.

// ========================================
// SOAL
// ========================================
// 1. Buat class StatistikNilai dengan field nilai (array number,
//    mulai kosong) dan method:
//    - tambah(n: number): void
//    - total(): number       (LOOP — dilarang map/filter/reduce)
//    - rata(): number
//    - terbesar(): number    (LOOP)
// 2. Tambahkan nilai 80, 75, 78 lalu cetak: isi array, total,
//    rata-rata, dan nilai terbesar.
//    RAMAL DULU angka rata-ratanya — tulis prediksimu SEBELUM
//    melihat jawaban (petunjuk: salin hasil persis seperti Node
//    mencetaknya, bukan pembulatan buatanmu).
// 3. RAMAL DULU: error apa yang muncul kalau field dideklarasikan
//    `nilai: number[];` TANPA default dan TANPA diisi constructor?
//    Sebutkan TIGA jalan keluarnya.

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) FIELD ARRAY + AGREGASI VIA LOOP — tanpa map/filter/reduce.
//     (Jika di Dart seperti ini: List<int> nilai = [];
//     → di TypeScript jadi seperti ini: nilai: number[] = [];)
// ------------------------------------------------------------------
class StatistikNilai {
  nilai: number[] = [];

  tambah(n: number): void {
    this.nilai.push(n);
  }

  total(): number {
    let jumlah = 0;
    for (const n of this.nilai) {
      jumlah = jumlah + n;
    }
    return jumlah;
  }

  rata(): number {
    return this.total() / this.nilai.length;
  }

  terbesar(): number {
    let besar = this.nilai[0];
    for (const n of this.nilai) {
      if (n > besar) {
        besar = n;
      }
    }
    return besar;
  }
}

const statistikB5 = new StatistikNilai();
statistikB5.tambah(80);
statistikB5.tambah(75);
statistikB5.tambah(78);

// format array Node: elemen dipisah spasi di dalam [ ]
console.log(statistikB5.nilai);       // [ 80, 75, 78 ]
console.log(statistikB5.total());     // 233
console.log(statistikB5.rata());      // 77.66666666666667
console.log(statistikB5.terbesar());  // 80

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — rata-rata 233/3:
//     Node mencetak 77.66666666666667 (16 digit enam berulang) —
//     komentar output harus jujur menyalin hasil nyata, bukan
//     pembulatan 77.67.
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU — field tanpa init:
// ------------------------------------------------------------------
// class SalahArray {
//     nilai: number[];
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2564: Property 'nilai' has no initializer and is not
//    definitely assigned in the constructor.
//    TIGA jalan keluar:
//    1. default:            nilai: number[] = [];
//    2. tanda seru:         nilai!: number[];
//       (≈ Dart late — PERBEDAAN NYATA: late melempar error saat
//       diakses terlalu dini, `!` hanya diam-diam undefined)
//    3. isi di constructor: this.nilai = [];

// ========================================
// RANGKUMAN
// ========================================
// - Field array diberi default [] supaya TS2564 tidak muncul;
//   tiga jalan keluarnya: default, `!`, atau isi di constructor.
// - Agregasi total/rata/terbesar cukup dengan loop for-of — tanpa
//   map/filter/reduce.
// - Komentar output wajib jujur: 233/3 = 77.66666666666667 dan
//   array Node dicetak [ 80, 75, 78 ] (ada spasi antar elemen).
