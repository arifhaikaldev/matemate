import type { Lesson } from '../types'

const sixTwoFour: Lesson = {
  id: '6.2.4',
  title: 'Graf persamaan linear dua pemboleh ubah',
  pages: [
    // PAGE 1 — HOOK: Table to plot
    {
      id: '6.2.4-1',
      type: 'hook-dual-slider',
      instruction:
        'Kita telah menemui banyak pasangan penyelesaian. Bagaimana kita boleh melihat semua hubungan ini sekaligus?',
      quantityLabel1: 'x',
      quantityLabel2: 'y',
      totalLabel: 'Jumlah',
      sliderMin: 0,
      sliderMax: 5,
      sliderDefault: 0,
      relationshipType: 'sum',
      totalValue: 7,
    },
    // PAGE 2 — TRY: Pattern recognition
    {
      id: '6.2.4-2',
      type: 'try-pattern-recognize',
      instruction:
        'Plot tiga titik berikut: (0,2), (1,3), (2,4). Apakah corak yang anda lihat?',
      patternPoints: [
        { x: 0, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
      ],
      patternOptions: [
        { id: 'random', label: 'Rawak' },
        { id: 'curved', label: 'Melengkung' },
        { id: 'straight', label: 'Garis lurus' },
        { id: 'circular', label: 'Bulatan' },
      ],
    },
    // PAGE 3 — REVEAL: Points + line
    {
      id: '6.2.4-3',
      type: 'reveal-graph-points',
      instruction:
        'Klik setiap titik untuk melihat bahawa ia memenuhi persamaan x - y = -2.',
      graphEquation: 'x - y = -2',
      graphPoints: [
        { x: 0, y: 2, label: '(0,2)' },
        { x: 1, y: 3, label: '(1,3)' },
        { x: 2, y: 4, label: '(2,4)' },
      ],
    },
    // PAGE 4 — BUILD: Guided graph construction
    {
      id: '6.2.4-4',
      type: 'build-graph',
      instruction:
        'Plot titik-titik berikut pada grid: (0,2), (1,3), (2,4). Kemudian sambungkan untuk membentuk garis.',
      graphEquationForBuild: 'y = x + 2',
      graphRequiredPoints: [
        { x: 0, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
      ],
      graphAxes: { xMin: -1, xMax: 5, yMin: -1, yMax: 6 },
    },
    // PAGE 5 — PRACTICE: Graph practice
    {
      id: '6.2.4-5',
      type: 'practice-graph',
      instruction:
        'Plot titik (0,2), (1,3), (2,4) untuk persamaan y = x + 2 dan lukis garis lurus.',
      graphEquationForBuild: 'y = x + 2',
      graphRequiredPoints: [
        { x: 0, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 4 },
      ],
      graphAxes: { xMin: -1, xMax: 5, yMin: -1, yMax: 6 },
    },
    // PAGE 6 — MASTERY: Meaning check
    {
      id: '6.2.4-6',
      type: 'mastery-explain',
      instruction:
        'Jawab soalan berikut untuk menguji pemahaman anda tentang graf:',
      masteryQuestion:
        'Apakah maksud satu titik pada graf persamaan linear?',
      masteryChoices: [
        { id: 'a', label: 'Satu pasangan penyelesaian (x,y) yang memenuhi persamaan' },
        { id: 'b', label: 'Garis yang menghubungkan dua nombor' },
        { id: 'c', label: 'Nilai x dan y yang sama' },
        { id: 'd', label: 'Titik persilangan dengan paksi-y' },
      ],
      masteryCorrectId: 'a',
    },
  ],
}

export default sixTwoFour