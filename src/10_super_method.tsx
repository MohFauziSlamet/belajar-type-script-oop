// ==================================================================
// OOP 10 — SUPER METHOD
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 49-51
// (Super Method). Semua klaim perilaku DIVERIFIKASI via tsc
// --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2335, TS2339. Temuan probe: super
// bekerja juga pada getter; rantai multi-level super bertumpuk;
// this tetap milik instance CHILD saat versi parent dijalankan.

// ------------------------------------------------------------------
// (1) super.method() — PANGGIL VERSI PARENT DARI DALAM OVERRIDE
//
// PDF (hlm. 50): sama seperti constructor, saat membuat method
// overriding kita bisa memanggil method yang sama di Parent Class
// dengan kata kunci `super` diikuti nama method-nya. Hasilnya
// pola "perilaku parent + tambahan anak" — bukan menimpa total
// seperti file 9.
//
// Jika di Dart seperti ini:
//     class Kucing extends Hewan {
//       @override
//       String suara() => '${super.suara()} lalu $nama: meong';
//     }
// di TypeScript jadi seperti ini:
//     class Kucing extends Hewan {
//         suara(): string {
//             return `${super.suara()} lalu ${this.nama}: meong`;
//         }
//     }
// Detail penting (terverifikasi runtime): versi parent yang
// dipanggil super TETAP membaca `this` milik instance CHILD —
// di bawah, super.suara() mencetak "Pus" (nama si Kucing), bukan
// nama lain. Dart berperilaku persis sama.
// ------------------------------------------------------------------

class Hewan {
    nama: string;

    constructor(nama: string) {
        this.nama = nama;
    }

    suara(): string {
        return `${this.nama}: ...`;
    }
}

class Kucing extends Hewan {
    suara(): string {                       // override + super
        return `${super.suara()} lalu ${this.nama}: meong`;
    }
}

console.log(new Hewan("A").suara());     // A: ...
console.log(new Kucing("Pus").suara());  // Pus: ... lalu Pus: meong

// ------------------------------------------------------------------
// (2) RANTAI MULTI-LEVEL SUPER + SUPER PADA GETTER (hlm. 50)
//
// super menunjuk parent LANGSUNG — tapi karena parent bisa pula
// memanggil super-nya sendiri, hasilnya RANTAI yang bertumpuk:
// Anggora → super (Kucing) → super (Hewan). Bonus terverifikasi:
// super juga bekerja untuk GETTER (`super.label`).
// ------------------------------------------------------------------

class Anggora extends Kucing {
    suara(): string {                       // super berantai
        return `${super.suara()} (lembut)`;
    }
}

class HewanBerlabel extends Hewan {        // getter parent — akan di-super
    get label(): string {
        return `hewan ${this.nama}`;
    }
}

class AnggoraLengkap extends HewanBerlabel {
    get label(): string {                  // super pada getter
        return `anggora — ${super.label}`;
    }
}

console.log(new Anggora("Mia").suara());
// Mia: ... lalu Mia: meong (lembut)
console.log(new HewanBerlabel("A").label);     // hewan A (parent dulu)
console.log(new AnggoraLengkap("Mia").label);  // anggora — hewan Mia

// ------------------------------------------------------------------
// (3) KODE ERROR — TS2335, TS2339
//
// class Mandiri {
//     sapa(): string {
//         return `super: ${super.sapa()}`;
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2335: 'super' can only be referenced in a derived
//    class.
//    (class tanpa parent tidak punya super — super hanya hidup
//    di dalam class yang extends)
//
// class SalahPanggil extends Hewan {
//     suara(): string {
//         return super.melompat();
//     }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'melompat' does not exist on type
//    'Hewan'.
//    (super hanya bisa memanggil member yang ADA di parent —
//    pesannya menyebut tipe parent, bukan child)
//
// Catatan Dart (terverifikasi dart analyze + run): super.method()
// Dart sejajar persis — probe Kucing versi Dart menghasilkan
// output yang sama ("Pus: ... lalu Pus: meong"), dan super pada
// getter juga sah ("kucing — hewan Pus"). Praktis tidak ada
// perbedaan perilaku di bab ini — yang berbeda hanya gaya: Dart
// interpolasi `$nama` tanpa this, TS wajib `this.nama`.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. super.method() memanggil VERSI PARENT dari dalam override
//    (hlm. 50) — pola "perilaku parent + tambahan anak".
// 2. Versi parent tetap membaca `this` instance CHILD — field
//    child yang tercetak (terverifikasi runtime; Dart sama).
// 3. Rantai multi-level: super menunjuk parent langsung, tapi
//    boleh bertumpuk Anggora → Kucing → Hewan; super juga sah
//    untuk GETTER.
// 4. super di class tanpa parent = TS2335; super ke member yang
//    tidak ada di parent = TS2339 (pesan menyebut tipe parent).
// 5. Dart berperilaku identik di bab ini — beda gaya saja:
//    `$nama` vs `this.nama` (aturan this file 1).
//
// Cara menjalankan file ini: npx tsx src/10_super_method.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Playlist dengan method jumlahLagu() mengembalikan
//    10, lalu class Premium meng-override-nya dengan
//    super.jumlahLagu() + 5. Cetak keduanya.
//
// JAWABAN:
class Playlist {
    jumlahLagu(): number {
        return 10;
    }
}

class Premium extends Playlist {
    jumlahLagu(): number {
        return super.jumlahLagu() + 5;
    }
}
console.log(new Playlist().jumlahLagu());   // 10
console.log(new Premium().jumlahLagu());    // 15

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Laporan {
//          String isi() => 'data penjualan';
//        }
//        class LaporanPdf extends Laporan {
//          @override
//          String isi() => '${super.isi()} dalam PDF';
//        }
//    Buat versi TS-nya lalu jalankan.
//
// JAWABAN:
class Laporan {
    isi(): string {
        return "data penjualan";
    }
}

class LaporanPdf extends Laporan {
    isi(): string {
        return `${super.isi()} dalam PDF`;
    }
}
console.log(new LaporanPdf().isi());   // data penjualan dalam PDF

// 3. Ramal-dulu: apa output kode berikut?
//        class A10 { teks() { return "A"; } }
//        class B10 extends A10 { teks() { return `[${super.teks()}]`; } }
//        class C10 extends B10 { teks() { return `<${super.teks()}>`; } }
//        console.log(new C10().teks());
//
// JAWABAN: `<[A]>` — C10 memanggil super (B10) yang membungkus
//    super-nya (A10): "A" → "[A]" → "<[A]>". Bukti yang bisa
//    dijalankan:
class A10 {
    teks(): string {
        return "A";
    }
}

class B10 extends A10 {
    teks(): string {
        return `[${super.teks()}]`;
    }
}

class C10 extends B10 {
    teks(): string {
        return `<${super.teks()}>`;
    }
}
console.log(new C10().teks());   // <[A]>
