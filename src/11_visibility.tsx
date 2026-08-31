// ==================================================================
// OOP 11 — VISIBILITY (public / private / protected)
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 52-56
// (Visibility). Semua klaim perilaku DIVERIFIKASI via tsc --strict
// --target esnext + tsx + Dart 3.11 dart analyze/run. Blok error
// terverifikasi: TS2341 (2 varian), TS2445, TS18013. Temuan probe
// kunci: `private` TS = pagar COMPILE-TIME saja (bypass runtime
// terbukti); `#field` (hlm. 53, versi JavaScript) dijaga sampai
// level transpiler/runtime.

// ------------------------------------------------------------------
// (1) TIGA KATA KUNCI VISIBILITY (hlm. 53-54)
//
// PDF (hlm. 53-54): secara default property/method bersifat public
// (bisa diakses di dalam dan di luar class). TS mempermudah
// visibility dengan TIGA kata kunci:
//   - public    : di mana pun (default kalau tak ditulis)
//   - private   : hanya class-nya sendiri
//   - protected : seperti private + boleh diakses class turunannya
//
// Jika di Dart seperti ini:
//     class Counter {
//       int _nilai = 0;          // "private" = underscore per library
//     }
// di TypeScript jadi seperti ini:
//     class Counter {
//         private nilai: number = 0;   // eksplisit, per class
//         protected catat() { ... }    // + turunannya
//     }
// PERBEDAAN NYATA: Dart TIDAK punya ketiga keyword ini — private
// Dart lewat underscore (dan berlaku per LIBRARY, bukan per class
// — file 5), protected tidak ada bawaannya (hanya anotasi
// @protected dari package meta, penegaknya lint). TS eksplisit
// semuanya; pakai `public String` di Dart = error undefined_class
// ("Undefined class 'public'." — terverifikasi dart analyze).
// ------------------------------------------------------------------

class Counter {
    protected nilai: number = 0;      // class + turunan
    private langkah: number = 1;      // hanya Counter sendiri

    public tambah(): number {         // public eksplisit (default)
        this.nilai += this.langkah;
        return this.nilai;
    }
}

class DoubleCounter extends Counter {
    naikDua(): number {
        this.nilai += this.nilai;     // protected parent: sah
        return this.nilai;
    }

    info(): string {
        return `double ${this.nilai}`;
    }
}

const dc = new DoubleCounter();
console.log(dc.tambah());   // 1
console.log(dc.naikDua());  // 2
console.log(dc.info());     // double 2

// ------------------------------------------------------------------
// (2) private = PAGAR COMPILE-TIME; #field = PAGAR JAVASCRIPT
//
// Pelunasan janji file 5: `_nama` di TS hanyalah KONVENSI (masih
// public); `private` adalah pagar sungguhan — tapi pagar yang
// HANYA berdiri saat type-check. Hasil probe dua sisi: `tsc`
// menolak akses private dari luar (TS2341), namun `tsx` (yang
// hanya transpile tanpa type-check) tetap MENCETAK nilai private
// itu — keyword visibility hilang ketika kode menjadi JavaScript.
// PDF (hlm. 53): JavaScript sendiri punya private bawaan berupa
// prefix `#` — dan pagar ini NYATA sampai level runtime:
// transpiler esbuild (basis tsx) langsung MENOLAK memproses
// akses `#field` dari luar class. Ringkasnya: `private` = janji
// compiler; `#field` = pagar JavaScript.
// ------------------------------------------------------------------

class Rekening {
    private rahasia: string = "X-99";   // pagar compile-time
    #kode: string = "H-1";              // pagar JavaScript (hlm. 53)

    baca(): string {
        return this.rahasia;            // dalam class: sah
    }

    bacaKode(): string {
        return this.#kode;              // dalam class: sah
    }
}

const rek = new Rekening();
console.log(rek.baca());      // X-99
console.log(rek.bacaKode());  // H-1

// ------------------------------------------------------------------
// (3) KODE ERROR — TS2341, TS2445, TS18013
//
// const rek2 = new Rekening();
// console.log(rek2.rahasia);
// ❌ ERROR kalau di-uncomment:
//    error TS2341: Property 'rahasia' is private and only
//    accessible within class 'Rekening'.
//    (private dari LUAR class; tapi ingat sub 2 — tsx tetap
//    mencetak "X-99": pagar ini compile-time saja)
//
// const dc2 = new DoubleCounter();
// console.log(dc2.nilai);
// ❌ ERROR kalau di-uncomment:
//    error TS2445: Property 'nilai' is protected and only
//    accessible within class 'Counter' and its subclasses.
//    (protected dari luar = TS2445 — kode beda dari TS2341!)
//
// class AnakBocor extends Counter {
//     lihat(): number {
//         return this.langkah;
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2341: Property 'langkah' is private and only
//    accessible within class 'Counter'.
//    (private TIDAK bisa diakses subclass — pesan menyebut class
//    PEMILIKnya, bukan si subclass; butuh akses turunan? pakai
//    protected)
//
// const rek3 = new Rekening();
// console.log(rek3.#kode);
// ❌ ERROR kalau di-uncomment:
//    error TS18013: Property '#kode' is not accessible outside
//    class 'Rekening' because it has a private identifier.
//    (#field dari luar — dan beda dari private biasa: tsx/esbuild
//    juga MENOLAK menjalankannya, bukan sekadar tsc)
//
// Catatan Dart (terverifikasi dart analyze): keyword `public`
// dianggap nama class tak dikenal — error undefined_class
// "Undefined class 'public'. Try changing the name to the name of
// an existing class, or creating the class with the name 'public'."
// Ditambah dua parse error ikutan. Peta lengkapnya: private Dart
// = underscore per LIBRARY (file 5), protected = tidak ada
// bawaan (@protected lint-only), public = tanpa penanda.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Tiga keyword (hlm. 54): public (default, di mana pun),
//    private (hanya class sendiri), protected (private + class
//    turunannya).
// 2. PERBEDAAN NYATA: Dart tidak punya ketiga keyword — private =
//    underscore per library, protected tidak bawaan; TS
//    menegakkannya eksplisit lewat compiler.
// 3. private dari luar = TS2341; protected dari luar = TS2445
//    (kode beda!); private dari subclass = TS2341 dengan pesan
//    menyebut class PEMILIK.
// 4. `private` hanyalah pagar COMPILE-TIME — terverifikasi tsx
//    masih mencetak nilai private (keyword hilang saat transpile);
//    butuh pagar nyata sampai JavaScript? pakai `#field` (hlm. 53,
//    TS18013 di tsc + ditolak esbuild/runtime).
// 5. `_nama` (file 5) = konvensi yang masih public; `private
//    nama` = keyword yang diperiksa compiler; `#nama` = private
//    asli JavaScript — tiga tingkat kedisiplinan.
//
// Cara menjalankan file ini: npx tsx src/11_visibility.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Gudang: private stok (default 10) hanya boleh
//    diubah lewat method ambil(n) dan dibaca lewat sisa();
//    protected nama. Class LaporanGudang extends Gudang punya
//    method tampil() "NAMA: SISA unit". Ambil 4 lalu tampilkan.
//
// JAWABAN:
class Gudang {
    private stok: number = 10;
    protected nama: string = "gudang pusat";

    ambil(n: number): number {
        this.stok -= n;
        return this.stok;
    }

    sisa(): number {
        return this.stok;
    }
}

class LaporanGudang extends Gudang {
    tampil(): string {
        return `${this.nama}: ${this.sisa()} unit`;
    }
}
const g = new LaporanGudang();
console.log(g.ambil(4));   // 6
console.log(g.tampil());   // gudang pusat: 6 unit

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Dompet {
//          double _saldo = 0;
//          void setor(double n) => _saldo += n;
//          double get saldo => _saldo;
//        }
//    Buat versi TS-nya (ingat: _saldo Dart → private saldo TS)
//    lalu setor 50 dan cetak.
//
// JAWABAN:
class Dompet {
    private saldo: number = 0;

    setor(n: number): void {
        this.saldo += n;
    }

    get sisa(): number {
        return this.saldo;
    }
}
const d = new Dompet();
d.setor(50);
console.log(d.sisa);   // 50

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class AnakCoba extends Counter {
//            lihat(): number { return this.langkah; }
//        }
//
// JAWABAN: ERROR TS2341 — "Property 'langkah' is private and only
//    accessible within class 'Counter'." (private tidak menurun
//    ke subclass — pesan menyebut class pemilik Counter). Versi
//    perbaikan yang bisa dijalankan — salinan ringkas Counter
//    dengan langkah diubah private → protected (nama baru agar
//    tidak duplikat class Counter di sub-section 1):
class CounterTerbuka {
    protected langkah: number = 1;

    lompat(): number {
        return this.langkah;
    }
}

class AnakCoba extends CounterTerbuka {
    lihat(): number {
        return this.langkah;   // protected: sah di subclass
    }
}
console.log(new AnakCoba().lihat());   // 1
