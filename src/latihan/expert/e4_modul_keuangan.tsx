// ========================================
// LATIHAN EXPERT 4 — MODUL KEUANGAN
// MATERI: 20 (NAMESPACE)
// ========================================
// Konsep: namespace sebagai sub-folder dalam module, gerbang
//         export, nested namespace, Dart prefix import
// Program: modul utilitas keuangan dengan gerbang akses.

// ========================================
// SOAL
// ========================================
// 1. Buat namespace Keuangan berisi:
//    - export function formatRupiah(n: number): string →
//      "Rp" + n.toLocaleString("id-ID")
//    - export class KalkulatorPajak (constructor public tarif:
//      number; method hitung(dasar) → dasar * tarif / 100)
//    - const kursInternal = 15500 TANPA export (internal)
//    - export function konversi(usd): string → "$usd = Rp..."
//      (memakai kursInternal dari DALAM — sah)
// 2. Buat nested namespace Laporan di dalam Keuangan berisi
//    export function header(nama) → "== nama ==" (nested wajib
//    di-export juga).
// 3. Cetak: formatRupiah(15000), pajak 10% dari 250000,
//    konversi(10), Laporan.header("Bulanan").
// 4. RAMAL DULU: dari luar namespace —
//       Keuangan.kursInternal
//    error apa? (perhatikan bentuk tipe yang disebut pesannya —
//    sama seperti pola static di file 17)

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) NAMESPACE + GERBANG EXPORT.
//     (Jika di Dart seperti ini: TIDAK ADA keyword namespace —
//     pengelompokan lintas file lewat PREFIX IMPORT
//     `import 'keuangan.dart' as Keuangan;`
//     → di TypeScript jadi seperti ini: namespace bawaan bahasa
//     — PERBEDAAN NYATA)
// ------------------------------------------------------------------
namespace Keuangan {
  const kursInternal: number = 15500;  // tanpa export = internal

  export function formatRupiah(n: number): string {
    return "Rp" + n.toLocaleString("id-ID");
  }

  export class KalkulatorPajak {
    constructor(public tarif: number) {}

    hitung(dasar: number): number {
      return (dasar * this.tarif) / 100;
    }
  }

  export function konversi(usd: number): string {
    return "$" + usd + " = " + formatRupiah(usd * kursInternal);
  }

  export namespace Laporan {
    export function header(nama: string): string {
      return "== " + nama + " ==";
    }
  }
}

console.log(Keuangan.formatRupiah(15000));            // Rp15.000
const pajakE4 = new Keuangan.KalkulatorPajak(10);
console.log(pajakE4.hitung(250000));                  // 25000
console.log(Keuangan.konversi(10));                   // $10 = Rp155.000
console.log(Keuangan.Laporan.header("Bulanan"));      // == Bulanan ==

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — gerbang export menjaga internal:
// ------------------------------------------------------------------
// const kurs = Keuangan.kursInternal;
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'kursInternal' does not exist on
//    type 'typeof Keuangan'.
//    ('typeof Keuangan' — persis pola static file 17: sisi luar
//    hanya melihat yang di-export; member internal tetap sah
//    dipakai SESAMA ANGGOTA, seperti konversi memakainya)

// ------------------------------------------------------------------
// (3) Catatan Dart: dalam SATU file, pengelompokan yang paling
//     mirip dicapai lewat class berisi static (file 17); lintas
//     file: prefix import. Di era module modern, namespace
//     jarang jadi pilihan utama — module = folder, namespace =
//     sub-folder di dalamnya.
// ------------------------------------------------------------------

// ========================================
// RANGKUMAN
// ========================================
// - namespace = sub-folder dalam module; gerbang export
//   menentukan apa yang terlihat dari luar.
// - Member tanpa export = internal — sah dipakai sesama anggota;
//   akses dari luar = TS2339 'typeof Namespace' (pola static).
// - Nested namespace sah dan wajib di-export berantai; Dart
//   mengelompokkan lewat prefix import — PERBEDAAN NYATA.
