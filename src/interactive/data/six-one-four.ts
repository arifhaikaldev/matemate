import type { Lesson } from '../types'

const sixOneFour: Lesson = {
  id: '6.1.4',
  title: 'Masalah persamaan linear',
  pages: [
    // PAGE 1 — HOOK: Age timeline predict
    {
      id: '6.1.4-1',
      type: 'hook-timeline-predict',
      instruction: 'Selepas 10 tahun, umur Jalil akan menjadi tiga kali umurnya sekarang.',
      timelineNow: 'Sekarang',
      timelineFuture: '+10 tahun',
      timelineLabel: '+10 tahun',
      question: 'Adakah umur Jalil sekarang lebih besar atau lebih kecil daripada 10?',
      choices: [
        { id: 'kecil', label: 'Lebih kecil daripada 10' },
        { id: 'sama', label: 'Sama dengan 10' },
        { id: 'besar', label: 'Lebih besar daripada 10' },
      ],
      correctChoiceId: 'kecil',
    },
    // PAGE 2 — PREDICTION: Identify unknown
    {
      id: '6.1.4-2',
      type: 'prediction-identify',
      instruction: 'Apakah yang kita tahu dan apakah yang belum kita tahu?',
      options: [
        { id: 'umur-sekarang', label: 'Umur sekarang' },
        { id: 'umur-depan', label: 'Umur selepas 10 tahun' },
        { id: '10-tahun', label: '10 tahun' },
        { id: 'gandaan-3', label: 'Gandaan 3' },
      ],
      correctId: 'umur-sekarang',
    },
    // PAGE 3 — CONSTRUCTION: Map to equation
    {
      id: '6.1.4-3',
      type: 'build-map-to-algebra',
      instruction: 'Padankan maklumat berikut dengan persamaan:',
      mappingPairs: [
        { language: 'Umur sekarang', algebra: 'x' },
        { language: 'Selepas 10 tahun', algebra: 'x + 10' },
        { language: 'Tiga kali umur sekarang', algebra: '3x' },
        { language: 'Persamaan', algebra: 'x + 10 = 3x' },
      ],
    },
    // PAGE 4 — SOLVE: Context solve
    {
      id: '6.1.4-4',
      type: 'solve-context',
      instruction: 'Selesaikan persamaan x + 10 = 3x:',
      initialEquation: 'x + 10 = 3x',
      steps: [
        {
          equationBefore: 'x + 10 = 3x',
          operation: '-x (kedua-dua belah)',
          equationAfter: '10 = 2x',
          explanation: 'Tolak x daripada kedua-dua belah.',
        },
        {
          equationBefore: '10 = 2x',
          operation: '÷2 (kedua-dua belah)',
          equationAfter: 'x = 5',
          explanation: 'Bahagi kedua-dua belah dengan 2.',
        },
      ],
    },
    // PAGE 5 — INTERPRET: Verify
    {
      id: '6.1.4-5',
      type: 'interpret-verify',
      instruction: 'Mari semak jawapan:',
      verifyEquation: '5 + 10 = 15',
      resultLatex: '3(5) = 15',
      question: 'Adakah 15 tiga kali 5?',
    },
    // PAGE 6 — MASTERY: Transfer problem
    {
      id: '6.1.4-6',
      type: 'transfer-model-solve',
      instruction: 'Selepas 6 tahun, umur seseorang menjadi dua kali umur sekarang. Selesaikan:',
      initialEquation: 'x + 6 = 2x',
      steps: [
        {
          equationBefore: 'x + 6 = 2x',
          operation: '-x (kedua-dua belah)',
          equationAfter: '6 = x',
          explanation: 'Tolak x daripada kedua-dua belah.',
        },
      ],
    },
  ],
}

export default sixOneFour