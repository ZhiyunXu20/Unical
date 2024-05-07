<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import {ref} from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import {createEventId, INITIAL_EVENTS} from '@/utils/event'
import {useCalendarStore, useCourseStore, useUserStore} from '@/stores/index.js'
import router from '@/router/index.js'
import {useMouseInElement} from '@vueuse/core'
import ContextMenu from '@imengyu/vue3-context-menu'
import {useDbStore} from '@/stores/db.js'
import {weekOfMonthArr} from "../utils/index.js";

// 使用 ref 创建响应式变量
const calendarRef = ref(null)
const calendarStore = useCalendarStore()
const currentEvents = ref([])
const { x, y } = useMouseInElement(calendarRef)

// 定义一个处理日期选择事件的函数
const handleDateSelect = (selectInfo) => {
  let title = prompt('Please enter a new title for your event')
  let calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: createEventId(),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}

// 定义一个处理事件点击事件的函数
const handleEventClick = (clickInfo) => {
  const ob = clickInfo.event
  const data = JSON.parse(clickInfo.event.id)
  if (ob.allDay === true) {
    ElMessage.info('This is a term duration, you can not remove it')
    return
  }
  if (clickInfo.view.type === 'multiMonthYear') {
    console.log(clickInfo)
    calendarStore.gotoDate(clickInfo.event.startStr, 'timeGridWeek')
    return
  }
  if (clickInfo.view.type === 'timeGridWeek') {
    console.log(clickInfo)
    calendarStore.gotoDate(clickInfo.event.startStr, 'timeGridDay')
    return
  }
  ContextMenu.showContextMenu({
    x: x.value,
    y: y.value,
    items: [
      {
        label: 'Remove',
        onClick: () => {
          courseStore.removeRepeatEvent(data, 2)
        }
      },
      {
        label: 'Remove Repeat',
        onClick: () => {
          courseStore.removeRepeatEvent(data, 0)
        }
      },
      {
        label: 'Detail',
        onClick: () => {
          router.push({
            name: 'course-view',
            query: {
              id: data.courseId
            }
          })
        }
      }
    ]
  })
}

const handleEvents = (events) => {
  currentEvents.value = events
}
const calendarOptions = {
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    multiMonthPlugin,
    // bootstrap5Plugin,
    interactionPlugin // needed for dateClick
  ],
  // eventOrderStrict: true,
  height: 700,
  headerToolbar: {
    // prev,next,title
    left: 'prev,today,next',
    center: 'timeGridDay,timeGridWeek,multiMonthYear',
    right: 'title'
  },
  buttonText: {
    today: 'back to today',
    year: 'month',
    week: 'week',
    day: 'day'
  },
  showNonCurrentDates: false,
  fixedWeekCount: false,
  slotMinTime: '08:00:00',
  slotMaxTime: '20:00:00',
  // timeZone: 'UTC',
  // themeSystem: 'bootstrap5',
  initialView: 'timeGridWeek',
  initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
  editable: false,
  selectable: false,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventsSet: handleEvents
}

const courseStore = useCourseStore()
// eslint-disable-next-line no-undef
onMounted(async () => {
  calendarStore.setCalendarRef(calendarRef.value)
  courseStore.initUserView()
})
const dbStore = useDbStore()
const userStore = useUserStore()

// eslint-disable-next-line no-undef
const trashCount = computed(() => {
  return (dbStore.trashCourse[userStore.state.user.username] || []).length
})
</script>

<template>
  <div class="demo-app">
    <div class="demo-app-main flex flex-col">
      <div class="flex justify-between">
        <el-popover placement="top-start" :width="600" trigger="click">
          <template #reference>
            <div class="flex cursor-pointer">
              <h1>README</h1>
              <span class="my-auto ml-2"><i-ep-arrow-down-bold /></span>
            </div>
          </template>
          <el-scrollbar height="400px">
            <ReadMe></ReadMe>
          </el-scrollbar>
        </el-popover>
        <i-ep-home-filled
          @click="router.push({ name: 'main-view' })"
          class="w-8 h-8 my-auto font-black font-bold ml-4 cursor-pointer"
        />
        <div class="w-full flex">
          <div class="mx-auto mt-2">
            {{
              weekOfMonthArr().currentWeek === ''
                ? ''
                : `Week ${weekOfMonthArr().currentWeek} ${weekOfMonthArr().currentMonth}`
            }}
          </div>
        </div>
        <FullSearch />
      </div>
      <FullCalendar
        ref="calendarRef"
        class="my-auto w-full demo-app-calendar"
        :options="calendarOptions"
      >
        <template v-slot:eventContent="arg">
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
    <div class="demo-app-right">
      <div>
        <RouterView />
      </div>
      <el-affix :offset="558" v-if="userStore.state !== null && userStore.state.isAuthenticated">
        <div class="w-full flex">
          <el-badge :value="trashCount" class="item ml-auto mr-5">
            <i-ep-delete class="w-8 h-8 cursor-pointer" @click="router.push('trash-view')" />
          </el-badge>
        </div>
      </el-affix>
    </div>
  </div>
</template>

<style lang="css" scoped>
h2 {
  margin: 0;
  font-size: 16px;
}

ul {
  margin: 0;
  padding: 0 0 0 1.5em;
}

li {
  margin: 1.5em 0;
  padding: 0;
}

b {
  /* used for event dates/times */
  margin-right: 3px;
}

.demo-app {
  display: flex;
  font-family:
    Arial,
    Helvetica Neue,
    Helvetica,
    sans-serif;
  font-size: 14px;
}

.little-cal div {
  text-align: center;
}

.demo-app-right {
  width: 240px;
  height: 600px;
  overflow: auto;
  overscroll-behavior-y: auto;
  color: #fff;
  margin-right: auto;
  background: #000;
}

.demo-app-main {
  width: 800px;
  height: 600px;
}

.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}

.fc-button-group .fc-dayGridMonth-button {
  background: #fff;
}

.fc-button-primary {
  background: #fff;
}
</style>
