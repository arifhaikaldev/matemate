import type { Lesson } from '../types'

const sixThreeTwo: Lesson = {
  id: '6.3.2',
  title: 'Menyelesaikan persamaan linear serentak',
  pages: [
    // PAGE 1 — HOOK: Graph intersection without labels, method choice
    {
      id: '6.3.2-1',
      type: 'hook-method-choice',
      instruction:
        'Dua garis bersilang, tetapi koordinat tepat tidak kelihatan. Bagaimana kita boleh mencari titik persilangan dengan tepat?',
      graphLines: [
        { equation: 'x - 3y = 7', color: '#0F6E56' },
        { equation: '5x + 2y = 1', color: '#D85A30' },
      ],
      intersectionPoint: { x: 1, y: -2 },
      graphAxes: { xMin: -3, xMax: 5, yMin: -4, yMax: 4 },
      methodChoices: [
        { id: 'algebra', label: 'Guna algebra' },
        { id: 'zoom', label: 'Zum pada graf' },
        { id: 'guess', label: 'Cuba teka' },
        { id: 'random', label: 'Lukis garis rawak' },
      ],
      correctMethodId: 'algebra',
    },
    // PAGE 2 — TRY: Substitution prediction
    {
      id: '6.3.2-2',
      type: 'try-substitution-predict',
      instruction:
        'Jika x = 7 + 3y, bolehkah 7 + 3y menggantikan x dalam persamaan 5x + 2y = 1?',
      substitutionEquation: '5x + 2y = 1',
      substitutionExpression: '7 + 3y',
      choices: [
        { id: 'yes', label: 'Ya, kerana x mempunyai nilai yang sama dengan 7 + 3y' },
        { id: 'no', label: 'Tidak, kerana x dan 7 + 3y berbeza' },
      ],
      correctChoiceId: 'yes',
    },
    // PAGE 3 — BUILD: Substitution
    {
      id: '6.3.2-3',
      type: 'build-substitution',
      instruction:
        'Klik langkah demi langkah untuk melihat bagaimana penggantian berfungsi:',
      substitutionSystem: {
        eq1: 'x - 3y = 7',
        eq2: '5x + 2y = 1',
      },
      substitutionSteps: [
        {
          instruction: 'Langkah 1: Susun semula persamaan pertama untuk x.',
          equation: 'x = 7 + 3y',
        },
        {
          instruction: 'Langkah 2: Gantikan x dalam persamaan kedua dengan 7 + 3y.',
          equation: '5(7 + 3y) + 2y = 1',
        },
        {
          instruction: 'Langkah 3: Kembangkan dan selesaikan untuk y.',
          equation: '35 + 15y + 2y = 1 → 17y = -34 → y = -2',
        },
        {
          instruction: 'Langkah 4: Gantikan y = -2 ke dalam x = 7 + 3y.',
          equation: 'x = 7 + 3(-2) = 1',
        },
      ],
    },
    // PAGE 4 — PROCEDURE: Solve step by step
    {
      id: '6.3.2-4',
      type: 'build-guided-solve',
      instruction:
        'Selesaikan sistem persamaan berikut langkah demi langkah:',
      initialEquation: 'x - 3y = 7, 5x + 2y = 1',
      steps: [
        {
          equationBefore: 'x - 3y = 7 → x = 7 + 3y',
          operation: 'Susun untuk x',
          equationAfter: 'x = 7 + 3y',
          explanation: 'Kita asingkan x dengan memindahkan -3y ke sebelah kanan.',
        },
        {
          equationBefore: '5(7 + 3y) + 2y = 1',
          operation: 'Gantikan x',
          equationAfter: '35 + 15y + 2y = 1',
          explanation: 'Gantikan x dengan 7 + 3y dalam persamaan kedua.',
        },
        {
          equationBefore: '35 + 17y = 1',
          operation: 'Selesaikan untuk y',
          equationAfter: 'y = -2',
          explanation: 'Tolak 35 daripada kedua-dua belah, kemudian bahagi dengan 17.',
        },
        {
          equationBefore: 'x = 7 + 3(-2)',
          operation: 'Gantikan y',
          equationAfter: 'x = 1',
          explanation: 'Gantikan y = -2 ke dalam x = 7 + 3y.',
        },
      ],
    },
    // PAGE 5 — CONNECT: Methods comparison
    {
      id: '6.3.2-5',
      type: 'connect-methods',
      instruction:
        'Ketiga-tiga kaedah ini mencari penyelesaian yang sama. Klik setiap kaedah untuk melihat:',
      connectMethods: [
        { name: 'Graf', description: 'Cari titik persilangan dua garis.' },
        { name: 'Penggantian', description: 'Gantikan satu pemboleh ubah dengan ungkapan yang sama nilai.' },
        { name: 'Penghapusan', description: 'Gabungkan persamaan untuk menghapuskan satu pemboleh ubah.' },
      ],
      commonSolution: 'x = 1, y = -2',
    },
    // PAGE 6 — MASTERY: Solve + verify
    {
      id: '6.3.2-6',
      type: 'transfer-model-solve',
      instruction:
        'Selesaikan sistem persamaan berikut: x + y = 8 dan x - y = 2',
      initialEquation: 'x + y = 8, x - y = 2',
      steps: [
        {
          equationBefore: 'x + y = 8, x - y = 2',
          operation: 'Tambah kedua-dua persamaan',
          equationAfter: '2x = 10',
          explanation: 'Tambah persamaan untuk menghapuskan y.',
        },
        {
          equationBefore: '2x = 10',
          operation: 'Bahagi dengan 2',
          equationAfter: 'x = 5',
          explanation: 'Bahagi kedua-dua belah dengan 2.',
        },
        {
          equationBefore: '5 + y = 8',
          operation: 'Gantikan x = 5',
          equationAfter: 'y = 3',
          explanation: 'Gantikan x = 5 ke dalam persamaan pertama.',
        },
      ],
    },
  ],
}

export default sixThreeTwo