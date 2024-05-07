<script setup>
import router from '@/router/index.js'
import {useDbStore} from '@/stores/db.js'
import {useCalendarStore, useCourseStore, useUserStore} from '@/stores/index.js'
import {addEventToCalendar} from '@/utils/index.js'

const dbStore = useDbStore()
const userStore = useUserStore()

// eslint-disable-next-line no-undef
const trashArr = computed(() => {
  console.log(dbStore.trashCourse[userStore.state.user.username] || [])
  return Array.from(
    new Set(
      (dbStore.trashCourse[userStore.state.user.username] || []).map(
        (item) => `${item.code}-${item.type}`
      )
    ).values()
  )
})

const getCourseArr = (key) => {
  return dbStore.trashCourse[userStore.state.user.username].filter(
    (item) => item.code === key.split('-')[0] && item.type === key.split('-')[1]
  )
}
const courseStore = useCourseStore()
const calendarStore = useCalendarStore()
const undo = (eventInfo) => {
  const calendar = calendarStore.calendarInstance.calendar
  addEventToCalendar(calendar, eventInfo)
  dbStore.trashCourse[userStore.state.user.username] = dbStore.trashCourse[
    userStore.state.user.username
  ].filter((item) => item.id !== eventInfo.id)

  if (eventInfo.type === 'ACTIVITY') {
    courseStore.activityTimeTableCoursesParseOver.push(eventInfo)
  } else {
    if (eventInfo.sourceType === 0) {
      courseStore.myTimeTableCoursesParseOver.push(eventInfo)
    } else {
      courseStore.publicTimeTableCoursesParseOver.push(eventInfo)
    }
  }
  console.log(eventInfo)
}
</script>

<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">Trash</span>
      </div>
    </el-header>
    <el-main>
      <el-scrollbar height="450px" class="w-full">
        <NotFound v-if="trashArr.length === 0" />
        <el-collapse class="w-97% my-collapse">
          <el-collapse-item
            class="w-full pl-1 w-168px"
            :name="index"
            v-for="(item, index) in trashArr"
            :key="item"
          >
            <template #title>
              <div class="flex flex-row items-center justify-center gap-2 h-30">
                <div>{{ item }}</div>
              </div>
            </template>
            <template v-for="(it, index) in getCourseArr(item)" :key="index">
              <div class="border-1 border-white border-solid p-1">
                <div class="flex gap-1">
                  <span>Week:</span>
                  <span>{{ it.week }}</span>
                </div>
                <div class="flex gap-1">
                  <span>Day:</span>
                  <span>{{ it.day }}</span>
                </div>
                <div class="flex gap-1">
                  <span>Start Time:</span>
                  <span>{{ `week${it.start.split(' ')[1]}` }}</span>
                </div>
                <div class="flex gap-1">
                  <span>End Time:</span>
                  <span>{{ it.end.split(' ')[1] }}</span>
                </div>
                <el-button link size="small" type="primary" @click.prevent="undo(it)"
                  >Undo
                </el-button>
              </div>
            </template>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>
:deep(.el-collapse-item) {
  background: #000;
}

:deep(.el-main) {
  overflow: unset;
}

:deep(.el-collapse) {
  --el-collapse-header-height: 48px;
  --el-collapse-header-text-color: #ffffff;
  --el-collapse-header-font-size: 13px;
  --el-collapse-content-bg-color: #303133ff;
  --el-collapse-content-font-size: 13px;
  --el-collapse-content-text-color: #ffffff;
  --el-collapse-border-color: 1px solid #363637;
  --el-collapse-header-bg-color: #000;
}

.el-collapse-item__header {
  background: #000;
}

:deep(.el-collapse-item__content) {
  background: #000;
}
</style>
