// ========================================
// LATIHAN ADVANCE 3 — KEBUN BINATANG CEK
// MATERI: 13 (OPERATOR INSTANCEOF)
// ========================================
// Konsep: typeof tak bisa untuk objek, instanceof + narrowing,
//         interface tak bisa (TS2693), abstract class sah
// Program: pemeriksa spesies hewan lewat pemeriksaan tipe.

// ========================================
// SOAL
// ========================================
// 1. Buat abstract class HewanA3 (abstract bersuara(): string),
//    class KucingA3 (bersuara "meong" + method kecepatan() → 30)
//    dan UlarA3 (bersuara "ssst" + method panjang() → 200).
// 2. Buat function periksa(hewan: HewanA3): string yang
//    mengembalikan "suara + data khusus" — data khusus hanya
//    bisa diakses SETELAH narrowing instanceof.
// 3. Buktikan typeof untuk objek selalu "object" (hewan & array),
//    tapi typeof function = "function"; Array.isArray membedakan
//    array.
// 4. RAMAL DULU:
//    a. function campur(hewan: KucingA3 | UlarA3) berisi
//       return hewan.kecepatan(); TANPA narrowing — error apa?
//    b. interface Berbulu dipakai: kucing instanceof Berbulu —
//       error apa? (bandingkan: abstract class sah atau tidak?)
//    c. const kosong: HewanA3 | null = null; lalu
//       kosong instanceof KucingA3 — error apa?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) NARROWING INSTANCEOF — sejak cabang if, member spesifik
//     terbuka.
//     (Jika di Dart seperti ini: if (h is Kucing) promotion
//     otomatis → di TypeScript jadi seperti ini: if (hewan
//     instanceof KucingA3) — narrowing otomatis, KEMIRIPAN
//     EKSTREM dengan is/type promotion Dart)
// ------------------------------------------------------------------
abstract class HewanA3 {
  abstract bersuara(): string;
}

class KucingA3 extends HewanA3 {
  bersuara(): string {
    return "meong";
  }

  kecepatan(): number {
    return 30;
  }
}

class UlarA3 extends HewanA3 {
  bersuara(): string {
    return "ssst";
  }

  panjang(): number {
    return 200;
  }
}

function periksa(hewan: HewanA3): string {
  if (hewan instanceof KucingA3) {
    return hewan.bersuara() + " lari " + hewan.kecepatan();
  }
  if (hewan instanceof UlarA3) {
    return hewan.bersuara() + " panjang " + hewan.panjang();
  }
  return hewan.bersuara();
}

console.log(periksa(new KucingA3()));  // meong lari 30
console.log(periksa(new UlarA3()));    // ssst panjang 200

// ------------------------------------------------------------------
// (2) TYPEOF UNTUK OBJEK = "object" — tak membedakan apa pun;
//     array dicek Array.isArray, function terlihat "function".
// ------------------------------------------------------------------
console.log(typeof new KucingA3());  // object
console.log(typeof [1, 2, 3]);       // object  (array pun "object")
console.log(Array.isArray([1, 2, 3]));  // true
console.log(Array.isArray("teks"));     // false
console.log(typeof periksa);            // function
console.log(new KucingA3() instanceof HewanA3);  // true
// bukti di atas: abstract class TETAP ADA saat runtime — sah
// jadi operand instanceof (bandingkan interface di bawah)

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// function campur(hewan: KucingA3 | UlarA3): number {
//     return hewan.kecepatan();
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'kecepatan' does not exist on type
//    'KucingA3 | UlarA3'.
//    Property 'kecepatan' does not exist on type 'UlarA3'.
//    (sebelum narrowing, yang pasti ada hanya anggota SEMUA
//    anggota union — obatnya if instanceof)
//
// interface Berbulu { bulu: boolean; }
// const cekBulu = new KucingA3() instanceof Berbulu;
// ❌ ERROR kalau di-uncomment:
//    error TS2693: 'Berbulu' only refers to a type, but is being
//    used as a value here.
//    (interface DIHAPUS saat transpile — tak ada di runtime;
//    bandingkan bukti live di sub (2): abstract class HewanA3
//    justru sah sebagai operand dan hasilnya true)
//
// const kosong: HewanA3 | null = null;
// const cekKosong = kosong instanceof KucingA3;
// ❌ ERROR kalau di-uncomment:
//    error TS2358: The left-hand side of an 'instanceof'
//    expression must be of type 'any', an object type or a type
//    parameter.
//    (const langsung null dinarrow ke null oleh control flow —
//    varian aman: lewat PARAMETER bertipe union)

// ========================================
// RANGKUMAN
// ========================================
// - typeof objek selalu "object" (array juga) — pemeriksaan tipe
//   objek pakai instanceof; array pakai Array.isArray.
// - instanceof + if = narrowing otomatis (≈ is + promotion Dart);
//   union tanpa narrowing = TS2339 dua baris.
// - Interface tak bisa jadi operand (TS2693 — dihapus saat
//   transpile); abstract class bisa dan true; const null kiri
//   ditolak TS2358.
