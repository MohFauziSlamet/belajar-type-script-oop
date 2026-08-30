// ==================================================================
// OOP 7 — INTERFACE INHERITANCE & implements
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 39-42
// (Interface Inheritance). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict + tsx + Dart 3.11 dart analyze/run. Blok error
// terverifikasi: TS2420 (2 baris). Temuan probe: class implements
// CLASS sah di TS (structural); interface extends BANYAK interface
// sah — keduanya kebalikan aturan extends class.

// ------------------------------------------------------------------
// (1) INTERFACE = KONTRAK, implements = JANJI MEMENUHI (hlm. 40)
//
// PDF (hlm. 40): seperti di Java, interface digunakan sebagai
// KONTRAK — class bisa mengikuti kontrak interface dengan kata
// kunci `implements`. Member interface ditulis TANPA isi; class
// yang implements WAJIB menyediakannya sendiri.
//
// Jika di Dart seperti ini:
//     abstract class Hewan {
//       String suara();                  // method abstrak
//     }
//     class Kucing implements Hewan {
//       @override
//       String suara() => '$nama: meong';
//     }
// di TypeScript jadi seperti ini:
//     interface Hewan {
//         suara(): string;               // deklarasi tanpa isi
//     }
//     class Kucing implements Hewan {
//         suara(): string { return `${nama}: meong`; }
//     }
// PERBEDAAN NYATA di belakang layar: Dart NOMINAL — setiap class
// adalah implicit interface, dan `implements` sebuah class
// mewajibkan meng-override SEMUA member-nya. TS STRUCTURAL — yang
// diperiksa hanya BENTUK: bahkan `class B implements SebuahClass`
// (bukan interface!) sah-sah saja selama bentuknya cocok (hasil
// probe) — warisan implementasi tidak terlibat sama sekali.
// ------------------------------------------------------------------

interface Hewan {
    nama: string;
    suara(): string;              // kontrak: tanpa isi
}

class Kucing implements Hewan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }

    suara(): string {
        return `${this.nama}: meong`;
    }
}

class Anjing implements Hewan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }

    suara(): string {
        return `${this.nama}: guk guk`;
    }
}

console.log(new Kucing("Pus").suara());    // Pus: meong
console.log(new Anjing("Doggy").suara());  // Doggy: guk guk

// ------------------------------------------------------------------
// (2) MULTIPLE implements + INTERFACE extends INTERFACE (hlm. 40)
//
// PDF: implements BUKAN pewarisan — karena itu class boleh
// implements LEBIH DARI SATU interface (kebalikan extends class
// yang single, TS1174 di file 6). Dan interface punya warisan
// versi sendiri: `interface X extends A, B` — interface boleh
// extends BANYAK interface (class tidak boleh!).
//
// Jika di Dart seperti ini:
//     class Robot implements Berjalan, Bersuara { ... }
//     // Dart: multiple implements sah — sama
// di TypeScript jadi seperti ini:
//     class Robot implements Berjalan, Bersuara { ... }
//     // identik — tidak ada perbedaan bentuk
// ------------------------------------------------------------------

interface Berjalan {
    jalan(): string;
}

interface Bersuara {
    suara(): string;
}

interface Peliharaan extends Berjalan, Bersuara {   // interface extends BANYAK
    nama: string;
}

class KucingPelihara implements Peliharaan {
    nama: string = "Pus";

    jalan(): string {
        return `${this.nama} melangkah`;
    }

    suara(): string {
        return `${this.nama}: meong`;
    }
}

// implements BANYAK interface:
class Robot implements Berjalan, Bersuara {
    jalan(): string {
        return "robot melangkah";
    }

    suara(): string {
        return "bip boop";
    }
}

console.log(new KucingPelihara().jalan());   // Pus melangkah
console.log(new KucingPelihara().suara());   // Pus: meong
console.log(new Robot().jalan());            // robot melangkah
console.log(new Robot().suara());            // bip boop

// ------------------------------------------------------------------
// (3) KODE ERROR — TS2420 KONTRAK TAK DIPENUHI
//
// class KambingSalah implements Hewan {
//     nama: string = "Embe";
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2420: Class 'KambingSalah' incorrectly implements
//    interface 'Hewan'.
//    Property 'suara' is missing in type 'KambingSalah' but
//    required in type 'Hewan'.
//    (2 baris: header + rincian member yang hilang; kontrak =
//    janji — suara() wajib disediakan class)
//
// Catatan Dart (terverifikasi dart analyze + run): multiple
// implements Dart sama sahnya (probe Robot: "robot melangkah" /
// "bip boop"). Bedanya `implements` CLASS di Dart tanpa override
// → error non_abstract_class_inherits_abstract_member "Missing
// concrete implementations of 'Induk.sapa', 'getter Induk.nama',
// and 'setter Induk.nama'. Try implementing the missing methods,
// or make the class abstract." ('Induk' pada kutipan = class
// contoh dari file 6) — Dart memaksa override SEMUA member
// (nominal); TS cukup cocok bentuk (structural).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. interface = KONTRAK (hlm. 40): member dideklarasikan tanpa
//    isi; `implements` = janji class menyediakannya sendiri.
// 2. implements BOLEH banyak interface — kebalikan extends class
//    yang single (TS1174, file 6); interface extends interface
//    juga sah, bahkan extends BANYAK interface sekaligus.
// 3. Kontrak tak dipenuhi = TS2420 (2 baris: header + rincian
//    member yang hilang).
// 4. PERBEDAAN NYATA: Dart NOMINAL (class = implicit interface;
//    implements class → wajib override SEMUA member), TS
//    STRUCTURAL (implements class pun sah, asal bentuknya cocok).
// 5. Dart menandai override dengan anotasi @override; TS tidak
//    punya penanda — kecocokan kontrak diperiksa otomatis.
//
// Cara menjalankan file ini: npx tsx src/7_interface.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat interface Kendaraan (merek: string + jalan(): string),
//    lalu dua class implements: Mobil "MEREK melaju di aspal" dan
//    Motor "MEREK menyusup di sela" (merek lewat constructor).
//
// JAWABAN:
interface Kendaraan {
    merek: string;
    jalan(): string;
}

class Mobil implements Kendaraan {
    merek: string;

    constructor(merek: string) {
        this.merek = merek;
    }

    jalan(): string {
        return `${this.merek} melaju di aspal`;
    }
}

class Motor implements Kendaraan {
    merek: string;

    constructor(merek: string) {
        this.merek = merek;
    }

    jalan(): string {
        return `${this.merek} menyusup di sela`;
    }
}
console.log(new Mobil("Toyota").jalan());  // Toyota melaju di aspal
console.log(new Motor("Honda").jalan());   // Honda menyusup di sela

// 2. Buat interface Manusia (nama: string) lalu interface
//    Mahasiswa extends Manusia ditambah nim: string — class Maba
//    implements Mahasiswa harus memenuhi keduanya. Tambahkan
//    method perkenalan() "NIM - Nama".
//
// JAWABAN:
interface Manusia {
    nama: string;
}

interface Mahasiswa extends Manusia {
    nim: string;
}

class Maba implements Mahasiswa {
    nama: string;
    nim: string;

    constructor(nama: string, nim: string) {
        this.nama = nama;
        this.nim = nim;
    }

    perkenalan(): string {
        return `${this.nim} - ${this.nama}`;
    }
}
console.log(new Maba("Eko", "221").perkenalan());   // 221 - Eko

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Kambing implements Hewan {
//            nama: string = "Embe";
//        }
//
// JAWABAN: ERROR TS2420 — "Class 'Kambing' incorrectly implements
//    interface 'Hewan'." + "Property 'suara' is missing in type
//    'Kambing' but required in type 'Hewan'." (kontrak Hewan
//    menuntut nama + suara(); Kambing hanya punya nama). Versi
//    perbaikan yang bisa dijalankan:
class Kambing implements Hewan {
    nama: string = "Embe";

    suara(): string {
        return `${this.nama}: mbeek`;
    }
}
console.log(new Kambing().suara());   // Embe: mbeek
