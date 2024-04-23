<script setup lang="jsx">
import router from '@/router/index.js'
import FireClock from '@/components/FireClock.vue'
import {useCourseStore, useUserStore} from '@/stores/index.js'
import {exportCalendar} from '@/utils/index.js'

const userStore = useUserStore()
const courseStore = useCourseStore()
const exportICS = () => {
  const data = courseStore.covCalendarDate()
  exportCalendar(data)
}
</script>

<template>
  <div class="flex flex-col">
    <fire-clock />
    <el-space direction="vertical" class="w-full main-button">
      <el-button @click="router.push('info')"> My Info</el-button>
      <el-button @click="router.push('import-view')"> Timetable Import</el-button>
      <el-button @click="router.push('add-event')"> Import Self-defined Activity</el-button>
      <el-button @click="router.push('statistics-view')"> Statistics</el-button>
      <el-button @click="router.push('activity-market')"> Activity Market</el-button>
      <el-button @click="router.push('conflict-view')"> Conflict Management</el-button>
      <el-button @click="router.push('my-comments')"> My Comments</el-button>
      <el-button @click="exportICS()"> Export ICS</el-button>
    </el-space>
  </div>
</template>

<style scoped>
.main-button .el-button {
  width: 200px;
}
</style>
