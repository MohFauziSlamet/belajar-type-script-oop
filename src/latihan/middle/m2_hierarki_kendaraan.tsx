// ========================================
// LATIHAN MIDDLE 2 — HIERARKI KENDARAAN
// MATERI: 6 (INHERITANCE)
// ========================================
// Konsep: extends, warisan berantai (multi-level), satu parent
//         banyak child, getter ikut diwariskan, arah satu arah
// Program: hierarki Kendaraan → Mobil → MobilListrik + Motor.

// ========================================
// SOAL
// ========================================
// 1. Buat class Kendaraan: field nama (via constructor), method
//    info() → "Kendaraan: nama", getter label → "[nama]".
// 2. Buat Mobil extends Kendaraan dengan method bukaPintu() →
//    "nama membuka 4 pintu".
// 3. Buat MobilListrik extends Mobil dengan method isiBaterai()
//    → "nama mengisi baterai". Objek MobilListrik harus bisa
//    memakai member dari TIGA tingkat class sekaligus.
// 4. Buat Motor extends Kendaraan dengan method bunyiKlakson()
//    → "nama: tin tin" (satu parent, banyak child).
// 5. RAMAL DULU: error apa yang muncul kalau...
//    a. class Salah extends Kendaraan, Mobil {} (dua parent)
//    b. new Mobil() tanpa argumen
//    c. member child dipanggil lewat tipe parent:
//       new Kendaraan("X").bukaPintu();

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) WARISAN BERANTAI + SATU PARENT BANYAK CHILD.
//     (Jika di Dart seperti ini: class Mobil extends Kendaraan
//     → di TypeScript jadi seperti ini: class Mobil extends
//     Kendaraan — keyword dan bentuknya IDENTIK sampai detail,
//     KEMIRIPAN EKSTREM; bedanya Dart masih punya `with` mixin)
// ------------------------------------------------------------------
class Kendaraan {
  nama: string;

  constructor(nama: string) {
    this.nama = nama;
  }

  info(): string {
    return "Kendaraan: " + this.nama;
  }

  get label(): string {
    return "[" + this.nama + "]";
  }
}

class Mobil extends Kendaraan {
  bukaPintu(): string {
    return this.nama + " membuka 4 pintu";
  }
}

class MobilListrik extends Mobil {
  isiBaterai(): string {
    return this.nama + " mengisi baterai";
  }
}

class Motor extends Kendaraan {
  bunyiKlakson(): string {
    return this.nama + ": tin tin";
  }
}

const teslaM2 = new MobilListrik("Tesla");
console.log(teslaM2.info());        // Kendaraan: Tesla
console.log(teslaM2.label);         // [Tesla]  (getter diwariskan)
console.log(teslaM2.bukaPintu());   // Tesla membuka 4 pintu
console.log(teslaM2.isiBaterai());  // Tesla mengisi baterai
const vespaM2 = new Motor("Vespa");
console.log(vespaM2.info());          // Kendaraan: Vespa
console.log(vespaM2.bunyiKlakson());  // Vespa: tin tin

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// class Salah extends Kendaraan, Mobil {}
// ❌ ERROR kalau di-uncomment:
//    error TS1174: Classes can only extend a single class.
//    (multi-reuse di Dart lewat `with` mixin — TS tak memilikinya)
//
// const m = new Mobil();
// ❌ ERROR kalau di-uncomment:
//    error TS2554: Expected 1 arguments, but got 0.
//    (Mobil tidak menulis constructor → memakai SIGNATURE
//    constructor parent — wajib kirim nama)
//
// new Kendaraan("X").bukaPintu();
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'bukaPintu' does not exist on type
//    'Kendaraan'.
//    (arah warisan SATU ARAH — parent tak punya member child)

// ========================================
// RANGKUMAN
// ========================================
// - extends mewariskan semua member; warisan berantai sah;
//   getter/setter pun ikut diwariskan.
// - Single inheritance: dua parent = TS1174 (Dart memakai `with`).
// - Child tanpa constructor memakai signature parent (TS2554
//   kalau argumen kurang); parent tak mewarisi member child
//   (TS2339).
