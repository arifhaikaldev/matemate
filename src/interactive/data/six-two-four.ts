import type { Lesson } from '../types'

const sixTwoFour: Lesson = {
  id: '6.2.4',
  title: 'Graf persamaan linear dua pemboleh ubah',
  pages: [
    // PAGE 1 — HOOK: Table to plot
    {
      id: '6.2.4-1',
      type: 'hook-table-to-plot',
      instruction:
        'Kita telah menemui banyak pasangan penyelesaian. Bagaimana kita boleh melihat semua hubungan ini sekaligus?',
      plotEquation: 'x + y = 7',
      tablePairs: [
        { x: 0, y: 7 },
        { x: 1, y: 6 },
        { x: 2, y: 5 },
        { x: 3, y: 4 },
        { x: 4, y: 3 },
      ],
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
    // PAGE 6 — MASTERY: Meaning check (3 questions)
    {
      id: '6.2.4-6',
      type: 'meaning-check',
      instruction:
        'Jawab soalan berikut untuk menguji pemahaman anda tentang graf:',
      questions: [
        {
          question: 'Apakah maksud satu titik pada graf persamaan linear?',
          choices: [
            { id: 'a', label: 'Satu pasangan penyelesaian (x,y) yang memenuhi persamaan' },
            { id: 'b', label: 'Garis yang menghubungkan dua nombor' },
            { id: 'c', label: 'Nilai x dan y yang sama' },
            { id: 'd', label: 'Titik persilangan dengan paksi-y' },
          ],
          correctId: 'a',
        },
        {
          question: 'Mengapakah titik (1,3) memenuhi persamaan y = x + 2?',
          choices: [
            { id: 'a', label: 'Kerana 3 = 1 + 2, jadi nilai y sama dengan x + 2' },
            { id: 'b', label: 'Kerana 1 dan 3 adalah nombor ganjil' },
            { id: 'c', label: 'Kerana garis melalui (0,0)' },
            { id: 'd', label: 'Kerana 1 + 3 = 4' },
          ],
          correctId: 'a',
        },
        {
          question: 'Apakah maksud garis lurus pada graf persamaan linear?',
          choices: [
            { id: 'a', label: 'Keseluruhan set semua pasangan penyelesaian (x,y) yang memenuhi persamaan' },
            { id: 'b', label: 'Garis yang menghubungkan dua titik sahaja' },
            { id: 'c', label: 'Bentuk paling ringkas persamaan' },
            { id: 'd', label: 'Garis yang tidak mempunyai makna matematik' },
          ],
          correctId: 'a',
        },
      ],
    },
  ],
}

export default sixTwoFour