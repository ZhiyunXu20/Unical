import { describe, expect, it } from 'vitest'
import { buildIcs, escapeText, foldLine } from '../src/core/ics.js'

const ev = { date: '2026-03-30', start: '09:00', end: '10:00', summary: 'DEMO101 Intro, part 1; (Lecture)', location: 'Room A', description: 'Staff: X\nS2 week 9', categories: 'Lecture' }

describe('ICS writer', () => {
  const ics = buildIcs([ev, ev], { tzid: 'Europe/London', calendarName: 'Test', alarmMinutes: 15, now: new Date('2026-01-01T00:00:00Z') })
  const lines = ics.split('\r\n')

  it('uses CRLF and wraps everything in a calendar', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
  })
  it('writes local times with a time zone definition', () => {
    expect(lines).toContain('DTSTART;TZID=Europe/London:20260330T090000')
    expect(lines).toContain('DTEND;TZID=Europe/London:20260330T100000')
    expect(lines).toContain('TZID:Europe/London')
  })
  it('escapes text and adds alarms', () => {
    expect(lines).toContain('SUMMARY:DEMO101 Intro\\, part 1\\; (Lecture)')
    expect(lines).toContain('DESCRIPTION:Staff: X\\nS2 week 9')
    expect(lines).toContain('TRIGGER:-PT15M')
  })
  it('gives duplicate events distinct, stable UIDs', () => {
    const uids = lines.filter((l) => l.startsWith('UID:'))
    expect(new Set(uids).size).toBe(2)
    expect(buildIcs([ev], { tzid: 'Europe/London', now: new Date() })).toContain(uids[0])
  })
  it('folds long lines at 75 octets', () => {
    const folded = foldLine('DESCRIPTION:' + '课'.repeat(40))
    for (const part of folded.split('\r\n')) expect(new TextEncoder().encode(part).length).toBeLessThanOrEqual(75)
    expect(escapeText('a\\b')).toBe('a\\\\b')
  })
  it('supports Shanghai time', () => {
    expect(buildIcs([ev], { tzid: 'Asia/Shanghai' })).toContain('DTSTART;TZID=Asia/Shanghai:20260330T090000')
  })
})
