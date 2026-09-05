// ========================================
// LATIHAN EXPERT 2 — EKSPOR IMPOR STRUKTUR
// MATERI: 18 (CLASS RELATIONSHIP)
// ========================================
// Konsep: structural typing, lookalike & superset, dispatch versi
//         class asli, private memutus structural
// Program: sistem member toko dengan tipe lintas class.

// ========================================
// SOAL
// ========================================
// 1. Buat class PelangganGold: constructor(public nama: string,
//    public poin: number) + method sapa() → "Halo gold nama".
// 2. Buat PelangganLoyal TANPA extends — bentuknya LENGKAP
//    (nama + poin + sapa) PLUS member ekstra diskon(): number
//    → 10. Deklarasikan const g1: PelangganGold =
//    new PelangganLoyal("Rina") — dan buktikan g1.sapa()
//    memanggil versi SIAPA, serta g1 instanceof PelangganGold.
// 3. Buat KartuBank dan KartuPalsu yang sama-sama ber-
//    constructor(private id: number), lalu coba
//    const kartu: KartuBank = new KartuPalsu(1).
// 4. RAMAL DULU:
//    a. const b1: PelangganGold = new PelangganBiasa("Tono")
//       (PelangganBiasa hanya punya nama — poin tidak ada) —
//       error apa?
//    b. baris kartu KartuPalsu di soal 3 — error apa? (hati-hati:
//       kodenya bukan TS2741 — bentuk persisnya lihat jawaban)
//    c. Menurut Dart, baris g1 lookalike di soal 2 — sah?

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) SUPERSET SAH + DISPATCH VERSI CLASS ASLI.
//     (Jika di Dart seperti ini: semua NOMINAL — lookalike
//     DITOLAK invalid_assignment walau bentuknya sama persis
//     → di TypeScript jadi seperti ini: object ditukar class
//     asal BENTUKNYA cocok — PERBEDAAN NYATA inti bab)
// ------------------------------------------------------------------
class PelangganGold {
  constructor(public nama: string, public poin: number) {}

  sapa(): string {
    return "Halo gold " + this.nama;
  }
}

class PelangganLoyal {  // tanpa extends — superset bentuk Gold
  constructor(public nama: string, public poin: number) {}

  sapa(): string {
    return "Halo loyal " + this.nama;
  }

  diskon(): number {
    return 10;
  }
}

const g1E2 = new PelangganLoyal("Rina", 120);
const g1: PelangganGold = g1E2;  // SAH — bentuknya lengkap
console.log(g1.sapa());                       // Halo loyal Rina
console.log(g1 instanceof PelangganGold);     // false
console.log(g1 instanceof PelangganLoyal);    // true
// method tetap versi CLASS ASLI (loyal), TAPI instanceof jujur:
// tipe deklarasi tidak pernah mengubah asal-usul objek

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU (a) — kurang SATU property:
// ------------------------------------------------------------------
// class PelangganBiasa {
//     constructor(public nama: string) {}
//     sapa(): string { return "Halo biasa " + this.nama; }
// }
// const b1: PelangganGold = new PelangganBiasa("Tono");
// ❌ ERROR kalau di-uncomment:
//    error TS2741: Property 'poin' is missing in type
//    'PelangganBiasa' but required in type 'PelangganGold'.
//    (kurang TEPAT SATU property = TS2741; kalau kurang banyak
//    sekaligus, pesannya berubah jadi TS2739 "missing the
//    following properties" — member ekstra tetap boleh)

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU (b) — PAGAR NOMINAL private:
// ------------------------------------------------------------------
// class KartuBank { constructor(private id: number) {} }
// class KartuPalsu { constructor(private id: number) {} }
// const kartu: KartuBank = new KartuPalsu(1);
// ❌ ERROR kalau di-uncomment:
//    error TS2322: Type 'KartuPalsu' is not assignable to type
//    'KartuBank'.
//    Types have separate declarations of a private property 'id'.
//    (bentuknya "lengkap" tapi private punya PEMILIK beda —
//    structural patah; protected juga sama memutus; obatnya
//    extends sungguhan)

// ------------------------------------------------------------------
// (4) JAWABAN RAMAL DULU (c): di Dart, g1 DITOLAK — lookalike
//     tanpa pewarisan = invalid_assignment, apalagi superset.
//     Yang di TS dianggap "bentuk cocok", Dart anggap "bukan
//     keluarga" — PERBEDAAN NYATA yang paling terasa saat
//     pindah dari Dart.
// ------------------------------------------------------------------

// ========================================
// RANGKUMAN
// ========================================
// - TS structural: objek dari class lain sah asal bentuknya
//   lengkap; member ekstra tidak menghalangi (superset sah).
// - Dispatch tetap versi class ASLI; instanceof jujur terhadap
//   asal-usul (deklarasi tidak menipu runtime).
// - Kurang satu property = TS2741; private/protected memutus
//   structural = TS2322 "separate declarations" — solusi extends.
