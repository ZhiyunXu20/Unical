// Minimal RFC 5545 writer. Times are written as local wall-clock times with
// a TZID and a matching VTIMEZONE, so Outlook, Google Calendar and Apple
// Calendar all place the class at the right hour, including across
// daylight-saving changes.

const VTIMEZONES = {
  'Europe/London': [
    'BEGIN:VTIMEZONE',
    'TZID:Europe/London',
    'X-LIC-LOCATION:Europe/London',
    'BEGIN:DAYLIGHT',
    'TZOFFSETFROM:+0000',
    'TZOFFSETTO:+0100',
    'TZNAME:BST',
    'DTSTART:19700329T010000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
    'END:DAYLIGHT',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0100',
    'TZOFFSETTO:+0000',
    'TZNAME:GMT',
    'DTSTART:19701025T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
    'END:STANDARD',
    'END:VTIMEZONE'
  ],
  'Asia/Shanghai': [
    'BEGIN:VTIMEZONE',
    'TZID:Asia/Shanghai',
    'X-LIC-LOCATION:Asia/Shanghai',
    'BEGIN:STANDARD',
    'TZOFFSETFROM:+0800',
    'TZOFFSETTO:+0800',
    'TZNAME:CST',
    'DTSTART:19700101T000000',
    'END:STANDARD',
    'END:VTIMEZONE'
  ]
}

export function escapeText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/([,;])/g, '\\$1')
}

/** Fold a content line to at most 75 octets (UTF-8 aware). */
export function foldLine(line) {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line
  const parts = []
  let current = ''
  let size = 0
  let limit = 75
  for (const ch of line) {
    const bytes = encoder.encode(ch).length
    if (size + bytes > limit) {
      parts.push(current)
      current = ''
      size = 0
      limit = 74 // continuation lines start with a space
    }
    current += ch
    size += bytes
  }
  parts.push(current)
  return parts.join('\r\n ')
}

const compactDate = (iso) => iso.replace(/-/g, '')
const compactTime = (hhmm) => `${hhmm.replace(':', '')}00`

function utcStamp(date) {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Short stable hash so re-importing the same file updates, not duplicates. */
function hash(text) {
  let h1 = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h1 ^= text.charCodeAt(i)
    h1 = Math.imul(h1, 0x01000193)
  }
  return (h1 >>> 0).toString(36)
}

/**
 * @param {Array} events  [{ date, start, end, summary, location, description, categories }]
 * @param {object} opts   { tzid, calendarName, alarmMinutes, now }
 */
export function buildIcs(events, opts) {
  const { tzid, calendarName = 'Timetable', alarmMinutes = 0, now = new Date() } = opts
  if (!VTIMEZONES[tzid]) throw new Error(`Unsupported time zone ${tzid}`)
  const stamp = utcStamp(now)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Unical//Timetable to ICS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    `X-WR-TIMEZONE:${tzid}`,
    ...VTIMEZONES[tzid]
  ]
  const seen = new Map()
  for (const ev of events) {
    const base = hash(`${ev.date}|${ev.start}|${ev.end}|${ev.summary}|${ev.location ?? ''}`)
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    const uid = `${compactDate(ev.date)}-${base}${n > 1 ? `-${n}` : ''}@unical-demo`
    lines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;TZID=${tzid}:${compactDate(ev.date)}T${compactTime(ev.start)}`,
      `DTEND;TZID=${tzid}:${compactDate(ev.date)}T${compactTime(ev.end)}`,
      `SUMMARY:${escapeText(ev.summary)}`
    )
    if (ev.location) lines.push(`LOCATION:${escapeText(ev.location)}`)
    if (ev.description) lines.push(`DESCRIPTION:${escapeText(ev.description)}`)
    if (ev.categories) lines.push(`CATEGORIES:${escapeText(ev.categories)}`)
    if (alarmMinutes > 0) {
      lines.push(
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        `DESCRIPTION:${escapeText(ev.summary)}`,
        `TRIGGER:-PT${Math.round(alarmMinutes)}M`,
        'END:VALARM'
      )
    }
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return lines.map(foldLine).join('\r\n') + '\r\n'
}
