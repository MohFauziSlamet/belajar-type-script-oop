// ==================================================================
// OOP 19 — ERROR HANDLING
// ==================================================================
// Sumber: PDF "TypeScript Object Oriented Programming" hlm. 87-90
// (Error Handling). Semua klaim perilaku DIVERIFIKASI via
// tsc --strict --target esnext + tsx + Dart 3.11 dart analyze/run.
// Blok error terverifikasi: TS18046, RUNTIME uncaught Error.
// Temuan probe: catch (e) strict = unknown (wajib narrowing);
// throw string & catch tanpa binding tetap sah.

// ------------------------------------------------------------------
// (1) CUSTOM ERROR — CLASS TURUNAN Error (hlm. 88-89)
//
// PDF (hlm. 88): error handling TS sama seperti JavaScript —
// try catch, termasuk membuat class Error manual lewat class
// turunan dari Error. Kode hlm. 89 (screenshot "Validation
// Error") dibangun ulang: ValidationError membawa member TAMBAHAN
// (bidang) di samping bawaan Error (message, name, stack).
// Dua kunci pola: super(pesan) mengisi message, dan
// this.name = "ValidationError" membuat nama error tercetak
// benar (tanpa itu semua tercetak "Error").
//
// Jika di Dart seperti ini:
//     class ValidationError implements Exception {
//       final String bidang;
//       ValidationError(this.bidang, String pesan);
//       @override
//       String toString() => 'ValidationError: $pesan';
//     }
// di TypeScript jadi seperti ini:
//     class ValidationError extends Error {
//         constructor(public bidang: string, pesan: string) {
//             super(pesan);
//             this.name = "ValidationError";
//         }
//     }
// Dart IDIOMNYA implements Exception + toString; TS IDIOMNYA
// extends Error + this.name — keduanya class error kustom
// dengan member tambahan, tapi PERBEDAAN NYATA jalur idiomnya.
// ------------------------------------------------------------------

class ValidationError extends Error {
    constructor(
        public bidang: string,
        pesan: string,
    ) {
        super(pesan);   // isi message bawaan Error
        this.name = "ValidationError";
    }
}

function simpanUmur(umur: number): void {
    if (umur < 0) {
        throw new ValidationError("umur", "tidak boleh negatif");
    }
    console.log("disimpan:", umur);   // "disimpan: <umur>"
}

try {
    simpanUmur(-5);
} catch (e) {
    if (e instanceof ValidationError) {   // narrowing file 13!
        // TERTANGKAP: ValidationError | umur | tidak boleh negatif
        console.log(`TERTANGKAP: ${e.name} | ${e.bidang} | ${e.message}`);
    } else {
        console.log("error lain:", e);   // tak terjadi di run ini
    }
} finally {
    console.log("finally jalan");   // finally jalan
}

simpanUmur(20);   // skenario sukses — tak ada lemparan

// ------------------------------------------------------------------
// (2) TRY CATCH FINALLY — ALUR LENGKAP (hlm. 90)
//
// Alurnya: baris try yang melempar langsung lompat ke catch;
// finally SELALU jalan — sukses maupun gagal (kode hlm. 90
// screenshot). Warisan JS lain yang tetap sah: throw string
// (bukan Error) dan catch tanpa binding variabel.
// ------------------------------------------------------------------

function bagi19(a: number, b: number): number {
    if (b === 0) {
        throw new Error("pembagian nol");
    }
    return a / b;
}

try {
    console.log(bagi19(10, 2));   // 5 — jalan normal
} catch (e) {
    console.log("tak terjadi");   // cabang catch — try sukses
} finally {
    console.log("finally 1");   // selalu jalan
}

try {
    console.log(bagi19(10, 0));   // melempar di sini
    console.log("tak akan tercetak");   // tak tercetak (lompat)
} catch (e) {
    // tertangkap: pembagian nol
    console.log("tertangkap:", e instanceof Error && e.message);
} finally {
    console.log("finally 2");   // selalu jalan
}

try {
    throw "gagal total";   // string pun bisa — legacy JS
} catch (e) {
    console.log(typeof e, e);   // string gagal total
}

try {
    throw new Error("x");
} catch {   // tanpa binding: sah (kalau e tak dipakai)
    console.log("catch tanpa binding jalan");   // muncul persis
}

// ------------------------------------------------------------------
// (3) KODE ERROR — catch STRICT unknown + UNCAUGHT
//
// Di mode strict, variabel catch bertipe unknown (bukan any) —
// persis gerbang file 13: wajib narrowing sebelum memakai.
// Dan throw yang tak pernah tertangkap = program crash dengan
// pesan "<NamaError>: <pesan>" — this.name terbawa sampai akhir
// (demo runtime: blok paling akhir file — sengaja di sana karena
// throw top-level membuat kode SETELAHNYA unreachable, dan di
// area unreachable tsc menonaktifkan narrowing catch — penemuan
// probe, repro tersendiri).
// ------------------------------------------------------------------

// try {
//     throw new ValidationError("umur", "negatif");
// } catch (e) {
//     console.log(e.bidang);
// }
// ❌ ERROR kalau di-uncomment:
//    error TS18046: 'e' is of type 'unknown'.
//    (catch strict = unknown — sempitkan dulu: e instanceof
//    ValidationError, lihat sub-section 1)
//
// Catatan Dart (terverifikasi dart analyze + run): PERBEDAAN
// NYATA — Dart punya on-clause yang TS tidak punya: `} on
// ValidationErrorD catch (e) {` menangkap HANYA tipe itu (TS:
// satu catch + if instanceof). finally PERSIS sama selalu jalan;
// `rethrow` melempar lanjut (TS juga punya rethrow — `throw e`).
// Konvensi Dart memisahkan Exception (recoverable, idiom
// kustom kita) vs Error (fatal programmer). Bonus: catch (e)
// yang tak memakai e memicu warning unused_catch_clause —
// tulis `on ValidationErrorD { rethrow; }` tanpa catch.
// ------------------------------------------------------------------

// ==================================================================
// RANGKUMAN
// ==================================================================
// 1. Custom error (hlm. 88-89): class turunan Error + super(pesan)
//    mengisi message + this.name mengatur nama tercetak; member
//    tambahan (bidang) bebas — diakses lewat narrowing.
// 2. Dart idiomnya implements Exception + toString; TS idiomnya
//    extends Error + this.name — PERBEDAAN NYATA jalur idiom,
//    tujuan sama: class error kustom ber-member tambahan.
// 3. try-catch-finally (hlm. 90): baris yang melempar lompat ke
//    catch; finally SELALU jalan. throw string & catch tanpa
//    binding tetap sah (warisan JS).
// 4. Mode strict: catch (e) = unknown — akses member tanpa
//    narrowing = TS18046; obatnya e instanceof (file 13).
// 5. PERBEDAAN NYATA: Dart punya on-clause per-tipe (TS: if
//    instanceof manual); rethrow tersedia di keduanya; Exception
//    vs Error di Dart dipisah konvensinya (recoverable vs fatal).
//
// Cara menjalankan file ini: npx tsx src/19_error_handling.tsx

// ==================================================================
// LATIHAN (+ JAWABAN)
// ==================================================================

// 1. Buat class SaldoError extends Error dengan property kurang
//    (number). Buat function tarik(saldo, jumlah) yang melempar
//    SaldoError kalau jumlah > saldo, lalu tangkap dan cetak
//    kurangnya.
//
// JAWABAN: (akhiran Latihan = penanda kode jawaban — file 13)
class SaldoErrorLatihan extends Error {
    constructor(
        public kurang: number,
        pesan: string,
    ) {
        super(pesan);
        this.name = "SaldoErrorLatihan";
    }
}

function tarikLatihan(saldo: number, jumlah: number): number {
    if (jumlah > saldo) {
        throw new SaldoErrorLatihan(
            jumlah - saldo,
            "saldo tidak cukup",
        );
    }
    return saldo - jumlah;
}

try {
    console.log(tarikLatihan(100, 30));   // 70
    console.log(tarikLatihan(100, 150));   // melempar
} catch (e) {
    if (e instanceof SaldoErrorLatihan) {
        // kurang Rp50 — saldo tidak cukup
        console.log(`kurang Rp${e.kurang} — ${e.message}`);
    }
}

// 2. Konversi Dart → TypeScript! Diberi kode Dart:
//        class LoginError implements Exception {
//          final String alasan;
//          LoginError(this.alasan);
//          @override
//          String toString() => 'LoginError: $alasan';
//        }
//        void main() {
//          try {
//            throw LoginError('token kedaluwarsa');
//          } on LoginError catch (e) {
//            print(e.alasan);
//          }
//        }
//
// JAWABAN:
class LoginErrorLatihan extends Error {
    constructor(public alasan: string) {
        super(alasan);
        this.name = "LoginErrorLatihan";
    }
}

try {
    throw new LoginErrorLatihan("token kedaluwarsa");
} catch (e) {
    if (e instanceof LoginErrorLatihan) {   // ≈ on-clause Dart
        console.log(e.alasan);   // token kedaluwarsa
    }
}

// 3. Ramal-dulu: apa kata `npx tsc --noEmit` pada kode ini?
//        class DataError extends Error {
//            constructor(public kode: number) { super("x"); }
//        }
//        try {
//            throw new DataError(404);
//        } catch (e) {
//            console.log(e.kode);
//        }
//
// JAWABAN: ERROR TS18046 — "'e' is of type 'unknown'." — catch
//    strict menuntut narrowing. Versi perbaikan yang bisa
//    dijalankan:
class DataErrorLatihan extends Error {
    constructor(public kode: number) {
        super("x");
        this.name = "DataErrorLatihan";
    }
}

try {
    throw new DataErrorLatihan(404);
} catch (e) {
    if (e instanceof DataErrorLatihan) {
        console.log(e.kode);   // 404 — sudah menyempit
    }
}

// Blok runtime uncaught — sengaja PALING AKHIR file (throw
// top-level membuat kode setelahnya unreachable; di akhir file
// tak ada yang dirugikan — tsc tetap bersih):
// throw new ValidationError("umur", "lempar tanpa try");
// ❌ ERROR RUNTIME kalau di-uncomment (tsc --noEmit DIAM):
//    ValidationError: lempar tanpa try
//    (uncaught = crash program; nama + pesan persis this.name
//    dan super(pesan) yang kita atur di sub-section 1)
