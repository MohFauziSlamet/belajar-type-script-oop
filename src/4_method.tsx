// ==================================================================
// OOP 4 — METHOD (LEBIH DALAM)
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 30-32
// (Method). Dasar method + this WAJIB sudah di file 1 — file ini
// memperdalam: anotasi penuh (hlm. 31) dan this-binding method
// sebagai callback (pendalaman praktik standar JS/TS, di luar PDF —
// semua klaim DIVERIFIKASI via tsc --strict + tsx + Dart 3.11 dart
// analyze/run). Blok terverifikasi: TS2322, TS2554, TypeError
// runtime unbound-method, Dart return_of_invalid_type dan
// not_enough_positional_arguments.

// ------------------------------------------------------------------
// (1) METHOD = FUNCTION DALAM CLASS — kini anotasi penuh
//
// PDF (hlm. 31): selain properties, class juga bisa memiliki
// function — disebut Method. Cara pembuatannya sama seperti di
// JavaScript; bedanya di TypeScript kita WAJIB menentukan tipe
// data parameter dan return value-nya.
//
// Jika di Dart seperti ini:
//     class Kalkulator {
//       int nilai = 0;
//       int tambah(int n) => nilai += n;
//       void reset() => nilai = 0;
//     }
// di TypeScript jadi seperti ini:
//     class Kalkulator {
//         nilai: number = 0;
//         tambah(n: number): number { this.nilai += n; return this.nilai; }
//         reset(): void { this.nilai = 0; }
//     }
// Keduanya typed. Beda kecil: TS sebenarnya bisa MENEBAK return
// type jika anotasi dilewat — tapi gaya eksplisit lebih aman dan
// lazim untuk method. Aturan function kelas Dasar semua berlaku:
// `void` untuk tanpa return, parameter optional `prefix?`, dan
// default `n: number = 1`.
// ------------------------------------------------------------------

class Kalkulator {
    nilai: number = 0;

    tambah(n: number): number {      // parameter & return: number
        this.nilai += n;
        return this.nilai;
    }

    geser(n: number = 1): number {   // default — geser() = geser(1)
        this.nilai += n;
        return this.nilai;
    }

    label(prefix?: string): string { // optional — prefix?: string
        return `${prefix ?? "nilai"} = ${this.nilai}`;
    }

    reset(): void {                  // tanpa return value
        this.nilai = 0;
    }
}

const k = new Kalkulator();
console.log(k.tambah(5));        // 5
console.log(k.geser());          // 6
console.log(k.label());          // nilai = 6
console.log(k.label("total"));   // total = 6
k.reset();
console.log(k.nilai);            // 0

// ------------------------------------------------------------------
// (2) JEBAKAN this — METHOD DICABUT DARI OBJECTNYA
//
// Pendalaman paling penting untuk eks-Dart: method TS/JS yang
// di-pass sebagai callback BISA KEHILANGAN this. `const f = t.sapa`
// mencabut method dari objeknya — memanggil `f()` tanpa receiver
// membuat this = undefined (tsc TIDAK menangkapnya — lihat blok
// runtime di sub-section 3). Solusinya: ARROW CLASS FIELD —
// `sapa = () => ...` mengikat this ke objek SECARA PERMANEN,
// aman dicabut maupun dipakai callback.
//
// Jika di Dart seperti ini:
//     final t = Timer();
//     final f = t.sapa;    // tear-off — sah & this TETAP terikat
//     f();                 // aman, idiom onPressed: c.proses
// di TypeScript jadi seperti ini:
//     const t = new Timer();
//     const f = t.sapaArrow;   // HARUS arrow class field
//     f();                     // baru aman
//
// PERBEDAAN NYATA: method Dart tidak pernah kehilangan this
// (tear-off/callback selalu aman — terverifikasi dart analyze+run);
// method TS biasa bisa — pakai arrow field kalau method akan
// dijadikan callback.
// ------------------------------------------------------------------

class SapaArrow {
    nama: string = "A";

    sapa = (): void => {         // arrow CLASS FIELD — this terikat
        console.log(`halo ${this.nama}`);
    };
}

const s = new SapaArrow();
const f = s.sapa;   // dicabut dari objeknya
f();                // halo A — this tidak lepas

// ------------------------------------------------------------------
// (3) KODE ERROR & JEBAKAN RUNTIME — TS2322, TS2554, UNBOUND this
//
// class SalahReturn {
//     tambah(n: number): number { return "teks"; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2322: Type 'string' is not assignable to type 'number'.
//    (hlm. 31: return value WAJIB cocok tipe — Dart punya saudaranya:
//    return_of_invalid_type, lihat Catatan Dart)
//
// class SalahArgumen {
//     tambah(n: number): number { return n; }
// }
// console.log(new SalahArgumen().tambah());
// ❌ ERROR kalau di-uncomment:
//    error TS2554: Expected 1 arguments, but got 0.
//    (parameter WAJIB diisi sesuai tipe — Dart:
//    not_enough_positional_arguments)
//
// class SalahUnbound {
//     nama: string = "A";
//     sapa(): void { console.log(`halo ${this.nama}`); }
// }
// const t3 = new SalahUnbound();
// const f3 = t3.sapa;
// f3();
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM — tidak
//    ditangkap!):
//    TypeError: Cannot read properties of undefined (reading 'nama')
//    (method biasa dicabut → this = undefined; perbaiki dengan
//    arrow class field seperti sub-section 2)
//
// Catatan Dart (terverifikasi dart analyze):
//   - `return 'teks'` pada method `int` → error return_of_invalid_
//     type "A value of type 'String' can't be returned from the
//     method 'tambah' because it has a return type of 'int'."
//   - `k.tambah()` tanpa argumen → error not_enough_positional_
//     arguments "1 positional argument expected by 'tambah', but
//     0 found. Try adding the missing argument."
//   - tear-off `final f = t.sapa; f();` → BERSIH, tercetak "halo A"
//     dua kali (langsung + lewat parameter callback).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. method = function dalam class; TS WAJIB mengetik parameter &
//    return value (hlm. 31) — `tambah(n: number): number`.
// 2. Aturan function kelas Dasar berlaku: `void`, optional `p?`,
//    default `n: number = 1`, dan `??` untuk fallback optional.
// 3. Method biasa yang DICABUT (`const f = t.sapa`) lalu dipanggil
//    → tsc diam, runtime TypeError "Cannot read properties of
//    undefined" — jebakan senyap.
// 4. Solusi: ARROW CLASS FIELD `sapa = (): void => {...}` — this
//    terikat permanen, aman sebagai callback.
// 5. PERBEDAAN NYATA: method Dart (tear-off/callback) tidak pernah
//    kehilangan this; di TS itu risiko nyata.
// 6. TS2322 (return salah tipe) & TS2554 (jumlah argumen salah) —
//    saudara Dart: return_of_invalid_type,
//    not_enough_positional_arguments.
//
// Cara menjalankan file ini: npx tsx src/4_method.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Pemain dengan field skor (number, default 0) dan
//    dua method: skor() mengembalikan skor, tambahSkor(n: number = 1)
//    menambah lalu mengembalikan skor baru.
//
// JAWABAN:
class Pemain {
    skor: number = 0;

    skorSekarang(): number {
        return this.skor;
    }

    tambahSkor(n: number = 1): number {
        this.skor += n;
        return this.skor;
    }
}
const pemain = new Pemain();
console.log(pemain.skorSekarang());   // 0
pemain.tambahSkor();
console.log(pemain.skorSekarang());   // 1
pemain.tambahSkor(3);
console.log(pemain.skorSekarang());   // 4

// 2. Buat class Kata dengan method teriak(teks?: string): string
//    yang mengembalikan teks dalam huruf besar; jika teks tidak
//    diisi, kembalikan "HALO".
//
// JAWABAN:
class Kata {
    teriak(teks?: string): string {
        return (teks ?? "halo").toUpperCase();
    }
}
const kata = new Kata();
console.log(kata.teriak());      // HALO
console.log(kata.teriak("oi"));  // OI

// 3. Ramal-dulu: diberi kode berikut, apa yang terjadi? Apakah
//    `npx tsc --noEmit` menangkapnya?
//        class Lampion {
//            warna = "merah";
//            nyalakan(): void { console.log(this.warna); }
//        }
//        const cb = new Lampion().nyalakan;
//        cb();
//
// JAWABAN: tsc --noEmit DIAM (lolos type-check!), tapi saat
//    dijalankan CRASH: TypeError: Cannot read properties of
//    undefined (reading 'warna') — this = undefined karena method
//    dicabut dari objeknya (sub-section 2-3). Perbaikan: jadikan
//    arrow class field `nyalakan = (): void => ...`, atau panggil
//    lewat pembungkus `() => lamp.nyalakan()`.
//    Versi perbaikan yang bisa dijalankan:
class Lampion {
    warna: string = "merah";

    nyalakan = (): void => {     // arrow class field — this aman
        console.log(this.warna);
    };
}
const aman = new Lampion().nyalakan;   // dicabut dari objeknya
aman();                                // merah
