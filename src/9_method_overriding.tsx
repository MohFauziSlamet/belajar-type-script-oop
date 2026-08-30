// ==================================================================
// OOP 9 — METHOD OVERRIDING
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 46-48
// (Method Overriding). Semua klaim perilaku DIVERIFIKASI via tsc
// --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2416 (2 varian). Temuan probe:
// getter/setter juga bisa dioverride; multi-level override sah;
// di Dart @override ternyata OPSIONAL (tanpa analysis_options,
// analyzer diam).

// ------------------------------------------------------------------
// (1) CHILD MENIMPA METHOD PARENT (hlm. 47)
//
// PDF (hlm. 47): Child Class boleh mendeklarasikan ULANG method
// yang ada di Parent Class — jika semua deklarasinya sama, itu
// disebut Method Overriding. Saat runtime, versi CHILD yang
// menang; instance parent tetap memakai versi parent.
//
// Jika di Dart seperti ini:
//     class Kucing extends Hewan {
//       @override
//       String suara() => '$nama: meong';
//     }
// di TypeScript jadi seperti ini:
//     class Kucing extends Hewan {
//         suara(): string {
//             return `${this.nama}: meong`;
//         }
//     }
// PERBEDAAN NYATA: Dart biasa menandainya dengan anotasi @override
// (opsional — tanpa analysis_options analyzer diam; dijaga lint
// Flutter). TS secara default TIDAK memakai penanda — yang
// diperiksa kompatibilitas signature (sub 2). TS sebenarnya punya
// modifier `override` (sejak TS 4.3) yang baru berperan jika flag
// noImplicitOverride dinyalakan — saat aktif, override tanpa
// modifier = TS4114; proyek ini tidak menyalakannya.
// Bonus terverifikasi: override berlaku berantai (cucu menimpa
// anak) dan getter/setter pun bisa ditimpa.
// ------------------------------------------------------------------

class Hewan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }

    suara(): string {
        return `${this.nama}: ...`;
    }

    get label(): string {
        return `hewan ${this.nama}`;
    }
}

class Kucing extends Hewan {
    suara(): string {              // override versi Kucing
        return `${this.nama}: meong`;
    }
}

class KucingAnggora extends Kucing {
    suara(): string {              // override LAGI — multi-level
        return `${this.nama}: meong lembut`;
    }

    get label(): string {          // getter ikut bisa dioverride
        return `anggora ${this.nama}`;
    }
}

console.log(new Hewan("A").suara());            // A: ...
console.log(new Kucing("Pus").suara());         // Pus: meong
console.log(new KucingAnggora("Mia").suara());  // Mia: meong lembut
console.log(new KucingAnggora("Mia").label);    // anggora Mia
console.log(new Hewan("A").label);              // hewan A

// ------------------------------------------------------------------
// (2) OVERRIDE MENIMPA TOTAL — SUPER MENYUSUL DI FILE 10
//
// Override menggantikan perilaku parent SEPENUHNYA untuk instance
// child — method parent tidak ikut terpanggil otomatis. Kalau
// yang dibutuhkan "perilaku parent DITAMBAH sesuatu", caranya
// memanggil versi parent lewat super.method() — materi file 10
// (Super Method, hlm. 49-51), sengaja tidak dibahas di sini.
// ------------------------------------------------------------------

class Karyawan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }

    slip(): string {
        return `${this.nama}: gaji pokok`;
    }
}

class Manager extends Karyawan {
    slip(): string {               // menimpa total versi Karyawan
        return `${this.nama}: gaji pokok + bonus`;
    }
}

console.log(new Karyawan("Budi").slip());   // Budi: gaji pokok
console.log(new Manager("Eko").slip());     // Eko: gaji pokok + bonus

// ------------------------------------------------------------------
// (3) KODE ERROR — TS2416 SIGNATURE TAK KOMPATIBEL (2 varian)
//
// class SalahReturn extends Hewan {
//     suara(): number {
//         return 42;
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2416: Property 'suara' in type 'SalahReturn' is not
//    assignable to the same property in base type 'Hewan'.
//    Type '() => number' is not assignable to type '() => string'.
//    Type 'number' is not assignable to type 'string'.
//    (3 baris: header + tipe fungsi + tipe return — parent
//    string, child number = tidak kompatibel)
//
// class SalahParam extends Hewan {
//     suara(keras: boolean): string {
//         return keras ? "MEONG" : "meong";
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2416: Property 'suara' in type 'SalahParam' is not
//    assignable to the same property in base type 'Hewan'.
//    Type '(keras: boolean) => string' is not assignable to type
//    '() => string'.
//    Target signature provides too few arguments. Expected 1 or
//    more, but got 0.
//    (override tidak boleh MENUNTUT parameter baru yang tidak
//    diminta parent — pemanggil versi parent akan kehabisan argumen)
//
// Catatan Dart (terverifikasi dart analyze + run): return type beda
// → error invalid_override "'Kucing.suara' ('int Function()') isn't
// a valid override of 'Hewan.suara' ('String Function()')." —
// semangat TS2416. Probe juga membuktikan @override OPSIONAL:
// override tanpa anotasi → "No issues found!" (analyzer Dart
// standar); di proyek Flutter, lint biasanya menandainya.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Overriding = child mendeklarasikan ulang method parent dengan
//    signature sama (hlm. 47); runtime memilih versi CHILD.
// 2. Override menimpa TOTAL — perilaku parent tidak ikut jalan;
//    untuk "parent + tambahan" pakai super.method() (file 10).
// 3. Berlaku juga multi-level (cucu menimpa anak) dan pada
//    getter/setter — semua terverifikasi di sub-section 1.
// 4. Signature HARUS kompatibel: return type beda ATAU menuntut
//    parameter baru = TS2416 (Dart: invalid_override).
// 5. PERBEDAAN NYATA: Dart menandai override dengan @override
//    (opsional tanpa lint); TS default tanpa penanda — modifier
//    `override` ada, wajib hanya jika noImplicitOverride aktif.
//
// Cara menjalankan file ini: npx tsx src/9_method_overriding.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Kendaraan (jenis lewat constructor + method info()
//    "ini kendaraan JENIS"), lalu class Mobil extends Kendaraan
//    menambah field roda (number, lewat constructor + super) dan
//    meng-override info() menjadi "ini JENIS beroda N roda".
//
// JAWABAN:
class Kendaraan {
    jenis: string;

    constructor(jenis: string) {
        this.jenis = jenis;
    }

    info(): string {
        return `ini kendaraan ${this.jenis}`;
    }
}

class MobilKu extends Kendaraan {
    roda: number;

    constructor(jenis: string, roda: number) {
        super(jenis);
        this.roda = roda;
    }

    info(): string {
        return `ini ${this.jenis} beroda ${this.roda} roda`;
    }
}
console.log(new Kendaraan("umum").info());   // ini kendaraan umum
console.log(new MobilKu("mobil", 4).info()); // ini mobil beroda 4 roda

// 2. Buat rantai Level1 → Level2 → Level3, masing-masing punya
//    method deskripsi() yang meng-override versi di atasnya
//    ("level 1" / "level 2" / "level 3"). Cetak ketiganya.
//
// JAWABAN:
class Level1 {
    deskripsi(): string {
        return "level 1";
    }
}

class Level2 extends Level1 {
    deskripsi(): string {
        return "level 2";
    }
}

class Level3 extends Level2 {
    deskripsi(): string {
        return "level 3";
    }
}
console.log(new Level1().deskripsi());   // level 1
console.log(new Level2().deskripsi());   // level 2
console.log(new Level3().deskripsi());   // level 3

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Salah extends Hewan {
//            suara(): number { return 42; }
//        }
//
// JAWABAN: ERROR TS2416 — "Property 'suara' in type 'Salah' is
//    not assignable to the same property in base type 'Hewan'."
//    (return type number tidak kompatibel dengan string milik
//    parent — lihat sub-section 3). Versi perbaikan yang bisa
//    dijalankan:
class Bebek extends Hewan {
    suara(): string {
        return `${this.nama}: kwek kwek`;
    }
}
console.log(new Bebek("Duck").suara());   // Duck: kwek kwek
