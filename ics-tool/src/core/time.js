// Small, dependency-free helpers for wall-clock times ("HH:MM") and
// calendar dates ("YYYY-MM-DD"). Dates are handled in UTC so the result
// never depends on the time zone of the browser running the tool.

/** "9:00" / "09:00" / " 9:00 " -> minutes since midnight, or null. */
export function toMinutes(text) {
  const m = /(\d{1,2})\s*[:.]\s*(\d{2})/.exec(String(text ?? ''))
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  if (h > 23 || min > 59) return null
  return h * 60 + min
}

/** minutes since midnight -> "HH:MM" */
export function fromMinutes(total) {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

/** Most common gap between consecutive slot start times (defaults to 30). */
export function slotLength(slotStarts) {
  const counts = new Map()
  for (let i = 1; i < slotStarts.length; i++) {
    const gap = slotStarts[i] - slotStarts[i - 1]
    if (gap > 0) counts.set(gap, (counts.get(gap) ?? 0) + 1)
  }
  let best = 30
  let bestCount = 0
  for (const [gap, count] of counts) {
    if (count > bestCount) {
      best = gap
      bestCount = count
    }
  }
  return best
}

/** Start time of slot `index`, extrapolating past the last header cell. */
export function slotStart(slotStarts, index, length) {
  if (index < slotStarts.length) return slotStarts[index]
  const last = slotStarts.length - 1
  return slotStarts[last] + (index - last) * length
}

export function parseISODate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? '')
  if (!m) return null
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])))
}

export function formatISODate(date) {
  return date.toISOString().slice(0, 10)
}

export function addDays(iso, days) {
  const d = parseISODate(iso)
  d.setUTCDate(d.getUTCDate() + days)
  return formatISODate(d)
}

/** ISO weekday of a "YYYY-MM-DD" date: 1 = Monday ... 7 = Sunday. */
export function isoWeekday(iso) {
  const day = parseISODate(iso).getUTCDay()
  return day === 0 ? 7 : day
}

const DAY_NAMES = {
  mon: 1, monday: 1, tue: 2, tues: 2, tuesday: 2, wed: 3, wednesday: 3,
  thu: 4, thur: 4, thurs: 4, thursday: 4, fri: 5, friday: 5,
  sat: 6, saturday: 6, sun: 7, sunday: 7
}

/** "Mon", "MONDAY", "Thu " -> 1..7, or null. */
export function dayNumber(text) {
  return DAY_NAMES[String(text ?? '').trim().toLowerCase()] ?? null
}

export const cleanText = (text) => String(text ?? '').replace(/\s+/g, ' ').trim()
