/**
 * Arabic Hardcoded Text Detector
 * Scans src/ for Arabic text outside translations.js and reports remaining i18n gaps
 *
 * Usage: node scripts/detect-arabic.mjs
 */

import { readFileSync, existsSync } from 'fs'
import { join, relative } from 'path'
import { globSync } from 'glob'

const SRC = new URL('../src', import.meta.url).pathname

// Arabic Unicode range: \u0600-\u06FF (basic), \u0750-\u077F (supplement), \u08A0-\u08FF (extended)
// Also includes common Arabic punctuation and numerals
const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]{3,}/g

const IGNORE = new Set([
  'translations.js',   // the translation source itself
  'translations.ts',
])

// Allowlisted patterns — Arabic that's acceptable in certain contexts
function isAllowlisted(file, lineText) {
  const filePath = file.replace(/\\/g, '/')

  // Brand name "مستقلين" — intentional brand text
  if (lineText.includes('مستقلين')) return true

  // Toggle text "English" / "العربية" — already dynamic
  if (lineText.includes('English') && lineText.includes('العربية')) return true
  if (lineText.includes('العربية')) return true

  // Login demo credentials — developer notes
  if (filePath.endsWith('Login.jsx') && (
    lineText.includes('مستخدم:') ||
    lineText.includes('شركة:') ||
    lineText.includes('مشرف:')
  )) return true

  return false
}

const files = globSync('**/*.{js,jsx,ts,tsx}', {
  cwd: SRC,
  ignore: ['node_modules/**', 'dist/**'],
})

let total = 0
const byFile = {}

for (const file of files) {
  if (IGNORE.has(file)) continue
  const absPath = join(SRC, file)
  if (!existsSync(absPath)) continue

  const content = readFileSync(absPath, 'utf8')
  const lines = content.split('\n')
  const matches = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    let match
    ARABIC_REGEX.lastIndex = 0
    while ((match = ARABIC_REGEX.exec(line)) !== null) {
      if (isAllowlisted(file, line)) continue
      matches.push({
        line: i + 1,
        text: match[0].trim(),
        context: line.trim().substring(0, 100),
      })
    }
  }

  if (matches.length > 0) {
    byFile[file] = matches
    total += matches.length
  }
}

// Output
console.log(`\n=== Arabic Hardcoded Text Detector ===\n`)
console.log(`Files scanned: ${files.length}`)
console.log(`Files with matches: ${Object.keys(byFile).length}`)
console.log(`Total matches: ${total}\n`)

for (const [file, matches] of Object.entries(byFile)) {
  console.log(`\n── ${file} (${matches.length} match${matches.length > 1 ? 'es' : ''})`)
  for (const m of matches) {
    console.log(`  L${m.line}: ${m.text}`)
    console.log(`    → ${m.context}`)
  }
}

if (total === 0) {
  console.log('\n✅ All translatable text is clean!')
} else {
  console.log(`\n⚠️  ${total} remaining Arabic text segment(s) found across ${Object.keys(byFile).length} file(s)`)
}
