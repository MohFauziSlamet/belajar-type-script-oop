// ==================================================================
// OOP 1 — PENGENALAN OOP & CLASS
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 5-11
// (Pengenalan OOP: objek, class, OOP di TypeScript) + hlm. 19-21
// (Class). Semua klaim perilaku DIVERIFIKASI via tsc + tsx +
// Dart 3.11 dart analyze/run. Prasyarat: kelas Dasar selesai
// (34 file — tipe data sampai JavaScript Feature).

// ------------------------------------------------------------------
// (1) CLASS = CETAK BIRU, NEW = BENDA JADI
//
// OOP sudah jadi keseharian Anda di Flutter/Dart — jadi bagian
// ini fokus ke BENTUK, bukan filosofi. Ringkasnya: class adalah
// cetak biru yang memadukan DATA (field/property) dan PERILAKU
// (method) jadi satu wadah; `new` mencetak objek nyata dari
// cetak biru itu.
//
// Jika di Dart seperti ini:
//     class Pelanggan {
//       String nama;              // field bertipe
//       String jenis = 'reguler'; // field dengan nilai default
//     }
//     var p = Pelanggan();        // new di Dart opsional
//     p.nama = 'Eko';
// di TypeScript jadi seperti ini:
//     class Pelanggan {
//         nama: string;               // field bertipe
//         jenis: string = "reguler";  // default — persis Dart
//     }
//     const p = new Pelanggan();  // new WAJIB (buang new = error)
//     p.nama = "Eko";
// Tulisan field-nya mirip sekali — bedanya gaya saja: Dart satu
// spasi, TS pakai titik dua seperti biasa. Satu perbedaan NYATA
// di bagian bawah: TS punya aturan tersendiri soal field yang
// belum diisi (sub-section 3).
//
// Konteks dari PDF (hlm. 11): implementasi OOP di TypeScript akan
// diterjemahkan menjadi kode JavaScript — dan JavaScript sendiri
// sejak awal adalah bahasa PROSEDURAL, bukan OOP murni seperti
// Java/C++. Akibatnya OOP di TS ≈ OOP di JavaScript: tidak
// sedetail bahasa yang OOP dari induk. Justru karena itu,
// perbandingan dengan Dart (OOP murni, mirip Java) akan sering
// memunculkan perbedaan menarik sepanjang kelas ini.
// ------------------------------------------------------------------

class Pelanggan {
    nama: string = "";          // default string kosong — bisa ditimpa
    jenis: string = "reguler";  // default — jalan tanpa diisi

    sapa(): string {            // method — bentuknya function dalam class
        return `Halo, saya ${this.nama} (${this.jenis})`;
    }
}

const p = new Pelanggan();
p.nama = "Eko";                 // nilai default ditimpa dari luar
console.log(p.sapa());          // Halo, saya Eko (reguler)
console.log(new Pelanggan().nama);    // (string kosong)

// ------------------------------------------------------------------
// (2) METHOD DAN this — SAMA PERSIS SEPERTI DART
//
// Method = function di dalam class. Di dalam method, kata `this`
// menunjuk objek yang sedang memanggil — kebiasaan yang sama
// persis dengan Dart (Dart bahkan sering membiarkan this ditulis
// atau tidak; di TS this WAJIB untuk membaca field:
// `nama` telanjang di dalam method = error tidak dikenal).
//
// Jika di Dart seperti ini:
//     class Counter {
//       int nilai = 0;
//       void tambah() { nilai++; }        // Dart: this opsional
//       int ambil() => nilai;
//     }
// di TypeScript jadi seperti ini:
//     class Counter {
//         nilai: number = 0;
//         tambah(): void { this.nilai++; }   // this WAJIB
//         ambil(): number { return this.nilai; }
//     }
// PERBEDAAN NYATA: Dart boleh menulis `nilai` tanpa this; TS
// menuntut this.nilai untuk field dan this.method() untuk memanggil
// method sesama anggota class.
// ------------------------------------------------------------------

class Counter {
    nilai: number = 0;

    tambah(): void {
        this.nilai++;           // tanpa this → error (lihat blok (4))
    }

    tambahTiga(): void {
        this.tambah();          // method panggil method — juga pakai this
        this.tambah();
        this.tambah();
    }
}

const c = new Counter();
c.tambahTiga();
console.log(c.nilai);           // 3

// ------------------------------------------------------------------
// (3) FIELD WAJIB DIISI — TS2564 (SAUDARA NULL-SAFETY DART)
//
// strict mode proyek ini menyalakan strictPropertyInitialization:
// field TANPA nilai awal dan TIDAK pernah diisi constructor =
// error TS2564. Kenapa? Karena `new Pelanggan()` meninggalkan
// nama sebagai undefined — dan class Anda berbohong soal tipe
// `string`.
//
// Saudaranya di Dart SAMA SEMANGAT: field non-nullable tanpa
// initializer dan tanpa constructor pengisi = error
// not_initialized_non_nullable_instance_field. Jadi kalau Anda
// terbiasa null-safety Dart, perilaku ini sudah akrab — hanya
// nama/nomor error yang beda.
//
// Tiga jalan yang sah (constructor baru diajarkan di file 2):
//   a. beri nilai default   → nama: string = ""
//   b. definite assignment `nama!: string` — pernyataan "percaya
//      saja, akan kuisi nanti" — SEPUPU `late` di Dart:
//      late String label; ≈ label!: string;
//   c. isi lewat constructor → file 2 (cara paling lazim)
// ------------------------------------------------------------------

class Telat {
    label!: string;             // janji diisi belakangan (≈ late Dart)

    isi(v: string): void {
        this.label = v;
    }
}

const t = new Telat();
t.isi("nanti");
console.log(t.label);           // nanti

// ------------------------------------------------------------------
// (4) KODE ERROR — TS2564 & this YANG HILANG
//
// class Kosong {
//     nama: string;
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2564: Property 'nama' has no initializer and is not
//    definitely assigned in the constructor.
//    (solusi: default, constructor — file 2, atau tanda ! )
//
// class TanpaThis {
//     nilai: number = 0;
//     ambil(): number { return nilai; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2663: Cannot find name 'nilai'. Did you mean the
//    instance member 'this.nilai'?
//    (pesannya bahkan menolong: maksud Anda this.nilai, kan? —
//    inilah penerapan nyata "this WAJIB" dari sub-section 2)
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. class = cetak biru (field data + method perilaku); new =
//    mencetak objek. Di TS `new` WAJIB — Dart boleh membuangnya.
// 2. Field bertipe ditulis `nama: string` — bentuk deklarasinya
//    seperti variabel biasa di dalam class, nilai default sama
//    seperti Dart: `jenis: string = "reguler"`.
// 3. Method = function dalam class. `this` menunjuk objek yang
//    memanggil — PERBEDAAN NYATA: Dart boleh `nilai` telanjang,
//    TS WAJIB this.nilai (lupa = TS2663, pesannya menolong).
// 4. strictPropertyInitialization (aktif lewat strict): field
//    tanpa nilai awal & tanpa constructor pengisi = TS2564 —
//    saudara null-safety Dart (not_initialized_non_nullable_
//    instance_field), semangat sama, nama beda.
// 5. Tiga jalan isi field: nilai default, `nama!: string`
//    (≈ late Dart), atau constructor (file 2 — cara paling lazim).
//
// Cara menjalankan file ini: npx tsx src/1_pengenalan_oop.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Lampu dengan field status bertipe boolean
//    (default false) dan method deskripsi() mengembalikan
//    "menyala" / "mati".
//
// JAWABAN:
class Lampu {
    status: boolean = false;

    deskripsi(): string {
        return this.status ? "menyala" : "mati";
    }
}
const lampu = new Lampu();
console.log(lampu.deskripsi());           // mati
lampu.status = true;
console.log(lampu.deskripsi());           // menyala

// 2. Buat class KalkulatorSederhana dengan field hasil (number,
//    default 0) dan method tambah(n) yang MENAMBAH field lalu
//    mengembalikan nilainya.
//
// JAWABAN:
class KalkulatorSederhana {
    hasil: number = 0;

    tambah(n: number): number {
        this.hasil = this.hasil + n;
        return this.hasil;
    }
}
const kalku = new KalkulatorSederhana();
console.log(kalku.tambah(5));             // 5
console.log(kalku.tambah(3));             // 8

// 3. Ramal-dulu: apa yang terjadi kalau class Buku menulis
//    `judul: string;` TANPA default dan TANPA tanda ! — lalu
//    di-new dan judul diisi setelahnya?
//
// JAWABAN: ERROR SAAT KOMPILASI (TS2564: Property 'judul' has no
//    initializer and is not definitely assigned in the
//    constructor) — mengisi manual SETELAH new tidak menolong,
//    karena pemeriksaan terjadi pada deklarasi fieldnya.
//    (Jika di-run via tsx yang hanya transpile, kode jalan —
//    undefined sempat tercetak kalau diakses sebelum diisi;
//    itulah kenapa tsc --noEmit rutin dijalankan di proyek ini.)
//    Perbaikan: default `judul: string = ""`, tanda `judul!:`,
//    atau constructor (file berikutnya).
