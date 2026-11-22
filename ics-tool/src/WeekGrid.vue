<script setup>
import { computed } from 'vue'
import { addDays, fromMinutes, toMinutes } from './core/time.js'

const props = defineProps({
  monday: { type: String, required: true },
  occurrences: { type: Array, required: true },
  showWeekend: Boolean,
  range: { type: Array, required: true },
  dayNames: { type: Array, required: true },
  emptyText: { type: String, default: '' }
})

const PX_PER_MIN = 0.9
const days = computed(() => {
  const n = props.showWeekend ? 7 : 5
  return Array.from({ length: n }, (_, i) => ({ index: i + 1, date: addDays(props.monday, i), name: props.dayNames[i] }))
})
const height = computed(() => (props.range[1] - props.range[0]) * PX_PER_MIN)
const hours = computed(() => {
  const out = []
  for (let m = props.range[0]; m < props.range[1]; m += 60) out.push(m)
  return out
})

// Stable colour per course code.
const PALETTE = 6
function colourOf(code) {
  let h = 0
  for (const ch of code) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return h % PALETTE
}

// Lay out overlapping sessions side by side.
const blocks = computed(() => {
  const byDay = new Map()
  for (const occ of props.occurrences) {
    const day = (new Date(`${occ.date}T00:00:00Z`).getUTCDay() + 6) % 7 + 1
    if (!byDay.has(day)) byDay.set(day, [])
    byDay.get(day).push(occ)
  }
  const out = []
  for (const [day, list] of byDay) {
    list.sort((a, b) => a.start.localeCompare(b.start) || b.end.localeCompare(a.end))
    const laneEnds = []
    const placed = list.map((occ) => {
      const s = toMinutes(occ.start)
      const e = toMinutes(occ.end)
      let lane = laneEnds.findIndex((end) => end <= s)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(e)
      } else laneEnds[lane] = e
      return { occ, s, e, lane }
    })
    for (const p of placed) {
      out.push({
        key: `${p.occ.classId}-${p.occ.date}`,
        day,
        top: (p.s - props.range[0]) * PX_PER_MIN,
        height: Math.max(18, (p.e - p.s) * PX_PER_MIN - 2),
        left: (p.lane / laneEnds.length) * 100,
        width: 100 / laneEnds.length,
        colour: colourOf(p.occ.cls.code),
        occ: p.occ
      })
    }
  }
  return out
})
</script>

<template>
  <div class="grid-scroll">
    <div class="grid" :style="{ '--cols': days.length }">
      <div class="corner"></div>
      <div v-for="d in days" :key="d.date" class="day-head">
        <b>{{ d.name }}</b>
        <span>{{ d.date.slice(8) }}/{{ d.date.slice(5, 7) }}</span>
      </div>
      <div class="times" :style="{ height: height + 'px' }">
        <span v-for="m in hours" :key="m" :style="{ top: (m - range[0]) * 0.9 + 'px' }">{{ fromMinutes(m) }}</span>
      </div>
      <div v-for="d in days" :key="'col' + d.date" class="day-col" :style="{ height: height + 'px' }">
        <i v-for="m in hours" :key="m" class="hour-line" :style="{ top: (m - range[0]) * 0.9 + 'px' }"></i>
        <div
          v-for="b in blocks.filter((x) => x.day === d.index)"
          :key="b.key"
          class="block"
          :class="'c' + b.colour"
          :style="{ top: b.top + 'px', height: b.height + 'px', left: b.left + '%', width: `calc(${b.width}% - 3px)` }"
          :title="`${b.occ.cls.code} ${b.occ.cls.name !== b.occ.cls.code ? b.occ.cls.name : ''}\n${b.occ.start}–${b.occ.end}\n${b.occ.cls.location}\n${b.occ.cls.teacher}`"
        >
          <b>{{ b.occ.cls.code }}</b>
          <span>{{ b.occ.cls.type }}</span>
          <span class="t">{{ b.occ.start }}–{{ b.occ.end }}</span>
          <span class="loc">{{ b.occ.cls.location }}</span>
        </div>
      </div>
      <div v-if="!occurrences.length" class="empty">{{ emptyText }}</div>
    </div>
  </div>
</template>
