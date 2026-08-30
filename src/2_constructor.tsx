// ==================================================================
// OOP 2 — CONSTRUCTOR
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 22-24
// (Constructor). Semua klaim perilaku DIVERIFIKASI via tsc --strict
// + tsx + Dart 3.11 dart analyze. Blok error terverifikasi:
// TS2392, TS2348, TS2322 + TS2409, dan kode error Dart
// not_initialized_non_nullable_instance_field serta
// return_in_generative_constructor.

// ------------------------------------------------------------------
// (1) CONSTRUCTOR = METHOD OTOMATIS SAAT OBJECT DIBUAT
//
// PDF (hlm. 23): constructor adalah method/function yang dipanggil
// ketika PERTAMA KALI object dibuat dari class. Sama seperti
// function biasa — boleh punya parameter — dengan satu beda:
// constructor tidak perlu mengembalikan value.
//
// Ini juga "jalan ke-3" yang dijanjikan file 1: field yang diisi
// di constructor bebas dari TS2564 TANPA nilai default dan TANPA
// tanda ! — inilah cara paling lazim mengisi field.
//
// Jika di Dart seperti ini:
//     class Pelanggan {
//       String nama;
//       Pelanggan(this.nama);          // shorthand parameter this.x
//     }
//     final p = Pelanggan('Eko');
// di TypeScript jadi seperti ini:
//     class Pelanggan {
//         nama: string;                // tanpa default, tanpa !
//         constructor(nama: string) {
//             this.nama = nama;         // diisi di BODY constructor
//         }
//     }
//     const p = new Pelanggan("Eko");
// Beda gaya kecil: Dart bisa merangkum deklarasi+isi lewat
// `this.nama` di parameter; TS menulis eksplisit parameter lalu
// `this.nama = nama` (shorthand versi TS baru muncul di topik
// Parameter Properties, hlm. 57-59 — file 12).
// ------------------------------------------------------------------

class Pelanggan {
    nama: string;   // tanpa default & tanpa ! — aman: constructor mengisi

    constructor(nama: string) {
        console.log(`[constructor jalan] membuat Pelanggan: ${nama}`);
        this.nama = nama;
    }

    sapa(): string {
        return `Halo, saya ${this.nama}`;
    }
}

const p1 = new Pelanggan("Eko");    // constructor jalan otomatis di sini
const p2 = new Pelanggan("Budi");   // ...dan lagi di sini
console.log(p1.sapa());             // Halo, saya Eko
console.log(p2.sapa());             // Halo, saya Budi

// ------------------------------------------------------------------
// (2) SATU CLASS = SATU CONSTRUCTOR — PERBEDAAN NYATA vs DART
//
// Dart membebaskan satu class punya BANYAK constructor lewat
// named constructor (Pelanggan.vip) plus redirecting/factory.
// TypeScript: hanya SATU constructor — tulis dua = error TS2392.
// Penggantinya: parameter OPSIONAL dengan nilai default, sehingga
// satu constructor melayani beberapa "bentuk" pembuatan objek.
//
// Jika di Dart seperti ini:
//     class Pelanggan {
//       String nama;
//       String jenis;
//       Pelanggan(this.nama, [this.jenis = 'reguler']);
//       Pelanggan.vip(this.nama) : jenis = 'vip';
//     }
// di TypeScript jadi seperti ini:
//     class Pelanggan {
//         nama: string;
//         jenis: string;
//         constructor(nama: string, jenis: string = "reguler") {
//             this.nama = nama;
//             this.jenis = jenis;
//         }
//     }
// Panggilan `Pelanggan.vip("Budi")` di Dart paling lazim
// digantikan di TS dengan `new Pelanggan("Budi", "vip")` — atau
// cukup andalkan default. (Trik lanjutan yang juga sah:
// constructor OVERLOAD — beberapa signature tanpa body + SATU
// implementasi; jarang dipakai karena parameter opsional sudah
// menutup hampir semua kasus.)
// ------------------------------------------------------------------

class PelangganLengkap {
    nama: string;
    jenis: string;

    constructor(nama: string, jenis: string = "reguler") {
        this.nama = nama;
        this.jenis = jenis;
    }

    sapa(): string {
        return `Halo, saya ${this.nama} (${this.jenis})`;
    }
}

console.log(new PelangganLengkap("Eko").sapa());
// Halo, saya Eko (reguler)
console.log(new PelangganLengkap("Budi", "vip").sapa());
// Halo, saya Budi (vip)

// ------------------------------------------------------------------
// (3) ISI FIELD DI BODY — SAH DI TS, DITOLAK DI DART
//
// PERBEDAAN NYATA yang bikin kaget kalau bolak-balik:
//   - TS menyembuhkan TS2564 lewat assignment DI DALAM body
//     constructor (control flow: "pernah di-assign di constructor?
//     ya → field pasti terisi").
//   - Dart justru MENOLAK `this.nama = nama` di body untuk field
//     non-nullable (error not_initialized_non_nullable_instance_
//     field) — Dart menuntut field pasti terisi SEBELUM body mulai
//     jalan: lewat parameter `this.nama` atau initializer list
//     `: nama = nama`.
// Bonusnya TS: body constructor boleh berisi LOGIKA — validasi,
// normalisasi, hitungan — bukan sekadar salin parameter.
//
// Jika di Dart seperti ini:
//     class AkunDart {
//       String nama;
//       int saldo;
//       AkunDart(String nama, int saldoAwal)
//           : nama = nama,                          // initializer list
//             saldo = saldoAwal < 0 ? 0 : saldoAwal;
//     }
// di TypeScript jadi seperti ini:
//     class Akun {
//         nama: string;
//         saldo: number;
//         constructor(nama: string, saldoAwal: number) {
//             this.nama = nama;
//             this.saldo = saldoAwal < 0 ? 0 : saldoAwal;
//         }
//     }
// ------------------------------------------------------------------

class Akun {
    nama: string;
    saldo: number;

    constructor(nama: string, saldoAwal: number) {
        this.nama = nama;
        this.saldo = saldoAwal < 0 ? 0 : saldoAwal;   // body boleh logika
    }
}

console.log(new Akun("Eko", 100).saldo);   // 100
console.log(new Akun("Budi", -5).saldo);   // 0  (negatif dinormalisasi)

// ------------------------------------------------------------------
// (4) KODE ERROR — TS2392, TS2348, TS2322 + TS2409
//
// class Dua {
//     nama: string;
//     constructor(nama: string) { this.nama = nama; }
//     constructor(nama: string, umur: number) { this.nama = nama; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2392: Multiple constructor implementations are not
//    allowed.
//    (muncul 2× — di tiap baris constructor yang punya body;
//    gantikan named constructor Dart dengan parameter
//    opsional/default seperti sub-section 2)
//
// const salah = Pelanggan("Eko");
// ❌ ERROR kalau di-uncomment:
//    error TS2348: Value of type 'typeof Pelanggan' is not callable.
//    Did you mean to include 'new'?
//    (melanjutkan file 1: new WAJIB — pesannya bahkan menawarkan
//    perbaikannya langsung)
//
// class SalahReturn {
//     nama: string = "x";
//     constructor() { return 42; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2322: Type 'number' is not assignable to type
//    'SalahReturn'.
//    error TS2409: Return type of constructor signature must be
//    assignable to the instance type of the class.
//    (syarat halus: class harus punya anggota — class kosong
//    malah lolos tsc! hlm. 23: constructor tidak perlu return
//    value; Dart juga melarang — lihat Catatan Dart berikut)
//
// Catatan Dart (terverifikasi dart analyze): `return 42;` di
// constructor → error return_in_generative_constructor "Constructors
// can't return values. Try removing the return statement or using
// a factory constructor." — semangat sama dengan TS2322/TS2409,
// tapi Dart menyebut pintasan keluarnya: factory constructor.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. constructor = method yang jalan OTOMATIS sekali saat object
//    pertama dibuat via new (hlm. 23); boleh berparameter; tidak
//    perlu (dan tidak boleh) mengembalikan value.
// 2. Field yang di-assign di constructor bebas TS2564 tanpa
//    default & tanpa ! — jalan ke-3 dari file 1, cara paling
//    lazim mengisi field.
// 3. SATU class = SATU constructor (TS2392) — PERBEDAAN NYATA vs
//    Dart yang bisa banyak (named constructor); pengganti paling
//    lazim: parameter opsional dengan nilai default.
// 4. TS mengisi field di BODY constructor (control flow — boleh
//    logika); Dart menuntut parameter this.x / initializer list:
//    body assignment di Dart ditolak analyzer, di TS justru cara
//    utama.
// 5. Lupa new = TS2348 (pesannya menawarkan 'new'); return nilai
//    = TS2322 + TS2409 — Dart juga melarang
//    (return_in_generative_constructor).
//
// Cara menjalankan file ini: npx tsx src/2_constructor.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Buku dengan field judul dan penulis yang diisi
//    lewat constructor (tanpa default, tanpa !), plus method
//    deskripsi() mengembalikan "JUDUL — oleh PENULIS".
//
// JAWABAN:
class Buku {
    judul: string;
    penulis: string;

    constructor(judul: string, penulis: string) {
        this.judul = judul;
        this.penulis = penulis;
    }

    deskripsi(): string {
        return `${this.judul} — oleh ${this.penulis}`;
    }
}
console.log(new Buku("Belajar TS", "Eko Kurniawan").deskripsi());
// Belajar TS — oleh Eko Kurniawan

// 2. Buat class Segitiga dengan constructor menerima alas dan
//    tinggi (number), lalu method luas() mengembalikan alas *
//    tinggi / 2.
//
// JAWABAN:
class Segitiga {
    alas: number;
    tinggi: number;

    constructor(alas: number, tinggi: number) {
        this.alas = alas;
        this.tinggi = tinggi;
    }

    luas(): number {
        return (this.alas * this.tinggi) / 2;
    }
}
console.log(new Segitiga(6, 4).luas());   // 12

// 3. Konversi Dart → TypeScript! Diberi kode Dart:
//        class User {
//          String nama;
//          User(this.nama);
//          User.tamu() : nama = 'tamu';
//        }
//    Buat versi TS-nya dengan SATU constructor yang hasil
//    panggilnya setara.
//
// JAWABAN: named constructor User.tamu() diganti parameter dengan
//    nilai default (sub-section 2):
class User {
    nama: string;

    constructor(nama: string = "tamu") {
        this.nama = nama;
    }
}
console.log(new User("Eko").nama);   // Eko
console.log(new User().nama);        // tamu
