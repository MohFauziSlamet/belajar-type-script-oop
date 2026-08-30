// ==================================================================
// OOP 8 — SUPER CONSTRUCTOR
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 43-45
// (Super Constructor). Semua klaim perilaku DIVERIFIKASI via tsc
// --strict + tsx + Dart 3.11 dart analyze/run. Blok error
// terverifikasi: TS2377, TS17009, TS2554 (+ catatan TS2376 yang
// hanya muncul di target lama). PERBEDAAN NYATA utama: Dart boleh implicit
// super, TS WAJIB eksplisit.

// ------------------------------------------------------------------
// (1) super() — GERBANG WAJIB KE CONSTRUCTOR PARENT (hlm. 44)
//
// PDF (hlm. 44): saat Child Class membuat constructor sendiri
// (sama ataupun berbeda dengan parent), OTOMATIS kita harus
// memanggil constructor Parent — pakai kata kunci `super` (sama
// seperti di JavaScript). Dan urutannya kaku: super() WAJIB di
// awal, `this` baru boleh dipakai SETELAH super (TS17009).
//
// Jika di Dart seperti ini:
//     class Kucing extends Hewan {
//       String suara;
//       Kucing(String nama, this.suara) : super(nama);
//     }
// di TypeScript jadi seperti ini:
//     class Kucing extends Hewan {
//         suara: string;
//         constructor(nama: string, suara: string) {
//             super(nama);          // panggil ctor parent DULU
//             this.suara = suara;   // baru boleh sentuh this
//         }
//     }
// Dart menulis super di initializer list (`: super(nama)`) — di
// luar body; TS menulis super(...) sebagai PERNYATAAN PERTAMA di
// dalam body. Semangatnya sama: parent siap dulu, baru anak.
// ------------------------------------------------------------------

class Hewan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }
}

class Kucing extends Hewan {
    suara: string;

    constructor(nama: string, suara: string) {
        super(nama);            // WAJIB lebih dulu (hlm. 44)
        this.suara = suara;     // this baru sah SETELAH super
    }

    perkenalan(): string {
        return `${this.nama}: ${this.suara}`;
    }
}

console.log(new Kucing("Pus", "meong").perkenalan());   // Pus: meong

// ------------------------------------------------------------------
// (2) PERBEDAAN NYATA: DART IMPLICIT super, TS WAJIB EKSPLISIT
//
// Di Dart, kalau parent punya constructor default (tanpa
// parameter), child constructor BOLEH tidak menulis apa-apa —
// super implicit dijalankan otomatis SEBELUM body child (bukti
// run: field `pesan` parent sudah terisi "halo" saat body anak
// dieksekusi). Di TS, begitu child MENULIS constructor, super()
// WAJIB ditulis eksplisit — walau parent-nya constructor kosong
// sekalipun; lupa = TS2377 (sub-section 3).
//
// Jika di Dart seperti ini:
//     class Anak extends Sederhana {
//       Anak() { ... }              // super implicit — sah
//     }
// di TypeScript jadi seperti ini:
//     class Anak extends Sederhana {
//         constructor() {
//             super();               // WAJIB eksplisit di TS
//             ...
//         }
//     }
// ------------------------------------------------------------------

class Sederhana {
    pesan: string = "halo";
}

class Anak extends Sederhana {
    tambahan: string;

    constructor() {
        super();                     // parent tanpa param — tetap WAJIB
        this.tambahan = "dunia";
    }

    gabung(): string {
        return `${this.pesan} ${this.tambahan}`;
    }
}

console.log(new Anak().gabung());   // halo dunia

// ------------------------------------------------------------------
// (3) KODE ERROR — TS2377, TS17009, TS2554
//
// class LupaSuper extends Hewan {
//     suara: string = "meong";
//     constructor(nama: string) {
//         console.log("ctor anak jalan");
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2377: Constructors for derived classes must contain
//    a 'super' call.
//    (begitu child menulis ctor, super WAJIB ada — hlm. 44)
//
// class ThisDulu extends Hewan {
//     constructor(nama: string) {
//         this.nama = nama;
//         super(nama);
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS17009: 'super' must be called before accessing 'this'
//    in the constructor of a derived class.
//    (this terlalu dini — super dulu. Catatan target: di tsconfig
//    proyek ini [target esnext], pelanggaran urutan hanya
//    melahirkan TS17009; pada target lama seperti ES2020, TS2376
//    ikut menegur jika child punya field initializer)
//
// class SalahJumlah extends Hewan {
//     constructor(nama: string, umur: number) {
//         super(nama, umur);
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2554: Expected 1 arguments, but got 2.
//    (super(nama, umur) mengikuti SIGNATURE ctor parent — parent
//    hanya meminta satu string)
//
// Catatan Dart (terverifikasi dart analyze + run): `Kucing('Pus',
// 'meong') : super(nama)` eksplisit dan ctor anak TANPA `: super()`
// keduanya sah di Dart (output run: "Pus" + field parent "halo"
// sudah terisi saat body anak jalan). Bandingkan blok TS2377 di
// atas: versi TS-nya ERROR. Kutipan `: super(nama)` Dart menempati
// initializer list; `super(nama)` TS menempati body — dua rumah
// untuk satu tugas.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Child yang menulis constructor WAJIB memanggil constructor
//    parent via super(...) — hlm. 44; sama seperti JavaScript.
// 2. Urutan kaku: super() di awal, `this` hanya sah SETELAH super
//    (TS17009 — TS2376 hanya muncul di target lama).
// 3. PERBEDAAN NYATA: Dart boleh implicit super (parent default →
//    anak tanpa `: super()` sah, dijalankan otomatis sebelum body);
//    TS WAJIB eksplisit — lupa = TS2377 walau parent kosong.
// 4. super(...) mengikuti SIGNATURE ctor parent — jumlah argumen
//    salah = TS2554.
// 5. Posisi: Dart `: super(n)` di initializer list; TS super(n)
//    sebagai pernyataan pertama body — dua rumah, satu tugas.
//
// Cara menjalankan file ini: npx tsx src/8_super_constructor.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Pengguna (nama lewat constructor + method sapa()
//    "Halo, NAMA"), lalu class Admin extends Pengguna menambah
//    field level (number) lewat constructor keduanya — panggil
//    super(nama) — dan method info() "NAMA — admin level N".
//
// JAWABAN:
class Pengguna {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }

    sapa(): string {
        return `Halo, ${this.nama}`;
    }
}

class Admin extends Pengguna {
    level: number;

    constructor(nama: string, level: number) {
        super(nama);
        this.level = level;
    }

    info(): string {
        return `${this.nama} — admin level ${this.level}`;
    }
}
const adm = new Admin("Eko", 2);
console.log(adm.sapa());   // Halo, Eko
console.log(adm.info());   // Eko — admin level 2

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Orang {
//          String nama;
//          Orang(this.nama);
//        }
//        class Karyawan extends Orang {
//          String jabatan;
//          Karyawan(String n, this.jabatan) : super(n);
//          String deskripsi() => '$nama bekerja sebagai $jabatan';
//        }
//    Buat versi TS-nya lalu jalankan.
//
// JAWABAN:
class Orang {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }
}

class Karyawan extends Orang {
    jabatan: string;

    constructor(nama: string, jabatan: string) {
        super(nama);
        this.jabatan = jabatan;
    }

    deskripsi(): string {
        return `${this.nama} bekerja sebagai ${this.jabatan}`;
    }
}
console.log(new Karyawan("Budi", "designer").deskripsi());
// Budi bekerja sebagai designer

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Lumba extends Hewan {
//            constructor(nama: string) {
//                this.nama = nama;
//            }
//        }
//
// JAWABAN: DUA error — TS2377 "Constructors for derived classes
//    must contain a 'super' call." (tidak ada super) DAN TS17009
//    "'super' must be called before accessing 'this' in the
//    constructor of a derived class." (this.nama terlalu dini).
//    Versi perbaikan yang bisa dijalankan:
class Lumba extends Hewan {
    constructor(nama: string) {
        super(nama);                 // super dulu — dua penyakit
    }                                // sekaligus sembuh

    suara(): string {
        return `${this.nama}: klik klik`;
    }
}
console.log(new Lumba("Dol").suara());   // Dol: klik klik
