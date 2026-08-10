import type { Lesson } from '../types'

const sixOneThree: Lesson = {
  id: '6.1.3',
  title: 'Menyelesaikan persamaan linear',
  pages: [
    // PAGE 1 — HOOK: Mystery box x+1=7
    {
      id: '6.1.3-1',
      type: 'hook-mystery-box',
      instruction: 'Sebuah kotak mengandungi nombor yang tidak diketahui. Jika 1 ditambah kepada nombor itu, hasilnya 7.',
      visibleCount: 1,
      totalCount: 7,
    },
    // PAGE 2 — TRY: Balance scale, choose operation
    {
      id: '6.1.3-2',
      type: 'try-balance-operate',
      instruction: 'Apa yang perlu kita lakukan untuk membuang +1 daripada x + 1?',
      leftExpression: 'x + 1',
      rightExpression: '7',
      operationOptions: ['tambah 1', 'tolak 1', 'darab 1', 'bahagi 1'],
      correctOperation: 'tolak 1',
    },
    // PAGE 3 — CONCEPT REVEAL: Balance operation
    {
      id: '6.1.3-3',
      type: 'reveal-balance',
      instruction: 'Kita perlu melakukan operasi yang sama pada kedua-dua belah untuk mengekalkan kesamaan.',
      leftExpression: 'x + 1',
      rightExpression: '7',
      operationOptions: ['tolak 1'],
      correctOperation: 'tolak 1',
    },
    // PAGE 4 — BUILD: Guided solve 2x+1=7
    {
      id: '6.1.3-4',
      type: 'build-guided-solve',
      instruction: 'Mari selesaikan 2x + 1 = 7 langkah demi langkah.',
      initialEquation: '2x + 1 = 7',
      steps: [
        {
          equationBefore: '2x + 1 = 7',
          operation: '-1 (kedua-dua belah)',
          equationAfter: '2x = 6',
          explanation: 'Kita tolak 1 daripada kedua-dua belah untuk mengasingkan 2x.',
        },
        {
          equationBefore: '2x = 6',
          operation: '÷2 (kedua-dua belah)',
          equationAfter: 'x = 3',
          explanation: 'Kita bahagi kedua-dua belah dengan 2 untuk mengetahui nilai satu x.',
        },
      ],
    },
    // PAGE 5 — PRACTICE: Sequential equation solving
    {
      id: '6.1.3-5',
      type: 'practice-solve',
      instruction: 'Selesaikan persamaan berikut:',
    },
    // PAGE 6 — MEANING CHECK / MASTERY
    {
      id: '6.1.3-6',
      type: 'meaning-check',
      instruction: 'Jawab soalan-soalan tentang persamaan 2x + 1 = 7:',
      questions: [
        {
          question: 'Mengapa kita tolak 1 pada kedua-dua belah?',
          choices: [
            { id: 'a', label: 'Untuk membuang +1 dan mengekalkan kesamaan' },
            { id: 'b', label: 'Supaya 1 hilang dari sebelah kiri' },
            { id: 'c', label: 'Kerana 1 adalah nombor kecil' },
            { id: 'd', label: 'Kerana operasi songsang tambah ialah tolak' },
          ],
          correctId: 'a',
        },
        {
          question: 'Mengapa kita bahagi 2?',
          choices: [
            { id: 'a', label: 'Untuk mengasingkan satu x, kerana 2x bermaksud dua x' },
            { id: 'b', label: 'Supaya nombor menjadi kecil' },
            { id: 'c', label: 'Kerana 2 adalah nombor genap' },
            { id: 'd', label: 'Kerana operasi songsang darab ialah bahagi' },
          ],
          correctId: 'a',
        },
        {
          question: 'Bagaimana anda tahu x = 3 betul?',
          choices: [
            { id: 'a', label: 'Jika gantikan x = 3, 2(3) + 1 = 7, kedua-dua belah sama' },
            { id: 'b', label: 'Kerana 3 adalah nombor ganjil' },
            { id: 'c', label: 'Kerana 7 - 1 = 6, kemudian 6 ÷ 2 = 3' },
            { id: 'd', label: 'Kerana saya ingat jawapannya' },
          ],
          correctId: 'a',
        },
      ],
    },
  ],
}

export default sixOneThree