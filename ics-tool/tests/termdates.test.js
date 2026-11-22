import { describe, expect, it } from 'vitest'
import { parseTermDates, parseLongDate } from '../src/core/termdates.js'
import terms from '../src/data/liverpool-terms.json'
import { loadDoc } from './helpers.js'

describe('Liverpool term-dates page parser', () => {
  const { years, problems } = parseTermDates(loadDoc('./fixtures/term-dates.html'))

  it('counts only "N weeks teaching" rows and continues S2 numbering after Easter', () => {
    expect(years['2026/27']).toEqual({
      S1: [{ start: '2026-09-28', fromWeek: 1, toWeek: 12 }],
      S2: [
        { start: '2027-02-01', fromWeek: 1, toWeek: 7 },
        { start: '2027-04-12', fromWeek: 8, toWeek: 12 }
      ]
    })
  })
  it('matches the bundled data', () => {
    expect(years['2027/28']).toEqual(terms.years['2027/28'])
  })
  it('rejects years that do not add up to 12 + 12 weeks', () => {
    expect(years['2099/00']).toBeUndefined()
    expect(problems).toHaveLength(1)
  })
  it('parses long dates', () => {
    expect(parseLongDate('8 December', 2027)).toBe('2027-12-08')
  })
})
