<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">Timetable Import</span>
      </div>
    </el-header>
    <el-main>
      <ElSpace direction="vertical">
        <!-- 导入我的课表 -->
        <ImportMyTimeTable />
        <!-- 到处公共课表 -->
        <ImportPubTimeTable />
      </ElSpace>
    </el-main>

    <el-footer class="flex flex-col">
      <el-button type="primary" @click="finishImport" class="w-193px">Finish Import</el-button>
      <div></div>
      <el-button link @click="clear" class="mt-2 ml-auto mr-2">Clean</el-button>
    </el-footer>
  </el-container>
</template>

<script setup>
import {ElButton, ElContainer, ElFooter, ElHeader, ElMain} from 'element-plus'
import router from '@/router/index.js'
import {useCalendarStore, useCourseStore} from '@/stores/index.js'
import {addEventToCalendar} from '@/utils/index.js'
import {batchAddCourseMeta} from '@/service/apis/course.js'

const store = useCourseStore()
const calendarStore = useCalendarStore()
// eslint-disable-next-line no-undef
const isFinishImport = ref(false)
const finishImport = async () => {
  if (isFinishImport.value) {
    // 提示不要重复导入
    ElMessage({
      message: 'Please do not import repeatedly',
      type: 'warning'
    })
    return
  }
  const courses = await store.covCalendarDate()

  courses.forEach((eventInfo) => {
    const calendar = calendarStore.calendarInstance.calendar
    addEventToCalendar(calendar, eventInfo)
  })
  const pu = [...store.publicTimeTableCoursesParseOver, ...store.myTimeTableCoursesParseOver]

  await batchAddCourseMeta(pu)

  isFinishImport.value = true
  ElMessage({
    message: 'Imported successfully',
    type: 'success'
  })
  // router.push({ name: 'main-view' })
}
const clear = () => {
  store.clearTable()
  ElMessage({
    message: 'Cleaned successfully',
    type: 'success'
  })
  // setTimeout(() => {
  //   window.location.reload()
  // }, 1000)
}
</script>

<style scoped>
:deep(.el-button) {
  --el-button-text-color: #fff;
}
</style>