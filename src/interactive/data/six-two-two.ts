import type { Lesson } from '../types'

const sixTwoTwo: Lesson = {
  id: '6.2.2',
  title: 'Membentuk persamaan linear dua pemboleh ubah',
  pages: [
    // PAGE 1 — HOOK: Dual slider difference
    {
      id: '6.2.2-1',
      type: 'hook-dual-slider',
      instruction:
        'Beza antara dua nombor ialah 18. Cuba gerakkan slider untuk melihat pasangan nombor yang mungkin.',
      quantityLabel1: 'Nombor P',
      quantityLabel2: 'Nombor Q',
      sliderMin: 18,
      sliderMax: 40,
      sliderDefault: 20,
      relationshipType: 'difference',
      differenceValue: 18,
    },
    // PAGE 2 — TRY: Pair input
    {
      id: '6.2.2-2',
      type: 'try-pair-input',
      instruction:
        'Cari tiga pasangan nombor yang mempunyai beza 18. Masukkan nombor pertama dan kedua.',
      pairTarget: 18,
      pairOperation: 'beza',
    },
    // PAGE 3 — REVEAL: Language to algebra
    {
      id: '6.2.2-3',
      type: 'reveal-language-to-algebra',
      instruction:
        'Klik setiap bahagian untuk melihat bagaimana bahasa diterjemahkan kepada algebra:',
      mappingPairs: [
        { language: 'Nombor pertama', algebra: 'p' },
        { language: 'Tolak nombor kedua', algebra: 'p - q' },
        { language: 'Beza ialah 18', algebra: 'p - q = 18' },
      ],
    },
    // PAGE 4 — CONSTRUCTION: Build equations (3 tasks)
    {
      id: '6.2.2-4',
      type: 'build-equation-tiles',
      instruction:
        'Bina persamaan bagi setiap ayat berikut.',
      sentence: 'Jumlah dua nombor ialah 20',
      availableTiles: [
        { id: 'p', label: 'p', latex: 'p' },
        { id: 'q', label: 'q', latex: 'q' },
        { id: '+', label: '+', latex: '+' },
        { id: '-', label: '-', latex: '-' },
        { id: '=', label: '=', latex: '=' },
        { id: '20', label: '20', latex: '20' },
        { id: '18', label: '18', latex: '18' },
        { id: '15', label: '15', latex: '15' },
        { id: '3', label: '3', latex: '3' },
        { id: 'x', label: 'x', latex: 'x' },
        { id: 'y', label: 'y', latex: 'y' },
      ],
      targetEquation: 'p + q = 20',
      tasks: [
        { sentence: 'Jumlah dua nombor ialah 20', targetEquation: 'p + q = 20' },
        { sentence: 'Beza dua nombor ialah 18', targetEquation: 'p - q = 18' },
        { sentence: 'Tiga kali satu nombor ditambah satu nombor lain ialah 15', targetEquation: '3p + q = 15' },
      ],
    },
    // PAGE 5 — REVERSE TRANSFER: Story match
    {
      id: '6.2.2-5',
      type: 'transfer-story-match',
      instruction:
        'Pilih cerita yang paling tepat mewakili persamaan p - q = 18:',
      algebraEquation: 'p - q = 18',
      stories: [
        { id: 's1', text: 'Beza antara p dan q ialah 18.' },
        { id: 's2', text: 'Jumlah p dan q ialah 18.' },
        { id: 's3', text: 'p darab q sama dengan 18.' },
        { id: 's4', text: 'p dibahagi q sama dengan 18.' },
      ],
      correctStoryId: 's1',
    },
    // PAGE 6 — MASTERY: Build story from equation
    {
      id: '6.2.2-6',
      type: 'transfer-story-build',
      instruction:
        'Bina satu situasi yang sepadan dengan persamaan 2x + y = 15:',
      storyBuildEquation: '2x + y = 15',
    },
  ],
}

export default sixTwoTwo