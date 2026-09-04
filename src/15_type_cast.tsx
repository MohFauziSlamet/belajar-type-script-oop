// ==================================================================
// OOP 15 — TYPE CAST
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 70-74
// (Type Cast). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2352 (2 baris), RUNTIME TypeError
// (tsc diam). Temuan probe: `as` = no-op runtime — TS percaya
// begitu, objek TIDAK berubah; Dart crash DI TITIK CAST.

// ------------------------------------------------------------------
// (1) INSTANCEOF + TYPE ASSERTION — KOMBINASI DARI PDF (hlm. 71-72)
//
// PDF (hlm. 71): type assertion (kelas dasar) bisa dipakai pada
// kasus method polymorphism — kombinasi operator instanceof dan
// type assertions. Pola gaya PDF: cek instanceof dulu, lalu
// cast `e as Child`, baru akses member spesifik child.
//
// Jika di Dart seperti ini:
//     if (e is VicePresident) {
//       final vp = e as VicePresident;   // gaya eksplisit
//       print(vp.jumlahCabang());
//     }
// di TypeScript jadi seperti ini:
//     if (e instanceof VicePresident) {
//         const vp = e as VicePresident;
//         console.log(vp.jumlahCabang());
//     }
// KEMIRIPAN EKSTREM. Nuansa modern keduanya: setelah cek
// lolos, NARROWING (file 13) / type promotion sudah menyempitkan
// tipe — `as` jadi OPSIONAL; analyzer Dart bahkan memberi warning
// unnecessary_cast. PDF menulis gaya eksplisit — kedua gaya sah,
// bab ini mengikuti PDF.
// ------------------------------------------------------------------

class Employee {
    constructor(public nama: string) {}
}
class Manager extends Employee {
    jumlahBawahan(): number {
        return 5;
    }
}
class VicePresident extends Manager {
    jumlahCabang(): number {
        return 3;
    }
}

function sapa(e: Employee): string {
    if (e instanceof VicePresident) {          // child paling bawah
        const vp = e as VicePresident;         // cast gaya PDF
        return `Halo VP ${vp.nama} — ${vp.jumlahCabang()} cabang`;
    } else if (e instanceof Manager) {
        const m = e as Manager;
        return `Halo Manager ${m.nama} — ${m.jumlahBawahan()} bawahan`;
    }
    return `Halo Employee ${e.nama}`;
}
console.log(sapa(new Employee("Eko")));             // Halo Employee Eko
console.log(sapa(new Manager("Budi")));    // Halo Manager Budi — 5 bawahan
console.log(sapa(new VicePresident("Sari")));   // Halo VP Sari — 3 cabang

// ------------------------------------------------------------------
// (2) URUTAN PENGECEKAN — CHILD PALING BAWAH DULU (hlm. 73-74)
//
// PDF (hlm. 73) "Perlu Diingat": pastikan child paling bawah
// dicek di awal — kalau Manager dicek sebelum VicePresident,
// VP BERHENTI di Manager, karena VP adalah turunan Manager dan
// instanceof Manager bernilai true (parent-true, file 13). Kode
// hlm. 74 ("Type Cast Salah") persis seperti sapaTerbalik di
// bawah. Perhatikan: TIDAK ADA error — tsc bersih, runtime jalan,
// hasilnya DIAM-DIAM SALAH. Bug jenis ini paling berbahaya.
// ------------------------------------------------------------------

function sapaTerbalik(e: Employee): string {
    if (e instanceof Manager) {                 // Manager dulu — salah!
        const m = e as Manager;
        return `Halo Manager ${m.nama} — ${m.jumlahBawahan()} bawahan`;
    } else if (e instanceof VicePresident) {    // VP tak pernah
        const vp = e as VicePresident;          // tersentuh
        return `Halo VP ${vp.nama} — ${vp.jumlahCabang()} cabang`;
    }
    return `Halo Employee ${e.nama}`;
}
const manBenar = sapaTerbalik(new Manager("Budi"));
console.log(manBenar);   // Halo Manager Budi — 5 bawahan (benar —
                         // Budi memang Manager)
const vpTertukar = sapaTerbalik(new VicePresident("Sari"));
console.log(vpTertukar);   // Halo Manager Sari — 5 bawahan (SALAH —
                           // tanpa error!)

// ------------------------------------------------------------------
// (3) CAST TANPA PENGECEKAN + KODE ERROR — TS HANYA PERCAYA
//
// `as` TIDAK melakukan pemeriksaan runtime apa pun: compiler
// menukar pandangan tipenya, objek tetap objek ASLI. TSC percaya
// begitu (downcast ke child diterima tanpa bukti) — kebohongan
// baru meledak saat member yang tidak ada DIPANGGIL (blok error
// runtime). Cast antar class yang bentuknya TIDAK overlap ditolak
// TS2352 — tapi bentuk SAMA justru sah (structural, file 14);
// pintu darurat `as unknown as X` meloloskan apa pun (kode live)
// — dan instanceof membongkar kebohongannya.
// ------------------------------------------------------------------

const emp15 = new Employee("Eko");
const fakeManager = emp15 as Manager;   // tsc PERCAYA — tanpa cek
console.log(typeof fakeManager);        // object — cast = no-op
console.log(fakeManager.nama);          // Eko — objek asli tak berubah

class Meja {
    beratKg(): number {
        return 10;
    }
}
console.log((emp15 as unknown as Meja) instanceof Meja);   // false —
                                                            // kebohongan
                                                            // terbongkar

// console.log(fakeManager.jumlahBawahan());
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM):
//    TypeError: fakeManager.jumlahBawahan is not a function
//    (cast tidak menambah member apa pun — objek tetap Employee
//    asli; Dart beda nasib: crash DI TITIK CAST, lihat Catatan)
//
// const mejaSalah = emp15 as Meja;
// console.log(mejaSalah);
// ❌ ERROR kalau di-uncomment:
//    error TS2352: Conversion of type 'Employee' to type 'Meja'
//    may be a mistake because neither type sufficiently overlaps
//    with the other. If this was intentional, convert the
//    expression to 'unknown' first.
//    Property 'beratKg' is missing in type 'Employee' but
//    required in type 'Meja'.
//    (bentuk tak overlap DITOLAK; bentuk sama justru lolos —
//    structural; `as unknown as` meloloskan semuanya, tapi
//    kebohongannya tetap terbongkar oleh instanceof — live)
//
// Catatan Dart (terverifikasi dart analyze + run): gaya
// `e is VicePresident` + `e as VicePresident` berjalan, tapi
// analyzer memberi warning unnecessary_cast (promotion sudah
// menyempitkan — as opsional). PERBEDAAN NYATA momen gagal:
// downcast salah `emp as Manager` DIAM analyzer, lalu runtime
// langsung crash DI TITIK CAST — "type 'EmployeeE' is not a
// subtype of type 'ManagerE' in type cast" — SEDANG TS `as`
// no-op: diam sampai member tak ada DIPANGGIL baru TypeError.
// Jebakan urutan hlm. 73? SAMA persis di Dart (run terbalik
// mencetak versi Manager).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Type cast pada class (hlm. 71): gabungkan instanceof + `e
//    as Child` untuk mengakses member spesifik child dari
//    referensi parent — gaya PDF. Setelah narrowing, `as`
//    sebenarnya opsional (Dart: warning unnecessary_cast).
// 2. URUTAN WAJIB (hlm. 73): child paling bawah dicek DULU.
//    Manager sebelum VicePresident = VP terhenti di Manager —
//    TANPA error, hasil diam-diam salah (kode hlm. 74).
// 3. `as` TIDAK memeriksa runtime apa pun (no-op): objek tetap
//    asli; tsc hanya PERCAYA. Kebohongan meledak saat member
//    dipanggil: TypeError "... is not a function" (tsc diam).
// 4. Cast antar bentuk TAK overlap = TS2352 (2 baris, lengkap
//    dengan saran 'unknown' first); bentuk SAMA justru sah
//    (structural). `as unknown as X` meloloskan semuanya —
//    tapi instanceof membongkarnya (false).
// 5. PERBEDAAN NYATA vs Dart: `as` Dart = pemeriksaan runtime
//    LANGSUNG — crash di titik cast ("... is not a subtype of
//    ... in type cast"); TS menunda ledakannya sampai akses.
//
// Cara menjalankan file ini: npx tsx src/15_type_cast.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Kendaraan → Mobil → Taksi (berantai). Mobil punya
//    merek(), Taksi punya tarifAwal(). Tulis function info(v)
//    gaya PDF: instanceof + as, child paling bawah DULU.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
class KendaraanLatihan {
    constructor(public plat: string) {}
}
class MobilLatihan extends KendaraanLatihan {
    merek(): string {
        return "Toyota";
    }
}
class TaksiLatihan extends MobilLatihan {
    tarifAwal(): number {
        return 10000;
    }
}
function info(v: KendaraanLatihan): string {
    if (v instanceof TaksiLatihan) {          // child bawah dulu
        const t = v as TaksiLatihan;
        return `${t.merek()} taksi Rp${t.tarifAwal()}`;
    } else if (v instanceof MobilLatihan) {
        const m = v as MobilLatihan;
        return `${m.merek()} (${m.plat})`;
    }
    return `kendaraan ${v.plat}`;
}
console.log(info(new KendaraanLatihan("B 1")));   // kendaraan B 1
console.log(info(new MobilLatihan("B 2")));       // Toyota (B 2)
console.log(info(new TaksiLatihan("B 3")));       // Toyota taksi
                                                  // Rp10000

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        String deskripsi(Hewan h) {
//          if (h is Burung) {
//            final b = h as Burung;
//            return '${b.sayap()} sayap';
//          }
//          return 'bukan burung';
//        }
//
// JAWABAN: (parameter unknown ≈ Object di Dart — pintu masuk
// bebas, penyaringnya instanceof)
class BurungLatihan {
    sayap(): number {
        return 2;
    }
}
function deskripsi(h: unknown): string {
    if (h instanceof BurungLatihan) {
        const b = h as BurungLatihan;
        return `${b.sayap()} sayap`;
    }
    return "bukan burung";
}
console.log(deskripsi(new BurungLatihan()));   // 2 sayap
console.log(deskripsi("beo"));                 // bukan burung

// 3. Ramal-dulu (bukan error!): dengan sapaTerbalik di
//    sub-section (2), apa OUTPUT `sapaTerbalik(new Manager("Joko"))`
//    dan kenapa tsc + runtime sama-sama diam?
//
// JAWABAN: "Halo Manager Joko — 5 bawahan" — Joko memang Manager,
//    cabang pertama `instanceof Manager` true, hasilnya BENAR
//    kebetulan. Bug urutan hanya menyapa VP salah; Manager tak
//    terkena. Versi perbaikan yang bisa dijalankan (urutan benar,
//    output VP kembali benar):
function sapaPerbaikan(e: Employee): string {
    if (e instanceof VicePresident) {          // child bawah dulu
        const vp = e as VicePresident;
        return `Halo VP ${vp.nama} — ${vp.jumlahCabang()} cabang`;
    } else if (e instanceof Manager) {
        const m = e as Manager;
        return `Halo Manager ${m.nama} — ${m.jumlahBawahan()} bawahan`;
    }
    return `Halo Employee ${e.nama}`;
}
const vpKembali = sapaPerbaikan(new VicePresident("Sari"));
console.log(vpKembali);   // Halo VP Sari — 3 cabang — benar lagi
