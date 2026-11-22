// Parser for the XJTLU e-Bridge "Student Timetable" page (saved as HTML).
//
// Layout: <table class="maintable">. The first row (tr.rowtitle) lists the
// days (Monday ... Sunday). Each following row is one time slot whose first
// cell (td.coltitle) holds the start time ("9:00"). A class is a
// td.nonemptycell with rowspan=N, containing a small inner table:
//   .R1 "ABC104-Lecture-D1/1"   (code-type-group, sometimes "<02-11, 13-14>")
//   .R2 teachers
//   .R4 room
//   .R4Student "Week:2-7, 9-14"
//
// Quirk: e-Bridge repeats every cell in every row (a rowspan=4 class is
// printed again in the next three rows), so a browser lays the table out
// wrongly. We therefore read cells by position when every row has one cell
// per day, and only fall back to real rowspan maths otherwise.

import { cleanText, dayNumber, fromMinutes, slotLength, toMinutes } from './time.js'
import { parseWeekNumbers } from './weeks.js'

export function isXjtluTimetable(doc) {
  return Boolean(doc.querySelector('table.maintable td.coltitle'))
}

function parseItems(cell) {
  const items = []
  let current = null
  for (const td of cell.querySelectorAll('td')) {
    const cls = td.className || ''
    const text = cleanText(td.textContent)
    if (/\bR1\b/.test(cls)) {
      current = { title: text, teacher: '', location: '', weeksText: '' }
      items.push(current)
    } else if (!current) {
      continue
    } else if (/R4Student/.test(cls) || /^weeks?\s*[:：]/i.test(text)) {
      current.weeksText = text
    } else if (/\bR2\b/.test(cls)) {
      current.teacher = text
    } else if (/\bR4\b/.test(cls) || /\bR3\b/.test(cls)) {
      current.location = current.location ? `${current.location}, ${text}` : text
    }
  }
  return items
}

/** "ABC104-Lecture-D1/1 <12>" -> { code, type, group } */
export function splitXjtluTitle(title) {
  const clean = cleanText(String(title).replace(/<[^>]*>/g, ''))
  const parts = clean.split('-')
  if (parts.length < 2) return { code: clean, type: 'Other', group: '' }
  return { code: parts[0].trim(), type: parts[1].trim() || 'Other', group: parts.slice(2).join('-').trim() }
}

/** Build grid[row][day] = cell element (or null), honouring both layouts. */
function buildGrid(bodyRows, dayCount) {
  const positional = bodyRows.every(
    (r) => [...r.cells].filter((c) => !c.classList.contains('coltitle')).length === dayCount
  )
  const grid = bodyRows.map(() => new Array(dayCount).fill(null))
  const starts = bodyRows.map(() => new Array(dayCount).fill(false))
  bodyRows.forEach((row, r) => {
    const cells = [...row.cells].filter((c) => !c.classList.contains('coltitle'))
    if (positional) {
      cells.forEach((cell, d) => {
        grid[r][d] = cell
        starts[r][d] = true
      })
      return
    }
    let d = 0
    for (const cell of cells) {
      while (d < dayCount && grid[r][d]) d++
      if (d >= dayCount) break
      const span = Math.max(1, parseInt(cell.getAttribute('rowspan') || '1', 10) || 1)
      for (let k = 0; k < span && r + k < bodyRows.length; k++) grid[r + k][d] = cell
      starts[r][d] = true
      d++
    }
  })
  return { grid, starts }
}

export function parseXjtlu(doc) {
  const table = doc.querySelector('table.maintable')
  if (!table) throw new Error('No table.maintable found: is this an XJTLU e-Bridge timetable page?')
  const rows = [...table.rows]
  const headerIndex = rows.findIndex((r) => r.classList.contains('rowtitle'))
  const header = rows[headerIndex >= 0 ? headerIndex : 0]
  const days = [...header.cells].slice(1).map((c) => dayNumber(c.textContent))
  const bodyRows = rows.slice(rows.indexOf(header) + 1).filter((r) => r.querySelector('td.coltitle'))
  const slots = bodyRows.map((r) => toMinutes(r.querySelector('td.coltitle').textContent))
  if (slots.some((s) => s === null)) throw new Error('Could not read the time of every row.')
  const length = slotLength(slots)

  const { grid, starts } = buildGrid(bodyRows, days.length)
  const classes = []
  for (let d = 0; d < days.length; d++) {
    let r = 0
    while (r < bodyRows.length) {
      const cell = grid[r][d]
      if (!cell || !starts[r][d] || !cell.classList.contains('nonemptycell')) {
        r++
        continue
      }
      const span = Math.max(1, parseInt(cell.getAttribute('rowspan') || '1', 10) || 1)
      const startMin = slots[r]
      const endMin = startMin + span * length
      for (const item of parseItems(cell)) {
        const { code, type, group } = splitXjtluTitle(item.title)
        classes.push({
          code,
          name: code,
          type,
          group,
          teacher: item.teacher,
          location: item.location,
          weeksText: item.weeksText,
          weeks: parseWeekNumbers(item.weeksText).map((week) => ({ term: null, week })),
          day: days[d],
          start: fromMinutes(startMin),
          end: fromMinutes(endMin)
        })
      }
      r += span
    }
  }

  return {
    school: 'xjtlu',
    classes: classes.map((c, i) => ({ id: `c${i + 1}`, ...c })),
    hints: { slotMinutes: length }
  }
}
