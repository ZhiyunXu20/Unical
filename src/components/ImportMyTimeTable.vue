<script setup>
import {parseTableHtml} from '@/utils'
import {ref} from 'vue'
import {ElMessage} from 'element-plus'
import {useCourseStore} from '@/stores/course'
import {useDbStore} from '@/stores/db.js'
import {useUserStore} from '@/stores/index.js'
import {v4 as uuidv4} from 'uuid'

const uploadRef = ref(null)
const dbStore = useDbStore()
// 找到当前登录人的学期和年份配置
const userStore = useUserStore()
const isFinishImport = ref(false)

const uploadCompClick = ref(null)
const fileList = ref([])
const selectYear = ref('')
const currentSemesterInfo = { year: userStore.state.user.schoolYear, semester: userStore.state.user.semester }
selectYear.value = currentSemesterInfo.year
const handleExceed = (files) => {
  const file = files.raw
  const isHTML = file.type === 'text/html'
  if (!isHTML) {
    ElMessage.error('limit .html file')
    uploadRef.value.clearFiles()
    return
  }

  if (selectYear.value === null || selectYear.value === undefined || selectYear.value === '') {
    ElMessage.error('Please config your semester Info first')
    uploadRef.value.clearFiles()
    return
  }
  const reader = new FileReader()
  reader.readAsText(file)
  reader.onload = () => {
    const htmlContent = reader.result
    // 原始的 HTML 表格数据
    const htmlData = htmlContent

    // 创建一个 div 元素
    const div = document.createElement('div')

    // 将 HTML 纯文本赋给 div 的 innerHTML 属性
    div.innerHTML = htmlData

    // 获取课程表格
    const table = div.querySelector('#tblSemesterView')

    // 创建一个数组来存储课程信息
    const courses = []

    // 获取表格的 tbody 元素
    const tbody = table.querySelector('tbody')

    // 遍历表格的每一行
    tbody.querySelectorAll('tr').forEach(function (row, add) {
      // 获取星期几
      const dayEles = row.querySelectorAll('.sm-days-header.emp.text-center')
      // 一天多行不同周上课
      if (dayEles === null || dayEles.length === 0) {
        const day = courses[courses.length - 1].day
        parseTableHtml(row, courses, day, add)
      } else {
        const day = dayEles[0].textContent.trim()
        parseTableHtml(row, courses, day)
      }
    })
    courses.forEach((item) => {
      item.year = selectYear.value
      item.tableType = 0
      item.id = uuidv4()
    })
    console.log(courses)
    const store = useCourseStore()
    store.setTimeTable(courses, 0)
  }
  uploadRef.value.clearFiles()
  isFinishImport.value = true
}
</script>

<template>
  <el-upload
    ref="uploadRef"
    :limit="1"
    v-model:file-list="fileList"
    :show-file-list="false"
    :on-change="handleExceed"
    :auto-upload="false"
    accept=".html"
    action="#"
  >
    <ElButton ref="uploadCompClick" type="primary" class="w-193px" :disabled="isFinishImport">
      {{ isFinishImport ? 'My Timetable ✅' : 'My Timetable' }}
    </ElButton>
  </el-upload>
</template>
