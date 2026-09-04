// ==================================================================
// OOP 16 — ABSTRACT CLASS
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 75-78
// (Abstract Class). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2391, TS2515, TS2511, TS1245.
// Temuan probe: Dart method tanpa body OTOMATIS abstract; TS
// wajib keyword `abstract` per-method (tanpa itu = TS2391).

// ------------------------------------------------------------------
// (1) DEKLARASI CLASS "BELUM SELESAI" (hlm. 76-77)
//
// PDF (hlm. 76): Abstract Class = deklarasi class yang belum
// selesai — membolehkan properties/method ABSTRACT (belum dibuat
// implementasinya); TIDAK bisa dibuat object dengan new;
// kegunaannya hanya sebagai Parent Class yang diturunkan.
//
// Jika di Dart seperti ini:
//     abstract class Hewan {
//       String suara();   // cukup tanpa body — otomatis abstract
//     }
// di TypeScript jadi seperti ini:
//     abstract class Hewan {
//         abstract suara(): string;   // keyword abstract WAJIB
//     }
// PERBEDAAN NYATA: Dart — method tanpa body di class abstract
// OTOMATIS abstract (probe: analyzer bersih); TS — keyword
// `abstract` wajib ditulis per-method, lupa = TS2391 (blok
// error). Class abstract BOLEH bercampur: member konkret tetap
// sah (perkenalan di bawah), dan method konkretnya bisa memanggil
// abstract method — versi CHILD yang jalan (dispatch, file 14).
// ------------------------------------------------------------------

abstract class Hewan {
    constructor(public nama: string) {}

    abstract suara(): string;   // abstract: TANPA body

    perkenalan(): string {       // konkret: sah bercampur
        return `Saya ${this.nama}: ${this.suara()}`;
    }
}
class Kucing extends Hewan {
    suara(): string {
        return "meong";
    }
}
console.log(new Kucing("Oreo").perkenalan());   // Saya Oreo: meong

const h16: Hewan = new Kucing("Milo");   // abstract sebagai TIPE: sah
console.log(h16.perkenalan());           // Saya Milo: meong
console.log(h16 instanceof Hewan);       // true — file 13

// abstract class HewanSalah {
//     suara(): string;
// }
// class KucingSalah extends HewanSalah {
//     suara(): string { return "meong"; }
// }
// console.log(new KucingSalah().suara());
// ❌ ERROR kalau di-uncomment:
//    error TS2391: Function implementation is missing or not
//    immediately following the declaration.
//    (TS menuntut keyword `abstract` eksplisit — di Dart method
//    tanpa body langsung dianggap abstract)

// ------------------------------------------------------------------
// (2) CHILD CLASS DARI ABSTRACT PARENT (hlm. 78)
//
// Child WAJIB mengimplementasikan SEMUA abstract member parent
// dengan override (file 9) — lupa satu saja = TS2515. Setelah
// terisi, semuanya jalan seperti class biasa: bisa polymorphism
// lewat tipe abstract (file 14) — array Hewan[] campur child.
// ------------------------------------------------------------------

class Anjing extends Hewan {
    suara(): string {
        return "guk";
    }
}
const kenalan: Hewan[] = [new Kucing("Oreo"), new Anjing("Bobi")];
for (const h of kenalan) {
    console.log(h.perkenalan());   // 2 baris: Saya Oreo: meong /
                                    // Saya Bobi: guk — dispatch
}

// class KucingTanpaSuara extends Hewan {}
// console.log(new KucingTanpaSuara("X"));
// ❌ ERROR kalau di-uncomment:
//    error TS2515: Non-abstract class 'KucingTanpaSuara' does
//    not implement inherited abstract member suara from class
//    'Hewan'.
//    (semua abstract member WAJIB diimplementasi — atau tandai
//    child juga abstract, tapi berarti ia juga tak bisa di-new)

// ------------------------------------------------------------------
// (3) KODE ERROR — new ABSTRACT + ABSTRACT BERBODY
//
// Dua pelanggaran paling khas: mencoba membuat object dari class
// abstract (TS2511), dan memberi body ke method abstract
// (TS1245). Keduanya konsisten dengan definisi "belum selesai":
// yang belum selesai tak bisa dipakai, dan yang abstract tak
// boleh punya implementasi.
// ------------------------------------------------------------------

// const hewanLangsung = new Hewan("X");
// console.log(hewanLangsung);
// ❌ ERROR kalau di-uncomment:
//    error TS2511: Cannot create an instance of an abstract
//    class.
//    (abstract hanya PARENT — buat object dari child konkret)
//
// abstract class HewanBerbody {
//     abstract suara(): string {
//         return "x";
//     }
// }
// console.log(HewanBerbody);
// ❌ ERROR kalau di-uncomment:
//    error TS1245: Method 'suara' cannot have an implementation
//    because it is marked abstract.
//    (abstract = kontrak tanpa isi; implementasi hidup di child)
//
// Catatan Dart (terverifikasi dart analyze + run): KEMIRIPAN
// EKSTREM — `abstract class HewanD` + child @override
// berjalan, `h is HewanD` true, run identik "Saya Oreo: meong".
// Perbedaannya hanya kode error: new abstract di Dart =
// instantiate_abstract_class "Abstract classes can't be
// instantiated. Try creating an instance of a concrete
// subtype." — pesan lebih mengarahkan (sebut solusinya);
// child lupa override = non_abstract_class_inherits_abstract_
// member "Missing concrete implementation of 'HewanE.suara'.
// Try implementing the missing method, or make the class
// abstract." — ingat baris ini dari file 7 (implements);
// di sini muncul lewat extends. Bonus: `h is HewanD` dengan tipe
// statis HewanD memicu warning unnecessary_type_check (file 13).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Abstract class (hlm. 76) = deklarasi "belum selesai": boleh
//    punya abstract member (tanpa implementasi) + member konkret
//    bercampur; TIDAK bisa di-new (TS2511); hanya sebagai parent.
// 2. PERBEDAAN NYATA sintaks: Dart — method tanpa body otomatis
//    abstract; TS — keyword `abstract` WAJIB per-method (lupa =
//    TS2391; beri body justru TS1245).
// 3. Child WAJIB implementasi SEMUA abstract member (TS2515);
//    setelah itu jalan seperti biasa: override + dispatch +
//    polymorphism via tipe abstract + instanceof true.
// 4. Method konkret di class abstract boleh memanggil abstract
//    method — versi CHILD yang jalan (dispatch file 14).
// 5. Kode error Dart sejenis namun lebih mengarahkan:
//    instantiate_abstract_class & non_abstract_class_inherits_
//    abstract_member (yang terakhir sama dengan kasus implements
//    file 7).
//
// Cara menjalankan file ini: npx tsx src/16_abstract_class.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat abstract class BangunDatar dengan abstract luas() dan
//    method konkret info() yang mencetak luasnya. Buat child
//    Persegi (sisi) dan Lingkaran (jari-jari), lalu loop array
//    BangunDatar[] mencetak info keduanya.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
abstract class BangunDatarLatihan {
    abstract luas(): number;

    info(): string {
        return `luas ${this.luas()}`;
    }
}
class PersegiLatihan extends BangunDatarLatihan {
    constructor(private sisi: number) {
        super();
    }

    luas(): number {
        return this.sisi * this.sisi;
    }
}
class LingkaranLatihan extends BangunDatarLatihan {
    constructor(private jari: number) {
        super();
    }

    luas(): number {
        return 3.14 * this.jari * this.jari;
    }
}
const bentukLatihan: BangunDatarLatihan[] = [
    new PersegiLatihan(4),
    new LingkaranLatihan(7),
];
for (const b of bentukLatihan) {
    console.log(b.info());   // luas 16 / luas 153.86
}

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        abstract class Mesin {
//          void hidupkan();
//        }
//        class MesinBensin extends Mesin {
//          @override
//          void hidupkan() => print('brum');
//        }
//
// JAWABAN:
abstract class MesinLatihan {
    abstract hidupkan(): string;   // keyword abstract WAJIB di TS
}
class MesinBensinLatihan extends MesinLatihan {
    hidupkan(): string {
        return "brum";
    }
}
console.log(new MesinBensinLatihan().hidupkan());   // brum

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        abstract class Pohon {
//            abstract tinggi(): number;
//        }
//        const p = new Pohon();
//
// JAWABAN: ERROR TS2511 — "Cannot create an instance of an
//    abstract class." — class abstract hanya parent; buat
//    object dari child konkret. Versi perbaikan yang bisa
//    dijalankan:
abstract class PohonLatihan {
    abstract tinggi(): number;
}
class ManggaLatihan extends PohonLatihan {
    tinggi(): number {
        return 7;
    }
}
console.log(new ManggaLatihan().tinggi());   // 7
