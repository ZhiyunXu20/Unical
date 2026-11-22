// Parsers for the "which weeks does this class run" strings.

/**
 * Liverpool: "S2 01-S2 08, S2 09-S2 12" or "S1 01, S1 03-S1 10".
 * Returns [{ term: 'S2', week: 1 }, ...] without duplicates, in order.
 */
export function parseLiverpoolWeeks(text) {
  const out = []
  const seen = new Set()
  const push = (term, week) => {
    const key = `${term}-${week}`
    if (!seen.has(key)) {
      seen.add(key)
      out.push({ term, week })
    }
  }
  for (const part of String(text ?? '').split(',')) {
    const m = /(S\d)\s*(\d+)(?:\s*-\s*(?:(S\d)\s*)?(\d+))?/i.exec(part)
    if (!m) continue
    const term = m[1].toUpperCase()
    const from = Number(m[2])
    const endTerm = (m[3] ?? term).toUpperCase()
    const to = m[4] ? Number(m[4]) : from
    if (endTerm !== term) {
      // Ranges never cross semesters in practice; keep the start only.
      push(term, from)
      continue
    }
    for (let w = from; w <= to; w++) push(term, w)
  }
  return out
}

/** XJTLU: "Week:2-7, 9-14" or "Week:8, 10, 13" -> [2,3,...]. */
export function parseWeekNumbers(text) {
  const body = String(text ?? '').replace(/^\s*weeks?\s*[:：]?/i, '')
  const out = []
  const seen = new Set()
  for (const part of body.split(/[,，]/)) {
    const m = /(\d+)(?:\s*-\s*(\d+))?/.exec(part)
    if (!m) continue
    const from = Number(m[1])
    const to = m[2] ? Number(m[2]) : from
    for (let w = from; w <= to; w++) {
      if (!seen.has(w)) {
        seen.add(w)
        out.push(w)
      }
    }
  }
  return out
}
