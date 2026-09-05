// ========================================
// LATIHAN ADVANCE 5 — TERMINAL TRANSPORT
// MATERI: 15 (TYPE CAST)
// ========================================
// Konsep: instanceof + as, urutan child-paling-bawah-dulu,
//         as = no-op runtime, TS2352 antar saudara
// Program: layanan penumpang terminal dengan pengecekan berantai.

// ========================================
// SOAL
// ========================================
// 1. Buat KendaraanA5 (constructor public nama, method info() →
//    "Kendaraan nama"), BusA5 extends (kapasitas() → 40),
//    BusListrikA5 extends BusA5 (daya() → 300).
// 2. Buat function layanan(k: KendaraanA5): string dengan cek
//    instanceof BERANTAI — dan pilih URUTAN cek yang BENAR agar
//    tiap kendaraan dilayani paling spesifik mungkin.
// 3. Buat TaxiA5 extends KendaraanA5 (argo() → 15000).
// 4. RAMAL DULU (inti latihan — tulis jawabanmu dulu):
//    a. Versi layananSalah() yang mengecek BusA5 DULU baru
//       BusListrikA5 — apa yang dicetak untuk BusListrikA5?
//       Error, atau benar, atau SENYAP-SALAH?
//    b. const bus = taksi as BusA5; (saudara, bukan induk) —
//       error compiler apa?
//    c. const bohong = new KendaraanA5("Umum") as BusA5; lalu
//       bohong.kapasitas() — compiler diam: apa yang terjadi
//       saat DIJALANKAN?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) URUTAN BENAR: CHILD PALING BAWAH DULU.
//     (Jika di Dart seperti ini: `if (k is BusListrik) ...`
//     dengan as opsional setelahnya
//     → di TypeScript jadi seperti ini: kombinasi instanceof
//     untuk NARROWING, lalu as hanya kalau memang perlu)
// ------------------------------------------------------------------
class KendaraanA5 {
  constructor(public nama: string) {}

  info(): string {
    return "Kendaraan " + this.nama;
  }
}

class BusA5 extends KendaraanA5 {
  kapasitas(): number {
    return 40;
  }
}

class BusListrikA5 extends BusA5 {
  daya(): number {
    return 300;
  }
}

class TaxiA5 extends KendaraanA5 {
  argo(): number {
    return 15000;
  }
}

function layanan(k: KendaraanA5): string {
  if (k instanceof BusListrikA5) {
    return k.nama + " — bus listrik " + k.daya() + " kWh";
  }
  if (k instanceof BusA5) {
    return k.nama + " — bus " + k.kapasitas() + " kursi";
  }
  return k.info();
}

console.log(layanan(new BusListrikA5("Volta")));  // Volta — bus
// listrik 300 kWh
console.log(layanan(new BusA5("TransJakarta")));  // TransJakarta —
// bus 40 kursi
console.log(layanan(new TaxiA5("BlueBird")));  // Kendaraan BlueBird

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL (a) — URUTAN TERBALIK = SALAH SENYAP:
//     BusListrik kena di cabang BusA5 (instanceof BusA5 true),
//     detail listrik tak pernah tercetak, TANPA error.
// ------------------------------------------------------------------
function layananSalah(k: KendaraanA5): string {
  if (k instanceof BusA5) {
    return k.nama + " — bus " + k.kapasitas() + " kursi";
  }
  if (k instanceof BusListrikA5) {
    return k.nama + " — bus listrik " + k.daya() + " kWh";
  }
  return k.info();
}

console.log(layananSalah(new BusListrikA5("Volta")));  // Volta —
// bus 40 kursi  (SALAH SENYAP — bukan "bus listrik 300 kWh";
// jebakan ini sama persis di Dart: urutan is wajib diperhatikan)

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL (b) — cast antar SAUDARA ditolak compiler:
// ------------------------------------------------------------------
// const taksiA5 = new TaxiA5("BlueBird");
// const bus = taksiA5 as BusA5;
// ❌ ERROR kalau di-uncomment:
//    error TS2352: Conversion of type 'TaxiA5' to type 'BusA5'
//    may be a mistake because neither type sufficiently overlaps
//    with the other. If this was intentional, convert the
//    expression to 'unknown' first.
//    Property 'kapasitas' is missing in type 'TaxiA5' but
//    required in type 'BusA5'.
//    (beda cerita kalau bentuknya overlap — cast parent→child
//    SAH karena memang mungkin benar; penangkal terakhir:
//    as unknown as X — meloloskan apa pun, risiko penuh)

// ------------------------------------------------------------------
// (4) JAWABAN RAMAL (c) — as = NO-OP runtime, TIDAK memeriksa
//     apa pun; kebohongan meledak SAAT MEMBER DIPANGGIL.
//     (PERBEDAAN NYATA: di Dart, as = runtime check yang CRASH
//     DI TITIK CAST — "type 'X' is not a subtype of type 'Y' in
//     type cast"; di TS objek tetap aslinya)
// ------------------------------------------------------------------
// const penumpangA5 = new KendaraanA5("Umum");
// const bohong = penumpangA5 as BusA5;
// console.log(bohong.kapasitas());
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM):
//    TypeError: bohong.kapasitas is not a function
//    (blok ini sengaja paling akhir — crash menghentikan file)

// ========================================
// RANGKUMAN
// ========================================
// - Berantai instanceof: cek child PALING BAWAH dulu — urutan
//   terbalik menghasilkan salah senyap tanpa error (sama seperti
//   jebakan urutan is di Dart).
// - Cast antar saudara tanpa overlap = TS2352 (2 baris);
//   parent→child sah, as unknown as X meloloskan semuanya.
// - as di TS = no-op runtime (Dart: crash di titik cast) —
//   kebohongan cast meledak saat member tak ada dipanggil:
//   TypeError ... is not a function.
