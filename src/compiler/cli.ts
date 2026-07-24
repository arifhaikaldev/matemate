#!/usr/bin/env node
// compiler/cli.ts
// CLI: node --loader ts-node/esm src/compiler/cli.ts <lesson.json> [lesson2.json ...]
// Or:  npx tsx src/compiler/cli.ts public/lessons/form1/**/*.json

import { readFileSync, existsSync } from 'node:fs'
import { resolve, basename } from 'node:path'
import { compileLesson, compileCurriculum, formatReport, formatBatchReport } from './index'

function readJson(filePath: string): unknown {
  const abs = resolve(filePath)
  if (!existsSync(abs)) {
    console.error(`File not found: ${abs}`)
    process.exit(1)
  }
  try {
    return JSON.parse(readFileSync(abs, 'utf-8'))
  } catch (e) {
    console.error(`Invalid JSON in ${basename(filePath)}: ${String(e)}`)
    process.exit(1)
  }
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
  const verbose = process.argv.includes('--verbose')
  const failFast = process.argv.includes('--fail-fast')

  if (args.length === 0) {
    console.log('Usage: tsx src/compiler/cli.ts <lesson.json> [lesson2.json ...] [--verbose] [--fail-fast]')
    console.log('')
    console.log('Options:')
    console.log('  --verbose    Show full per-lesson reports including info messages')
    console.log('  --fail-fast  Exit with code 1 if any lesson fails')
    process.exit(0)
  }

  const rawLessons = args.map(readJson)

  if (rawLessons.length === 1) {
    // Single lesson — show detailed report
    const report = compileLesson(rawLessons[0])
    console.log(formatReport(report))
    if (verbose) {
      console.log('Full issues:')
      for (const issue of report.issues) {
        console.log(`  [${issue.stage}] ${issue.severity.toUpperCase()}: ${issue.message}`)
      }
    }
    process.exit(report.productionReady ? 0 : failFast ? 1 : 0)
  } else {
    // Multiple lessons — batch report
    const reports = compileCurriculum(rawLessons)
    if (verbose) {
      for (const r of reports) {
        console.log(formatReport(r))
      }
    }
    console.log(formatBatchReport(reports))
    const allReady = reports.every((r) => r.productionReady)
    process.exit(allReady || !failFast ? 0 : 1)
  }
}

main()
