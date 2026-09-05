// ========================================
// LATIHAN MIDDLE 3 — MEDIA PLAYER
// MATERI: 7 (INTERFACE INHERITANCE & IMPLEMENTS)
// ========================================
// Konsep: interface sebagai kontrak, implements, interface
//         extends interface (banyak), kontrak wajib penuh
// Program: MP3 & radio dengan kontrak pemutar media.

// ========================================
// SOAL
// ========================================
// 1. Buat interface Playable { putar(): string } dan interface
//    Berhenti { stop(): string }.
// 2. Buat interface MediaLengkap extends Playable, Berhenti yang
//    menambah jeda(): string — interface boleh extends BANYAK
//    interface (beda dengan class yang hanya satu).
// 3. Buat class Mp3Player implements MediaLengkap: implementasi
//    ketiga method → "MP3 memutar lagu", "MP3 berhenti",
//    "MP3 jeda".
// 4. Buat class RadioPlayer implements Playable saja →
//    "Radio memutar siaran". Cetak semua hasilnya.
// 5. RAMAL DULU: class VideoPlayer implements MediaLengkap yang
//    mengimplementasi putar dan jeda tapi KELUPAAN stop — error
//    apa yang muncul? (tebak kodenya DAN bagaimana compiler
//    menyebutkan method yang kurang)

// ========================================
// JAWABAN
// ========================================

// ------------------------------------------------------------------
// (1) KONTRAK + IMPLEMENTS.
//     (Jika di Dart seperti ini: class Mp3Player implements
//     MediaLengkap — dan setiap method wajib @override;
//     → di TypeScript jadi seperti ini: implements sama persis,
//     tapi TANPA penanda override sama sekali)
// ------------------------------------------------------------------
interface Playable {
  putar(): string;
}

interface Berhenti {
  stop(): string;
}

interface MediaLengkap extends Playable, Berhenti {
  jeda(): string;
}

class Mp3Player implements MediaLengkap {
  putar(): string {
    return "MP3 memutar lagu";
  }

  stop(): string {
    return "MP3 berhenti";
  }

  jeda(): string {
    return "MP3 jeda";
  }
}

class RadioPlayer implements Playable {
  putar(): string {
    return "Radio memutar siaran";
  }
}

const mp3M3 = new Mp3Player();
console.log(mp3M3.putar());    // MP3 memutar lagu
console.log(mp3M3.stop());     // MP3 berhenti
console.log(mp3M3.jeda());     // MP3 jeda
const radioM3 = new RadioPlayer();
console.log(radioM3.putar());  // Radio memutar siaran

// ------------------------------------------------------------------
// (2) JAWABAN RAMAL DULU — kontrak tak terpenuhi:
// ------------------------------------------------------------------
// class VideoPlayer implements MediaLengkap {
//     putar(): string { return "Video memutar"; }
//     jeda(): string { return "Video jeda"; }
// }
// ❌ ERROR kalau di-uncomment:
//    error TS2420: Class 'VideoPlayer' incorrectly implements
//    interface 'MediaLengkap'.
//    Property 'stop' is missing in type 'VideoPlayer' but
//    required in type 'MediaLengkap'.
//    (baris kedua menyebut method yang kurang PERSIS by name)
//
// Catatan Dart (terverifikasi dart analyze): lupa mengimplementasi
// member kontrak → non_abstract_class_inherits_abstract_member
// "Missing concrete implementations of ..."; di Dart kontrak juga
// bisa berupa abstract class, dan tiap implementasi dianotasi
// @override — di TS interface murni kontrak tanpa isi.

// ========================================
// RANGKUMAN
// ========================================
// - interface = kontrak; implements WAJIB memenuhi semua member
//   — kurang satu = TS2420 + baris penyebut nama member.
// - Class hanya bisa extends SATU; interface boleh extends BANYAK
//   interface.
// - Dart: kontrak via abstract class + @override; TS: interface
//   murni kontrak, implementasi tanpa penanda.
