// Refresh src/data/liverpool-terms.json from the University of Liverpool
// term-dates page. Runs in CI before each build. Years already in the file
// are kept (the page only lists the current and future years), and a year
// is only replaced when the page yields a full 12 + 12 teaching weeks.
// Any network or parsing failure leaves the bundled file untouched.

import { readFile, writeFile } from 'node:fs/promises'
import { JSDOM } from 'jsdom'
import { parseTermDates } from '../src/core/termdates.js'

const URL = 'https://www.liverpool.ac.uk/term-dates/'
const file = new globalThis.URL('../src/data/liverpool-terms.json', import.meta.url)

async function main() {
  const current = JSON.parse(await readFile(file, 'utf8'))
  let html
  try {
    const res = await fetch(URL, { headers: { 'User-Agent': 'unical-term-dates-updater' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    html = await res.text()
  } catch (err) {
    console.warn(`Could not fetch ${URL}: ${err.message}. Keeping bundled term dates.`)
    return
  }
  const { years, problems } = parseTermDates(new JSDOM(html).window.document)
  problems.forEach((p) => console.warn(`Skipped ${p}`))
  const labels = Object.keys(years)
  if (labels.length === 0) {
    console.warn('No academic years parsed. Keeping bundled term dates.')
    return
  }
  let changed = false
  for (const label of labels) {
    if (JSON.stringify(current.years[label]) !== JSON.stringify(years[label])) {
      console.log(`${current.years[label] ? 'Updated' : 'Added'} ${label}`)
      current.years[label] = years[label]
      changed = true
    }
  }
  if (!changed) {
    console.log(`Term dates up to date (${labels.join(', ')}).`)
    return
  }
  current.years = Object.fromEntries(Object.entries(current.years).sort(([a], [b]) => a.localeCompare(b)))
  current.updated = new Date().toISOString().slice(0, 10)
  await writeFile(file, JSON.stringify(current, null, 2) + '\n')
}

main()
