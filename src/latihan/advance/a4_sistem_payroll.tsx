// ========================================
// LATIHAN ADVANCE 4 — SISTEM PAYROLL
// MATERI: 14, 16 (POLYMORPHISM & ABSTRACT CLASS)
// ========================================
// Konsep: abstract sebagai tipe + dispatch, method polymorphism,
//         arah balik TS2741, lookalike structural
// Program: penggajian pegawai berbagai jenis lewat satu pintu.

// ========================================
// SOAL
// ========================================
// 1. Buat abstract class PegawaiA4: constructor(public nama:
//    string), abstract gaji(): number, plus method KONKRET
//    deskripsi() → "nama: Rp gaji" yang memanggil gaji() versi
//    instance child.
// 2. Buat Staf (gaji 5000) dan ManagerA4 (gaji 15000 + method
//    tunjangan() → 4000).
// 3. Buat function payroll(pegawai: PegawaiA4): number yang
//    mengembalikan pegawai.gaji() — dan loop for-of yang
//    menjumlahkan gaji array [Staf, ManagerA4].
// 4. Buat class FreelancerA4 TANPA extends apa pun (nama + gaji
//    7000 sendiri) — kira-kira langsung diterima parameter
//    payroll? Ramal dulu, lalu lengkapi di JAWABAN (2) sampai
//    benar-benar diterima.
// 5. RAMAL DULU:
//    a. new PegawaiA4("X") — error apa?
//    b. class StafSalah extends PegawaiA4 {} (lupa gaji) —?
//    c. const salah: ManagerA4 = new Staf("Budi"); (arah
//       balik turunan→induk) — error apa? (hati-hati: kodenya
//       mungkin bukan dugaan pertamamu)

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) ABSTRACT = KERANGKA + POLYMORPHISM.
//     (Jika di Dart seperti ini: abstract class PegawaiA4 dengan
//     method tanpa body otomatis abstract
//     → di TypeScript jadi seperti ini: keyword abstract wajib
//     di class DAN di tiap method kosongnya — PERBEDAAN NYATA)
// ------------------------------------------------------------------
abstract class PegawaiA4 {
  constructor(public nama: string) {}

  abstract gaji(): number;

  deskripsi(): string {  // konkret boleh memanggil abstract —
    return this.nama + ": Rp" + this.gaji();  // dispatch child
  }
}

class Staf extends PegawaiA4 {
  gaji(): number {
    return 5000;
  }
}

class ManagerA4 extends PegawaiA4 {
  gaji(): number {
    return 15000;
  }

  tunjangan(): number {
    return 4000;
  }
}

function payroll(pegawai: PegawaiA4): number {
  return pegawai.gaji();  // versi instance mana pun
}

const timA4: PegawaiA4[] = [new Staf("Budi"), new ManagerA4("Sari")];
let totalA4 = 0;
for (const p of timA4) {
  totalA4 = totalA4 + payroll(p);
}
console.log(new Staf("Budi").deskripsi());  // Budi: Rp5000
console.log(new ManagerA4("Sari").deskripsi());  // Sari: Rp15000
console.log(totalA4);  // 20000

// ------------------------------------------------------------------
// (2) LOOKALIKE STRUCTURAL — masuk HANYA jika bentuknya LENGKAP.
//     (PERBEDAAN NYATA: Dart menolak lookalike —
//     argument_type_not_assignable; TS menerima yang bentuknya
//     lengkap: polymorphism tanpa pewarisan)
// ------------------------------------------------------------------
class FreelancerA4 {  // kurang SATU anggota: deskripsi
  constructor(public nama: string) {}

  gaji(): number {
    return 7000;
  }
}

// console.log(payroll(new FreelancerA4("Rina")));
// ❌ ERROR kalau di-uncomment:
//    error TS2345: Argument of type 'FreelancerA4' is not
//    assignable to parameter of type 'PegawaiA4'.
//    Property 'deskripsi' is missing in type 'FreelancerA4' but
//    required in type 'PegawaiA4'.
//    (method KONKRET pun ikut dituntut — bukan hanya abstract)

class FreelancerPenuh {  // bentuk lengkap: gaji + deskripsi
  constructor(public nama: string) {}

  gaji(): number {
    return 7000;
  }

  deskripsi(): string {
    return this.nama + ": Rp" + this.gaji();
  }
}

console.log(payroll(new FreelancerPenuh("Rina")));  // 7000

// ------------------------------------------------------------------
// (3) JAWABAN RAMAL DULU:
// ------------------------------------------------------------------
// const baru = new PegawaiA4("X");
// ❌ ERROR kalau di-uncomment:
//    error TS2511: Cannot create an instance of an abstract
//    class.
//
// class StafSalah extends PegawaiA4 {}
// ❌ ERROR kalau di-uncomment:
//    error TS2515: Non-abstract class 'StafSalah' does not
//    implement inherited abstract member gaji from class
//    'PegawaiA4'.
//
// const salah: ManagerA4 = new Staf("Budi");
// ❌ ERROR kalau di-uncomment:
//    error TS2741: Property 'tunjangan' is missing in type
//    'Staf' but required in type 'ManagerA4'.
//    (arah balik turunan→induk tidak sah; arah benar: tipe induk
//    menampung instance anak — persis array timA4 di atas)

// ========================================
// RANGKUMAN
// ========================================
// - Abstract = kerangka: tak bisa di-new (TS2511), child wajib
//   melengkapi (TS2515); method konkret boleh memanggil abstract
//   dan mendapat versi child.
// - Tipe induk menampung semua turunan; loop + method
//   polymorphism menggaji campuran lewat satu pintu.
// - TS structural: lookalike tanpa extends diterima HANYA jika
//   bentuknya lengkap (kurang satu anggota = TS2345 — Dart
//   menolak lookalike apa pun); arah balik tetap TS2741.
