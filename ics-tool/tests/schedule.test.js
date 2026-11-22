import { describe, expect, it } from 'vitest'
import { buildOccurrences, liverpoolWeekMonday } from '../src/core/schedule.js'
import { parseLiverpoolWeeks, parseWeekNumbers } from '../src/core/weeks.js'
import terms from '../src/data/liverpool-terms.json'

describe('week strings', () => {
  it('parses Liverpool ranges', () => {
    expect(parseLiverpoolWeeks('S2 01-S2 03, S2 09').map((w) => `${w.term}-${w.week}`)).toEqual(['S2-1', 'S2-2', 'S2-3', 'S2-9'])
  })
  it('parses XJTLU ranges', () => {
    expect(parseWeekNumbers('Week:2-4, 9')).toEqual([2, 3, 4, 9])
  })
})

describe('Liverpool term dates', () => {
  it('skips the Easter break', () => {
    const y = terms.years['2023/24']
    expect(liverpoolWeekMonday(y, 'S2', 8)).toBe('2024-03-18')
    expect(liverpoolWeekMonday(y, 'S2', 9)).toBe('2024-04-15')
  })
  it('every year has 12 + 12 teaching weeks starting on Mondays', () => {
    for (const [label, y] of Object.entries(terms.years)) {
      for (const term of ['S1', 'S2']) {
        const weeks = y[term].reduce((n, s) => n + s.toWeek - s.fromWeek + 1, 0)
        expect(weeks, `${label} ${term}`).toBe(12)
        for (const s of y[term]) expect(new Date(`${s.start}T00:00:00Z`).getUTCDay(), `${label} ${s.start}`).toBe(1)
      }
    }
  })
})

describe('buildOccurrences', () => {
  const cls = { id: 'c1', day: 3, start: '10:00', end: '11:00', weeks: [] }
  it('dates Liverpool classes and reports weeks with no dates', () => {
    const { occurrences, missing } = buildOccurrences(
      [{ ...cls, weeks: [{ term: 'S1', week: 1 }, { term: 'S1', week: 13 }] }],
      { school: 'liverpool', yearData: terms.years['2025/26'] }
    )
    expect(occurrences.map((o) => o.date)).toEqual(['2025-09-24'])
    expect(missing).toEqual(['S1 week 13'])
  })
  it('dates XJTLU classes from the week-1 Monday', () => {
    const { occurrences } = buildOccurrences(
      [{ ...cls, weeks: [{ term: null, week: 1 }, { term: null, week: 3 }] }],
      { school: 'xjtlu', week1Monday: '2026-09-07' }
    )
    expect(occurrences.map((o) => o.date)).toEqual(['2026-09-09', '2026-09-23'])
  })
})
