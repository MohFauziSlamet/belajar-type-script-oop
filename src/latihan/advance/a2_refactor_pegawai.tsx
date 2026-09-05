// ========================================
// LATIHAN ADVANCE 2 — REFACTOR PEGAWAI
// MATERI: 12 (PARAMETER PROPERTIES)
// ========================================
// Konsep: parameter properties (constructor shorthand), campuran
//         modifier, refactor kode bertele-tele
// Program: data pegawai & konsultan yang direfactor ringkas.

// ========================================
// SOAL
// ========================================
// 1. Mulai dari class PegawaiRibet yang MENDEKLARASI field lalu
//    mengisinya manual di constructor (bertele-tele) — lihat
//    JAWABAN (1). Refactor menjadi class Pegawai yang sama tapi
//    memakai PARAMETER PROPERTIES: constructor(public nama:
//    string, public gaji: number) TANPA deklarasi field manual.
// 2. Buat class Konsultan dengan CAMPURAN modifier: nama public,
//    tarif private, aktifSampai public readonly (semua via
//    parameter properties) + method bacaTarif(): number (satu-
//    satunya jalan baca tarif dari luar).
// 3. Cetak info pegawai, nama konsultan, tarif lewat method, dan
//    aktifSampai langsung dari luar.
// 4. RAMAL DULU:
//    a. constructor(nama: string) TANPA modifier, lalu method
//       berisi return this.nama — error apa?
//    b. method perpanjang() berisi this.aktifSampai = "2027";
//       (aktifSampai readonly) — error apa?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) SEBELUM → SESUDAH REFACTOR.
//     (Jika di Dart seperti ini: Pegawai(this.nama, this.gaji)
//     → di TypeScript jadi seperti ini: constructor(public nama:
//     string, public gaji: number) — KEMIRIPAN EKSTREM dengan
//     shorthand this.x Dart; bedanya TS menuntut modifier
//     eksplisit agar parameter jadi property)
// ------------------------------------------------------------------
class PegawaiRibet {                 // SEBELUM — bertele-tele
  nama: string;
  gaji: number;

  constructor(nama: string, gaji: number) {
    this.nama = nama;
    this.gaji = gaji;
  }
}

class Pegawai {                      // SESUDAH — shorthand
  constructor(public nama: string, public gaji: number) {}

  info(): string {
    return this.nama + " gaji " + this.gaji;
  }
}

const pegawaiA2 = new Pegawai("Rina", 9000);
console.log(pegawaiA2.info());  // Rina gaji 9000

// ------------------------------------------------------------------
// (2) CAMPURAN MODIFIER — readonly sah walau bukan visibility:
// ------------------------------------------------------------------
class Konsultan {
  constructor(public nama: string, private tarif: number,
              public readonly aktifSampai: string) {}

  bacaTarif(): number {
    return this.tarif;  // private terbaca dari DALAM class
  }
}

const konsA2 = new Konsultan("Tono", 25000, "2026-12-31");
console.log(konsA2.nama);          // Tono
console.log(konsA2.bacaTarif());   // 25000
console.log(konsA2.aktifSampai);   // 2026-12-31  (readonly tetap
// terbaca — beku hanya soal PENULISAN)

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// class SalahParam {
//     constructor(nama: string) {}          // tanpa modifier
//     baca(): string { return this.nama; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'nama' does not exist on type
//    'SalahParam'.
//    (parameter TANPA modifier hanya variabel biasa — bukan
//    field; kebalikan shorthand di atas)
//
// class SalahUbah {
//     constructor(public readonly kode: string) {}
//     ubah(): void { this.kode = "baru"; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2540: Cannot assign to 'kode' because it is a
//    read-only property.

// ========================================
// RANGKUMAN
// ========================================
// - constructor(public x: T) = deklarasi field + isi otomatis —
//   KEMIRIPAN EKSTREM dengan this.x Dart (di Dart privat lewat
//   underscore, di TS lewat keyword private).
// - Modifier boleh dicampur per parameter (public/private/
//   protected/readonly) — tidak harus semuanya sekaligus.
// - Parameter tanpa modifier bukan field (this.x = TS2339);
//   readonly param property beku setelah constructor (TS2540).
