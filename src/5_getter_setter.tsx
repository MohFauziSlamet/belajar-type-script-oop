// ==================================================================
// OOP 5 — GETTER DAN SETTER
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 33-35
// (Getter dan Setter). Semua klaim perilaku DIVERIFIKASI via tsc
// --strict + tsx + Dart 3.11 dart analyze/run. Blok error
// terverifikasi: TS2540, TS6234, TS2300. Temuan probe tambahan:
// get/set BOLEH beda tipe (tsc diam); setter tanpa getter sah tapi
// membacanya = undefined senyap di runtime.

// ------------------------------------------------------------------
// (1) GETTER/SETTER — METHOD YANG "MENYAMAR" JADI PROPERTY
//
// PDF (hlm. 34): selama ini kita mengubah properties dengan
// operator `=` dan mengambilnya dengan `.` — getter dan setter
// adalah METHOD khusus untuk hal yang sama, sehingga kita bisa
// menambahkan VALIDASI apa pun sebelum property asli diubah.
// Kunci yang sering menjebak: pemanggilannya TANPA KURUNG —
// `p.nama` menjalankan getter, `p.nama = "x"` menjalankan setter.
//
// Jika di Dart seperti ini:
//     class Pelanggan {
//       String _nama = 'tanpa nama';   // _nama PRIVATE di Dart
//       String get nama => _nama;
//       set nama(String v) => _nama = v;
//     }
// di TypeScript jadi seperti ini:
//     class Pelanggan {
//         _nama: string = "tanpa nama";  // underscore: konvensi
//         get nama(): string { return this._nama; }
//         set nama(v: string) { this._nama = v; }
//     }
// Bentuknya nyaris sejajar. PERBEDAAN NYATA ada di backing field
// `_nama`: di Dart underscore = PRIVATE per library; di TS
// underscore MURNI KONVENSI — masih public, kode di bawah membaca
// `p._nama` dari luar class dan tsc diam saja (visibility asli
// `private` menyusul di file 11).
// ------------------------------------------------------------------

class Pelanggan {
    _nama: string = "tanpa nama";   // konvensi underscore — bukan private!

    get nama(): string {
        return this._nama;
    }

    set nama(v: string) {
        this._nama = v.trim() === "" ? "tanpa nama" : v.trim();
    }

    get namaUpper(): string {       // derived getter — dihitung
        return this._nama.toUpperCase();
    }
}

const p = new Pelanggan();
p.nama = "  Eko  ";                 // SETTER jalan: trim otomatis
console.log(p.nama);                // Eko
console.log(p.namaUpper);           // EKO
p.nama = "   ";                     // validasi: kosong → default
console.log(p.nama);                // tanpa nama
console.log(p._nama);               // tanpa nama — masih public!

// ------------------------------------------------------------------
// (2) VALIDASI DI SETTER + GETTER TURUNAN (hlm. 34)
//
// Dua kegunaan raksasa: (a) setter menjaga data masuk —
// normalisasi/clamp sebelum disimpan; (b) getter TURUNAN —
// nilai yang dihitung on-the-fly, bukan disimpan (pajak,
// fahrenheit, kategori — pola umum Flutter pun).
//
// Dua catatan hasil probe: TS membolehkan get dan set berBEDA
// tipe (mis. get string, set number — tsc diam), tapi itu di luar
// kebiasaan dan membingungkan — samakan saja. Setter TANPA getter
// juga sah — tapi membaca property itu senyap menjadi `undefined`
// di runtime (tsc diam!) — beri getter, atau baca via method.
// ------------------------------------------------------------------

class Produk {
    _harga: number = 0;

    set harga(v: number) {
        this._harga = v < 0 ? 0 : v;    // clamp: tolak negatif
    }

    get harga(): number {
        return this._harga;
    }

    get pajak(): number {               // derived: dihitung, tak disimpan
        return (this._harga * 10) / 100;
    }
}

const pr = new Produk();
pr.harga = 100;
console.log(pr.harga);   // 100
console.log(pr.pajak);   // 10
pr.harga = -50;          // clamp jalan
console.log(pr.harga);   // 0
console.log(pr.pajak);   // 0

// ------------------------------------------------------------------
// (3) KODE ERROR — TS2540, TS6234, TS2300
//
// class SalahAssign {
//     _id: number = 1;
//     get id(): number { return this._id; }
// }
// const a5 = new SalahAssign();
// a5.id = 99;
// ❌ ERROR kalau di-uncomment:
//    error TS2540: Cannot assign to 'id' because it is a read-only
//    property.
//    (getter tanpa setter = property readonly — konsisten dengan
//    readonly di file 3)
//
// class SalahKurung {
//     _nama: string = "Eko";
//     get nama(): string { return this._nama; }
// }
// console.log(new SalahKurung().nama());
// ❌ ERROR kalau di-uncomment:
//    error TS6234: This expression is not callable because it is a
//    'get' accessor. Did you mean to use it without '()'?
//    Type 'String' has no call signatures.
//    (getter dipanggil seperti method — pesannya langsung menolong)
//
// class SalahDuplikat {
//     nama: string = "Eko";
//     get nama(): string { return this.nama; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2300: Duplicate identifier 'nama'.
//    (muncul 2× — di baris field dan di baris getter; inilah
//    alasan backing field dinamai _nama)
//
// Catatan Dart (terverifikasi dart analyze + run): getter/setter
// Dart sejajar — probe versi Dart class Pelanggan di atas
// menghasilkan output yang PERSIS sama (Eko / EKO / tanpa nama /
// tanpa nama). Bedanya cuma privatitas `_nama`: private per
// library di Dart, murni konvensi (masih public) di TS —
// `private` sungguhan baru di file 11.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. getter/setter = method yang dipanggil dengan SINTAKS property
//    (hlm. 34): `p.nama` (get, tanpa kurung!), `p.nama = "x"` (set).
// 2. Kekuatan utamanya: VALIDASI/normalisasi sebelum property asli
//    diubah — dan getter TURUNAN (dihitung, bukan disimpan).
// 3. Bentuk Dart hampir sejajar: `get nama => ...` /
//    `set nama(v) => ...`; beda return type eksplisit di TS.
// 4. PERBEDAAN NYATA: `_nama` di Dart PRIVATE per library; di TS
//    underscore hanya KONVENSI — masih public (visibility file 11).
// 5. Getter tanpa setter = readonly (TS2540); panggil dengan
//    kurung = TS6234; field + accessor nama sama = TS2300 (2×).
// 6. Jebakan senyap: setter TANPA getter — membacanya mencetak
//    undefined (tsc diam); get/set beda tipe pun diam — jangan.
//
// Cara menjalankan file ini: npx tsx src/5_getter_setter.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Diskon dengan setter persen yang meng-clamp ke
//    0..100, getter persen, dan getter turunan hemat (harga
//    200000 × persen%). Coba persen 150, -5, lalu 25.
//
// JAWABAN:
class Diskon {
    _persen: number = 0;

    set persen(v: number) {
        this._persen = v < 0 ? 0 : v > 100 ? 100 : v;
    }

    get persen(): number {
        return this._persen;
    }

    get hemat(): number {
        return (200000 * this._persen) / 100;
    }
}
const d = new Diskon();
d.persen = 150;
console.log(d.persen);   // 100
d.persen = -5;
console.log(d.persen);   // 0
d.persen = 25;
console.log(d.hemat);    // 50000

// 2. Buat class User dengan setter umur (clamp 0..120), getter
//    umur, dan getter turunan kategori: "anak" jika umur <= 17,
//    selain itu "dewasa".
//
// JAWABAN:
class User {
    _umur: number = 0;

    set umur(v: number) {
        this._umur = v < 0 ? 0 : v > 120 ? 120 : v;
    }

    get umur(): number {
        return this._umur;
    }

    get kategori(): string {
        return this._umur <= 17 ? "anak" : "dewasa";
    }
}
const u = new User();
u.umur = 25;
console.log(u.umur);       // 25
console.log(u.kategori);   // dewasa
u.umur = -5;
console.log(u.umur);       // 0
console.log(u.kategori);   // anak

// 3. Ramal-dulu: diberi kode berikut, apa yang dicetak? Apakah
//    `npx tsc --noEmit` menangkapnya?
//        class TimerSetOnly {
//            _detik: number = 0;
//            set detik(v: number) { this._detik = v; }
//        }
//        const t5 = new TimerSetOnly();
//        t5.detik = 60;
//        console.log(t5.detik);
//
// JAWABAN: tsc DIAM (setter-saja sah), tapi console.log mencetak
//    undefined — tanpa getter, membaca property itu tidak
//    mengambil `_detik` (sub-section 2). Perbaikan: tambahkan
//    getter — versi yang bisa dijalankan:
class TimerLengkap {
    _detik: number = 0;

    set detik(v: number) {
        this._detik = v;
    }

    get detik(): number {
        return this._detik;
    }
}
const t6 = new TimerLengkap();
t6.detik = 60;
console.log(t6.detik);   // 60
