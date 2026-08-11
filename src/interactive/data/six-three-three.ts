import type { Lesson } from '../types'

const sixThreeThree: Lesson = {
  id: '6.3.3',
  title: 'Masalah persamaan linear serentak',
  pages: [
    // PAGE 1 — HOOK: Ticket pricing
    {
      id: '6.3.3-1',
      type: 'try-yes-no',
      instruction:
        '2 tiket dewasa + 3 tiket kanak-kanak berharga RM97.',
      yesNoQuestion:
        'Bolehkah kita tahu harga setiap tiket dengan satu maklumat ini sahaja?',
      choices: [
        { id: 'yes', label: 'Ya, boleh tahu' },
        { id: 'no', label: 'Tidak, belum cukup maklumat' },
      ],
      correctChoiceId: 'no',
    },
    // PAGE 2 — TRY: Identify unknowns
    {
      id: '6.3.3-2',
      type: 'prediction-identify',
      instruction:
        'Kita ada dua maklumat: 2 dewasa + 3 kanak-kanak = RM97, dan 4 dewasa + 1 kanak-kanak = RM139. Apakah dua kuantiti yang belum diketahui?',
      options: [
        { id: 'harga-dewasa', label: 'Harga tiket dewasa' },
        { id: 'harga-kanak', label: 'Harga tiket kanak-kanak' },
        { id: 'jumlah-tiket', label: 'Jumlah tiket' },
        { id: 'jumlah-wang', label: 'Jumlah wang' },
      ],
      correctId: 'harga-dewasa',
    },
    // PAGE 3 — CONSTRUCTION: Build equations
    {
      id: '6.3.3-3',
      type: 'build-equation-tiles',
      instruction:
        'Bina persamaan pertama: "2 tiket dewasa + 3 tiket kanak-kanak = RM97"',
      sentence: '2 tiket dewasa + 3 tiket kanak-kanak = RM97',
      availableTiles: [
        { id: '2', label: '2', latex: '2' },
        { id: 'x', label: 'x', latex: 'x' },
        { id: '3', label: '3', latex: '3' },
        { id: 'y', label: 'y', latex: 'y' },
        { id: '+', label: '+', latex: '+' },
        { id: '=', label: '=', latex: '=' },
        { id: '97', label: '97', latex: '97' },
        { id: '139', label: '139', latex: '139' },
        { id: '4', label: '4', latex: '4' },
        { id: '1', label: '1', latex: '1' },
        { id: '-', label: '-', latex: '-' },
      ],
      targetEquation: '2x + 3y = 97',
    },
    // PAGE 4 — SOLVE: Guided solve
    {
      id: '6.3.3-4',
      type: 'build-guided-solve',
      instruction:
        'Selesaikan untuk mencari harga tiket dewasa (x) dan kanak-kanak (y):',
      initialEquation: '2x + 3y = 97, 4x + y = 139',
      steps: [
        {
          equationBefore: '2x + 3y = 97, 4x + y = 139',
          operation: 'Gunakan penghapusan',
          equationAfter: 'y = 139 - 4x',
          explanation: 'Susun persamaan kedua untuk y.',
        },
        {
          equationBefore: '2x + 3(139 - 4x) = 97',
          operation: 'Gantikan y',
          equationAfter: '2x + 417 - 12x = 97',
          explanation: 'Gantikan y ke dalam persamaan pertama.',
        },
        {
          equationBefore: '-10x + 417 = 97',
          operation: 'Selesaikan untuk x',
          equationAfter: 'x = 32',
          explanation: 'Tolak 417, bahagi dengan -10.',
        },
        {
          equationBefore: 'y = 139 - 4(32)',
          operation: 'Gantikan x = 32',
          equationAfter: 'y = 11',
          explanation: 'Gantikan x ke dalam y = 139 - 4x.',
        },
      ],
    },
    // PAGE 5 — VERIFY: Check answers
    {
      id: '6.3.3-5',
      type: 'verify-check',
      instruction:
        'Semak sama ada harga RM32 (dewasa) dan RM11 (kanak-kanak) memenuhi kedua-dua situasi:',
      verifyCalculations: [
        { latex: '2(32) + 3(11) = 64 + 33 = 97', label: 'Pembelian pertama' },
        { latex: '4(32) + 11 = 128 + 11 = 139', label: 'Pembelian kedua' },
      ],
      verifyQuestion: 'Adakah harga ini memenuhi kedua-dua situasi?',
    },
    // PAGE 6 — TRANSFER: New problem
    {
      id: '6.3.3-6',
      type: 'transfer-context-workflow',
      instruction:
        'Selesaikan masalah baharu: 3 buku + 2 pensel = RM26, 1 buku + 5 pensel = RM26. Cari harga buku dan pensel.',
      workflowSteps: [
        { instruction: 'Langkah 1: Kenal pasti kuantiti yang tidak diketahui (harga buku dan pensel).', type: 'identify' },
        { instruction: 'Langkah 2: Bentukkan dua persamaan: 3x + 2y = 26 dan x + 5y = 26.', type: 'solve' },
        { instruction: 'Langkah 3: Selesaikan untuk mendapatkan x = 6, y = 4.', type: 'solve' },
        { instruction: 'Langkah 4: Semak: buku = RM6, pensel = RM4. Kedua-dua persamaan dipenuhi.', type: 'verify' },
        { instruction: 'Langkah 5: Selesai! Anda telah menyelesaikan masalah persamaan linear serentak.', type: 'success' },
      ],
    },
  ],
}

export default sixThreeThree