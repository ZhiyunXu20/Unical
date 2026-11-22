import { describe, expect, it } from 'vitest'
import { parseLiverpool, normaliseLiverpoolType } from '../src/core/liverpool.js'
import { detectSchool } from '../src/core/index.js'
import { loadDoc } from './helpers.js'

const doc = loadDoc('../public/samples/liverpool-sample.html')
const { classes, hints } = parseLiverpool(doc)
const brief = (c) => `${c.day} ${c.start}-${c.end} ${c.code} ${c.type}`

describe('Liverpool parser', () => {
  it('detects the layout', () => {
    expect(detectSchool(doc)).toBe('liverpool')
  })

  it('reads every class with times from the header', () => {
    expect(classes.map(brief)).toEqual([
      '1 09:00-10:00 DEMO101 Lecture',
      '1 13:00-14:00 DEMO202 Lecture',
      '1 13:00-14:00 DEMO202 Lecture',
      '2 11:00-13:00 DEMO230 Lab',
      '2 15:00-16:00 DEMO250 Tutorial',
      '3 10:00-11:00 DEMO101 Lecture',
      '4 09:00-10:00 DEMO202 Lecture',
      '4 18:00-19:00 DEMO250 Lecture',
      '4 09:00-10:00 DEMO202 Lecture',
      '5 14:00-16:00 DEMO230 Drop-In'
    ])
  })

  it('handles evening classes past the old 18:00 limit', () => {
    expect(classes.find((c) => c.start === '18:00').end).toBe('19:00')
  })

  it('extracts staff, room, activity and weeks', () => {
    const c = classes[3]
    expect(c).toMatchObject({
      name: 'Web Development',
      mode: 'On campus',
      teacher: 'Dr C. Placeholder',
      location: 'Demo Computer Lab 2',
      activity: 'DEMO230/DEMO/LAB/A/01',
      weeksText: 'S1 02-S1 11'
    })
    expect(c.weeks).toHaveLength(10)
  })

  it('expands non-contiguous week lists', () => {
    expect(classes[4].weeks.map((w) => w.week)).toEqual([2, 4, 6, 7, 8, 9, 10])
  })

  it('guesses the academic year and semester', () => {
    expect(hints).toMatchObject({ academicYear: '2025/26', term: 'S1', slotMinutes: 30 })
  })

  it('normalises activity types', () => {
    expect(normaliseLiverpoolType('ON CAMPUS COMPUTER LAB')).toEqual({ mode: 'On campus', type: 'Computer Lab' })
    expect(normaliseLiverpoolType('CAMPUS ELC')).toEqual({ mode: 'On campus', type: 'Elc' })
    expect(normaliseLiverpoolType('ONLINE LECTURE')).toEqual({ mode: 'Online', type: 'Lecture' })
  })

  it('rejects pages without the timetable table', () => {
    expect(() => parseLiverpool(new DOMParser().parseFromString('<p>hi</p>', 'text/html'))).toThrow()
  })
})
