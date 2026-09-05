// ========================================
// LATIHAN ADVANCE 1 — PERPUSTAKAAN PRIVATE
// MATERI: 11 (VISIBILITY)
// ========================================
// Konsep: trio public/private/protected, private = pagar
//         compile-time, #field pagar nyata
// Program: perpustakaan dengan koleksi berbagai tingkat akses.

// ========================================
// SOAL
// ========================================
// 1. Buat class Perpustakaan dengan field: nama (public
//    eksplisit), judulRahasia (private), lokasi (protected),
//    #rakArsip (private identifier JS, default "arsip-1") —
//    semua diisi lewat constructor kecuali #rakArsip.
// 2. Buat method public info() → "nama di lokasi (rahasia:
//    judulRahasia)" — di DALAM class semua tingkat terbaca.
// 3. Buat Cabang extends Perpustakaan dengan method
//    alamatLengkap() → nama + " cabang " + lokasi (protected
//    sah dikonsumsi subclass).
// 4. RAMAL DULU: dari LUAR class (kode pemakai) —
//       perpus.judulRahasia
//       perpus.lokasi
//    error apa saja? Kodenya sama atau beda? Lalu di DALAM
//    subclass, this.judulRahasia — boleh?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) TRIO VISIBILITY + #FIELD.
//     (Jika di Dart seperti ini: tanpa keyword — private lewat
//     underscore _judulRahasia per library, protected tak
//     bawaan; `public String nama` justru error undefined_class
//     → di TypeScript jadi seperti ini: keyword eksplisit di
//     tiap member — PERBEDAAN NYATA)
// ------------------------------------------------------------------
class Perpustakaan {
  public nama: string;
  private judulRahasia: string;
  protected lokasi: string;
  #rakArsip: string = "arsip-1";

  constructor(nama: string, judulRahasia: string, lokasi: string) {
    this.nama = nama;
    this.judulRahasia = judulRahasia;
    this.lokasi = lokasi;
  }

  info(): string {
    return this.nama + " di " + this.lokasi +
      " (rahasia: " + this.judulRahasia + ", rak: " + this.#rakArsip + ")";
  }
}

class Cabang extends Perpustakaan {
  alamatLengkap(): string {
    return this.nama + " cabang " + this.lokasi;  // protected: sah
  }
}

const perpusA1 = new Perpustakaan("Perpus Pusat", "Naskah Kuno", "Jakarta");
const cabangA1 = new Cabang("Perpus Pusat", "Naskah Kuno", "Bandung");
console.log(perpusA1.nama);          // Perpus Pusat  (public)
console.log(perpusA1.info());        // Perpus Pusat di Jakarta (rahasia:
// Naskah Kuno, rak: arsip-1)
console.log(cabangA1.alamatLengkap());  // Perpus Pusat cabang Bandung

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — kode errornya BEDA per tingkat:
// ------------------------------------------------------------------
// const rahasia = perpusA1.judulRahasia;
// ❌ ERROR kalau di-uncomment:
//    error TS2341: Property 'judulRahasia' is private and only
//    accessible within class 'Perpustakaan'.
//
// const lokasinya = perpusA1.lokasi;
// ❌ ERROR kalau di-uncomment:
//    error TS2445: Property 'lokasi' is protected and only
//    accessible within class 'Perpustakaan' and its subclasses.
//    (private = TS2341, protected dari luar = TS2445 — jebakan
//    klasik: kodenya berbeda)
//
// class CabangSerakah extends Perpustakaan {
//     bacaJudul(): string { return this.judulRahasia; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2341: Property 'judulRahasia' is private and only
//    accessible within class 'Perpustakaan'.
//    (private TIDAK diwariskan ke subclass — pesan tetap menyebut
//    class PEMILIK)
//
// const rak = perpusA1.#rakArsip;
// ❌ ERROR kalau di-uncomment:
//    error TS18013: Property '#rakArsip' is not accessible
//    outside class 'Perpustakaan' because it has a private
//    identifier.
//
// Catatan penting: private TS = pagar COMPILE-TIME saja —
// keywordnya hilang saat transpile. Kalau baris TS2341 di atas
// dijalankan pakai tsx (bukan tsc), nilai justru TERBACA tanpa
// error. #field beda cerita: pagar nyata sampai runtime.

// ========================================
// RANGKUMAN
// ========================================
// - private (class sendiri) vs protected (+ subclass) vs public
//   (default); private dari subclass pun tetap TS2341.
// - Kode error beda: private = TS2341, protected dari luar =
//   TS2445.
// - private hanya pagar compile-time (tsx bypass); #field pagar
//   nyata hingga runtime — PERBEDAAN NYATA vs underscore Dart
//   yang private per library.
