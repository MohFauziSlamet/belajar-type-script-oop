// ==================================================================
// OOP 13 — OPERATOR INSTANCEOF
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 60-63
// (Operator instanceof). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2367, TS2339 (2 baris), TS2693,
// TS2358 2x (null & const-null). Temuan probe: instanceof
// INTERFACE ditolak TS2693; assignment lookalike SAH tapi
// instanceof tetap false.

// ------------------------------------------------------------------
// (1) MASALAH typeof — SEMUA OBJEK "object" (hlm. 61)
//
// PDF (hlm. 61): kadang kita perlu mengecek apakah sebuah object
// merupakan instance dari class tertentu. Operator typeof TIDAK
// BISA — object dari class apa pun menghasilkan "object".
// Operator instanceof menghasilkan boolean: true jika benar
// instance-nya, false jika bukan.
//
// Aturan penting (terverifikasi): instance dari CHILD juga
// dihitung instance dari PARENT (true — warisan berantai, file 6);
// sebaliknya sibling (saudara) = false, dan parent dibanding
// member child = false (arah satu arah).
// ------------------------------------------------------------------

class Hewan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }
}
class Kucing extends Hewan {
    suaraKucing(): string {
        return `meong — ${this.nama}`;
    }
}
class Anjing extends Hewan {
    suaraAnjing(): string {
        return `guk — ${this.nama}`;
    }
}

const oreo = new Kucing("Oreo");
console.log(typeof oreo);             // object — SEMUA objek sama
console.log(typeof ["a"]);            // object — array juga!
console.log(typeof { nama: "x" });    // object — literal juga!
console.log(typeof "eko");            // string — primitif OK
console.log(typeof oreo.suaraKucing); // function — non-primitif unik
console.log(Array.isArray(["a"]));    // true — obat utk cek array
console.log(oreo instanceof Kucing);  // true — class sendiri
console.log(oreo instanceof Hewan);   // true — PARENT ikut true!
console.log(oreo instanceof Anjing);  // false — saudara: false
console.log(new Hewan("X") instanceof Kucing);   // false — arah
                                                  // satu arah!

// ------------------------------------------------------------------
// (2) NARROWING — INSTANCEOF MENYEMPITKAN TIPE
//
// Kegunaan nyata instanceof bukan sekadar boolean: di dalam
// cabang if, tipe parameter UNION otomatis menyempit sehingga
// member spesifik bisa dipanggil TANPA cast.
//
// Jika di Dart seperti ini:
//     void suara(Hewan h) {
//       if (h is Kucing) {
//         print(h.suaraKucing());   // dipromosikan otomatis
//       }
//     }
// di TypeScript jadi seperti ini:
//     function suara(h: Kucing | Anjing): string {
//         if (h instanceof Kucing) {
//             return h.suaraKucing();   // di-narrow otomatis
//         }
//         return h.suaraAnjing();
//     }
// KEMIRIPAN EKSTREM — Dart menyebutnya TYPE PROMOTION, TS
// menyebutnya NARROWING: setelah `is` / `instanceof` lolos, tipe
// menyempit otomatis. Cabang sisa juga menyempit (Anjing saja).
// (Sisi TS sengaja memakai union `Kucing | Anjing`, bukan
// `Hewan` — supaya penyempitan cabang sisa terlihat eksplisit.)
// Negasi Dart `is!` ditulis `!(x instanceof Kucing)` di TS.
// ------------------------------------------------------------------

function suara(h: Kucing | Anjing): string {
    if (h instanceof Kucing) {
        return h.suaraKucing();   // h sudah menyempit: Kucing
    }
    return h.suaraAnjing();       // sisa union: Anjing
}
console.log(suara(new Kucing("Oreo")));   // meong — Oreo
console.log(suara(new Anjing("Bobi")));   // guk — Bobi
console.log(!(oreo instanceof Kucing));   // false — ≈ Dart `is!`

// ------------------------------------------------------------------
// (3) PERBEDAAN NYATA + KODE ERROR — INTERFACE, STRUCTURAL, null
//
// DUA perbedaan genuine di bab ini:
// a) instanceof INTERFACE DITOLAK — interface murni kontrak
//    compile-time yang DIHAPUS saat transpile (file 7), jadi tak
//    ada nilai runtime untuk diperiksa. Dart tidak punya masalah
//    ini: `is` pada abstract class SAH dan true.
// b) TS STRUCTURAL saat assignment tapi NOMINAL saat instanceof:
//    class lookalike (bentuk sama, TANPA extends) boleh di-assign
//    ke tipe parent — namun instanceof-nya tetap FALSE (yang
//    dicek rantai prototype, bukan bentuk). Dart nominal di
//    keduanya: assignment lookalike DITOLAK analyzer.
// Bonus: operand kiri null DITOLAK tsc (TS2358) padahal runtime
// JS murni menghasilkan false. Varian aman: PARAMETER union
// `Hewan | null` atau unknown — tapi CONST yang langsung null
// TETAP ditolak: control flow men-narrow tipe konstanta itu ke
// null (probe!). Dart: `null is X` sah, false, analyzer diam.
// ------------------------------------------------------------------

class Serigala {
    // lookalike: field sama dengan Hewan, TANPA extends
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }
}

const h13: Hewan = new Serigala("Bulan");   // SAH — bentuk cocok
console.log("assigned:", h13.nama);          // Bulan
console.log(h13 instanceof Hewan);           // false — nominal!
console.log(h13 instanceof Serigala);        // true — aslinya

// abstract class TIDAK ikut terhapus saat transpile — jadi
// target instanceof yang SAH (kontras dengan interface, blok C):
abstract class Makhluk {
    abstract bersuara(): string;
}
class Ular extends Makhluk {
    bersuara(): string {
        return "sss";
    }
}
console.log(new Ular() instanceof Makhluk);   // true — abstract!

function adaHewannya(h: Hewan | null): boolean {
    return h instanceof Hewan;   // parameter X | null: aman
}
console.log(adaHewannya(null));               // false
console.log(adaHewannya(new Anjing("Bobi"))); // true

const data13: unknown = null;   // unknown juga aman (tipe lebar)
console.log(data13 instanceof Hewan);         // false

// if (typeof oreo === "Kucing") {
//     console.log("kucing");
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2367: This comparison appears to be unintentional
//    because the types '"string" | "number" | "bigint" |
//    "boolean" | "symbol" | "undefined" | "object" | "function"'
//    and '"Kucing"' have no overlap.
//    (typeof HANYA mengenal daftar string primitif itu — nama
//    class bukan nilainya; TS bahkan menandai perbandingan ini
//    mustahil)
//
// function suaraTanpaNarrow(h: Kucing | Anjing): string {
//     return h.suaraKucing();
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'suaraKucing' does not exist on type
//    'Kucing | Anjing'.
//    Property 'suaraKucing' does not exist on type 'Anjing'.
//    (ini alasan narrowing sub-section 2 diperlukan — bukan
//    sekadar boolean)
//
// interface BisaBersuara {
//     suara(): string;
// }
// class Kecoa implements BisaBersuara {
//     suara(): string { return "sreeet"; }
// }
// const kecoa = new Kecoa();
// console.log(kecoa instanceof BisaBersuara);
// ❌ ERROR kalau di-uncomment:
//    error TS2693: 'BisaBersuara' only refers to a type, but is
//    being used as a value here.
//    (interface dihapus saat transpile — cek bentuknya lewat
//    kontrak/property, atau pakai abstract class)
//
// console.log(null instanceof Hewan);
// ❌ ERROR kalau di-uncomment:
//    error TS2358: The left-hand side of an 'instanceof'
//    expression must be of type 'any', an object type or a type
//    parameter.
//    (runtime JS murni: false — tapi tsc strict menolak null;
//    varian aman di kode atas: parameter union `X | null`
//    atau unknown; CONST langsung null tetap ditolak)
//
// const n13: Hewan | null = null;
// console.log(n13 instanceof Hewan);
// ❌ ERROR kalau di-uncomment:
//    error TS2358: The left-hand side of an 'instanceof'
//    expression must be of type 'any', an object type or a type
//    parameter.
//    (bukan literal null, tapi CONST yang diinisialisasi null —
//    control flow men-narrow tipe konstanta ini ke null, hasilnya
//    sama TS2358; varian aman: parameter union, lihat kode atas)
//
// Catatan Dart (terverifikasi dart analyze + run): `is` dan
// `is!` adalah operatornya; `h is Hewan` pada ABSTRACT CLASS sah
// dan true — semua tipe runtime Dart adalah class, tidak ada
// "interface yang hilang saat kompilasi" seperti TS. `null is
// Kucing` sah = false (analyzer diam; TS strict malah TS2358).
// Assignment lookalike `Hewan2 h = Persik2(...)` DITOLAK:
// invalid_assignment "A value of type 'Persik2' can't be
// assigned to a variable of type 'Hewan2'." — Dart nominal di
// assignment DAN runtime. Bonus: analyzer memberi WARNING
// unnecessary_type_check saat `h is Hewan` dan tipe statis h
// memang Hewan ("the result is always 'true'") — TS tidak
// memperingatkan hal serupa.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. typeof tidak bisa membedakan class — SEMUA objek (termasuk
//    array dan object literal) = "object" (hlm. 61). typeof hanya
//    berguna untuk primitif (dan "function" untuk function/
//    method — satu-satunya non-primitif yang khas).
// 2. instanceof menghasilkan boolean: class sendiri = true,
//    PARENT = true (warisan berantai), saudara = false, class
//    luar rantai = false, dan arahnya SATU ARAH (instance parent
//    bukan instance child). Array dicek dengan Array.isArray.
// 3. Keunggulan utama: NARROWING — di cabang if instanceof, tipe
//    union menyempit otomatis (≈ Dart type promotion via `is`);
//    cabang sisa juga menyempit. `is!` Dart ≈ `!(x instanceof C)`.
// 4. PERBEDAAN NYATA: (a) interface TIDAK BISA di-instanceof
//    (TS2693 — dihapus saat transpile; abstract class SAMA
//    sekali tidak — ia tetap class runtime: instanceof sah);
//    Dart `is` abstract class juga sah. (b) assignment TS
//    structural (lookalike sah) tapi instanceof tetap
//    nominal/false; Dart nominal di keduanya.
// 5. null sebagai operand kiri ditolak TS2358 — varian aman:
//    parameter union `X | null` atau unknown (hasil false).
//    CONST yang langsung null TETAP ditolak: tipe konstantanya
//    sudah di-narrow ke null oleh control flow (temuan probe).
//
// Cara menjalankan file ini: npx tsx src/13_instanceof.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Kendaraan + dua child (Mobil, Motor). Tulis
//    function adalahMobil(v: Kendaraan): boolean dengan
//    instanceof, lalu cek juga apakah Mobil instance Kendaraan.
//
// JAWABAN: (class jawaban diberi akhiran Latihan — penanda
// jelas bahwa ini kode jawaban, bukan bagian materi)
class Kendaraan {
    constructor(public jenis: string) {}
}
class MobilLatihan extends Kendaraan {
    constructor() {
        super("Mobil");
    }
}
class MotorLatihan extends Kendaraan {
    constructor() {
        super("Motor");
    }
}
function adalahMobil(v: Kendaraan): boolean {
    return v instanceof MobilLatihan;
}
console.log(adalahMobil(new MobilLatihan()));          // true
console.log(adalahMobil(new MotorLatihan()));          // false
console.log(new MobilLatihan() instanceof Kendaraan);  // true

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        void cek(Object h) {
//          if (h is Kucing) {
//            print(h.suaraKucing());
//          } else {
//            print("bukan kucing");
//          }
//        }
//    Buat versi TS-nya (petunjuk: parameter `unknown` ≈ Object).
//
// JAWABAN:
function cek13(h: unknown): string {
    if (h instanceof Kucing) {
        return h.suaraKucing();   // unknown → Kucing, otomatis
    }
    return "bukan kucing";
}
console.log(cek13(new Kucing("Oreo")));   // meong — Oreo
console.log(cek13(42));                   // bukan kucing

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Roti {
//            makanRoti(): string { return "nyam"; }
//        }
//        class Teh {
//            minumTeh(): string { return "glek"; }
//        }
//        function santap(x: Roti | Teh): string {
//            return x.makanRoti();
//        }
//
// JAWABAN: ERROR TS2339 — "Property 'makanRoti' does not exist on
//    type 'Roti | Teh'." (+ baris kedua pada 'Teh') — union harus
//    di-narrow dulu. Versi perbaikan yang bisa dijalankan:
class Roti {
    makanRoti(): string {
        return "nyam";
    }
}
class Teh {
    minumTeh(): string {
        return "glek";
    }
}
function santap(x: Roti | Teh): string {
    if (x instanceof Roti) {
        return x.makanRoti();
    }
    return x.minumTeh();
}
console.log(santap(new Roti()));   // nyam
