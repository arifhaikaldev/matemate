import type { Lesson } from '../types'

const sixThreeOne: Lesson = {
  id: '6.3.1',
  title: 'Membentuk dan mewakilkan persamaan linear serentak',
  pages: [
    // PAGE 1 — HOOK: Chicken/duck combinations
    {
      id: '6.3.1-1',
      type: 'try-yes-no',
      instruction:
        'Faizah mempunyai ayam dan itik. Jumlah semuanya ialah 7. Beberapa kemungkinan: (1,6), (2,5), (3,4).',
      yesNoQuestion:
        'Adakah kita sudah tahu bilangan ayam dan itik yang sebenar dengan satu maklumat ini sahaja?',
      choices: [
        { id: 'yes', label: 'Ya, sudah tahu' },
        { id: 'no', label: 'Tidak, belum pasti' },
      ],
      correctChoiceId: 'no',
    },
    // PAGE 2 — TRY: Cost check
    {
      id: '6.3.1-2',
      type: 'try-cost-check',
      instruction:
        'Jumlah kos ialah RM12. Ayam RM2, itik RM1. Klik pasangan yang manakah jumlah kosnya RM12?',
      costPairs: [
        { x: 1, y: 6, cost: 8 },
        { x: 2, y: 5, cost: 9 },
        { x: 3, y: 4, cost: 10 },
        { x: 4, y: 3, cost: 11 },
        { x: 5, y: 2, cost: 12 },
      ],
      totalCost: 12,
    },
    // PAGE 3 — REVEAL: Two equations
    {
      id: '6.3.1-3',
      type: 'reveal-two-equations',
      instruction:
        'Klik setiap persamaan untuk melihat maklumat yang diwakilinya:',
      equationParts: [
        { component: 'x + y = 7', label: 'x + y = 7', meaning: 'Jumlah ayam dan itik ialah 7' },
        { component: '2x + y = 12', label: '2x + y = 12', meaning: 'Jumlah kos ialah RM12 (ayam RM2, itik RM1)' },
      ],
      mappingPairs: [
        { language: 'Jumlah haiwan', algebra: 'x + y = 7' },
        { language: 'Jumlah kos', algebra: '2x + y = 12' },
      ],
    },
    // PAGE 4 — GRAPH: Intersection
    {
      id: '6.3.1-4',
      type: 'graph-intersection',
      instruction:
        'Dua garis ini mewakili kedua-dua persamaan. Klik titik persilangan untuk melihat penyelesaiannya.',
      graphLines: [
        { equation: 'x + y = 7', color: '#0F6E56' },
        { equation: '2x + y = 12', color: '#D85A30' },
      ],
      intersectionPoint: { x: 5, y: 2 },
      graphAxes: { xMin: -1, xMax: 8, yMin: -1, yMax: 8 },
    },
    // PAGE 5 — VARIATION: Graph cases
    {
      id: '6.3.1-5',
      type: 'variation-graph-cases',
      instruction:
        'Terdapat tiga kemungkinan untuk dua garis. Padankan setiap kes dengan maksudnya:',
      graphCases: [
        {
          id: 'intersecting',
          label: 'Garis Bersilang',
          description: 'Dua garis bersilang pada satu titik.',
          equations: ['x + y = 7', '2x + y = 12'],
          correctMeaning: 'one-solution',
        },
        {
          id: 'parallel',
          label: 'Garis Selari',
          description: 'Dua garis tidak bersilang.',
          equations: ['x + y = 5', 'x + y = 10'],
          correctMeaning: 'no-solution',
        },
        {
          id: 'coincident',
          label: 'Garis Bertindih',
          description: 'Dua garis adalah sama.',
          equations: ['x + y = 7', '2x + 2y = 14'],
          correctMeaning: 'infinite-solutions',
        },
      ],
    },
    // PAGE 6 — MASTERY: Explain
    {
      id: '6.3.1-6',
      type: 'mastery-explain',
      instruction:
        'Jawab soalan berikut:',
      masteryQuestion:
        'Mengapakah titik persilangan mesti memenuhi kedua-dua persamaan?',
      masteryChoices: [
        { id: 'a', label: 'Kerana titik itu terletak pada kedua-dua garis, bermakna ia memenuhi kedua-dua persamaan' },
        { id: 'b', label: 'Kerana titik itu mempunyai nilai x yang terbesar' },
        { id: 'c', label: 'Kerana kedua-dua persamaan mempunyai simbol yang sama' },
        { id: 'd', label: 'Kerana graf sentiasa mempunyai satu titik' },
      ],
      masteryCorrectId: 'a',
    },
  ],
}

export default sixThreeOne