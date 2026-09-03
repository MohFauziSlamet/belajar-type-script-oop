// ==================================================================
// OOP 14 — POLYMORPHISM
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 64-69
// (Polymorphism). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS2741, TS2339, TS2345 (2 baris).
// Temuan probe: lookalike TANPA extends yang bentuknya lengkap
// TETAP masuk parameter parent (structural) — Dart menolaknya.

// ------------------------------------------------------------------
// (1) CLASS POLYMORPHISM — REFERENSI PARENT MENAMPUNG CHILD (hlm. 65)
//
// PDF (hlm. 65): polymorphism dari bahasa Yunani, "banyak bentuk"
// — kemampuan object berubah bentuk menjadi bentuk lain; erat
// hubungannya dengan inheritance. Contoh klasik PDF (hlm. 68):
// Employee → Manager → VicePresident (warisan berantai, file 6).
//
// Jika di Dart seperti ini:
//     Employee e = Manager('Budi');
//     print(e.perkenalan());   // versi Manager yang jalan
// di TypeScript jadi seperti ini:
//     const man: Employee = new Manager("Budi");
//     console.log(man.perkenalan());
// KEMIRIPAN EKSTREM — satu mesin di baliknya: DYNAMIC DISPATCH.
// Referensi bertipe parent, tapi method override yang dipanggil
// tetap versi CHILD-nya (file 9 menyediakan override-nya, bab
// ini membuktikan mesinnya). Arahnya SATU ARAH: parent boleh
// menampung child, child TIDAK boleh menampung parent (blok
// error TS2741 di bawah).
// ------------------------------------------------------------------

class Employee {
    constructor(public nama: string) {}

    perkenalan(): string {
        return `Saya ${this.nama}, employee`;
    }
}
class Manager extends Employee {
    perkenalan(): string {
        return `Saya ${this.nama}, manager`;
    }

    jumlahBawahan(): number {
        return 5;   // member SPESIFIK Manager (tidak dimiliki Employee)
    }
}
class VicePresident extends Manager {
    perkenalan(): string {
        return `Saya ${this.nama}, vice president`;
    }
}

const emp14 = new Employee("Eko");
const man14: Employee = new Manager("Budi");          // parent <= child
const vp14: Employee = new VicePresident("Sari");     // 2 tingkat pun sah
console.log(emp14.perkenalan());   // Saya Eko, employee
console.log(man14.perkenalan());   // Saya Budi, manager — dispatch!
console.log(vp14.perkenalan());    // Saya Sari, vice president

// const salahArah: Manager = new Employee("X");
// console.log(salahArah);
// ❌ ERROR kalau di-uncomment:
//    error TS2741: Property 'jumlahBawahan' is missing in type
//    'Employee' but required in type 'Manager'.
//    (penyempitan ke child tanpa bukti — Employee tidak punya
//    jumlahBawahan yang diminta Manager)

// ------------------------------------------------------------------
// (2) METHOD POLYMORPHISM — PARAMETER PARENT MENERIMA SEMUA
//     TURUNANNYA (hlm. 68)
//
// PDF (hlm. 68): function/method berparameter class Employee
// bisa menerima object Employee, Manager, ataupun VicePresident
// — karena Manager dan VicePresident keduanya turunan Employee.
// Berlaku juga untuk array: Employee[] boleh berisi campuran
// semua bentuk.
// ------------------------------------------------------------------

function sapa(e: Employee): string {
    return `Halo! ${e.perkenalan()}`;   // dispatch per bentuk asli
}
console.log(sapa(emp14));   // Halo! Saya Eko, employee
console.log(sapa(new Manager("Joko")));   // Halo! Saya Joko, manager
const rina14 = new VicePresident("Rina");
console.log(sapa(rina14));   // Halo! Saya Rina, vice president

const tim14: Employee[] = [emp14, man14, vp14];   // array campuran
for (const anggota of tim14) {
    console.log(`- ${anggota.perkenalan()}`);  // 3 baris, dispatch
}                                               // per anggota

// console.log(vp14.jumlahBawahan());
// ❌ ERROR kalau di-uncomment:
//    error TS2339: Property 'jumlahBawahan' does not exist on
//    type 'Employee'.
//    (referensi parent TAK melihat member spesifik child walau
//    objeknya VicePresident — solusinya narrowing, sub-section 3)

// ------------------------------------------------------------------
// (3) PERBEDAAN NYATA + KODE ERROR — STRUCTURAL BOLEH MASUK
//
// TS STRUCTURAL (file 7 & 13): yang dicek BENTUK, bukan garis
// turunan. Akibatnya di bab ini: class TANPA extends yang
// bentuknya lengkap (punya semua member Employee) TETAP masuk
// parameter Employee — polymorphism tanpa pewarisan! Dart
// NOMINAL: hanya turunan sah, lookalike ditolak analyzer.
// Member spesifik child lewat referensi parent = TS2339 —
// obatnya narrowing instanceof (file 13); Type Cast (hlm.
// 70-74) adalah jalan lain, materi file 15.
// ------------------------------------------------------------------

class Freelancer {
    // TANPA extends Employee — tapi bentuknya lengkap sama
    constructor(public nama: string) {}

    perkenalan(): string {
        return `Saya ${this.nama}, freelancer`;
    }
}
console.log(sapa(new Freelancer("Rian")));   // Halo! Saya Rian, freelancer

if (man14 instanceof Manager) {
    console.log(man14.jumlahBawahan());   // 5 — narrowed: Employee
}                                          // → Manager (file 13)

// class Pelamar {
//     constructor(public nama: string) {}
// }
// console.log(sapa(new Pelamar("Ari")));
// ❌ ERROR kalau di-uncomment:
//    error TS2345: Argument of type 'Pelamar' is not assignable
//    to parameter of type 'Employee'.
//    Property 'perkenalan' is missing in type 'Pelamar' but
//    required in type 'Employee'.
//    (bentuk KURANG satu member — structural tetap menuntut
//    lengkap; lengkap = bebas masuk, kurang = ditolak)
//
// Catatan Dart (terverifikasi dart analyze + run): perilaku
// dynamic dispatch PERSIS sama (run mencetak "Saya Budi,
// manager" lewat referensi Employee, dst). Yang beda gerbang
// masuknya: `sapa(FreelancerE('Rian'))` DITOLAK —
// argument_type_not_assignable "The argument type
// 'FreelancerE' can't be assigned to the parameter type
// 'EmployeeE'." — tanpa extends TIDAK ada jalan masuk (nominal).
// Arah terbalik `ManagerE m = EmployeeE('X')` juga ditolak:
// invalid_assignment. Bonus warisan berantai: `e is ManagerD`
// pada objek VicePresident = true (VP turunan Manager — sama
// seperti parent-true file 13).
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Polymorphism = "banyak bentuk" (hlm. 65): referensi parent
//    menampung objek child — Employee/Manager/VicePresident bisa
//    ditampung variabel bertipe Employee (warisan berantai 2
//    tingkat pun sah).
// 2. Mesinnya DYNAMIC DISPATCH: method dipanggil lewat referensi
//    parent → versi CHILD yang jalan (override file 9 + bab ini
//    berpasangan). Arah SATU ARAH: child menampung parent =
//    TS2741 (property child hilang).
// 3. Method polymorphism (hlm. 68): parameter bertipe parent
//    menerima SEMUA turunannya; array parent juga boleh campur.
//    Member spesifik child lewat referensi parent = TS2339.
// 4. PERBEDAAN NYATA: gerbang TS STRUCTURAL — lookalike TANPA
//    extends yang lengkap tetap masuk (bentuk kurang = TS2345);
//    Dart NOMINAL — hanya turunan, lookalike ditolak
//    (argument_type_not_assignable).
// 5. Akses member spesifik child: narrowing instanceof (file 13)
//    menyempitkan tipe dengan aman; Type Cast (file 15, hlm.
//    70-74) jalan cepatnya.
//
// Cara menjalankan file ini: npx tsx src/14_polymorphism.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class Hewan dengan method bersuara(), lalu Kucing dan
//    Anjing menimpanya. Tulis function dengar(h: Hewan) yang
//    mencetak suara — panggil dengan kedua bentuk child.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
class HewanLatihan {
    bersuara(): string {
        return "...";
    }
}
class KucingLatihan extends HewanLatihan {
    bersuara(): string {
        return "meong";
    }
}
class AnjingLatihan extends HewanLatihan {
    bersuara(): string {
        return "guk";
    }
}
function dengar(h: HewanLatihan): string {
    return h.bersuara();   // dispatch: versi child yang jalan
}
console.log(dengar(new KucingLatihan()));   // meong
console.log(dengar(new AnjingLatihan()));   // guk

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class Kendaraan {
//          String jenis() => 'kendaraan umum';
//        }
//        class Mobil extends Kendaraan {
//          @override
//          String jenis() => 'mobil';
//        }
//        class Motor extends Kendaraan {
//          @override
//          String jenis() => 'motor';
//        }
//        void main() {
//          List<Kendaraan> tim = [Mobil(), Motor()];
//          for (final k in tim) print(k.jenis());
//        }
//
// JAWABAN:
class KendaraanLatihan {
    jenis(): string {
        return "kendaraan umum";
    }
}
class MobilLatihan extends KendaraanLatihan {
    jenis(): string {
        return "mobil";
    }
}
class MotorLatihan extends KendaraanLatihan {
    jenis(): string {
        return "motor";
    }
}
const timLatihan: KendaraanLatihan[] = [
    new MobilLatihan(),
    new MotorLatihan(),
];
for (const k of timLatihan) {
    console.log(k.jenis());   // mobil, motor
}

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class Produk {
//            nama(): string { return "produk"; }
//        }
//        class ProdukFisik extends Produk {
//            beratKg(): number { return 2; }
//        }
//        const p: Produk = new ProdukFisik();
//        console.log(p.beratKg());
//
// JAWABAN: ERROR TS2339 — "Property 'beratKg' does not exist on
//    type 'Produk'." — referensi parent tidak melihat member
//    spesifik child (sub-section 2). Versi perbaikan dengan
//    narrowing yang bisa dijalankan:
class Produk {
    nama(): string {
        return "produk";
    }
}
class ProdukFisik extends Produk {
    beratKg(): number {
        return 2;
    }
}
const pProduk: Produk = new ProdukFisik();
if (pProduk instanceof ProdukFisik) {
    console.log(pProduk.beratKg());   // 2 — sudah menyempit
}
