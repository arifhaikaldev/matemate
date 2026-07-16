# Product Requirements Document (PRD)
## PWA Pembelajaran — Matematik Tingkatan 4 KSSM
### MVP Version 1.1

---

## 1. Overview

**Product name (working title):** MateMate T4 (nama boleh ditukar)

**Product type:** Progressive Web App (PWA) — installable, mobile-first, boleh diakses secara offline selepas load pertama.

**Bahasa:** Bahasa Melayu (utama), mengikut istilah KSSM rasmi.

**Scope of content:** Matematik Tingkatan 4 KSSM. Bab & subtopik **tidak ditentukan dalam PRD ini** — kandungan diisi sendiri mengikut struktur template yang disediakan (lihat Bahagian 6). Ini bermakna app boleh digunakan untuk mana-mana bab, dan bab/subtopik baru boleh ditambah tanpa ubah kod.

**Core loop:** Pelajar pilih subtopik → baca nota ringkas → jawab kuiz (self-paced, tiada had masa) → dapat penjelasan segera untuk setiap soalan → sistem beri cadangan latihan susulan berdasarkan keputusan.

**Why this matters:** Pelajar sering belajar melalui nota/modul PDF statik tanpa maklum balas segera. Alat yang beri maklum balas segera + cadangan latihan yang tertumpu (bukan generik) boleh menutup jurang pemahaman lebih cepat.

---

## 2. Problem Statement

- Pelajar Tingkatan 4 kebanyakannya belajar melalui nota/modul PDF statik dan tiada maklum balas segera bila buat latihan.
- Guru tiada masa untuk semak kerja setiap pelajar secara individu dan cadangkan latihan yang spesifik kepada kelemahan masing-masing.
- Banyak apps sedia ada terlalu umum (cover semua subjek/tingkatan) dan tidak fokus kepada keperluan padat untuk satu bab/subtopik.
- Akses internet tidak konsisten di sesetengah kawasan → perlu keupayaan offline.

---

## 3. Goals & Success Metrics (MVP)

| Goal | Metric (MVP target) |
|---|---|
| Pelajar boleh belajar & buat kuiz satu subtopik tanpa bantuan guru | ≥70% pelajar uji siapkan kesemua subtopik yang diisi |
| Maklum balas membantu pemahaman | ≥60% pelajar tunjuk peningkatan skor pada attempt kedua kuiz yang sama subtopik |
| App boleh digunakan offline | 100% kandungan (nota, soalan, penjelasan) boleh diakses tanpa internet selepas install pertama |
| App installable sebagai PWA | Lulus Lighthouse PWA audit (installable, offline-capable) |
| Kandungan mudah ditambah/dikemaskini | Tambah subtopik baru = tambah 1 fail kandungan, tiada perubahan kod |

**Out of scope for success metrics:** engagement jangka panjang, retention berbulan, monetisasi — ini MVP untuk validasi konsep sahaja.

---

## 4. Target Users

- **Primary:** Pelajar Tingkatan 4 di Malaysia yang belajar Matematik KSSM, self-study atau revision di rumah.
- **Secondary (future, bukan MVP):** Guru yang mahu assign topik ini sebagai homework/revision.

**Assumption:** Pengguna primer guna telefon pintar (Android majoriti), kadangkala tablet/laptop. Reka bentuk mesti mobile-first.

---

## 5. MVP Scope — Functional Requirements

### 5.1 Content Structure (Generic — tidak terikat kepada bab tertentu)

Setiap **subtopik** adalah satu unit kandungan berasingan, terdiri daripada:
- **Nota ringkas** (teks + rajah/graf statik, contoh kerja/worked example)
- **Kuiz** (bilangan soalan fleksibel — tiada had ditetapkan, bergantung kepada berapa banyak soalan diisi dalam fail kandungan)
- **Penjelasan per-soalan** (muncul selepas jawab, sama ada betul/salah)

Bilangan subtopik dan bilangan soalan per subtopik **ditentukan oleh sesiapa yang isi kandungan**, bukan hardcoded dalam app. App hanya baca apa sahaja yang ada dalam fail kandungan dan papar mengikutnya.

### 5.2 User Flow (MVP)

1. **Halaman Utama (Home)** — senarai subtopik (mengikut apa yang ada dalam kandungan) dengan status (belum mula / sedang belajar / selesai) dan skor terakhir.
2. **Halaman Nota** — pelajar baca nota subtopik sebelum kuiz. Butang "Mula Kuiz".
3. **Halaman Kuiz** — soalan satu per satu (atau senarai scrollable), pelajar pilih jawapan. **Self-paced, tiada timer/had masa.**
4. **Halaman Penjelasan (per soalan)** — sebaik jawab, papar sama ada betul/salah + penjelasan langkah demi langkah secara animasi: setiap langkah (dari field `langkah`) muncul satu per satu menggunakan CSS transition, sambil Web Speech API (TTS) membaca teks `penjelasan` secara automatik, disinkronkan dengan `boundary` event. Jika field `audio_file` hadir dalam data soalan, audio pra-rakaman tersebut digunakan sebagai ganti TTS. Pelajar boleh maju ke langkah seterusnya secara manual (tap/klik) dan **boleh toggle mute untuk matikan/hidupkan suara** (confirmed).
5. **Halaman Keputusan (Result Summary)** — skor keseluruhan subtopik + ringkasan umum sub-kemahiran yang lemah (confirmed: papar nama sub-kemahiran yang gagal sahaja, bukan pecahan statistik terperinci). Tiada perlu paparan graf/table mendalam — mesej ringkas sudah mencukupi untuk MVP.
6. **Cadangan Latihan (Recommendation)** — berdasarkan keputusan, sistem cadangkan:
   - Ulang kuiz subtopik yang sama (jika skor rendah), ATAU
   - Set latihan tambahan fokus kepada sub-kemahiran lemah, ATAU
   - Teruskan ke subtopik seterusnya (jika skor tinggi).

### 5.3 Feature List (must-have for MVP)

| # | Feature | Priority |
|---|---|---|
| F1 | Paparan nota per subtopik (teks + imej/rajah statik) | Must |
| F2 | Kuiz aneka pilihan per subtopik (bilangan soalan fleksibel, ditentukan oleh kandungan) | Must |
| F3 | Penjelasan jawapan per soalan (betul & salah) | Must |
| F4 | Skor & ringkasan keputusan per subtopik — papar skor keseluruhan + senarai ringkas sub-kemahiran yang lemah (confirmed: ringkasan umum sahaja, bukan breakdown statistik terperinci) | Must |
| F5 | Logik cadangan latihan berdasarkan keputusan (rule-based, bukan AI) | Must |
| F6 | Simpan progress pelajar secara lokal (localStorage/IndexedDB) | Must |
| F7 | PWA: installable + berfungsi offline (service worker, cache assets & data) | Must |
| F8 | Navigasi mudah antara subtopik | Must |
| F9 | Responsive design (mobile-first) | Must |
| F10 | Reset/retry kuiz | Should |
| F11 | Progress bar keseluruhan bab | Should |
| F12 | Dark mode | Could |
| F13 | Timer/had masa kuiz | **Tidak diperlukan (confirmed)** |
| F14 | Rajah/graf interaktif | **Out of scope MVP — statik dahulu (confirmed), interaktif boleh v2** |
| F15 | Akaun pengguna / login / sync antara peranti | **Out of scope (v2)** |
| F16 | Backend server / database | **Out of scope (v2)** — MVP guna local storage sahaja |
| F17 | Penjelasan animasi langkah-demi-langkah + suara (TTS) — setiap langkah dalam `langkah` dipapar secara berurutan dengan animasi CSS, dibacakan secara automatik menggunakan Web Speech API (TTS on-device), disinkronkan menggunakan `boundary` event. Termasuk **butang toggle mute** (confirmed) untuk pelajar matikan/hidupkan semula suara. Jika suara `ms-MY` tidak tersedia pada peranti, ciri suara dinon-aktifkan sepenuhnya secara automatik. Field `audio_file` opsyenal boleh menggantikan TTS dengan audio pra-rakaman jika kualiti lebih baik diperlukan kemudian. | Should |
| F18 | Video penjelasan per soalan | **Tidak diperlukan (confirmed)** — video fail besar (3–10MB/soalan) menyebabkan masalah offline PWA cache dan memerlukan pengeluaran konten per-soalan yang tidak skala dengan model JSON |

---

## 6. Content Schema — "Container" untuk Diisi

Ini bahagian paling penting untuk operasi: **struktur/template kandungan** supaya sesiapa boleh isi nota dan soalan tanpa perlu tulis kod.

### 6.1 Struktur fail

Satu fail JSON = satu subtopik. Contoh nama fail: `content/subtopik-01.json`

```json
{
  "id": "subtopik-01",
  "tajuk_subtopik": "",
  "nota": [
    {
      "tajuk": "",
      "kandungan": "",
      "imej": "",
      "contoh": ""
    }
  ],
  "soalan": [
    {
      "id": "s1",
      "soalan": "",
      "pilihan": ["", "", "", ""],
      "jawapan_betul": 0,
      "penjelasan": "",
      "langkah": ["", "", ""],
      "audio_file": "",
      "sub_kemahiran": "",
      "imej": ""
    }
  ]
}
```

### 6.2 Penerangan setiap field

**Bahagian `nota`** (array — boleh ada seberapa banyak section yang perlu):
| Field | Wajib? | Penerangan |
|---|---|---|
| `tajuk` | Ya | Heading kecil untuk section nota (contoh: "Definisi") |
| `kandungan` | Ya | Teks dalam format Markdown ringkas (boleh guna **bold**, senarai, dsb) |
| `imej` | Tidak | Path/nama fail imej rajah/graf statik (kosongkan `""` jika tiada) |
| `contoh` | Tidak | Worked example, juga dalam Markdown |

**Bahagian `soalan`** (array — bilangan soalan bebas, tiada had):
| Field | Wajib? | Penerangan |
|---|---|---|
| `id` | Ya | ID unik untuk soalan (contoh: "s1", "s2") |
| `soalan` | Ya | Teks soalan |
| `pilihan` | Ya | Array pilihan jawapan (aneka pilihan — cadang 4 pilihan, tapi boleh 3–5) |
| `jawapan_betul` | Ya | Index (0-based) pilihan yang betul dalam array `pilihan` |
| `penjelasan` | Ya | Penjelasan keseluruhan dalam satu teks (digunakan sebagai input TTS — Web Speech API membaca teks ini secara automatik) |
| `langkah` | Ya | Array langkah-langkah penyelesaian (contoh: `["Cari domain dahulu", "Gantikan x=2", "Jawapan: f(2) = 5"]`) — setiap langkah dipapar satu per satu secara animasi pada Halaman Penjelasan |
| `audio_file` | Tidak | Path fail audio pra-rakaman (contoh: `"audio/s1.mp3"`) — jika hadir, menggantikan TTS untuk soalan ini. Kosongkan `""` atau ketinggalkan field jika tidak ada. |
| `sub_kemahiran` | Ya | Tag ringkas untuk kumpulkan soalan ikut kemahiran (digunakan oleh logik cadangan di Bahagian 7) — contoh: "kira_nilai", "konsep_asas" |
| `imej` | Tidak | Path imej jika soalan perlukan rajah/graf |

### 6.3 Cara tambah kandungan baru

1. Salin template di atas → satu fail JSON baru per subtopik.
2. Isi `tajuk_subtopik`, section-section `nota`, dan senarai `soalan` — tiada had bilangan.
3. Letak fail dalam folder `content/` app.
4. Tambah entri fail ini dalam satu senarai index (contoh: `content/index.json` — senarai semua subtopik yang app patut papar di Home). App baca index ini untuk tahu subtopik apa yang ada. **Susunan subtopik di Home mengikut susunan dalam `index.json`** (confirmed: tiada peraturan urutan khusus — pengisi kandungan bebas susun mengikut keperluan pedagogi).
5. Tiada perlu ubah kod app — app automatik papar subtopik/soalan baru selepas fail ditambah.

Ini bermakna anda (atau sesiapa isi kandungan) hanya perlu kerja dengan fail JSON/teks — tak perlu sentuh logik program.

---

## 7. Recommendation Logic (Rule-Based, MVP)

MVP tidak memerlukan AI/ML — cukup logik berasaskan peraturan mudah menggunakan skor per **sub-kemahiran** (guna tag `sub_kemahiran` daripada Bahagian 6.2).

**Contoh peraturan:**

- Jika skor keseluruhan subtopik ≥ 80% → cadang: "Teruskan ke subtopik seterusnya."
- Jika skor 50–79% → cadang: "Buat semula soalan pada sub-kemahiran yang lemah: [senarai sub-kemahiran dengan skor <60%]."
- Jika skor < 50% → cadang: "Baca semula nota subtopik ini, kemudian cuba kuiz semula."
- Jika satu sub-kemahiran spesifik konsisten salah → cadang latihan tertumpu untuk sub-kemahiran itu sahaja (guna soalan lain dengan tag sub-kemahiran yang sama, jika ada).

Logik ini jalan sepenuhnya di client-side (tiada backend diperlukan) sebab semua data (soalan + tag) sudah ada dalam fail kandungan.

---

## 8. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Platform** | PWA — boleh dibuka di browser mobile/desktop, boleh "Add to Home Screen" |
| **Offline** | Service worker cache semua asset (HTML/CSS/JS) + kandungan (fail JSON, imej, fail audio `audio_file` jika ada) selepas load pertama. TTS (Web Speech API) berfungsi sepenuhnya tanpa internet kerana diproses on-device — ini kelebihan utama berbanding video atau audio pra-muat. |
| **Performance** | First load < 3s pada 3G; interaksi kuiz responsif (< 100ms) |
| **Data storage** | Semua progress disimpan secara lokal (IndexedDB/localStorage) — tiada akaun/login di MVP |
| **Bahasa** | Bahasa Melayu sepenuhnya (UI + kandungan) |
| **Rajah/Graf** | Imej statik untuk MVP (PNG/SVG); interaktif ditangguh ke v2 |
| **Suara/Audio** | TTS (Web Speech API) digunakan secara lalai — berfungsi offline, sifar saiz storan tambahan. Kualiti suara bergantung pada peranti (iOS Safari lebih baik dari Android/Chrome). **Fallback jika suara `ms-MY` tidak tersedia pada peranti: nyahaktifkan (disable) ciri suara sepenuhnya — animasi langkah tetap berjalan tanpa audio (confirmed).** Fail `audio_file` opsyenal boleh di-cache oleh service worker jika hadir, tapi **tidak wajib untuk MVP**. |
| **Accessibility** | Saiz teks boleh baca di skrin kecil, kontras warna mencukupi |
| **Browser support** | Chrome & Safari mobile (majoriti pengguna Malaysia) |
| **Privacy** | Tiada data peribadi dikumpul di MVP (tiada login = tiada PII) |

---

## 9. Tech Stack Suggestion (non-binding)

- **Frontend:** React (atau Vue/Svelte) + service worker (Workbox) untuk keupayaan PWA
- **Content storage:** Fail JSON statik (lihat Bahagian 6) untuk nota dan soalan — mudah dikemaskini tanpa backend
- **Markdown rendering:** Library ringan (contoh: `marked` atau `react-markdown`) untuk render field `kandungan`/`contoh`
- **Animasi penjelasan:** CSS transitions asas (tiada library tambahan diperlukan untuk MVP) untuk papar langkah dalam `langkah` satu per satu; timing boleh menggunakan `setTimeout` atau dikawal oleh event TTS
- **Text-to-Speech:** Web Speech API (`window.speechSynthesis`) — built-in dalam browser, sifar fail tambahan, berfungsi offline on-device. Tetapkan `lang: "ms-MY"` pada `SpeechSynthesisUtterance`; **jika suara `ms-MY` tidak tersedia pada peranti, disable ciri suara sepenuhnya** (animasi langkah tetap jalan tanpa audio — confirmed). **Sinkronkan animasi langkah dengan `boundary` event TTS** (confirmed) supaya setiap langkah dalam `langkah` dipapar seiring dengan sebutan — bukan jeda masa tetap. Jika `audio_file` hadir dalam data soalan, guna `HTMLAudioElement` sebagai ganti TTS.
- **State/progress:** IndexedDB (via library ringan seperti Dexie.js) atau localStorage untuk skop kecil MVP
- **Hosting:** Static hosting (Vercel/Netlify/GitHub Pages) — sesuai kerana tiada backend di MVP
- **Manifest:** `manifest.json` dengan ikon, nama app, `display: standalone`

---

## 10. Out of Scope for MVP

- Login/akaun pengguna & sync data merentasi peranti
- Backend server / database
- Timer/had masa kuiz
- Rajah/graf interaktif (statik dahulu)
- AI-generated explanation atau adaptive learning berasaskan ML
- Gamifikasi (badge, leaderboard)
- Analitik guru/dashboard guru
- Multi-bahasa (Bahasa Inggeris versi)
- Video penjelasan per soalan (confirmed out of scope — lihat F18; bertentangan dengan keperluan offline PWA dan model kandungan berasaskan JSON)
- Audio pra-rakaman per soalan (boleh ditambah kemudian via field `audio_file` opsyenal tanpa ubah seni bina — tapi bukan keperluan MVP)

---

## 11. Milestones (Cadangan)

| Fasa | Kandungan | Anggaran Masa |
|---|---|---|
| 1 | Bina template/schema kandungan (Bahagian 6) + isi 1 subtopik contoh | 2–3 hari |
| 2 | Build UI: Home, Nota, Kuiz, Keputusan | 1–2 minggu |
| 3 | Implement logik cadangan latihan (rule-based) | 3–5 hari |
| 4 | PWA setup: manifest, service worker, offline caching | 3–5 hari |
| 5 | Testing (pelbagai peranti) + isi kandungan penuh | 3–5 hari |

**Anggaran keseluruhan MVP:** ~3–4 minggu (solo/small team), tidak termasuk masa isi kandungan penuh (bergantung berapa banyak subtopik).

---

## 12. Risks & Assumptions

- **Andaian:** Kandungan (nota, soalan, penjelasan) akan diisi sendiri oleh pemilik produk mengikut template di Bahagian 6 — kualiti pedagogi kandungan bukan sesuatu yang PRD ini boleh jamin, tapi struktur memudahkan proses isi.
- **Andaian:** Bilangan imej/rajah statik per subtopik adalah **sedikit** (beberapa keping sahaja) — beban penyediaan aset imej dianggap rendah dan tidak menjadi kesesakan dalam proses pengeluaran kandungan.
- **Risiko:** Tanpa backend, progress hilang jika pelajar tukar peranti atau clear browser data — perlu dinyatakan jelas kepada pengguna (contoh: mesej "data disimpan di peranti ini sahaja").
- **Risiko:** Logik cadangan rule-based mungkin terlalu ringkas untuk kes tepi (contoh: pelajar random-guess). Boleh ditambah baik di v2.
- **Risiko:** Kalau bilangan soalan per subtopik sangat sedikit (contoh 2–3), logik cadangan sub-kemahiran kurang bermakna secara statistik — cadang minimum 5 soalan per subtopik untuk hasil yang lebih berguna (bukan had keras, sekadar cadangan).

---

## 13. Open Questions

Tiada soalan terbuka pada masa ini — semua soalan telah dijawab dan keputusan telah dicatatkan dalam bahagian berkenaan di atas.