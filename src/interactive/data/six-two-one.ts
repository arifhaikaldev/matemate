import type { Lesson } from '../types'

const sixTwoOne: Lesson = {
  id: '6.2.1',
  title: 'Apakah persamaan linear dalam dua pemboleh ubah?',
  pages: [
    // PAGE 1 — HOOK: Dual slider books
    {
      id: '6.2.1-1',
      type: 'hook-dual-slider',
      instruction:
        'Anda mempunyai dua jenis buku. Jumlah keseluruhan buku ialah 7. Jika bilangan novel berubah, adakah bilangan buku cerita juga perlu berubah?',
      quantityLabel1: 'Novel',
      quantityLabel2: 'Buku Cerita',
      totalLabel: 'Jumlah',
      sliderMin: 0,
      sliderMax: 7,
      sliderDefault: 1,
      relationshipType: 'sum',
      totalValue: 7,
    },
    // PAGE 2 — TRY: Yes/No total check
    {
      id: '6.2.1-2',
      type: 'try-yes-no',
      instruction:
        'Perhatikan pasangan berikut: (1,6), (2,5), (3,4), (4,3).',
      yesNoQuestion: 'Apakah jumlahnya sentiasa sama?',
      choices: [
        { id: 'yes', label: 'Ya, sentiasa 7' },
        { id: 'no', label: 'Tidak, berbeza' },
      ],
      correctChoiceId: 'yes',
    },
    // PAGE 3 — REVEAL: Two-variable equation mapping
    {
      id: '6.2.1-3',
      type: 'reveal-two-variable',
      instruction:
        'Klik setiap simbol untuk memahami maksudnya dalam persamaan ini.',
      equation: 'x + y = 7',
      variableMeanings: [
        { symbol: 'x', meaning: 'Bilangan novel' },
        { symbol: 'y', meaning: 'Bilangan buku cerita' },
        { symbol: '+', meaning: 'Ditambah' },
        { symbol: '=', meaning: 'Kedua-dua belah sama nilai' },
        { symbol: '7', meaning: 'Jumlah keseluruhan buku' },
      ],
    },
    // PAGE 4 — FORMALISM: Sort cards
    {
      id: '6.2.1-4',
      type: 'formalism-sort',
      instruction:
        'Persamaan linear dalam dua pemboleh ubah ialah persamaan yang mempunyai dua pemboleh ubah dan kuasa setiap pemboleh ubah ialah 1.\n\nYang manakah persamaan linear dalam dua pemboleh ubah?',
      sortItems: [
        { id: 'eq1', latex: '3p - q = 6', label: '3p - q = 6' },
        { id: 'eq2', latex: 'x + y = 7', label: 'x + y = 7' },
        { id: 'eq3', latex: 'x^2 + y = 7', label: 'x² + y = 7' },
        { id: 'eq4', latex: 'xy = 7', label: 'xy = 7' },
        { id: 'eq5', latex: '2x + 3y = 12', label: '2x + 3y = 12' },
      ],
      sortCategories: [
        { id: 'linear', label: 'Linear (dua pemboleh ubah)' },
        { id: 'bukan-linear', label: 'Bukan Linear' },
      ],
      correctMap: {
        eq1: 'linear',
        eq2: 'linear',
        eq3: 'bukan-linear',
        eq4: 'bukan-linear',
        eq5: 'linear',
      },
      incorrectFeedback:
        'Perhatikan: ada berapa pemboleh ubah? Apakah kuasa setiap pemboleh ubah?',
    },
    // PAGE 5 — PRACTICE: Identify and explain
    {
      id: '6.2.1-5',
      type: 'formalism-sort',
      instruction:
        'Klasifikasikan persamaan berikut dan kenal pasti pemboleh ubahnya:',
      sortItems: [
        { id: 'v1', latex: '3p - q = 6', label: '3p - q = 6' },
        { id: 'v2', latex: '2x + 3y = 12', label: '2x + 3y = 12' },
        { id: 'v3', latex: 'x^2 + y = 5', label: 'x² + y = 5' },
        { id: 'v4', latex: 'xy = 7', label: 'xy = 7' },
      ],
      sortCategories: [
        { id: 'linear', label: 'Linear (dua pemboleh ubah)' },
        { id: 'bukan-linear', label: 'Bukan Linear' },
      ],
      correctMap: {
        v1: 'linear',
        v2: 'linear',
        v3: 'bukan-linear',
        v4: 'bukan-linear',
      },
      meaningQuestion: 'Terangkan maksud x + y = 7 dalam bahasa biasa.',
      meaningChoices: [
        { id: 'a', label: 'Bilangan x ditambah bilangan y sentiasa menghasilkan 7' },
        { id: 'b', label: 'x dan y ialah 7' },
        { id: 'c', label: 'x darab y sama dengan 7' },
        { id: 'd', label: 'x dan y berbeza 7' },
      ],
      meaningAnswer: 'a',
    },
    // PAGE 6 — MASTERY: Meaning check
    {
      id: '6.2.1-6',
      type: 'mastery-explain',
      instruction:
        'Jawab soalan berikut untuk menguji pemahaman anda:',
      masteryQuestion:
        'Mengapakah x + y = 7 boleh mempunyai lebih daripada satu pasangan nilai?',
      masteryChoices: [
        { id: 'a', label: 'Kerana nilai x dan y yang berbeza masih boleh memberikan jumlah yang sama' },
        { id: 'b', label: 'Kerana x dan y ialah nombor yang sama' },
        { id: 'c', label: 'Kerana persamaan tidak lengkap' },
        { id: 'd', label: 'Kerana 7 boleh dibahagi dengan banyak nombor' },
      ],
      masteryCorrectId: 'a',
    },
  ],
}

export default sixTwoOne