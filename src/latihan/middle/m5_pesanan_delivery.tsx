// ========================================
// LATIHAN MIDDLE 5 — PESANAN DELIVERY
// MATERI: 9, 10 (METHOD OVERRIDING & SUPER METHOD)
// ========================================
// Konsep: override method & getter, super.method() dalam rantai,
//         signature override harus kompatibel, super di class root
// Program: biaya bertingkat Pesanan → Express → SameDay.

// ========================================
// SOAL
// ========================================
// 1. Class Pesanan: field nomor (via constructor), method
//    biaya(): number → 10000, getter label → "Pesanan nomor",
//    method ringkas(): string → "label — Rpbiaya" (memanggil
//    versi milik instance, bukan milik class-nya sendiri).
// 2. PesananExpress extends Pesanan: override biaya() → 25000 dan
//    override getter label → "Express nomor" (menimpa total).
// 3. PesananSameDay extends PesananExpress: override biaya()
//    dengan super.biaya() + 10000 (bangun di atas versi parent).
// 4. Cetak ringkas() ketiganya + label SameDay.
// 5. RAMAL DULU:
//    a. class SalahReturn extends Pesanan override biaya() tapi
//       return STRING "25rb" — error apa?
//    b. class SalahParam extends Pesanan override
//       biaya(dasar: number) — param TAMBAHAN — error apa?
//    c. class Akar TANPA parent berisi super.apa() — error apa?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) OVERRIDE + SUPER.METHOD RANTAI.
//     (Jika di Dart seperti ini: @override int biaya() —
//     → di TypeScript jadi seperti ini: biaya(): number tanpa
//     penanda apa pun — perilaku dispatch-nya pun mengikuti
//     instance, KEMIRIPAN EKSTREM dengan Dart)
// ------------------------------------------------------------------
class Pesanan {
  nomor: string;

  constructor(nomor: string) {
    this.nomor = nomor;
  }

  biaya(): number {
    return 10000;
  }

  get label(): string {
    return "Pesanan " + this.nomor;
  }

  ringkas(): string {
    return this.label + " — Rp" + this.biaya();
  }
}

class PesananExpress extends Pesanan {
  biaya(): number {
    return 25000;
  }

  get label(): string {
    return "Express " + this.nomor;
  }
}

class PesananSameDay extends PesananExpress {
  biaya(): number {
    return super.biaya() + 10000;  // versi Express + tambahan
  }
}

const p1M5 = new Pesanan("A-1");
const p2M5 = new PesananExpress("A-2");
const p3M5 = new PesananSameDay("A-3");
console.log(p1M5.ringkas());  // Pesanan A-1 — Rp10000
console.log(p2M5.ringkas());  // Express A-2 — Rp25000
console.log(p3M5.ringkas());  // Express A-3 — Rp35000
console.log(p3M5.label);      // Express A-3
// runtutan SameDay: label warisan override Express; biaya =
// super.biaya() (versi Express 25000) + 10000 = 35000; method
// ringkas() milik Pesanan ikut memakai versi instance CHILD

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — dua varian signature tak kompatibel:
// ------------------------------------------------------------------
// class SalahReturn extends Pesanan {
//     biaya(): string { return "25rb"; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2416: Property 'biaya' in type 'SalahReturn' is not
//    assignable to the same property in base type 'Pesanan'.
//    Type '() => string' is not assignable to type '() => number'.
//    Type 'string' is not assignable to type 'number'.
//
// class SalahParam extends Pesanan {
//     biaya(dasar: number): number { return dasar; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2416: Property 'biaya' in type 'SalahParam' is not
//    assignable to the same property in base type 'Pesanan'.
//    Type '(dasar: number) => number' is not assignable to type
//    '() => number'.
//    Target signature provides too few arguments. Expected 1 or
//    more, but got 0.
//    (return beda tipe maupun param tambahan-wajib — keduanya
//    ditolak dengan kode TS2416 yang sama)
//
// class Akar {
//     halo(): string { return super.apa(); }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2335: 'super' can only be referenced in a derived
//    class.
//    (super.method hanya ada di class yang punya parent)

// ========================================
// RANGKUMAN
// ========================================
// - Override boleh method dan getter; method parent yang memanggil
//   this tetap mendapat versi instance child (dispatch).
// - super.method() memanggil versi parent dari DALAM override;
//   dipakai untuk membangun di atasnya, bukan menimpa total.
// - Signature override wajib kompatibel: return beda tipe / param
//   tambahan wajib = TS2416; super di class root = TS2335.
