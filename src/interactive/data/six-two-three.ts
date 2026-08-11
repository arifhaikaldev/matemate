import type { Lesson } from '../types'

const sixTwoThree: Lesson = {
  id: '6.2.3',
  title: 'Menentukan pasangan penyelesaian',
  pages: [
    // PAGE 1 — HOOK: Dual slider books
    {
      id: '6.2.3-1',
      type: 'hook-dual-slider',
      instruction:
        'Jumlah dua jenis buku yang dibaca ialah 7. Cuba gerakkan slider untuk melihat pasangan yang mungkin.',
      quantityLabel1: 'Novel',
      quantityLabel2: 'Buku Cerita',
      totalLabel: 'Jumlah',
      sliderMin: 0,
      sliderMax: 7,
      sliderDefault: 2,
      relationshipType: 'sum',
      totalValue: 7,
    },
    // PAGE 2 — PREDICTION: Pair change
    {
      id: '6.2.3-2',
      type: 'prediction-pair-change',
      instruction:
        'Perhatikan persamaan x + y = 7. Jika x berubah, apa berlaku pada y?',
      pairEquation: 'x + y = 7',
      initialX: 2,
      initialY: 5,
    },
    // PAGE 3 — BUILD: Pair table
    {
      id: '6.2.3-3',
      type: 'build-pair-table',
      instruction:
        'Lengkapkan jadual nilai untuk persamaan 2x + y = 6 dengan mencari nilai y bagi setiap x:',
      tableEquation: '2x + y = 6',
      tableXValues: [0, 1, 2],
    },
    // PAGE 4 — FORMALISM: Ordered pair quiz
    {
      id: '6.2.3-4',
      type: 'formalism-ordered-pair',
      instruction:
        'Pasangan tertib (x,y) bermaksud nilai x datang dahulu dan nilai y datang kedua. Antara berikut, yang manakah memenuhi 2x + y = 6?',
      orderedPairEquation: '2x + y = 6',
      orderedPairOptions: [
        { id: 'a', label: '(1,4)' },
        { id: 'b', label: '(4,1)' },
        { id: 'c', label: '(2,3)' },
        { id: 'd', label: '(0,5)' },
      ],
      orderedPairCorrectId: 'a',
    },
    // PAGE 5 — PRACTICE: Find pairs
    {
      id: '6.2.3-5',
      type: 'practice-pairs',
      instruction:
        'Cari pasangan penyelesaian bagi x + y = 10. Masukkan nilai x dan y yang memenuhi:',
      practicePairEquation: 'x + y = 10',
      practicePairQuestions: [
        { pairs: [{ x: 3, y: 7 }], correct: true },
      ],
    },
    // PAGE 6 — MASTERY: Meaning check
    {
      id: '6.2.3-6',
      type: 'mastery-explain',
      instruction:
        'Jawab soalan berikut untuk menguji pemahaman anda:',
      masteryQuestion:
        'Adakah satu persamaan linear dalam dua pemboleh ubah hanya mempunyai satu penyelesaian?',
      masteryChoices: [
        { id: 'a', label: 'Tidak, kerana banyak pasangan nilai yang berbeza boleh memenuhi hubungan yang sama' },
        { id: 'b', label: 'Ya, kerana persamaan hanya mempunyai satu jawapan' },
        { id: 'c', label: 'Ya, kerana hanya ada satu nilai x dan satu nilai y' },
        { id: 'd', label: 'Tidak, kerana persamaan tidak lengkap' },
      ],
      masteryCorrectId: 'a',
    },
  ],
}

export default sixTwoThree