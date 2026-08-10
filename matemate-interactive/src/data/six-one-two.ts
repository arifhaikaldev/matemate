import type { Lesson } from '../types'

const sixOneTwo: Lesson = {
  id: '6.1.2',
  title: 'Membentuk persamaan linear',
  pages: [
    // PAGE 1 — HOOK: Number solve
    {
      id: '6.1.2-1',
      type: 'hook-number-solve',
      instruction: 'Satu nombor ditolak dengan 8 menghasilkan 2. Apakah nombor tersebut?',
      correctAnswer: 10,
    },
    // PAGE 2 — TRY: Phrase arrange
    {
      id: '6.1.2-2',
      type: 'try-phrase-arrange',
      instruction: 'Susun maklumat ini mengikut urutan hubungan matematik:',
      phrases: [
        { id: 'p1', text: 'satu nombor' },
        { id: 'p2', text: 'ditolak' },
        { id: 'p3', text: '8' },
        { id: 'p4', text: 'menghasilkan' },
        { id: 'p5', text: '2' },
      ],
      correctOrder: ['p1', 'p2', 'p3', 'p4', 'p5'],
    },
    // PAGE 3 — REVEAL: Language to algebra mapping
    {
      id: '6.1.2-3',
      type: 'reveal-language-to-algebra',
      instruction: 'Klik setiap bahagian untuk melihat bagaimana bahasa diterjemahkan kepada algebra:',
      mappingPairs: [
        { language: 'Satu nombor', algebra: 'x' },
        { language: 'Ditolak 8', algebra: 'x - 8' },
        { language: 'Menghasilkan 2', algebra: 'x - 8 = 2' },
      ],
    },
    // PAGE 4 — CONSTRUCTION: Equation builder
    {
      id: '6.1.2-4',
      type: 'build-equation-tiles',
      instruction: 'Bina persamaan untuk: "Satu nombor ditambah 5 menghasilkan 10."',
      sentence: 'Satu nombor ditambah 5 menghasilkan 10',
      availableTiles: [
        { id: 'x', label: 'x', latex: 'x' },
        { id: '+', label: '+', latex: '+' },
        { id: '5', label: '5', latex: '5' },
        { id: '=', label: '=', latex: '=' },
        { id: '10', label: '10', latex: '10' },
        { id: '-', label: '-', latex: '-' },
        { id: '3x', label: '3x', latex: '3x' },
      ],
      targetEquation: 'x + 5 = 10',
    },
    // PAGE 5 — VARIATION: Builder for 3 tasks
    {
      id: '6.1.2-5',
      type: 'variation-build',
      instruction: 'Bina persamaan untuk setiap situasi berikut:',
      sentence: 'Satu nombor ditambah 4 menghasilkan 10',
      availableTiles: [
        { id: 'x', label: 'x', latex: 'x' },
        { id: '+', label: '+', latex: '+' },
        { id: '-', label: '-', latex: '-' },
        { id: '4', label: '4', latex: '4' },
        { id: '10', label: '10', latex: '10' },
        { id: '7', label: '7', latex: '7' },
        { id: '3', label: '3', latex: '3' },
        { id: '=', label: '=', latex: '=' },
        { id: '17', label: '17', latex: '17' },
        { id: '2', label: '2', latex: '2' },
      ],
      targetEquation: 'x+4=10',
    },
    // PAGE 6 — TRANSFER / MASTERY: Story match
    {
      id: '6.1.2-6',
      type: 'transfer-story-match',
      instruction: 'Pilih cerita yang paling tepat mewakili persamaan 2x + 5 = 15:',
      algebraEquation: '2x + 5 = 15',
      stories: [
        {
          id: 's1',
          text: 'Dua kali satu nombor ditambah 5 menghasilkan 15.',
        },
        {
          id: 's2',
          text: 'Dua nombor ditambah 5 menghasilkan 15.',
        },
        {
          id: 's3',
          text: 'Satu nombor ditambah 5, kemudian didarab 2, menghasilkan 15.',
        },
        {
          id: 's4',
          text: 'Lima kali satu nombor ditambah 2 menghasilkan 15.',
        },
      ],
      correctStoryId: 's1',
    },
  ],
}

export default sixOneTwo