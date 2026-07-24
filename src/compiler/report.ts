// compiler/report.ts
// Generates a formatted human-readable report from CompilerReport

import type { CompilerReport, Issue, Severity } from './types'

const ICONS: Record<Severity, string> = {
  error: '❌',
  warning: '⚠️ ',
  info: 'ℹ️ ',
}

function bar(score: number, width = 20): string {
  const filled = Math.round((score / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

export function formatReport(report: CompilerReport): string {
  const lines: string[] = []

  lines.push('')
  lines.push('═'.repeat(60))
  lines.push(`  Lesson: ${report.lessonId}`)
  lines.push(`  ${report.title}`)
  lines.push('═'.repeat(60))
  lines.push('')

  // Per-stage results
  for (const stage of report.stages) {
    const icon = stage.passed ? '✅' : '❌'
    const scoreBar = bar(stage.score)
    lines.push(`  ${icon} ${stage.stage.padEnd(20)} ${scoreBar} ${stage.score}/100`)

    const stageIssues = stage.issues.filter((i) => i.severity !== 'info')
    for (const issue of stageIssues) {
      lines.push(`       ${ICONS[issue.severity]} ${issue.message}`)
      if (issue.detail) {
        lines.push(`          ${issue.detail}`)
      }
    }
  }

  lines.push('')
  lines.push('─'.repeat(60))

  // Summary
  const allErrors = report.issues.filter((i) => i.severity === 'error')
  const allWarnings = report.issues.filter((i) => i.severity === 'warning')

  lines.push(`  Errors   : ${allErrors.length}`)
  lines.push(`  Warnings : ${allWarnings.length}`)
  lines.push('')
  lines.push(`  Overall Score : ${bar(report.totalScore)} ${report.totalScore}/100`)
  lines.push('')

  const readyIcon = report.productionReady ? '🟢' : '🔴'
  lines.push(`  ${readyIcon} Production Ready : ${report.productionReady ? 'YES' : 'NO'}`)

  if (!report.productionReady) {
    lines.push('')
    lines.push('  Fix these errors before shipping:')
    for (const err of allErrors) {
      lines.push(`    • [${err.stage}] ${err.message}`)
    }
  }

  lines.push('═'.repeat(60))
  lines.push('')

  return lines.join('\n')
}

export function formatBatchReport(reports: CompilerReport[]): string {
  const lines: string[] = []

  lines.push('')
  lines.push('╔' + '═'.repeat(58) + '╗')
  lines.push('║  CURRICULUM COMPILER — BATCH REPORT' + ' '.repeat(21) + '║')
  lines.push('╚' + '═'.repeat(58) + '╝')
  lines.push('')

  const passed = reports.filter((r) => r.productionReady)
  const failed = reports.filter((r) => !r.productionReady)
  const avgScore = Math.round(reports.reduce((s, r) => s + r.totalScore, 0) / reports.length)

  lines.push(`  Total lessons  : ${reports.length}`)
  lines.push(`  Ready          : ${passed.length} ✅`)
  lines.push(`  Not ready      : ${failed.length} ❌`)
  lines.push(`  Average score  : ${avgScore}/100`)
  lines.push('')

  // Summary table
  lines.push('  ' + '─'.repeat(56))
  lines.push('  lessonId     Score   Ready   Title')
  lines.push('  ' + '─'.repeat(56))

  for (const r of reports) {
    const ready = r.productionReady ? '✅' : '❌'
    const title = r.title.slice(0, 30).padEnd(30)
    lines.push(
      `  ${r.lessonId.padEnd(12)} ${String(r.totalScore).padStart(3)}/100  ${ready}    ${title}`
    )
  }

  lines.push('  ' + '─'.repeat(56))

  if (failed.length > 0) {
    lines.push('')
    lines.push('  Lessons requiring fixes:')
    for (const r of failed) {
      const errs = r.issues.filter((i) => i.severity === 'error')
      lines.push(`    ${r.lessonId}: ${errs.length} error(s)`)
      for (const e of errs.slice(0, 3)) {
        lines.push(`      • [${e.stage}] ${e.message}`)
      }
    }
  }

  lines.push('')
  return lines.join('\n')
}

// Issue filter helpers
export function getErrors(issues: Issue[]): Issue[] {
  return issues.filter((i) => i.severity === 'error')
}

export function getWarnings(issues: Issue[]): Issue[] {
  return issues.filter((i) => i.severity === 'warning')
}
