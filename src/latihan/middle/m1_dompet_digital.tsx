// ========================================
// LATIHAN MIDDLE 1 — DOMPET DIGITAL
// MATERI: 5 (GETTER DAN SETTER)
// ========================================
// Konsep: get/set accessor, validasi di setter, derived getter,
//         konvensi underscore, pemanggilan TANPA kurung
// Program: dompet dengan saldo tervalidasi dan format rupiah.

// ========================================
// SOAL
// ========================================
// 1. Buat class DompetDigital dengan field _saldo (number, mulai
//    0 — underscore hanya KONVENSI, bukan private).
// 2. Buat getter saldo dan setter saldo yang MENOLAK nilai
//    negatif (cetak "penyetoran negatif ditolak" lalu abaikan).
// 3. Buat derived getter saldoRupiah → "Rpn".
// 4. Uji: set 50000, coba set -100 (ditolak), baca saldo,
//    baca saldoRupiah, lalu baca _saldo LANGSUNG dari luar class.
// 5. RAMAL DULU: apa yang terjadi kalau...
//    a. getter dipanggil PAKAI kurung: dompet.saldo();
//    b. class hanya punya getter (tanpa setter), lalu di-assign:
//       salin.saldo = 5000;

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) GET/SET + VALIDASI — dipanggil TANPA kurung seperti field.
//     (Jika di Dart seperti ini: double get saldo => _saldo;
//     set saldo(double v) {...}
//     → di TypeScript jadi seperti ini: get saldo(): number
//     {...} / set saldo(nilai: number) {...} — KEMIRIPAN EKSTREM,
//     hanya letak tipe return dan kurung kurawal)
// ------------------------------------------------------------------
class DompetDigital {
  _saldo: number = 0;

  get saldo(): number {
    return this._saldo;
  }

  set saldo(nilai: number) {
    if (nilai < 0) {
      console.log("penyetoran negatif ditolak");
      return;
    }
    this._saldo = nilai;
  }

  get saldoRupiah(): string {
    return "Rp" + this._saldo;
  }
}

const dompetM1 = new DompetDigital();
dompetM1.saldo = 50000;
console.log(dompetM1.saldo);        // 50000
dompetM1.saldo = -100;              // penyetoran negatif ditolak
console.log(dompetM1.saldo);        // 50000  (set gagal, tetap)
console.log(dompetM1.saldoRupiah);  // Rp50000
console.log(dompetM1._saldo);       // 50000
// _underscore hanya KONVENSI — masih terbaca dari luar class
// (private aslinya baru di materi visibility, file 11)

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// const baca = dompetM1.saldo();
// ❌ ERROR kalau di-uncomment:
//    error TS6234: This expression is not callable because it is
//    a 'get' accessor. Did you mean to use it without '()'?
//    Type 'Number' has no call signatures.
//    (getter = property, bukan method — panggil tanpa kurung)
//
// class SalinDompet {
//     _saldo: number = 0;
//     get saldo(): number { return this._saldo; }
// }
// const salin = new SalinDompet();
// salin.saldo = 5000;
// ❌ ERROR kalau di-uncomment:
//    error TS2540: Cannot assign to 'saldo' because it is a
//    read-only property.
//    (getter TANPA setter = readonly)

// ========================================
// RANGKUMAN
// ========================================
// - get/set dipanggil tanpa kurung seperti field; pakai kurung =
//   TS6234 (pesan errornya langsung menolong).
// - Getter tanpa setter = readonly (TS2540); setter wadah
//   validasi — penjagaan data terpusat di satu tempat.
// - _underscore konvensi murni di TS (di Dart private per
//   library) — masih terbaca dari luar class.
