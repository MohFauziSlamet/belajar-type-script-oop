// ==================================================================
// OOP 3 — PROPERTIES & DEFAULT VALUE
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 25-29
// (Properties atau Fields; trio mandatory/optional/readonly;
// Properties Default Value). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict + tsx + Dart 3.11 dart analyze. Blok error
// terverifikasi: TS2339, TS2540, TS2532, dan kode error Dart
// undefined_setter serta assignment_to_final.

// ------------------------------------------------------------------
// (1) PROPERTIES = ATRIBUT CLASS — WAJIB DIDEKLARASIKAN DI TS
//
// PDF (hlm. 26): properties/fields adalah atribut yang dimiliki
// class. Di JavaScript kita bisa langsung MEMBUAT atribut baru di
// object tanpa deklarasi; di TypeScript property harus
// DIDEKLARASIKAN dulu beserta tipe datanya — sama disiplin dengan
// Dart.
//
// Jika di Dart seperti ini:
//     class Produk {
//       String nama = 'Kopi';
//       int harga = 0;
//     }
//     final p = Produk();
//     p.harga = 25000;
// di TypeScript jadi seperti ini:
//     class Produk {
//         nama: string = "Kopi";
//         harga: number = 0;
//     }
//     const p = new Produk();
//     p.harga = 25000;
// Tulisan field sama persis Dart (kelas Dasar) — yang baru di file
// ini: TS punya TRIO sifat property (sub-section 2) dan aturan
// default value yang berinteraksi dengan trio itu (sub-section 3).
// ------------------------------------------------------------------

class Produk {
    nama: string = "Kopi";
    harga: number = 0;
}

const p = new Produk();
p.harga = 25000;                        // set field terdeklarasi — sah
console.log(`${p.nama} Rp${p.harga}`);  // Kopi Rp25000

// ------------------------------------------------------------------
// (2) TRIO SIFAT: MANDATORY, OPTIONAL, READONLY (hlm. 26)
//
// PDF: sama seperti attribute di Type/Interface (kelas Dasar),
// property class juga bisa OPTIONAL, MANDATORY, atau READONLY.
// Property yang mandatory WAJIB ditambahkan nilainya di
// constructor (ingat TS2564 di file 1) — atau beri default
// (sub-section 3). Trio ini punya kembaran
// akrab di Dart:
//   - mandatory   ≈ field non-nullable biasa
//   - optional ?  ≈ String? (nullable) — tipe jadi string | undefined
//   - readonly    ≈ final — bisa diisi di constructor, BEKU
//                   setelahnya (timpa di luar = TS2540)
//
// Jika di Dart seperti ini:
//     class Produk {
//       final int id;          // ≈ readonly
//       String nama;           // mandatory
//       String? deskripsi;     // ≈ optional
//       Produk(this.id, this.nama);
//     }
// di TypeScript jadi seperti ini:
//     class Produk {
//         readonly id: number;     // mandatory + readonly
//         nama: string;            // mandatory
//         deskripsi?: string;      // optional
//         constructor(id: number, nama: string) {
//             this.id = id;        // readonly BOLEH diisi di ctor
//             this.nama = nama;
//         }
//     }
// ------------------------------------------------------------------

class ProdukTrio {
    readonly id: number;        // mandatory + readonly → wajib di ctor
    nama: string;               // mandatory → wajib di ctor
    deskripsi?: string;         // optional → bebas tak diisi

    constructor(id: number, nama: string) {
        this.id = id;           // readonly sah diisi DI constructor
        this.nama = nama;
    }
}

const kopi = new ProdukTrio(1, "Kopi");
console.log(kopi.id);                // 1
console.log(kopi.deskripsi);         // undefined  (belum diisi — sah)
kopi.deskripsi = "Kopi hitam pekat"; // optional tetap bisa diisi belakangan
console.log(kopi.deskripsi?.length); // 16

// ------------------------------------------------------------------
// (3) DEFAULT VALUE DENGAN `=` — DAN NUANSANYA READONLY (hlm. 28)
//
// PDF (hlm. 28): property bisa diberi default value dengan
// operator `=` — bentuknya sama persis Dart. Default juga
// MENYELAMATKAN property mandatory tanpa perlu constructor
// (jalan "a" dari file 1).
//
// PERBEDAAN NYATA yang halus & menarik: TS membolehkan readonly
// yang SUDAH ber-default DI-TIMPA di dalam constructor (hasil
// akhirnya nilai baru — terverifikasi). Dart justru MENOLAK final
// ber-initializer yang di-timpa di constructor:
// error assignment_to_final.
//
// Jika di Dart seperti ini:
//     class Pelanggan {
//       final String jenis = 'reguler';   // beku selamanya
//       Pelanggan(bool vip) {
//         if (vip) jenis = 'vip';         // error assignment_to_final
//       }
//     }
// di TypeScript jadi seperti ini:
//     class Pelanggan {
//         readonly jenis: string = "reguler";  // default
//         constructor(vip: boolean) {
//             if (vip) this.jenis = "vip";     // SAH di dalam ctor
//         }
//     }
// Jadi di TS pola "default yang bisa dioverride constructor"
// berjalan mulus; di Dart nilai final memang beku sejak awal.
// ------------------------------------------------------------------

class Pelanggan {
    readonly jenis: string = "reguler";   // default readonly

    constructor(vip: boolean) {
        if (vip) {
            this.jenis = "vip";           // timpa readonly di ctor = SAH
        }
    }
}

console.log(new Pelanggan(false).jenis);  // reguler
console.log(new Pelanggan(true).jenis);   // vip

// ------------------------------------------------------------------
// (4) KODE ERROR — TS2339, TS2540, TS2532
//
// const salah = new Produk();
// salah.umur = 20;
// console.log(salah.umur);
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'umur' does not exist on type 'Produk'.
//    (muncul 2× — saat set dan saat baca; inilah disiplin "wajib
//    deklarasi" dari hlm. 26: JavaScript bebas menambah atribut,
//    TS dan Dart tidak)
//
// const salah2 = new ProdukTrio(1, "Kopi");
// salah2.id = 99;
// ❌ ERROR kalau di-uncomment:
//    error TS2540: Cannot assign to 'id' because it is a read-only
//    property.
//    (readonly beku SETELAH constructor)
//
// class SalahOptional {
//     deskripsi?: string;
//     panjang(): number { return this.deskripsi.length; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2532: Object is possibly 'undefined'.
//    (optional = string | undefined — TS menolak dipakai langsung;
//    gunakan this.deskripsi?.length ?? 0, isi dulu, atau default)
//
// Catatan Dart (terverifikasi dart analyze):
//   - p.umur = 20 di Dart → error undefined_setter "The setter
//     'umur' isn't defined for the type 'Produk'."
//   - menimpa final → error assignment_to_final "'jenis' can't be
//     used as a setter because it's final."
// Semangatnya sama dengan TS2339/TS2540 — beda halus: TS2339
// menyasar baca DAN set, undefined_setter khusus setter.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. properties/fields = atribut class; TS WAJIB deklarasi + tipe
//    (hlm. 26) — JS bebas menambah atribut, TS & Dart tidak
//    (TS2339 / undefined_setter).
// 2. Trio sifat: mandatory (wajib di constructor — ingat TS2564),
//    optional `judul?:` (≈ String? Dart; tipe string | undefined),
//    readonly (≈ final; beku setelah constructor, timpa = TS2540).
// 3. readonly BOLEH diisi / DI-TIMPA di dalam constructor — bahkan
//    yang sudah ber-default (PERBEDAAN NYATA: Dart menolak dengan
//    assignment_to_final).
// 4. Default value dengan `=` — sama persis Dart; default
//    menyelamatkan mandatory tanpa constructor.
// 5. Optional dipakai langsung = TS2532 "Object is possibly
//    'undefined'" — pakai ?. dan ?? seperti di kelas Dasar.
//
// Cara menjalankan file ini: npx tsx src/3_properties.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Mahasiswa: readonly nim & mandatory nama diisi
//    constructor, optional asal. Method profil() mengembalikan
//    "NIM - Nama" plus " dari Asal" kalau asal terisi.
//
// JAWABAN:
class Mahasiswa {
    readonly nim: number;
    nama: string;
    asal?: string;

    constructor(nim: number, nama: string) {
        this.nim = nim;
        this.nama = nama;
    }

    profil(): string {
        const asal = this.asal ? ` dari ${this.asal}` : "";
        return `${this.nim} - ${this.nama}${asal}`;
    }
}
console.log(new Mahasiswa(221, "Eko").profil());   // 221 - Eko
const m = new Mahasiswa(222, "Budi");
m.asal = "Bandung";
console.log(m.profil());                           // 222 - Budi dari Bandung

// 2. Buat class Pesanan dengan property status bertipe string
//    ber-default "baru" (tanpa constructor!), plus method
//    ubahStatus(statusBaru) yang menimpa nilainya.
//
// JAWABAN:
class Pesanan {
    status: string = "baru";    // default — tidak perlu constructor

    ubahStatus(statusBaru: string): void {
        this.status = statusBaru;
    }
}
const pes = new Pesanan();
console.log(pes.status);       // baru
pes.ubahStatus("diantar");
console.log(pes.status);       // diantar

// 3. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Titik {
//          final int x;
//          final int y;
//          Titik(this.x, this.y);
//        }
//    Buat versi TS-nya (perhatikan: final → readonly, dan x/y
//    mandatory wajib diisi constructor).
//
// JAWABAN:
class Titik {
    readonly x: number;
    readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
console.log(new Titik(3, 4).x);   // 3
