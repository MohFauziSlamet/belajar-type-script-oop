# AGENTS.md — Memori Proyek Belajar TypeScript OOP

## Tujuan
Repositori ini adalah **proyek belajar TypeScript Object Oriented Programming**
pemilik akun dengan bantuan AI — kelanjutan kelas Dasar (repo sejajar
`../belajar-type-script-dasar/`, 34 file, SELESAI). Kurikulum mengikuti materi
**"TypeScript Object Oriented Programming" oleh Eko Kurniawan Khannedy
(Programmer Zaman Now)** — sumber: `docs/TypeScript Object Oriented
Programming.pdf` (96 halaman). Bahasa komunikasi utama: **Bahasa Indonesia**.

## Cara AI Membantu (Pedoman)
- **MEMORI VAULT (WAJIB dibaca di awal sesi)**:
  `/Users/user/flywheel-vault/projects/belajar-type-script-oop/memory.md`
  (profil user, kamus Dart → TypeScript OOP, progres, log sesi).
  Kamus lengkap kelas Dasar ada di vault `belajar-type-script-dasar`.
- User = Flutter developer mahir Dart, TypeScript dasar SELESAI. Jelaskan
  konsep baru selalu dengan format "Jika di Dart seperti ini → di TypeScript
  jadi seperti ini" (jangan pakai kata "padanan").
- Bertindak sebagai **tutor**: jelaskan konsep singkat & jelas, lalu beri
  contoh kode. Jangan hanya memberi jawaban.
- Saat ada error TypeScript, jelaskan *penyebab* dan *cara memperbaikinya*.
- Verifikasi bertingkat: probe klaim SEBELUM menulis (termasuk klaim negatif),
  klaim sisi Dart diverifikasi `dart analyze`/`dart run` (fvm:
  `~/fvm/default/bin/dart`), kutipan error diverifikasi via simulasi uncomment
  di file FINAL, lalu jalankan output satu per satu. `tsx` hanya transpile,
  TIDAK type-check — selalu `npx tsc --noEmit`.
- Setelah tiap file baru selesai: kirim subagent review untuk **file baru
  saja** (bukan keseluruhan materi) — pola 2 subagent (eksekusi + struktur).
- Unit test di `tests/` OPSIONAL.

## Tech Stack & Konfigurasi
- **Runtime**: Node.js, ESM (`"type": "module"`)
- **TypeScript** ^5.9.3, **tsconfig** mode ketat (`strict: true`);
  `noUncheckedIndexedAccess` & `exactOptionalPropertyTypes` dimatikan sengaja
  (mewarisi keputusan kelas Dasar — komentar alasan di tsconfig)
- **tsx** (devDependency): jalankan file TS langsung
- **Testing**: Jest ^30 + Babel (`--passWithNoTests` selama belum ada test)
- Ekstensi file sumber pakai `.tsx` (konvensi proyek), isi bukan React JSX

## Perintah Penting
| Tujuan | Perintah |
|---|---|
| Jalankan file materi langsung | `npx tsx src/NN_topik.tsx` |
| Type-check tanpa emit | `npx tsc --noEmit` |
| Jalankan semua unit test | `npm test` |
| Kompilasi ke `dist/` | `npx tsc` |

## Konvensi File
- Implementasi: `src/<nomor>_<nama>.tsx`, gaya define-then-print dengan
  struktur WAJIB berurutan:
  1. Banner judul 3 baris + referensi PDF (halaman)
  2. Sub-section `------` bernomor `(1) (2) ...` → penjelasan → kode → cetak
  3. Banner RANGKUMAN 3 baris (poin sebagai komentar)
  4. Banner LATIHAN (+ JAWABAN) 3 baris — tiap soal langsung disertai jawaban
  5. Trailer `// Cara menjalankan file ini: npx tsx src/NN_....tsx` —
     TEPAT SATU kali, di akhir RANGKUMAN (bukan di header!)
- Blok error: baris kode terkomentar MURNI (tanpa panah `←` inline) +
  baris `// ❌ ERROR kalau di-uncomment:` terpisah berisi kode+pesan verbatim
- Test (opsional): `tests/<nama>.test.ts`, import path relatif

## Peta Kurikulum & Progres
Legenda: [x] selesai · [ ] belum. Setup project (hlm. 12-18) DILEWATI.

- [x] Pengenalan OOP & Class — OOP/objek/class, OOP di TS, `class`/`new`/field bertipe/default, method+`this`, TS2564+TS2663 (hlm. 5-11, 19-21) → `src/1_pengenalan_oop.tsx`
- [x] Constructor (hlm. 22-24) → `src/2_constructor.tsx`
- [x] Properties & Default Value (hlm. 25-29) → `src/3_properties.tsx`
- [x] Method — lebih dalam (hlm. 30-32; dasar method+this sudah di file 1) → `src/4_method.tsx`
- [x] Getter dan Setter — `get`/`set` accessor (hlm. 33-35) → `src/5_getter_setter.tsx`
- [x] Inheritance — `extends` (hlm. 36-38) → `src/6_inheritance.tsx`
- [x] Interface Inheritance & `implements` (hlm. 39-42) → `src/7_interface.tsx`
- [x] Super Constructor (hlm. 43-45) → `src/8_super_constructor.tsx`
- [x] Method Overriding (hlm. 46-48) → `src/9_method_overriding.tsx`
- [x] Super Method (hlm. 49-51) → `src/10_super_method.tsx`
- [x] Visibility — `public`/`private`/`protected` (+ catatan Dart: underscore `_`) (hlm. 52-56) → `src/11_visibility.tsx`
- [x] Parameter Properties — `constructor(private nama: string)` (hlm. 57-59) → `src/12_parameter_properties.tsx`
- [x] Operator `instanceof` (+ `typeof` tak cukup utk objek; structural vs nominal) (hlm. 60-63) → `src/13_instanceof.tsx`
- [x] Polymorphism — class/method polymorphism (hlm. 64-69) → `src/14_polymorphism.tsx`
- [x] Type Cast — `as` pada class, salah-cast (hlm. 70-74) → `src/15_type_cast.tsx`
- [x] Abstract Class (hlm. 75-78) → `src/16_abstract_class.tsx`
- [x] Static — properties & method (+ perlu diingat) (hlm. 79-83) → `src/17_static.tsx`
- [x] Class Relationship (hlm. 84-86) → `src/18_class_relationship.tsx`
- [x] Error Handling — `extends Error`, try-catch (hlm. 87-90) → `src/19_error_handling.tsx`
- [x] Namespace (hlm. 91-94) → `src/20_namespace.tsx`
- Materi berikutnya (hlm. 95-96): Generic → Decorator (kelas lanjutan)

## Latihan Review Materi
Dibuat sesi 68 (konsep latihan repo dasar). 20 program = 4 level × 5,
cakupan materi 1-20 lengkap (setiap materi ≥1×; e5 = integrasi).

| Level | Folder | Status |
|---|---|---|
| Beginner (materi 1-4) | `src/latihan/beginner/b1..b5_*.tsx` | ✅ |
| Middle (materi 5-10) | `src/latihan/middle/m1..m5_*.tsx` | ✅ |
| Advance (materi 11-16) | `src/latihan/advance/a1..a5_*.tsx` | ✅ |
| Expert (materi 17-20 + integrasi) | `src/latihan/expert/e1..e5_*.tsx` | ✅ |

Konvensi file latihan (penyimpangan sadar dari file materi):
- Nama `<level><nomor>_<nama>.tsx` (bukan `NN_`); identifier class/method
  Indonesia seperti file materi; TANPA trailer "Cara menjalankan".
- Struktur 4 blok: banner 3 baris (JUDUL + MATERI: n) → SOAL
  (wajib ada sub-soal "RAMAL DULU", tanpa membocorkan jawaban) →
  JAWABAN (define-then-print; tiap console.log berprediksi jujur
  hasil run nyata) → RANGKUMAN tepat 3 poin.
- No-lompat: hanya materi 1-20 + fondasi repo dasar; DILARANG
  Generic/Decorator/async/map-filter-reduce-sort/Math.random
  (agregasi pakai loop).
- Blok error terkomentar + `// ❌ ERROR ...` verbatim (probe tsc
  dengan konfigurasi proyek `--strict --target esnext ...`);
  blok RUNTIME (tsc diam + crash) PALING AKHIR file.
- Tiap level: verifikasi (tsc + tsx per file + simulasi uncomment
  dinamis + grep konvensi) + review 2 subagent (eksekusi &
  struktur) + tindak lanjut semua temuan.

## Catatan Tambahan
- Repo ini DIPISAHKAN dari `../belajar-type-script-dasar/` pada 2026-08-29
  (sesi 44) atas permintaan user — sebelumnya sempat berupa subfolder
  `src/oop/` di repo dasar (sesi 42-43).
- Untuk membaca PDF, ekstrak via `pypdf` (`python3 -c "from pypdf import
  PdfReader; ..."`); banyak kode contoh buku berupa screenshot yang tidak
  terekstrak — materi dibangun dari praktik standar + verifikasi penuh.
- `dist/` berisi hasil kompilasi (jangan edit manual).
