import type { Lesson } from '../types'

const sixOneOne: Lesson = {
  id: '6.1.1',
  title: 'Apakah persamaan linear dalam satu pemboleh ubah?',
  pages: [
    // PAGE 1 — HOOK: Mystery box
    {
      id: '6.1.1-1',
      type: 'hook-mystery-box',
      instruction:
        'Ada satu kotak misteri. Kita tahu sebahagian daripada kandungannya, tetapi tidak tahu semuanya.',
      visibleCount: 5,
      totalCount: 12,
    },
    // PAGE 2 — TRY: Number blocks
    {
      id: '6.1.1-2',
      type: 'try-number-blocks',
      instruction:
        'Jika 5 ditambah dengan sesuatu nombor menghasilkan 12, apakah nombor itu?',
      visibleNumber: 5,
      correctAnswer: 7,
      maxNumber: 12,
    },
    // PAGE 3 — PREDICTION: Choose symbol
    {
      id: '6.1.1-3',
      type: 'prediction-symbol',
      instruction:
        'Bolehkah kita menggunakan satu simbol untuk mewakili nombor yang belum diketahui?',
      symbols: [
        { id: 'x', label: 'x' },
        { id: '5', label: '5' },
        { id: '12', label: '12' },
        { id: '=', label: '=' },
      ],
      correctId: 'x',
      feedbackLabel:
        'Kita perlukan sesuatu yang mewakili nombor yang belum diketahui.',
    },
    // PAGE 4 — CONCEPT REVEAL: Clickable equation parts
    {
      id: '6.1.1-4',
      type: 'reveal-concept',
      instruction:
        'x mewakili nombor yang belum kita ketahui. Klik setiap bahagian persamaan untuk memahami maksudnya.',
      equationParts: [
        {
          component: 'x',
          label: 'x',
          meaning: 'Nombor yang belum diketahui',
        },
        {
          component: '+',
          label: '+',
          meaning: 'Ditambah',
        },
        {
          component: '5',
          label: '5',
          meaning: 'Nilai yang diketahui, iaitu 5',
        },
        {
          component: '=',
          label: '=',
          meaning: 'Kedua-dua belah mempunyai nilai yang sama',
        },
        {
          component: '12',
          label: '12',
          meaning: 'Hasil keseluruhan ialah 12',
        },
      ],
    },
    // PAGE 5 — FORMALISM + PRACTICE: Sort cards
    {
      id: '6.1.1-5',
      type: 'formalism-sort',
      instruction:
        'Persamaan linear dalam satu pemboleh ubah ialah persamaan yang mempunyai satu pemboleh ubah dan kuasa pemboleh ubah tersebut ialah 1.\n\nYang manakah persamaan linear dalam satu pemboleh ubah?',
      sortItems: [
        { id: 'eq1', latex: '3x + 2 = 5', label: '3x + 2 = 5' },
        { id: 'eq2', latex: 'x - 8 = 2', label: 'x - 8 = 2' },
        { id: 'eq3', latex: '5x = 20', label: '5x = 20' },
        { id: 'eq4', latex: 'x^2 + 2 = 5', label: 'x² + 2 = 5' },
        { id: 'eq5', latex: 'xy + 2 = 5', label: 'xy + 2 = 5' },
      ],
      sortCategories: [
        { id: 'linear', label: 'Linear' },
        { id: 'bukan-linear', label: 'Bukan Linear' },
      ],
      correctMap: {
        eq1: 'linear',
        eq2: 'linear',
        eq3: 'linear',
        eq4: 'bukan-linear',
        eq5: 'bukan-linear',
      },
      incorrectFeedback:
        'Perhatikan: ada berapa pemboleh ubah? Apakah kuasa pemboleh ubah tersebut?',
    },
    // PAGE 6 — VARIATION + MASTERY CHECK
    {
      id: '6.1.1-6',
      type: 'variation-classify',
      instruction:
        'Klasifikasikan persamaan berikut sama ada linear dalam satu pemboleh ubah atau bukan:',
      sortItems: [
        { id: 'v1', latex: 'x + 5 = 10', label: 'x + 5 = 10' },
        { id: 'v2', latex: '2x = 14', label: '2x = 14' },
        { id: 'v3', latex: '3x - 4 = 11', label: '3x - 4 = 11' },
        { id: 'v4', latex: '7 = x + 2', label: '7 = x + 2' },
        { id: 'v5', latex: '10 - x = 4', label: '10 - x = 4' },
        { id: 'v6', latex: 'x^2 + 2 = 5', label: 'x² + 2 = 5' },
        { id: 'v7', latex: 'xy + 2 = 5', label: 'xy + 2 = 5' },
      ],
      sortCategories: [
        { id: 'linear', label: 'Linear (satu pemboleh ubah)' },
        { id: 'bukan-linear', label: 'Bukan Linear' },
      ],
      correctMap: {
        v1: 'linear',
        v2: 'linear',
        v3: 'linear',
        v4: 'linear',
        v5: 'linear',
        v6: 'bukan-linear',
        v7: 'bukan-linear',
      },
      meaningQuestion:
        'Mengapakah 3x + 2 = 5 ialah persamaan linear dalam satu pemboleh ubah?',
      meaningChoices: [
        {
          id: 'a',
          label: 'Mempunyai satu pemboleh ubah x dan kuasa x ialah 1',
        },
        { id: 'b', label: 'Mempunyai nombor 3 dan 2' },
        { id: 'c', label: 'Mempunyai tanda sama dengan' },
        { id: 'd', label: 'Mempunyai tanda tambah' },
      ],
      meaningAnswer: 'a',
    },
  ],
}

export default sixOneOne