// ==================================================================
// OOP 18 — CLASS RELATIONSHIP
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 84-86
// (Class Relationship). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2741, TS2322 (2 varian: return
// beda 3 baris, private 2 baris). Temuan probe: PRIVATE/PROTECTED
// memutus structural — "pagar nominal" di dalam TS; kurang banyak
// member sekaligus = TS2739 (varian, dicatat di blok error
// pertama sub 2); protected juga memutus, pesan beda (sub 3).

// ------------------------------------------------------------------
// (1) RELASI BERDASARKAN STRUKTUR, BUKAN GARIS KETURUNAN
//     (hlm. 85-86 — kode contoh hlm. 86 dibangun ulang)
//
// PDF (hlm. 85): implementasi object TypeScript adalah JavaScript
// object — dua object dari class BERBEDA, asal properties dan
// function-nya sama, secara struktur JS dianggap SAMA. Object
// untuk tipe A boleh dibuat dari class B asal bentuknya cocok.
//
// Jika di Dart seperti ini:
//     class Karyawan { final String nama; ... }
//     class Pelanggan { final String nama; ... }  // bentuk sama
//     Karyawan k = Pelanggan('Eko', 'eko@x');     // DITOLAK!
// di TypeScript jadi seperti ini:
//     class Karyawan { constructor(public nama: string) {} }
//     class Pelanggan { constructor(public nama: string) {} }
//     const k: Karyawan = new Pelanggan("Eko");   // SAH
// PERBEDAAN NYATA inti bab: Dart NOMINAL (garis keturunan,
// bentuk sama persis pun ditolak invalid_assignment); TS
// STRUCTURAL (bentuk cukup, tanpa perlu extends/implements).
// Dua nuansa penting: method yang jalan tetap versi CLASS ASLI
// (dispatch — bukan versi tipe deklarasi), dan instanceof tetap
// jujur (class asli true, tipe deklarasi false — file 13).
// ------------------------------------------------------------------

class Karyawan {
    constructor(
        public nama: string,
        public email: string,
    ) {}

    perkenalan(): string {
        return `${this.nama} <${this.email}>`;
    }
}
class Pelanggan {
    // TANPA extends, TANPA implements — hanya kebetulan sama
    constructor(
        public nama: string,
        public email: string,
    ) {}

    perkenalan(): string {
        return `pelanggan ${this.nama}`;
    }

    poinLoyalitas(): number {   // member EKSTRA — tak masalah
        return 10;
    }
}

const k18: Karyawan = new Pelanggan("Eko", "eko@x");   // sah!
console.log(k18.perkenalan());   // pelanggan Eko — versi asli

const tim18: Karyawan[] = [
    new Karyawan("Ari", "ari@x"),
    new Pelanggan("Budi", "budi@x"),   // campur sah
];
console.log(tim18.length);             // 2
console.log(k18 instanceof Karyawan);  // false — tipe deklarasi
console.log(k18 instanceof Pelanggan); // true — class asli

// ------------------------------------------------------------------
// (2) SYARAT STRUKTUR — TARGET LENGKAP, SIGNATURE COCOK
//
// Arah pemeriksaannya: SEMUA member target harus terpenuhi di
// sumber (boleh lebih/ekstra — superset sah, lihat poinLoyalitas
// di atas); cukup satu member kurang = ditolak. Nama member sama
// saja tak cukup: signature method (tipe parameter & return)
// harus cocok.
// ------------------------------------------------------------------

class Mitra {
    constructor(
        public nama: string,
        public email: string,
    ) {}

    perkenalan(): string {
        return `mitra ${this.nama}`;
    }

    diskonMitra(): number {   // ekstra — superset tetap masuk
        return 15;
    }
}
const m18: Karyawan = new Mitra("Ria", "ria@x");
console.log(m18.perkenalan());   // mitra Ria — dispatch lagi

// class Penjual {
//     constructor(public nama: string) {}   // TANPA email
//     perkenalan(): string { return `toko ${this.nama}`; }
// }
// const penjual18: Karyawan = new Penjual("Ici");
// console.log(penjual18);
// ❌ ERROR kalau di-uncomment:
//    error TS2741: Property 'email' is missing in type 'Penjual'
//    but required in type 'Karyawan'.
//    (struktur target harus terpenuhi SEMUA — sumber boleh
//    ekstra, tidak boleh kurang; kurang BANYAK member = TS2739
//    dengan daftar "missing the following properties";
//    varian parameter = TS2345, file 14)
//
// class Pemburu {
//     constructor(
//         public nama: string,
//         public email: string,
//     ) {}
//     perkenalan(): number { return 1; }   // return beda tipe!
// }
// const pemburu18: Karyawan = new Pemburu("Uta", "u@x");
// console.log(pemburu18);
// ❌ ERROR kalau di-uncomment:
//    error TS2322: Type 'Pemburu' is not assignable to type
//    'Karyawan'.
//      The types returned by 'perkenalan()' are incompatible
//      between these types.
//        Type 'number' is not assignable to type 'string'.
//    (nama member sama saja tidak cukup — signature harus cocok)

// ------------------------------------------------------------------
// (3) PAGAR NOMINAL — PRIVATE MEMUTUS STRUCTURAL + Catatan Dart
//
// Penemuan bab ini: structural TS pun BATAS. Saat class punya
// member private/protected (file 11), kompatibilitas struktur
// GUGUR — dua class dengan private "sama nama" tetap dianggap
// ASING karena private harus berasal dari deklarasi yang sama.
// protected sama memutusnya, dengan pesan berbeda (terverifikasi
// probe): "Property 'id' is protected but type 'PelangganP' is
// not a class derived from 'KaryawanP'." Jalan keluarnya satu:
// relasi deklaratif (extends) — kode live.
// ------------------------------------------------------------------

class KaryawanResmi extends Karyawan {}   // relasi DEKLARATIF
const resmi18: Karyawan = new KaryawanResmi("Ana", "ana@x");
console.log(resmi18.nama);   // Ana — extends tak butuh bentuk

// class KaryawanRahasia {
//     constructor(
//         private id: number,
//         public nama: string,
//     ) {}
//     tampil(): string { return `${this.id} ${this.nama}`; }
// }
// class PelangganRahasia {
//     constructor(
//         private id: number,
//         public nama: string,
//     ) {}
//     tampil(): string { return `${this.id} ${this.nama}`; }
// }
// const kr18: KaryawanRahasia = new PelangganRahasia(1, "Eko");
// console.log(kr18.tampil());
// ❌ ERROR kalau di-uncomment:
//    error TS2322: Type 'PelangganRahasia' is not assignable to
//    type 'KaryawanRahasia'.
//      Types have separate declarations of a private property
//      'id'.
//    (PAGAR NOMINAL: private/protected memutus structural —
//    solusi: extends, atau singkirkan private)
//
// Catatan Dart (terverifikasi dart analyze + run): Dart NOMINAL
// di SEMUA kasus bab ini — `KaryawanD k = PelangganD('Eko',
// 'eko@x')` dengan bentuk sama persis tetap DITOLAK:
// invalid_assignment "A value of type 'PelangganD' can't be
// assigned to a variable of type 'KaryawanD'. Try changing the
// type of the variable, or casting the right-hand type to
// 'KaryawanD'." — tanpa extends tidak ada jalan masuk (recall
// file 13-14). Justru TS yang longgar di sini; pagar nominalnya
// TS hanya muncul lewat private/protected.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Class relationship TS = STRUKTURAL (hlm. 85): object tipe A
//    boleh dibuat dari class B asal properties & method cocok —
//    tanpa extends/implements. Dart NOMINAL: bentuk sama persis
//    pun ditolak (invalid_assignment) — PERBEDAAN NYATA inti.
// 2. Sumber boleh EKSTRA (superset sah: poinLoyalitas, diskon);
//    target harus terpenuhi SEMUA — kurang = TS2741 (varian
//    variabel; parameter = TS2345 file 14).
// 3. Signature harus cocok: return beda tipe = TS2322 3 baris
//    ("The types returned by ... are incompatible ...").
// 4. Method yang jalan versi CLASS ASLI (dispatch), dan
//    instanceof jujur: class asli true, tipe deklarasi false
//    (file 13).
// 5. PAGAR NOMINAL: private/protected memutus structural ("Types
//    have separate declarations of a private property") — dua
//    class jadi asing; solusi deklaratif: extends.
//
// Cara menjalankan file ini: npx tsx src/18_class_relationship.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Buku (judul, halaman) dan class Majalah yang
//    bentuknya sama (plus member ekstra terbitan()). Assign
//    Majalah ke variabel bertipe Buku, panggil method infonya.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
class BukuLatihan {
    constructor(
        public judul: string,
        public halaman: number,
    ) {}

    info(): string {
        return `buku ${this.judul} (${this.halaman} hlm)`;
    }
}
class MajalahLatihan {
    constructor(
        public judul: string,
        public halaman: number,
    ) {}

    info(): string {
        return `majalah ${this.judul}`;
    }

    terbitan(): number {   // ekstra — sah
        return 2026;
    }
}
const b18: BukuLatihan = new MajalahLatihan("Moto", 40);
console.log(b18.info());   // majalah Moto — versi asli

// 2. Konversi Dart → TypeScript! Diberi kode Dart yang DITOLAK:
//        class Laptop {
//          final String merek;
//          Laptop(this.merek);
//        }
//        class Handphone {
//          final String merek;
//          Handphone(this.merek);
//        }
//        void main() {
//          Laptop l = Handphone('X');  // invalid_assignment!
//        }
//    Tulis versi TS-nya yang SAH, dan jelaskan kenapa.
//
// JAWABAN:
class LaptopLatihan {
    constructor(public merek: string) {}
}
class HandphoneLatihan {
    constructor(public merek: string) {}   // struktur sama
}
const l18: LaptopLatihan = new HandphoneLatihan("X");
console.log(l18.merek);   // X — sah: TS structural (hlm. 85)
// Kenapa sah: TS memeriksa BENTUK (merek: string ada) — sedangkan
// Dart menolak kode yang sama karena memeriksa NAMA class.

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Akun {
//            constructor(private kode: number) {}
//        }
//        class Profil {
//            constructor(private kode: number) {}
//        }
//        const a: Akun = new Profil(7);
//
// JAWABAN: ERROR TS2322 — "Type 'Profil' is not assignable to
//    type 'Akun'." + "Types have separate declarations of a
//    private property 'kode'." — private memutus structural
//    (sub-section 3). Versi perbaikan yang bisa dijalankan:
class AkunLatihan {
    constructor(public kode: number) {}   // tanpa private
}
class ProfilLatihan {
    constructor(public kode: number) {}
}
const a18: AkunLatihan = new ProfilLatihan(7);
console.log(a18.kode);   // 7 — structural kembali berlaku
