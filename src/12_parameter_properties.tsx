// ==================================================================
// OOP 12 — PARAMETER PROPERTIES
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 57-59
// (Parameter Properties). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2564, TS2687 2x, TS2300 (duplikat —
// 4 baris), TS2540, TS2339. Temuan probe: readonly
// juga sah sebagai modifier walau bukan "visibility" (hlm. 58).

// ------------------------------------------------------------------
// (1) SHORTHAND — MELUNASI JANJI file 2 (hlm. 58)
//
// PDF (hlm. 58): parameter constructor sering HANYA dipakai untuk
// mengisi property. Parameter Properties membuat parameter itu
// otomatis menjadi property — caranya menambahkan VISIBILITY pada
// parameter di constructor (public/private/protected — file 11):
// `constructor(private nama: string)`.
//
// Jika di Dart seperti ini:
//     class Pelanggan {
//       String nama;
//       Pelanggan(this.nama);          // parameter property Dart
//     }
// di TypeScript jadi seperti ini:
//     class Pelanggan {
//         constructor(public nama: string) {}
//     }
// KEMIRIPAN EKSTREM — `this.x` Dart adalah parameter property
// bawaan sejak lama. PERBEDAAN NYATA: TS menuntut modifier
// EKSPLISIT (public/private/protected; readonly juga sah walau
// bukan visibility), sedangkan Dart mengikuti nama field —
// `this._nama` otomatis private, tanpa modifier. Dan di TS,
// parameter TANPA modifier TIDAK menjadi field (sub-section 2).
// ------------------------------------------------------------------

class Produk {
    constructor(
        public kode: string,           // otomatis field public
        private harga: number,         // otomatis field private
        protected diskon: number = 0,  // modifier + default value
        readonly id: number = 1,       // readonly — sah juga
    ) {}

    labelHarga(): string {
        return `${this.kode} Rp${this.harga - this.diskon} (#${this.id})`;
    }
}

const p12 = new Produk("K-1", 10000, 500);
console.log(p12.kode);           // K-1 — public: bisa dari luar
console.log(p12.labelHarga());   // K-1 Rp9500 (#1)

class AnakProduk extends Produk {
    lihatDiskon(): number {
        return this.diskon;      // protected: sah di subclass
    }
}
console.log(new AnakProduk("K-2", 2000).lihatDiskon());   // 0

// ------------------------------------------------------------------
// (2) CAMPURAN — PARAMETER BIASA + PARAMETER PROPERTY
//
// Tidak harus semuanya sekaligus: parameter TANPA modifier tetap
// parameter biasa (harus di-assign manual kalau mau jadi field),
// parameter BER-modifier otomatis jadi field. Pola umum: satu
// field butuh logika khusus (manual), sisanya cukup shorthand.
// ------------------------------------------------------------------

class Buku {
    judul: string;                     // diisi MANUAL dari param biasa

    constructor(judul: string, private penulis: string) {
        this.judul = judul;            // param tanpa modifier ≠ field
    }

    info(): string {
        return `${this.judul} — ${this.penulis}`;
    }
}
console.log(new Buku("TS Dasar", "Eko").info());   // TS Dasar — Eko

// ------------------------------------------------------------------
// (3) KODE ERROR — DUPLIKAT FIELD, READONLY, PARAMETER BIASA
//
// class PelangganDuplikat {
//     nama: string;
//     constructor(private nama: string) {}
// }
// ❌ ERROR kalau di-uncomment (4 baris — duplikat + modifier beda):
//    error TS2564: Property 'nama' has no initializer and is not
//    definitely assigned in the constructor.
//    error TS2687: All declarations of 'nama' must have identical
//    modifiers.
//    error TS2300: Duplicate identifier 'nama'.
//    error TS2687: All declarations of 'nama' must have identical
//    modifiers.
//    (jangan deklarasi field lagi — parameter property SUDAH
//    mendeklarasikannya; TS2687 muncul 2x karena dilaporkan di
//    dua lokasi: deklarasi field dan parameter)
//
// const salahRo = new Produk("K-9", 5000);
// salahRo.id = 99;
// ❌ ERROR kalau di-uncomment:
//    error TS2540: Cannot assign to 'id' because it is a read-only
//    property.
//    (readonly pada parameter property sama beku-nya dengan
//    readonly pada field — file 3)
//
// class SalahBiasa {
//     constructor(judul: string) {}
//     tampil(): string { return this.judul; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'judul' does not exist on type
//    'SalahBiasa'.
//    (parameter tanpa modifier BUKAN field — beri modifier atau
//    deklarasi field + assign manual)
//
// Catatan Dart (terverifikasi dart analyze + run):
// `Pelanggan(this.namaPublik, this._namaPrivat)` — keduanya
// parameter property; privatitas mengikuti UNDERSCORE nama field
// (bukan modifier), dan output run "eko / rahasia" + akses
// `p._namaPrivat` dari library yang sama sah. Justru TS yang
// lebih eksplisit di sini: private-nya tertulis di constructor.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Parameter Properties (hlm. 58): tambahkan modifier pada
//    parameter constructor → otomatis jadi property — deklarasi,
//    assign, semuanya diringkas satu tempat.
// 2. Modifier sah: public/private/protected + readonly (walau
//    readonly bukan "visibility" — hlm. 58 bilang visibility,
//    praktiknya readonly ikut diterima — terverifikasi).
// 3. PERBEDAAN NYATA vs Dart `this.x`: TS wajib modifier eksplisit;
//    Dart mengikuti nama field (underscore = private). Parameter
//    TS tanpa modifier = parameter biasa, BUKAN field (TS2339
//    kalau dipakai sebagai this.x).
// 4. Duplikat deklarasi (field + parameter property) = TS2300 +
//    TS2687 + TS2564 — jangan deklarasi ulang.
// 5. readonly parameter property beku setelah constructor (TS2540);
//    modifier + default value sah (`diskon: number = 0`).
//
// Cara menjalankan file ini: npx tsx src/12_parameter_properties.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Refactor! Ubah class bertele-tele ini jadi versi shorthand:
//        class Pemain {
//            nama: string;
//            nomor: number;
//            constructor(nama: string, nomor: number) {
//                this.nama = nama;
//                this.nomor = nomor;
//            }
//        }
//    (nomor boleh dibaca dari luar, nama juga)
//
// JAWABAN:
class Pemain {
    constructor(public nama: string, public nomor: number) {}

    perkenalan(): string {
        return `#${this.nomor} ${this.nama}`;
    }
}
const pem = new Pemain("Eko", 9);
console.log(pem.nama);                  // Eko
console.log(pem.perkenalan());          // #9 Eko

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Mobil {
//          String merek;
//          int _tahun;
//          Mobil(this.merek, this._tahun);
//        }
//    Buat versi TS-nya (merek public, tahun private) lalu buat
//    method umur() mengembalikan 2026 - tahun.
//
// JAWABAN:
class Mobil {
    constructor(public merek: string, private tahun: number) {}

    umur(): number {
        return 2026 - this.tahun;
    }
}
console.log(new Mobil("Toyota", 2020).umur());   // 6

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Catatan {
//            constructor(judul: string) {}
//            tampil(): string { return this.judul; }
//        }
//
// JAWABAN: ERROR TS2339 — "Property 'judul' does not exist on type
//    'Catatan'." — parameter tanpa modifier tidak menjadi field
//    (sub-section 2-3). Versi perbaikan yang bisa dijalankan:
class Catatan {
    constructor(public judul: string) {}   // modifier ditambahkan

    tampil(): string {
        return this.judul;
    }
}
console.log(new Catatan("belajar").tampil());   // belajar
