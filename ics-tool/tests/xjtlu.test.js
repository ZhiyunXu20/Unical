import { describe, expect, it } from 'vitest'
import { parseXjtlu, splitXjtluTitle } from '../src/core/xjtlu.js'
import { detectSchool } from '../src/core/index.js'
import { loadDoc } from './helpers.js'

const doc = loadDoc('../public/samples/xjtlu-sample.html')
const { classes } = parseXjtlu(doc)
const brief = (c) => `${c.day} ${c.start}-${c.end} ${c.code} ${c.type}`

describe('XJTLU parser', () => {
  it('detects the layout', () => {
    expect(detectSchool(doc)).toBe('xjtlu')
  })

  it('reads each class once despite e-Bridge repeating cells in every row', () => {
    expect(classes.map(brief)).toEqual([
      '1 09:00-11:00 DEM101 Lecture',
      '1 11:00-12:00 DEM101 Tutorial',
      '2 10:00-12:00 DEM102 Lecture',
      '3 14:00-18:00 DEM103 Lab',
      '4 09:00-10:00 DEM104 Seminar',
      '5 18:00-20:00 DEM105 Lecture'
    ])
  })

  it('extracts teacher, room, group and weeks', () => {
    expect(classes[3]).toMatchObject({
      teacher: 'Demo Teacher D',
      location: 'SIP-DEMO301, SIP-DEMO302',
      group: 'D1/2'
    })
    expect(classes[3].weeks.map((w) => w.week)).toEqual([4, 7, 10])
    expect(classes[0].weeks.map((w) => w.week)).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13])
  })

  it('strips week annotations from titles', () => {
    expect(splitXjtluTitle('XYZ102-Lecture-D1/1 <02-05, 07-09>')).toEqual({ code: 'XYZ102', type: 'Lecture', group: 'D1/1' })
  })

  it('also works with a standards-compliant rowspan layout', () => {
    // Same timetable, but cells are not repeated in the rows they cover.
    const html = `<table class="maintable"><tr class="rowtitle"><td></td><td>Monday</td><td>Tuesday</td></tr>
      <tr><td class="coltitle">9:00</td><td rowspan="2" class="nonemptycell"><table><tr><td class="R1">AAA101-Lecture-D1/1</td></tr><tr><td class="R4Student">Week:1-2</td></tr></table></td><td class="gridcell"></td></tr>
      <tr><td class="coltitle">9:30</td><td rowspan="2" class="nonemptycell"><table><tr><td class="R1">BBB202-Lab-D1/1</td></tr><tr><td class="R4Student">Week:3</td></tr></table></td></tr>
      <tr><td class="coltitle">10:00</td><td class="gridcell"></td></tr></table>`
    const parsed = parseXjtlu(new DOMParser().parseFromString(html, 'text/html'))
    expect(parsed.classes.map(brief)).toEqual(['1 09:00-10:00 AAA101 Lecture', '2 09:30-10:30 BBB202 Lab'])
  })
})
