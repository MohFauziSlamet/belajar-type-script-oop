// ==================================================================
// OOP 17 — STATIC
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 79-83
// (Static). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2339 (typeof), TS2576, TS2341.
// Temuan probe: static DIWARISKAN di TS (Dart menolak via nama
// child!); `this` di static method TS sah = class itu sendiri.

// ------------------------------------------------------------------
// (1) MILIK CLASS, BUKAN OBJECT (hlm. 80-81)
//
// PDF (hlm. 80): keyword `static` pada properties/method membuat
// member itu BUKAN bagian dari object — seperti global variable
// atau function yang bisa diakses langsung TANPA new; visibility
// tetap bisa dipakai; biasanya untuk class utility/helper.
//
// Jika di Dart seperti ini:
//     class Konfigurasi {
//       static String versi = '1.0';
//       static int catat() { ... }
//     }
// di TypeScript jadi seperti ini:
//     class Konfigurasi {
//         static versi: string = "1.0";
//         static catat(): void { ... }
//     }
// KEMIRIPAN EKSTREM — keyword, makna, dan akses lewat NAMA CLASS
// keduanya sama. Perhatikan juga: mengubah static property =
// mengubah GLOBAL STATE — terlihat dari mana saja (versi 1.0 →
// 2.0 di bawah), non-static member bebas membacanya lewat nama
// class-nya (hlm. 83, arah kedua).
// ------------------------------------------------------------------

class Konfigurasi {
    static versi: string = "1.0";
    private static jumlahAkses: number = 0;   // static + visibility

    static catatAkses(): void {
        Konfigurasi.jumlahAkses++;   // static akses static: sah
    }

    static totalAkses(): number {
        return Konfigurasi.jumlahAkses;
    }

    static versiLewatThis(): string {
        return this.versi;   // nuansa TS: this di static = CLASS
    }

    tampilkanVersi(): string {          // non-static membaca
        return `v${Konfigurasi.versi}`;  // static: sah (hlm. 83)
    }
}

console.log(Konfigurasi.versi);                   // 1.0
Konfigurasi.catatAkses();
Konfigurasi.catatAkses();
console.log(Konfigurasi.totalAkses());           // 2
console.log(Konfigurasi.versiLewatThis());       // 1.0
console.log(new Konfigurasi().tampilkanVersi()); // v1.0
Konfigurasi.versi = "2.0";   // ubah sekali — global!
console.log(Konfigurasi.versi);                   // 2.0

// ------------------------------------------------------------------
// (2) PERLU DIINGAT — ATURAN AKSES DUA ARAH (hlm. 83) + KODE ERROR
//
// PDF (hlm. 83): static member HANYA bisa mengakses static member
// lainnya — tidak bisa mengakses non-static member, KECUALI lewat
// object; sebaliknya non-static member BOLEH mengakses static
// member secara langsung. Rasa "global" inilah yang membuat class
// utility (seperti Math) bisa dipakai tanpa new sama sekali.
// ------------------------------------------------------------------

class MatematikaUtil {
    static kuadrat(n: number): number {
        return n * n;
    }

    static bulatkan(n: number): number {   // helper kedua — hlm. 80
        return Math.round(n);
    }
}
console.log(MatematikaUtil.kuadrat(8));      // 64 — tanpa new
console.log(MatematikaUtil.bulatkan(3.6));   // 4

// class SalahStatic {
//     namaBiasa: string = "x";
//     static bacaNama(): string {
//         return this.namaBiasa;
//     }
// }
// console.log(SalahStatic.bacaNama());
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'namaBiasa' does not exist on type
//    'typeof SalahStatic'.
//    (di context static, this = CLASS (typeof X), bukan instance
//    — instance member tidak terlihat; hlm. 83 arah pertama)
//
// const k17 = new Konfigurasi();
// console.log(k17.versi);
// ❌ ERROR kalau di-uncomment:
//    error TS2576: Property 'versi' does not exist on type
//    'Konfigurasi'. Did you mean to access the static member
//    'Konfigurasi.versi' instead?
//    (static milik class — akses lewat instance ditolak; pesan
//    TS2576 bahkan menunjuk jalan benarnya)
//
// console.log(Konfigurasi.jumlahAkses);
// ❌ ERROR kalau di-uncomment:
//    error TS2341: Property 'jumlahAkses' is private and only
//    accessible within class 'Konfigurasi'.
//    (visibility berlaku juga untuk static — hlm. 80)

// ------------------------------------------------------------------
// (3) PERBEDAAN NYATA — WARISAN STATIC + Catatan Dart
//
// Di TS, static member DIWARISKAN: nama child bisa dipakai
// mengakses static parent (prototype chain). Di Dart, static
// MILIK class pendeklarasinya — akses lewat nama child DITOLAK
// (undefined_getter). Ini perbedaan yang mudah menjegal migrasi
// Dart → TS dan sebaliknya (pola PERBEDAAN NYATA file 6).
// ------------------------------------------------------------------

class SubKonfigurasi extends Konfigurasi {}
console.log(SubKonfigurasi.versi);         // 2.0 — diwariskan!
console.log(SubKonfigurasi.totalAkses());  // 2 — ikut parent

// Catatan Dart (terverifikasi dart analyze + run): perilaku dasar
// identik — run mencetak "1.0 / 2 / v1.0 / 2.0 / 2.0" (global
// state juga). Yang beda: (a) `SubKonfigurasiD.versi` = error
// undefined_getter "The getter 'versi' isn't defined for the type
// 'SubKonfigurasiD'." — static tidak diwariskan lewat nama child;
// (b) `this` di static method = invalid_reference_to_this
// "Invalid reference to 'this' expression." — sedangkan TS justru
// SAH (this = class itu sendiri, versiLewatThis di atas);
// (c) static via instance = instance_access_to_static_member
// "The static getter 'versi' can't be accessed through an
// instance. Try using the class 'KonfigurasiE' to access the
// getter."; (d) di DALAM class yang sama, Dart boleh mengakses
// static TANPA prefix (`versi` telanjang di method non-static
// sah) — TS selalu butuh `Konfigurasi.versi` (atau this di
// static).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. static (hlm. 80): member milik CLASS bukan object — diakses
//    lewat nama class tanpa new; seperti global variable/function;
//    visibility tetap berlaku (private static = TS2341).
// 2. Hlm. 83 dua arah: static hanya bisa akses static lain
//    (instance member tak terlihat — this di static = typeof
//    class); non-static bebas akses static lewat nama class.
// 3. Static property = GLOBAL STATE — sekali diubah, terbaca dari
//    mana saja (1.0 → 2.0). Cocok untuk utility/helper class.
// 4. Static via instance = TS2576, pesannya menunjuk jalan benar
//    ("Did you mean to access the static member ... instead?").
// 5. PERBEDAAN NYATA vs Dart: static DIWARISKAN di TS (nama child
//    sah) tapi Dart menolak (undefined_getter); this di static
//    method sah di TS (= class), invalid_reference_to_this di
//    Dart; Dart boleh akses static tanpa prefix di dalam class
//    yang sama.
//
// Cara menjalankan file ini: npx tsx src/17_static.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class HitungUtil berisi static pi = 3.14 dan static
//    luasLingkaran(jari) yang memakainya. Panggil tanpa new.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
class HitungUtilLatihan {
    static pi: number = 3.14;

    static luasLingkaran(jari: number): number {
        return HitungUtilLatihan.pi * jari * jari;
    }
}
console.log(HitungUtilLatihan.pi);                 // 3.14
console.log(HitungUtilLatihan.luasLingkaran(10));  // 314

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Pencatat {
//          static int _total = 0;
//          static void catat() => _total++;
//          static int get total => _total;
//        }
//
// JAWABAN:
class PencatatLatihan {
    private static totalAngka: number = 0;   // _total Dart ≈
                                             // private (file 11)
    static catat(): void {
        PencatatLatihan.totalAngka++;
    }

    static get total(): number {   // static getter ≈ file 5 —
        return PencatatLatihan.totalAngka;   // pemanggilan tanpa
    }                             // kurung, persis get total Dart
}
PencatatLatihan.catat();
PencatatLatihan.catat();
console.log(PencatatLatihan.total);   // 2

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Database {
//            static host: string = "localhost";
//        }
//        const db = new Database();
//        console.log(db.host);
//
// JAWABAN: ERROR TS2576 — "Property 'host' does not exist on
//    type 'Database'. Did you mean to access the static member
//    'Database.host' instead?" — static milik class, bukan
//    instance. Versi perbaikan yang bisa dijalankan:
class DatabaseLatihan {
    static host: string = "localhost";
}
console.log(DatabaseLatihan.host);   // localhost — via nama class
