// Public entry point: HTML text in, classes / .ics text out.

import { isLiverpoolTimetable, parseLiverpool } from './liverpool.js'
import { isXjtluTimetable, parseXjtlu } from './xjtlu.js'
import { buildOccurrences, SCHOOLS } from './schedule.js'
import { buildIcs } from './ics.js'

export { SCHOOLS, buildOccurrences, buildIcs, parseLiverpool, parseXjtlu }
export { liverpoolWeekMonday, isMonday } from './schedule.js'

/** Which school's layout does this document use? 'liverpool' | 'xjtlu' | null */
export function detectSchool(doc) {
  if (isLiverpoolTimetable(doc)) return 'liverpool'
  if (isXjtluTimetable(doc)) return 'xjtlu'
  return null
}

export function parseTimetable(doc, school) {
  if (school === 'liverpool') return parseLiverpool(doc)
  if (school === 'xjtlu') return parseXjtlu(doc)
  throw new Error(`Unknown school ${school}`)
}

/** Text shown in the calendar for one occurrence. */
export function describeOccurrence(occ, { titleStyle = 'code-name' } = {}) {
  const c = occ.cls
  const name = c.name && c.name !== c.code ? c.name : ''
  let summary
  if (titleStyle === 'name' && name) summary = `${name} (${c.type})`
  else summary = [c.code, name, `(${c.type})`].filter(Boolean).join(' ')
  const details = [
    c.teacher && `Staff: ${c.teacher}`,
    c.activity && `Activity: ${c.activity}`,
    c.group && `Group: ${c.group}`,
    occ.term ? `${occ.term} week ${occ.week}` : `Week ${occ.week}`,
    c.link && c.link
  ].filter(Boolean)
  return {
    date: occ.date,
    start: occ.start,
    end: occ.end,
    summary,
    location: c.location,
    description: details.join('\n'),
    categories: c.type
  }
}
