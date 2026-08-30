// ==================================================================
// OOP 6 — INHERITANCE (extends)
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 36-38
// (Inheritance). Semua klaim perilaku DIVERIFIKASI via tsc --strict
// + tsx + Dart 3.11 dart analyze/run. Blok error terverifikasi:
// TS1174, TS2339, TS2554. Temuan probe: getter/setter ikut
// diwariskan; child tanpa constructor memakai signature ctor parent.

// ------------------------------------------------------------------
// (1) EXTENDS — SEMUA MEMBER PARENT DIWARISKAN (hlm. 37)
//
// PDF (hlm. 37): TypeScript mendukung pewarisan antar class dengan
// kata kunci `extends` (sama seperti JavaScript). Otomatis SEMUA
// properties dan method Parent Class diwariskan ke Child Class —
// termasuk getter/setter (dibuktikan `panjangNama` di bawah).
//
// Jika di Dart seperti ini:
//     class Anak extends Induk {
//       String perkenalan() => '$nama punya ${nama.length} huruf';
//     }
// di TypeScript jadi seperti ini:
//     class Anak extends Induk {
//         perkenalan(): string {
//             return `${this.nama} punya ${this.panjangNama} huruf`;
//         }
//     }
// Keyword-nya IDENTIK — tidak ada perbedaan bentuk. PERBEDAAN NYATA
// baru muncul saat ingin reuse dari banyak sumber: Dart punya
// `with` (mixin), TS tidak — jalur multi-reuse TS lewat `implements`
// banyak interface (file 7).
// ------------------------------------------------------------------

class Induk {
    nama: string = "Eko";

    sapa(): string {
        return `Halo, saya ${this.nama}`;
    }

    get panjangNama(): number {
        return this.nama.length;
    }
}

class Anak extends Induk {          // mewarisi nama, sapa(), panjangNama
    perkenalan(): string {          // member BARU milik anak
        return `${this.nama} punya ${this.panjangNama} huruf`;
    }
}

class AnakKedua extends Induk {     // satu parent, BANYAK child (hlm. 37)
    teriak(): string {
        return `${this.nama.toUpperCase()}!!!`;
    }
}

const a6 = new Anak();
a6.nama = "Budi";                   // field warisan bisa ditimpa
console.log(a6.sapa());             // Halo, saya Budi
console.log(a6.perkenalan());       // Budi punya 4 huruf
console.log(new AnakKedua().sapa());        // Halo, saya Eko
console.log(new AnakKedua().teriak());      // EKO!!!
console.log(new AnakKedua().panjangNama);   // 3

// ------------------------------------------------------------------
// (2) SINGLE INHERITANCE + MULTI-LEVEL (hlm. 37)
//
// PDF: pewarisan di TS sama seperti JavaScript — child hanya bisa
// punya SATU parent class (extends dua class = TS1174, sub 3).
// Tapi satu parent bebas punya banyak child, dan warisan
// BERANTAI sah: cucu mewarisi semua milik anak + induk.
//
// Catatan constructor (hasil probe): child yang TIDAK menulis
// constructor memakai SIGNATURE constructor parent — kalau parent
// meminta parameter, `new Anak()` ikut meminta argumen (TS2554).
// Cara mengatur constructor anak sendiri = file 8 (Super
// Constructor).
//
// Jika di Dart seperti ini:
//     class Kucing extends Hewan {}
//     class KucingPersia extends Kucing {}   // berantai sah
// di TypeScript jadi seperti ini:
//     class Kucing extends Hewan {}
//     class KucingPersia extends Kucing {}   // identik — beda nol
// ------------------------------------------------------------------

class Hewan {
    nama: string = "?";

    makan(): string {
        return `${this.nama} makan`;
    }
}

class Kucing extends Hewan {
    meong(): string {
        return `${this.nama}: meong`;
    }
}

class KucingPersia extends Kucing {   // cucu — warisan berantai
    bulu(): string {
        return `${this.nama} berbulu tebal`;
    }
}

const kp = new KucingPersia();
kp.nama = "Pus";
console.log(kp.makan());   // Pus makan      (dari Induk teratas)
console.log(kp.meong());   // Pus: meong     (dari anak)
console.log(kp.bulu());    // Pus berbulu tebal (milik sendiri)

// ------------------------------------------------------------------
// (3) KODE ERROR — TS1174, TS2339
//
// class Ganda extends Induk, AnakKedua {}
// ❌ ERROR kalau di-uncomment:
//    error TS1174: Classes can only extend a single class.
//    (single inheritance — hlm. 37; Dart sama: satu extends saja,
//    reuse tambahan lewat `with` yang tidak dimiliki TS)
//
// console.log(new Induk().perkenalan());
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'perkenalan' does not exist on type
//    'Induk'.
//    (warisan itu SATU ARAH: anak punya semua milik induk, induk
//    TIDAK punya member milik anak)
//
// class OrangTua {
//     nama: string;
//     constructor(nama: string) { this.nama = nama; }
// }
// class Bayi extends OrangTua {}
// const b = new Bayi();
// ❌ ERROR kalau di-uncomment:
//    error TS2554: Expected 1 arguments, but got 0.
//    (child tanpa ctor memakai SIGNATURE ctor parent — cara
//    mengatur constructor anak = file 8 Super Constructor)
//
// Catatan Dart (terverifikasi dart analyze + run): `extends` Dart
// identik sampai ke perilaku single-parent. Bedanya Dart punya
// mixin — `class Anak extends Induk with Teriak {}` sah di Dart
// (probe: teriak "WOO!!!" jalan), TS tidak punya keyword `with`;
// multi-reuse di TS dibahas lewat interface (file 7).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. `extends` mewariskan SEMUA properties & method parent ke
//    child (hlm. 37) — field, method, bahkan getter/setter.
// 2. Keyword & bentuk IDENTIK dengan Dart — PERBEDAAN NYATA:
//    Dart punya `with` (mixin) untuk reuse tambahan, TS tidak
//    (jalurnya `implements`, file 7).
// 3. SINGLE inheritance: satu child satu parent saja (TS1174);
//    satu parent boleh punya BANYAK child; warisan berantai
//    (cucu) sah — semua member turun menurun.
// 4. Warisan SATU ARAH: instance parent tidak punya member child
//    (TS2339).
// 5. Child tanpa constructor memakai SIGNATURE ctor parent —
//    `new Anak()` ikut meminta argumen bila parent berparameter
//    (TS2554); cara mengaturnya = file 8 (Super Constructor).
//
// Cara menjalankan file ini: npx tsx src/6_inheritance.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Kendaraan (kecepatanMaks default 100 + method
//    jalan() "melaju max N km/jam"), lalu dua child: Mobil dengan
//    method klakson() "tin tin" dan Sepeda dengan method bel()
//    "kring kring". Panggil method warisan + method khusus.
//
// JAWABAN:
class Kendaraan {
    kecepatanMaks: number = 100;

    jalan(): string {
        return `melaju max ${this.kecepatanMaks} km/jam`;
    }
}

class Mobil extends Kendaraan {
    klakson(): string {
        return "tin tin";
    }
}

class Sepeda extends Kendaraan {
    bel(): string {
        return "kring kring";
    }
}
const mob = new Mobil();
console.log(mob.jalan());     // melaju max 100 km/jam
console.log(mob.klakson());   // tin tin
const sepeda = new Sepeda();
sepeda.kecepatanMaks = 25;    // field warisan ditimpa
console.log(sepeda.jalan());  // melaju max 25 km/jam
console.log(sepeda.bel());    // kring kring

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Karyawan {
//          String nama = '';
//          String kerja() => '$nama bekerja';
//        }
//        class Manager extends Karyawan {
//          String rapat() => '$nama memimpin rapat';
//        }
//    Buat versi TS-nya lalu jalankan dengan nama "Eko".
//
// JAWABAN:
class Karyawan {
    nama: string = "";

    kerja(): string {
        return `${this.nama} bekerja`;
    }
}

class Manager extends Karyawan {
    rapat(): string {
        return `${this.nama} memimpin rapat`;
    }
}
const man = new Manager();
man.nama = "Eko";
console.log(man.kerja());   // Eko bekerja
console.log(man.rapat());   // Eko memimpin rapat

// 3. Ramal-dulu: dengan class Induk & Anak di sub-section (1),
//    mana yang sah? a) new Anak().sapa()  b) new Induk().sapa()
//    c) new Induk().perkenalan()
//
// JAWABAN: a dan b SAH (sapa milik Induk — Anak mewarisinya,
//    Induk punya miliknya sendiri); c ERROR TS2339
//    "Property 'perkenalan' does not exist on type 'Induk'."
//    karena perkenalan() milik Anak — warisan satu arah (sub 3).
//    Bukti a dan b yang bisa dijalankan:
console.log(new Anak().sapa());        // Halo, saya Eko
console.log(new Induk().sapa());       // Halo, saya Eko
