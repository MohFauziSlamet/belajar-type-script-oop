// ==================================================================
// OOP 20 — NAMESPACE
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 91-94
// (Namespace). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2339 (typeof Namespace) — satu-
// satunya blok bab ini (gerbang export). Temuan
// probe: member tanpa export TIDAK terlihat dari luar (kembar
// pola static file 17); Dart TIDAK punya keyword namespace.

// ------------------------------------------------------------------
// (1) SUB-FOLDER DI DALAM MODULE (hlm. 92-93)
//
// PDF (hlm. 92): selain JavaScript Modules, TS punya cara lain
// mengorganisir kode — NAMESPACE, untuk mengelola banyak kode
// dalam SATU module. Analoginya: module = folder, namespace =
// sub-folder. Dibuat dengan keyword `namespace`, bisa berisi
// class, function, dan lain-lain. Gerbangnya `export`: member
// ber-export terlihat dari luar; TANPA export = internal —
// tapi tetap sah dipakai SESAMA anggota namespace (label() di
// bawah dipanggil Dompet.tampil).
// ------------------------------------------------------------------

namespace RupiahFormat {
    export function format(angka: number): string {
        return `Rp${angka.toLocaleString("id-ID")}`;
    }

    export const NAMA: string = "RupiahFormat";

    export class Dompet {
        constructor(public saldo: number) {}

        tampil(): string {   // pakai member internal: sah
            return `${label()} ${format(this.saldo)}`;
        }
    }

    function label(): string {   // TANPA export — internal
        return "saldo:";
    }
}

console.log(RupiahFormat.format(15000));   // Rp15.000
console.log(RupiahFormat.NAMA);            // RupiahFormat
console.log(new RupiahFormat.Dompet(2500).tampil());   // saldo:
                                                        // Rp2.500

// ------------------------------------------------------------------
// (2) NAMESPACE BERSARANG + PASANGAN DART (hlm. 94)
//
// Namespace bisa BERANAK: namespace di dalam namespace (tetap
// harus di-export agar terlihat). Pemakaiannya persis jalur
// sub-folder: Toko.Kasir.sapa().
//
// PERBEDAAN NYATA: Dart TIDAK punya keyword namespace. Cara
// Dart mengelompokkan: lintas file lewat PREFIX IMPORT, dalam
// file lewat class static (file 17).
// Jika di Dart seperti ini:
//     // file util_dart.dart:
//     String formatRupiah(int angka) => 'Rp$angka';
//     // file pemakai:
//     import 'util_dart.dart' as RupiahD;
//     void main() {
//       print(RupiahD.formatRupiah(15000));   // Rp15000
//     }
// di TypeScript jadi seperti ini (satu file, tanpa import):
//     namespace RupiahD {
//         export function formatRupiah(angka: number): string {
//             return `Rp${angka}`;
//         }
//     }
//     console.log(RupiahD.formatRupiah(15000));   // Rp15000
// Efek visualnya sama (prefix titik), tapi jalurnya beda:
// Dart butuh file terpisah + import; TS namespace hidup DI
// DALAM satu module — persis klaim "sub-folder" hlm. 92.
// ------------------------------------------------------------------

namespace Toko {
    export namespace Kasir {   // nested — di-export juga
        export function sapa(nama: string): string {
            return `halo kasir ${nama}`;
        }
    }
}
console.log(Toko.Kasir.sapa("Eko"));   // halo kasir Eko

// ------------------------------------------------------------------
// (3) KODE ERROR + Catatan Dart
//
// Member tanpa export sama sekali tidak terlihat dari luar —
// pesannya kembar pola static file 17 ('typeof X'), karena
// namespace juga diakses lewat "sisi class"-nya.
// ------------------------------------------------------------------

// console.log(RupiahFormat.label());
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'label' does not exist on type
//    'typeof RupiahFormat'.
//    (tanpa export = internal; beri export kalau memang mau
//    dibuka — atau akses lewat member ber-export yang
//    membukanya, seperti Dompet.tampil)
//
// Catatan Dart (terverifikasi dart analyze + run): probe dua
// file — util_dart.dart berisi formatRupiah + class Dompet,
// pemakai meng-import `as RupiahD` — analyzer bersih, run
// mencetak "Rp15000 / saldo: Rp2500". Prefix import BISA
// dihilangkan (import tanpa as — semua nama lepas ke top-level,
// rawan tabrakan — persis alasan pengelompokan dipakai:
// namespace di TS, prefix import di Dart).
// Catatan penutup: di era module modern, namespace jarang jadi
// pilihan utama — PDF sendiri memposisikannya untuk module yang
// sudah memuat SANGAT banyak kode (hlm. 92).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Namespace (hlm. 92) = pengelompok kode DALAM satu module —
//    analogi module folder, namespace sub-folder; keyword
//    `namespace`; bisa berisi class, function, const, dan
//    namespace lain.
// 2. Gerbangnya `export`: ber-export terlihat dari luar;
//    tanpa export = internal (tetap sah dipakai sesama anggota
//    namespace di dalam).
// 3. Akses member tanpa export dari luar = TS2339 'typeof
//    Namespace' — kembar pola static file 17.
// 4. Nested namespace sah dan harus di-export juga:
//    Toko.Kasir.sapa() — jalur bertingkat seperti sub-folder.
// 5. PERBEDAAN NYATA: Dart TIDAK punya keyword namespace —
//    lintas file pakai prefix import (`as RupiahD`), dalam file
//    pakai class static (file 17); TS namespace hidup satu file.
//
// Cara menjalankan file ini: npx tsx src/20_namespace.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat namespace Matematika berisi export const PI dan
//    export function luasLingkaran(jari). Panggil keduanya.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
namespace MatematikaLatihan {
    export const PI: number = 3.14;

    export function luasLingkaran(jari: number): number {
        return PI * jari * jari;   // sesama anggota: tanpa prefix
    }
}
console.log(MatematikaLatihan.PI);                  // 3.14
console.log(MatematikaLatihan.luasLingkaran(10));   // 314

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        // file geo_dart.dart:
//        int luasPersegi(int s) => s * s;
//        // file pemakai:
//        import 'geo_dart.dart' as Geo;
//        void main() {
//          print(Geo.luasPersegi(4));
//        }
//    Tulis versi TS-nya memakai namespace (satu file).
//
// JAWABAN:
namespace GeoLatihan {
    export function luasPersegi(s: number): number {
        return s * s;
    }
}
console.log(GeoLatihan.luasPersegi(4));   // 16

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        namespace Konfigurasi {
//            export function ambil(): string { return baca(); }
//            function baca(): string { return "x"; }
//        }
//        console.log(Konfigurasi.baca());
//
// JAWABAN: ERROR TS2339 — "Property 'baca' does not exist on
//    type 'typeof Konfigurasi'." — baca tanpa export hanya
//    internal (sah dipanggil ambil(), tak sah dari luar).
//    Versi perbaikan yang bisa dijalankan:
namespace KonfigurasiLatihan {
    export function ambil(): string {
        return baca();
    }

    function baca(): string {
        return "x";
    }
}
console.log(KonfigurasiLatihan.ambil());   // x — via pintu export
