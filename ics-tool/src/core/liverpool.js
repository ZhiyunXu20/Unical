// Parser for the University of Liverpool timetable page
// (timetables.liverpool.ac.uk, "Semester view", saved as HTML).
//
// Layout: one <table id="tblSemesterView">. The header row lists the slot
// start times (08:00, 08:30, ...). Each day is one or more <tr>; the first
// row of a day starts with a <td class="sm-days-header" rowspan=N>. A class
// is a <td class="sm-event" colspan=K> spanning K slots.
//
// Slot times are read from the header instead of being hard-coded, so
// timetables that extend into the evening work too.

import { cleanText, dayNumber, fromMinutes, slotLength, slotStart, toMinutes } from './time.js'
import { parseLiverpoolWeeks } from './weeks.js'

export function isLiverpoolTimetable(doc) {
  return Boolean(doc.querySelector('#tblSemesterView'))
}

const MODES = {
  'ON CAMPUS': 'On campus',
  CAMPUS: 'On campus',
  ONLINE: 'Online',
  'ON-LINE': 'Online',
  HYBRID: 'Hybrid'
}

/** "[ON CAMPUS LECTURE]" -> { mode: 'On campus', type: 'Lecture' } */
export function normaliseLiverpoolType(bracket) {
  let rest = cleanText(bracket).toUpperCase()
  let mode = ''
  const modeMatch = /^(ON CAMPUS|CAMPUS|ONLINE|ON-LINE|HYBRID)\s+/.exec(rest)
  if (modeMatch) {
    mode = MODES[modeMatch[1]]
    rest = rest.slice(modeMatch[0].length)
  }
  return { mode, type: titleCase(rest || 'Other') }
}

function titleCase(text) {
  return text.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase())
}

function parseCell(cell) {
  const paragraphs = [...cell.querySelectorAll('p')]
  const descEl = cell.querySelector('p.emp') ?? paragraphs[0]
  const desc = cleanText(descEl?.textContent)
  const m = /^(.*?)\s+-\s+(.*?)\s*\[(.*)\]\s*$/.exec(desc)
  const code = m ? cleanText(m[1]) : desc.split(' ')[0] ?? ''
  const name = m ? cleanText(m[2]) : desc
  const { mode, type } = normaliseLiverpoolType(m ? m[3] : '')

  const weeksEl = [...paragraphs].reverse().find((p) => /S\d\s*\d+/i.test(p.textContent))
  const weeksText = cleanText(weeksEl?.textContent)

  const locationEl = paragraphs.find((p) => p !== descEl && p.querySelector('span.emp'))
  const location = cleanText(locationEl?.textContent)

  // Remaining plain paragraphs: activity name first, then staff.
  const plain = paragraphs.filter(
    (p) => p !== descEl && p !== weeksEl && p !== locationEl && !p.querySelector('a')
  )
  const activity = cleanText(plain[0]?.textContent)
  const teacher = cleanText(plain[1]?.textContent)
  const link = cell.querySelector('a[href]')?.getAttribute('href') ?? ''

  return { code, name, type, mode, activity, teacher, location, weeksText, link }
}

/** Academic year from module links like ".../COMP101_202324.htm" -> "2023/24". */
function yearFromLinks(doc) {
  for (const a of doc.querySelectorAll('#tblSemesterView a[href]')) {
    const m = /_(20\d{2})(\d{2})\.htm/i.exec(a.getAttribute('href'))
    if (m) return `${m[1]}/${m[2]}`
  }
  return null
}

export function parseLiverpool(doc) {
  const table = doc.querySelector('#tblSemesterView')
  if (!table) throw new Error('No #tblSemesterView table found: is this a Liverpool "Semester view" page?')

  let headerCells = [...table.querySelectorAll('thead th.sm-times-header')]
  if (headerCells.length === 0) headerCells = [...table.querySelectorAll('thead th')].slice(1)
  const slots = headerCells.map((th) => toMinutes(th.textContent)).filter((v) => v !== null)
  if (slots.length === 0) throw new Error('Could not read the time slots from the table header.')
  const length = slotLength(slots)

  const classes = []
  let day = null
  const rows = table.tBodies.length ? [...table.tBodies].flatMap((b) => [...b.rows]) : [...table.rows]
  for (const row of rows) {
    let col = 0
    for (const cell of row.cells) {
      if (cell.classList.contains('sm-days-header')) {
        day = dayNumber(cell.textContent)
        continue
      }
      const span = Math.max(1, parseInt(cell.getAttribute('colspan') || '1', 10) || 1)
      if (cell.classList.contains('sm-event') && day) {
        const info = parseCell(cell)
        classes.push({
          ...info,
          day,
          start: fromMinutes(slotStart(slots, col, length)),
          end: fromMinutes(slotStart(slots, col + span, length)),
          weeks: parseLiverpoolWeeks(info.weeksText)
        })
      }
      col += span
    }
  }

  const title = cleanText(doc.querySelector('title')?.textContent)
  const termMatch = /Semester\s*(\d)/i.exec(title)
  const terms = [...new Set(classes.flatMap((c) => c.weeks.map((w) => w.term)))]

  return {
    school: 'liverpool',
    classes: classes.map((c, i) => ({ id: `c${i + 1}`, ...c })),
    hints: {
      academicYear: yearFromLinks(doc),
      term: termMatch ? `S${termMatch[1]}` : terms[0] ?? null,
      slotMinutes: length
    }
  }
}
