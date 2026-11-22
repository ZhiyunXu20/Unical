<script setup>
import { computed, ref, watch } from 'vue'
import {
  SCHOOLS, buildIcs, buildOccurrences, describeOccurrence, detectSchool, isMonday, parseTimetable
} from './core/index.js'
import { addDays, isoWeekday, toMinutes } from './core/time.js'
import terms from './data/liverpool-terms.json'
import { defaultLang, messages } from './i18n.js'
import WeekGrid from './WeekGrid.vue'

const lang = ref(defaultLang())
const t = computed(() => messages[lang.value])
watch(lang, (v) => {
  document.documentElement.lang = v === 'zh' ? 'zh-CN' : 'en'
  try { localStorage.setItem('unical-lang', v) } catch { /* ignore */ }
}, { immediate: true })

// 1. School
const school = ref('liverpool')
const schoolInfo = computed(() => SCHOOLS[school.value])

// 2. Settings
const years = Object.keys(terms.years)
const academicYear = ref(guessYear())
const yearFromFile = ref(false)
const week1Monday = ref('')
const alarmMinutes = ref(0)
const titleStyle = ref('code-name')
const excludedTypes = ref([])

function guessYear() {
  const now = new Date()
  const start = now.getUTCMonth() >= 7 ? now.getUTCFullYear() : now.getUTCFullYear() - 1
  const label = `${start}/${String(start + 1).slice(2)}`
  return years.includes(label) ? label : years[years.length - 1]
}

// 3. Upload
const parsed = ref(null)
const fileName = ref('')
const error = ref('')
const otherSchool = ref(null)
const dragging = ref(false)
const fileInput = ref(null)

function loadHtml(text, name) {
  error.value = ''
  otherSchool.value = null
  const doc = new DOMParser().parseFromString(text, 'text/html')
  const detected = detectSchool(doc)
  if (!detected) {
    error.value = t.value.notTimetable
    return
  }
  if (detected !== school.value) {
    otherSchool.value = { id: detected, text, name }
    return
  }
  try {
    const result = parseTimetable(doc, detected)
    if (result.classes.length === 0) throw new Error('empty')
    parsed.value = result
    fileName.value = name
    excludedTypes.value = []
    const hinted = result.hints.academicYear
    if (hinted && terms.years[hinted]) {
      academicYear.value = hinted
      yearFromFile.value = true
    }
  } catch {
    error.value = t.value.notTimetable
  }
}

function switchSchool() {
  const pending = otherSchool.value
  school.value = pending.id
  loadHtml(pending.text, pending.name)
}

async function onFiles(files) {
  const file = files?.[0]
  if (!file) return
  loadHtml(await file.text(), file.name)
}

function onDrop(e) {
  dragging.value = false
  onFiles(e.dataTransfer.files)
}

async function loadSample() {
  const res = await fetch(`${import.meta.env.BASE_URL}samples/${school.value}-sample.html`)
  loadHtml(await res.text(), `${school.value}-sample.html`)
  if (school.value === 'xjtlu' && !week1Monday.value) week1Monday.value = nextMonday()
}

function nextMonday() {
  const today = new Date().toISOString().slice(0, 10)
  return addDays(today, (8 - isoWeekday(today)) % 7)
}

watch(school, () => {
  if (parsed.value && parsed.value.school !== school.value) {
    parsed.value = null
    fileName.value = ''
  }
  yearFromFile.value = false
})

// 4. Preview
const types = computed(() => [...new Set((parsed.value?.classes ?? []).map((c) => c.type))].sort())
const activeClasses = computed(() =>
  (parsed.value?.classes ?? []).filter((c) => !excludedTypes.value.includes(c.type))
)
const week1Invalid = computed(() => school.value === 'xjtlu' && week1Monday.value && !isMonday(week1Monday.value))

const schedule = computed(() => {
  if (!parsed.value) return null
  if (school.value === 'xjtlu' && (!week1Monday.value || week1Invalid.value)) return null
  return buildOccurrences(activeClasses.value, {
    school: school.value,
    yearData: terms.years[academicYear.value],
    week1Monday: week1Monday.value
  })
})
const occurrences = computed(() => schedule.value?.occurrences ?? [])

// Weeks shown in the preview: every Monday from the first to the last class.
const weekMondays = computed(() => {
  const occ = occurrences.value
  if (!occ.length) return []
  const mondayOf = (d) => addDays(d, 1 - isoWeekday(d))
  const out = []
  for (let m = mondayOf(occ[0].date); m <= occ[occ.length - 1].date; m = addDays(m, 7)) out.push(m)
  return out
})
const weekIndex = ref(0)
watch(weekMondays, () => { weekIndex.value = 0 })
const currentMonday = computed(() => weekMondays.value[weekIndex.value])
const weekOccurrences = computed(() => {
  const m = currentMonday.value
  if (!m) return []
  const end = addDays(m, 7)
  return occurrences.value.filter((o) => o.date >= m && o.date < end)
})
const weekLabel = computed(() => {
  const first = weekOccurrences.value[0]
  if (!first) return ''
  const term = first.term ? ` · ${first.term}` : ''
  return lang.value === 'zh' ? `第 ${first.week} 周${term}` : `Week ${first.week}${term}`
})
const showWeekend = computed(() => activeClasses.value.some((c) => c.day >= 6))
const dayRange = computed(() => {
  const mins = activeClasses.value.flatMap((c) => [toMinutes(c.start), toMinutes(c.end)])
  if (!mins.length) return [9 * 60, 18 * 60]
  return [Math.floor(Math.min(...mins) / 60) * 60, Math.ceil(Math.max(...mins) / 60) * 60]
})

const yearSegments = computed(() => terms.years[academicYear.value] ?? {})

// 5. Export
const icsEvents = computed(() => occurrences.value.map((o) => describeOccurrence(o, { titleStyle: titleStyle.value })))
const exportName = computed(() => {
  if (school.value === 'liverpool') {
    const term = parsed.value?.hints.term ? `-${parsed.value.hints.term}` : ''
    return `liverpool-${academicYear.value.replace('/', '-')}${term}.ics`
  }
  return `xjtlu-from-${week1Monday.value}.ics`
})

function download() {
  const ics = buildIcs(icsEvents.value, {
    tzid: schoolInfo.value.tzid,
    calendarName: school.value === 'liverpool' ? `Timetable ${academicYear.value}` : 'XJTLU timetable',
    alarmMinutes: Number(alarmMinutes.value)
  })
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = exportName.value
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString(lang.value === 'zh' ? 'zh-CN' : 'en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC'
  })
</script>

<template>
  <header class="top">
    <div class="wrap top-inner">
      <div class="brand">
        <span class="logo" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </span>
        <span>Unical</span>
      </div>
      <div class="lang" role="group" aria-label="Language">
        <button :class="{ on: lang === 'en' }" @click="lang = 'en'">EN</button>
        <button :class="{ on: lang === 'zh' }" @click="lang = 'zh'">中文</button>
      </div>
    </div>
  </header>

  <main class="wrap">
    <section class="hero">
      <h1>{{ t.title }}</h1>
      <p class="lead">{{ t.tagline }}</p>
      <p class="privacy">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
        {{ t.privacy }}
      </p>
    </section>

    <!-- 1. School -->
    <section class="card">
      <h2><span class="num">1</span>{{ t.step1 }}</h2>
      <div class="schools">
        <label v-for="s in Object.values(SCHOOLS)" :key="s.id" class="school" :class="{ on: school === s.id }">
          <input v-model="school" type="radio" name="school" :value="s.id" />
          <span class="school-name">{{ s.id === 'liverpool' ? 'Liverpool' : 'XJTLU' }}</span>
          <span class="school-full">{{ s.name }}</span>
          <span class="school-tz">{{ t.tz }}: {{ s.tzid }}</span>
        </label>
      </div>
    </section>

    <!-- 2. Settings -->
    <section class="card">
      <h2><span class="num">2</span>{{ t.step2 }}</h2>
      <div class="settings">
        <template v-if="school === 'liverpool'">
          <label class="field">
            <span>{{ t.academicYear }}</span>
            <select v-model="academicYear" @change="yearFromFile = false">
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
            <small v-if="yearFromFile" class="ok">{{ t.autoYear }}</small>
          </label>
          <div class="field wide">
            <span>{{ t.termDates }}</span>
            <div class="segments">
              <div v-for="term in ['S1', 'S2']" :key="term" class="seg-row">
                <b>{{ term }}</b>
                <span v-for="seg in yearSegments[term]" :key="seg.start" class="seg">
                  {{ lang === 'zh' ? `第 ${seg.fromWeek}–${seg.toWeek} 周` : `Weeks ${seg.fromWeek}–${seg.toWeek}` }}
                  · {{ formatDate(seg.start) }}
                </span>
              </div>
            </div>
            <small>{{ t.easterNote }}</small>
          </div>
        </template>
        <template v-else>
          <label class="field">
            <span>{{ t.week1 }}</span>
            <input v-model="week1Monday" type="date" />
            <small v-if="week1Invalid" class="bad">{{ t.notMonday }}</small>
            <small v-else>{{ t.week1Help }}</small>
          </label>
        </template>
        <label class="field">
          <span>{{ t.reminder }}</span>
          <select v-model="alarmMinutes">
            <option :value="0">{{ t.none }}</option>
            <option v-for="n in [10, 15, 30, 60]" :key="n" :value="n">{{ t.minutesBefore(n) }}</option>
          </select>
        </label>
        <label class="field">
          <span>{{ t.titleStyle }}</span>
          <select v-model="titleStyle">
            <option value="code-name">{{ t.titleCodeName }}</option>
            <option value="name">{{ t.titleName }}</option>
          </select>
        </label>
      </div>
    </section>

    <!-- 3. Upload -->
    <section class="card">
      <h2><span class="num">3</span>{{ t.step3 }}</h2>
      <p class="hint">{{ t.howToSave[school] }}</p>
      <div
        class="drop"
        :class="{ dragging }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>{{ t.drop }} <button class="link" @click="fileInput.click()">{{ t.browse }}</button></span>
        <input ref="fileInput" type="file" accept=".html,.htm,text/html" hidden @change="onFiles($event.target.files); $event.target.value = ''" />
      </div>
      <div class="upload-foot">
        <button class="ghost" @click="loadSample">{{ t.trySample }}</button>
        <span v-if="parsed" class="ok">✓ {{ t.loaded(fileName, parsed.classes.length) }}</span>
      </div>
      <p v-if="fileName.endsWith('-sample.html')" class="note">{{ t.sampleNote }}</p>
      <p v-if="error" class="alert">{{ error }}</p>
      <p v-if="otherSchool" class="alert">
        {{ t.wrongSchool(otherSchool.id === 'liverpool' ? 'Liverpool' : 'XJTLU') }}
        <button class="link" @click="switchSchool">{{ t.switchTo(otherSchool.id === 'liverpool' ? 'Liverpool' : 'XJTLU') }}</button>
      </p>
    </section>

    <!-- 4. Preview -->
    <section v-if="parsed" class="card">
      <h2><span class="num">4</span>{{ t.step4 }}</h2>
      <div v-if="types.length > 1" class="types">
        <span class="types-label">{{ t.types }}</span>
        <label v-for="ty in types" :key="ty" class="chip" :class="{ off: excludedTypes.includes(ty) }">
          <input v-model="excludedTypes" type="checkbox" :value="ty" hidden />
          {{ ty }}
        </label>
      </div>
      <p v-if="!schedule" class="note">{{ t.needWeek1 }}</p>
      <template v-else>
        <p v-if="occurrences.length" class="summary">
          {{ t.summary(occurrences.length, formatDate(occurrences[0].date), formatDate(occurrences[occurrences.length - 1].date)) }}
        </p>
        <p v-if="schedule.missing.length" class="alert">{{ t.missing(schedule.missing.join(', ')) }}</p>
        <div v-if="weekMondays.length" class="week-nav">
          <button class="icon" :disabled="weekIndex === 0" :aria-label="t.prev" @click="weekIndex--">‹</button>
          <div class="week-title">
            <b>{{ weekLabel || '—' }}</b>
            <span>{{ formatDate(currentMonday) }} – {{ formatDate(addDays(currentMonday, showWeekend ? 6 : 4)) }}</span>
          </div>
          <button class="icon" :disabled="weekIndex >= weekMondays.length - 1" :aria-label="t.next" @click="weekIndex++">›</button>
        </div>
        <input
          v-if="weekMondays.length > 1"
          v-model.number="weekIndex"
          class="week-slider"
          type="range"
          min="0"
          :max="weekMondays.length - 1"
          :aria-label="t.week"
        />
        <WeekGrid
          v-if="currentMonday"
          :monday="currentMonday"
          :occurrences="weekOccurrences"
          :show-weekend="showWeekend"
          :range="dayRange"
          :day-names="t.days"
          :empty-text="t.noClassesThisWeek"
        />
      </template>
    </section>

    <!-- 5. Export -->
    <section v-if="parsed && occurrences.length" class="card">
      <h2><span class="num">5</span>{{ t.step5 }}</h2>
      <div class="export">
        <button class="primary" @click="download">
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          {{ t.download }}
        </button>
        <span class="muted">{{ exportName }}</span>
      </div>
      <p class="muted small">{{ t.downloadHint(icsEvents.length) }}</p>
      <div class="apps">
        <article class="app">
          <h3>{{ t.google }}</h3>
          <ol><li v-for="s in t.googleSteps" :key="s">{{ s }}</li></ol>
          <a href="https://calendar.google.com/calendar/r/settings/export" target="_blank" rel="noopener">{{ t.open }} {{ t.google }} ↗</a>
        </article>
        <article class="app">
          <h3>{{ t.outlook }}</h3>
          <ol><li v-for="s in t.outlookSteps" :key="s">{{ s }}</li></ol>
          <a href="https://outlook.live.com/calendar/0/addcalendar" target="_blank" rel="noopener">{{ t.open }} Outlook.com ↗</a>
        </article>
        <article class="app">
          <h3>{{ t.apple }}</h3>
          <ol><li v-for="s in t.appleSteps" :key="s">{{ s }}</li></ol>
        </article>
      </div>
    </section>
  </main>

  <footer class="wrap foot">
    <span>{{ t.from }}</span>
    <a href="https://github.com/ZhiyunXu20/Unical/tree/demo" target="_blank" rel="noopener">{{ t.source }} ↗</a>
  </footer>
</template>
