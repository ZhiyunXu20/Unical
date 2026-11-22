// Parse https://www.liverpool.ac.uk/term-dates/ into teaching-week segments.
//
// The page has one heading per academic year ("2026/27") followed by a table
// with three columns: From | To | description. Only rows whose description is
// "N weeks teaching" count. "weeks break" and "weeks teaching and
// assessment" (exam periods) have no classes.
//
// Semester 1 = teaching blocks before 1 January; Semester 2 = blocks after,
// with week numbers carrying on across the Easter break.

import { addDays, cleanText, formatISODate } from './time.js'

const MONTHS = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7,
  august: 8, september: 9, october: 10, november: 11, december: 12
}

/** "28 September 2026" -> "2026-09-28" (year may be missing: fallbackYear). */
export function parseLongDate(text, fallbackYear) {
  const m = /(\d{1,2})\s+([A-Za-z]+)\s*(\d{4})?/.exec(cleanText(text))
  if (!m) return null
  const month = MONTHS[m[2].toLowerCase()]
  const year = m[3] ? Number(m[3]) : fallbackYear
  if (!month || !year) return null
  return formatISODate(new Date(Date.UTC(year, month - 1, Number(m[1]))))
}

function yearLabelFor(table) {
  // Walk backwards through the document to the nearest "YYYY/YY" heading.
  let node = table
  while (node) {
    let prev = node.previousElementSibling
    while (prev) {
      const m = /(20\d{2})\s*\/\s*(\d{2})/.exec(prev.textContent ?? '')
      if (m && /^H[1-6]$/.test(prev.tagName)) return `${m[1]}/${m[2]}`
      const heading = prev.querySelector?.('h1,h2,h3,h4,h5,h6')
      const hm = heading && /(20\d{2})\s*\/\s*(\d{2})/.exec(heading.textContent)
      if (hm) return `${hm[1]}/${hm[2]}`
      prev = prev.previousElementSibling
    }
    node = node.parentElement
  }
  const caption = table.querySelector('caption')
  const cm = caption && /(20\d{2})\s*\/\s*(\d{2})/.exec(caption.textContent)
  return cm ? `${cm[1]}/${cm[2]}` : null
}

const TEACHING = /^\s*(\d+)\s+weeks?\s+(?:of\s+)?teaching\s*$/i

export function parseTermDates(doc) {
  const years = {}
  const problems = []
  for (const table of doc.querySelectorAll('table')) {
    const label = yearLabelFor(table)
    if (!label) continue
    const startYear = Number(label.slice(0, 4))
    const segments = []
    for (const row of table.querySelectorAll('tr')) {
      const cells = [...row.querySelectorAll('td')]
      if (cells.length < 3) continue
      // The description may contain <br>: only its first line decides.
      const firstLine = cleanText(cells[2].innerHTML.split(/<br\s*\/?>/i)[0].replace(/<[^>]+>/g, ' '))
      const m = TEACHING.exec(firstLine)
      if (!m) continue
      const from = parseLongDate(cells[0].textContent, startYear)
      if (!from) continue
      segments.push({ start: from, weeks: Number(m[1]) })
    }
    if (segments.length === 0) continue
    segments.sort((a, b) => a.start.localeCompare(b.start))
    const result = { S1: [], S2: [] }
    const counters = { S1: 0, S2: 0 }
    for (const seg of segments) {
      const term = seg.start < `${startYear + 1}-01-01` ? 'S1' : 'S2'
      // Teaching weeks start on Monday; snap just in case.
      const day = new Date(`${seg.start}T00:00:00Z`).getUTCDay()
      const monday = addDays(seg.start, day === 0 ? 1 : 1 - day)
      result[term].push({ start: monday, fromWeek: counters[term] + 1, toWeek: counters[term] + seg.weeks })
      counters[term] += seg.weeks
    }
    if (counters.S1 !== 12 || counters.S2 !== 12) {
      problems.push(`${label}: expected 12 + 12 teaching weeks, got ${counters.S1} + ${counters.S2}`)
      continue
    }
    years[label] = result
  }
  return { years, problems }
}
