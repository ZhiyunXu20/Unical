// Turn parsed weekly classes into dated occurrences.

import { addDays, isoWeekday } from './time.js'

export const SCHOOLS = {
  liverpool: { id: 'liverpool', name: 'University of Liverpool', tzid: 'Europe/London' },
  xjtlu: { id: 'xjtlu', name: "Xi'an Jiaotong-Liverpool University", tzid: 'Asia/Shanghai' }
}

/** Monday of a Liverpool teaching week, or null when outside the table. */
export function liverpoolWeekMonday(yearData, term, week) {
  for (const seg of yearData?.[term] ?? []) {
    if (week >= seg.fromWeek && week <= seg.toWeek) {
      return addDays(seg.start, (week - seg.fromWeek) * 7)
    }
  }
  return null
}

/**
 * @param {Array} classes   output of parseLiverpool / parseXjtlu
 * @param {object} options  { school, yearData } for Liverpool,
 *                          { school, week1Monday } for XJTLU
 * @returns {{ occurrences: Array, missing: string[] }}  missing = weeks with no term dates
 */
export function buildOccurrences(classes, options) {
  const occurrences = []
  const missing = new Set()
  for (const cls of classes) {
    for (const { term, week } of cls.weeks) {
      let monday
      if (options.school === 'liverpool') {
        monday = liverpoolWeekMonday(options.yearData, term, week)
        if (!monday) {
          missing.add(`${term} week ${week}`)
          continue
        }
      } else {
        if (!options.week1Monday) continue
        monday = addDays(options.week1Monday, (week - 1) * 7)
      }
      occurrences.push({
        classId: cls.id,
        date: addDays(monday, cls.day - 1),
        start: cls.start,
        end: cls.end,
        term,
        week,
        cls
      })
    }
  }
  occurrences.sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
  return { occurrences, missing: [...missing] }
}

export function isMonday(iso) {
  return Boolean(iso) && isoWeekday(iso) === 1
}
