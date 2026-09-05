// ========================================
// LATIHAN EXPERT 5 — KASIR MINIMARKET
// MATERI: 2, 3, 9, 12, 14, 16, 17, 19 (INTEGRASI)
// ========================================
// Konsep: gabungan constructor + readonly + override + parameter
//         properties + polymorphism + abstract + static + custom
//         error dalam satu program utuh
// Program: kasir minimarket dengan struk, counter & validasi.

// ========================================
// SOAL
// ========================================
// 1. TransaksiE5: PRIVATE static totalTransaksi (mulai 0) +
//    field nomor — constructor menaikkan counter lalu nomor =
//    nilai counter terbaru (nomor transaksi berurutan otomatis).
// 2. abstract ProdukE5: parameter properties readonly kode,
//    nama, harga + abstract kategori(): string + method konkret
//    tampil() → "kode nama Rpharga (kategori())" — kategori()
//    di dalam tampil harus menjalankan versi CHILD.
// 3. MakananE5 extends ProdukE5: tambah expired (param property)
//    — kategori() → "makanan — expired X". ElektronikE5: tambah
//    garansiBulan — kategori() → "elektronik — garansi N bln".
//    (Super constructor + parameter properties bekerja bersama.)
// 4. KeranjangE5: isi ProdukE5[], tambah(), total() via LOOP.
//    Function bayar(keranjang): keranjang kosong → throw
//    StokHabis; selain itu buat TransaksiE5 baru →
//    "Transaksi #n total Rptotal".
// 5. StokHabis extends Error: constructor(public namaProduk:
//    string) → super("stok habis: " + namaProduk) + name =
//    "StokHabis".
// 6. Skenario: keranjang berisi Kopi (M-1, 15000, expired
//    2026-01-01) + Kipas (E-1, 100000, garansi 12) → bayar;
//    keranjang kosong → bayar dalam try-catch (instanceof
//    StokHabis, finally "kasir siap lagi"); bayar keranjang
//    pertama LAGI; terakhir cetak TransaksiE5.totalTransaksi
//    lewat getter static.
// 7. RAMAL DULU (tanpa menjalankan dulu):
//    a. Berapa TransaksiE5.totalTransaksi di akhir — apakah
//       percobaan keranjang kosong ikut menambah?
//    b. class SalahElektronik extends ProdukE5 dengan override
//       kategori(): number { return 1; } — error apa?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) TRANSAKSI: PRIVATE STATIC COUNTER — nomor otomatis.
// ------------------------------------------------------------------
class TransaksiE5 {
  private static totalTransaksi: number = 0;

  static get jumlahTransaksi(): number {
    return TransaksiE5.totalTransaksi;
  }

  nomor: number;

  constructor() {
    TransaksiE5.totalTransaksi = TransaksiE5.totalTransaksi + 1;
    this.nomor = TransaksiE5.totalTransaksi;
  }
}

// ------------------------------------------------------------------
// (2) PRODUK: ABSTRACT + PARAMETER PROPERTIES + DISPATCH.
//     (Jika di Dart seperti ini: ProdukE5(this.kode, this.nama,
//     this.harga) dengan kode final → di TypeScript jadi seperti
//     ini: constructor(public readonly kode: string, ...) —
//     KEMIRIPAN EKSTREM dengan shorthand Dart)
// ------------------------------------------------------------------
abstract class ProdukE5 {
  constructor(public readonly kode: string, public nama: string,
              public harga: number) {}

  abstract kategori(): string;

  tampil(): string {
    return this.kode + " " + this.nama + " Rp" + this.harga +
      " (" + this.kategori() + ")";
  }
}

class MakananE5 extends ProdukE5 {
  constructor(kode: string, nama: string, harga: number,
              public expired: string) {
    super(kode, nama, harga);
  }

  kategori(): string {
    return "makanan — expired " + this.expired;
  }
}

class ElektronikE5 extends ProdukE5 {
  constructor(kode: string, nama: string, harga: number,
              public garansiBulan: number) {
    super(kode, nama, harga);
  }

  kategori(): string {
    return "elektronik — garansi " + this.garansiBulan + " bln";
  }
}

// ------------------------------------------------------------------
// (3) CUSTOM ERROR + KERANJANG + PINTU BAYAR (polymorphism):
// ------------------------------------------------------------------
class StokHabis extends Error {
  constructor(public namaProduk: string) {
    super("stok habis: " + namaProduk);
    this.name = "StokHabis";
  }
}

class KeranjangE5 {
  isi: ProdukE5[] = [];

  tambah(p: ProdukE5): void {
    this.isi.push(p);
  }

  total(): number {
    let jumlah = 0;
    for (const p of this.isi) {
      jumlah = jumlah + p.harga;
    }
    return jumlah;
  }
}

function bayar(keranjang: KeranjangE5): string {
  if (keranjang.isi.length === 0) {
    throw new StokHabis("(keranjang kosong)");
  }
  const transaksi = new TransaksiE5();  // hanya kalau lolos cek
  return "Transaksi #" + transaksi.nomor +
    " total Rp" + keranjang.total();
}

const keranjangE5 = new KeranjangE5();
keranjangE5.tambah(new MakananE5("M-1", "Kopi", 15000, "2026-01-01"));
keranjangE5.tambah(new ElektronikE5("E-1", "Kipas", 100000, 12));
console.log(keranjangE5.isi[0].tampil());
// M-1 Kopi Rp15000 (makanan — expired 2026-01-01)
console.log(keranjangE5.isi[1].tampil());
// E-1 Kipas Rp100000 (elektronik — garansi 12 bln)
console.log(bayar(keranjangE5));   // Transaksi #1 total Rp115000
const kosongE5 = new KeranjangE5();
try {
  // prediksi: baris ini TIDAK tercetak — bayar melempar sebelum
  // sempat mengembalikan string
  console.log(bayar(kosongE5));
} catch (e) {
  if (e instanceof StokHabis) {
    console.log("gagal: " + e.message);
    // gagal: stok habis: (keranjang kosong)
  }
} finally {
  console.log("kasir siap lagi");  // kasir siap lagi
}
console.log(bayar(keranjangE5));   // Transaksi #2 total Rp115000
console.log(TransaksiE5.jumlahTransaksi);  // 2

// ------------------------------------------------------------------
// (4) JAWABAN RAMAL DULU (a): total = 2 — percobaan keranjang
//     kosong TIDAK menambah counter karena bayar() melempar
//     StokHabis SEBELUM membuat TransaksiE5 (urutan cek dulu,
//     efek samping belakangan).
// ------------------------------------------------------------------

// ------------------------------------------------------------------
// (5) JAWABAN RAMAL DULU (b) — override beda tipe return:
// ------------------------------------------------------------------
// class SalahElektronik extends ProdukE5 {
//     kategori(): number { return 1; }
//     constructor() { super("X-9", "Salah", 100); }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2416: Property 'kategori' in type 'SalahElektronik'
//    is not assignable to the same property in base type
//    'ProdukE5'.
//    Type '() => number' is not assignable to type
//    '() => string'.
//    Type 'number' is not assignable to type 'string'.

// ------------------------------------------------------------------
// (6) BLOK TERAKHIR — uncaught crash (tsc diam):
// ------------------------------------------------------------------
// bayar(kosongE5);
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM):
//    StokHabis: stok habis: (keranjang kosong)
//    (format <NamaError>: <pesan> — name dari constructor ikut
//    tampil; blok ini sengaja paling akhir: crash menghentikan
//    seluruh program)

// ========================================
// RANGKUMAN
// ========================================
// - Integrasi: abstract + param properties + readonly + override
//   + polymorphism loop + private static counter + custom error
//   bekerja sebagai satu sistem.
// - Urutan berpengaruh: cek validasi SEBELUM efek samping —
//   transaksi gagal tidak menambah counter.
// - Dispatch menjalar: method konkret parent memanggil abstract
//   → versi child yang jalan (Makanan vs Elektronik).
