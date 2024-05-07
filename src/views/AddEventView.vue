<template>
  <el-container>
    <el-header class="flex">
      <el-button
        v-if="!addActivityVisible"
        class="absolute top-5"
        link
        type="primary"
        @click="router.back()"
      >
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">Self-defined Activity</span>
      </div>
    </el-header>
    <el-main>
      <el-space direction="vertical">
        <div v-if="!addActivityVisible">
          <div class="flex flex-col gap-2">
            <div>
              <ElButton type="primary" @click="addActivityVisible = true">Add My Activity</ElButton>
            </div>
          </div>
          <div>
            <el-scrollbar height="350px" class="w-180px">
              <el-collapse class="w-175px my-collapse">
                <el-collapse-item
                  class="w-full pl-1 w-168px"
                  :name="index"
                  v-for="(item, index) in tableData"
                  :key="item"
                >
                  <template #title>
                    <div class="flex items-center justify-center gap-2">
                      <span>{{ item.name }}</span>
                    </div>
                  </template>
                  <div class="flex gap-1">
                    <span>Code:</span>
                    <span>{{ item.code }}</span>
                  </div>
                  <div class="flex gap-1">
                    <span>Type:</span>
                    <span>{{ item.type }}</span>
                  </div>
                  <div class="flex gap-1">
                    <span>Week:</span>
                    <span>{{ item.weekOrRepeated === '0' ? `week${item.week}` : 'Repeat' }}</span>
                  </div>
                  <div class="flex gap-1">
                    <span>Day:</span>
                    <span>{{ item.day }}</span>
                  </div>
                  <el-button link size="small" type="primary" @click.prevent="deleteRow(index)"
                    >Remove
                  </el-button>
                </el-collapse-item>
              </el-collapse>
            </el-scrollbar>
          </div>
        </div>

        <div v-if="addActivityVisible">
          <!--        <img src="logo.png" alt="LOGO">-->
          <h2>Event Information</h2>
          <el-form
            ref="addEventRef"
            :model="form"
            label-position="top"
            :rules="eventRules"
            label-width="auto"
          >
            <el-form-item label="Event Name" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="Event Type" prop="type">
              <el-select v-model="form.type" placeholder="Select">
                <el-option
                  v-for="(item, index) in eventType"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :required="!isActivityRef" label="Event Code" prop="code">
              <el-input v-model="form.code"></el-input>
            </el-form-item>
            <el-form-item :required="!isActivityRef" label="Event Director" prop="teacher">
              <el-input v-model="form.teacher"></el-input>
            </el-form-item>
            <el-form-item label="Week or Repeated" prop="weekOrRepeated">
              <el-radio-group v-model="form.weekOrRepeated">
                <el-radio label="Not repeated" value="0"></el-radio>
                <el-radio label="Weekly repeated" value="1"></el-radio>
                <!--                <el-checkbox label="Holiday Week1 to Week3" value="2"></el-checkbox>-->
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="form.weekOrRepeated === '0'" label="Week" prop="week">
              <el-select v-model="form.week">
                <el-option label="Week1" value="1"></el-option>
                <el-option label="Week2" value="2"></el-option>
                <el-option label="Week3" value="3"></el-option>
                <el-option label="Week4" value="4"></el-option>
                <el-option label="Week5" value="5"></el-option>
                <el-option label="Week6" value="6"></el-option>
                <el-option label="Week7" value="7"></el-option>
                <el-option label="Week8" value="8"></el-option>
                <el-option label="Week9" value="9"></el-option>
                <el-option label="Week10" value="10"></el-option>
                <el-option label="Week11" value="11"></el-option>
                <el-option label="Week12" value="12"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="Day" prop="day">
              <el-select v-model="form.day" placeholder="Select">
                <el-option v-for="item in weekInfo" :value="item" :key="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Time Start" prop="timeStart">
              <el-input v-model="form.timeStart" placeholder="hh:mm"></el-input>
            </el-form-item>
            <el-form-item label="Time End" prop="timeEnd">
              <el-input v-model="form.timeEnd" placeholder="hh:mm"></el-input>
            </el-form-item>
            <el-form-item label="Description" prop="description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item :required="!isActivityRef" label="Location" prop="location">
              <el-input v-model="form.location"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="dialog-footer">
                <el-button link @click="cancelAddActivity">Cancel</el-button>
                <el-button link type="primary" @click="confirmAddActivity">Confirm</el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </el-space>
    </el-main>
    <div class="mx-auto">
      <el-button v-if="!addActivityVisible" class="mt-4" type="primary" @click="saveToStore"
        >Save
      </el-button>
    </div>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { addEventToCalendar, eventType } from '@/utils'
import { useCalendarStore, useCourseStore, useUserStore } from '@/stores'
import router from '@/router/index.js'
import { ElButton, ElContainer, ElHeader, ElMain } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'

const userStore = useUserStore()
const currentSemesterInfo = {
  year: userStore.state.user.schoolYear,
  semester: userStore.state.user.semester
}
const form = ref({
  name: '',
  type: 'ACTIVITY',
  code: '',
  teacher: '',
  weekOrRepeated: [],
  day: '',
  timeStart: '',
  timeEnd: '',
  description: '',
  location: '',
  year: currentSemesterInfo.year,
  semester: currentSemesterInfo.semester
})
// eslint-disable-next-line no-undef
const isActivityRef = computed(() => {
  return form.value.type === 'ACTIVITY'
})
const addEventRef = ref(null)
const eventRules = {
  name: [{ required: true, message: 'Please input event name', trigger: 'blur' }],
  type: [{ required: true, message: 'Please select event type', trigger: 'change' }],
  weekOrRepeated: [
    { required: true, message: 'Please select week or repeated', trigger: 'change' }
  ],
  week: [
    {
      required: form.value.weekOrRepeated !== '0',
      message: 'Please select week'
    }
  ],
  // 条件必输
  teacher: [
    {
      required: !isActivityRef.value,
      message: 'Please input teacher '
    }
  ],
  code: [
    {
      required: !isActivityRef.value,
      message: 'Please input code'
    }
  ],
  location: [
    {
      validator: (rule, value, callback) => {
        if (!isActivityRef.value && !value) {
          return callback(new Error('Please input correct location format'))
        }
        return true
      },
      trigger: 'blur'
    }
  ],
  day: [{ required: true, message: 'Please select day', trigger: 'change' }],
  timeStart: [
    { required: true, message: 'Please select time start', trigger: 'change' },
    // 校验是否符合11:00 整点规范
    {
      validator: (rule, value, callback) => {
        if (value && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
          return callback(new Error('Please input correct time format'))
        }
        return true
      },
      trigger: 'blur'
    }
  ],
  timeEnd: [
    { required: true, message: 'Please select time end', trigger: 'change' },
    // 校验是否符合11:00 整点规范
    {
      validator: (rule, value, callback) => {
        if (value && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
          return callback(new Error('Please input correct time format'))
        }
        return true
      },
      trigger: 'blur'
    }
  ]
}

const tableData = ref([])
const addActivityVisible = ref(false)

const resetForm = () => {
  Object.assign(form.value, {
    name: '',
    day: '',
    type: 'ACTIVITY',
    teacher: '',
    timeStart: '',
    timeEnd: '',
    date: '',
    location: '',
    desc: '',
    code: '',
    weekOrRepeated: ' []',
    week: '',
    description: '',
    year: currentSemesterInfo.year,
    semester: currentSemesterInfo.semester
  })
}

const addAct = () => {
  tableData.value.push(Object.assign({}, form.value))
}

const deleteRow = (index) => {
  tableData.value.splice(index, 1)
}
const calendarStore = useCalendarStore()
const saveToStore = () => {
  const store = useCourseStore()
  tableData.value.forEach((item) => {
    item.id = uuidv4()
    item.tableType = 2
    item.courseWeekInfo =
      item.weekOrRepeated === '0'
        ? `${currentSemesterInfo.semester} ${item.week}`
        : `${currentSemesterInfo.semester} 01-${currentSemesterInfo.semester} 12`
    item.start = item.timeStart
    item.end = item.timeEnd
  })

  // 返回可以添加时间的数据结构
  const result = store.setTimeTable(tableData.value, 2)
  result.forEach((eventInfo) => {
    const calendar = calendarStore.calendarInstance.calendar
    addEventToCalendar(calendar, eventInfo)
  })
  ElMessage({
    message: 'Save successfully',
    type: 'success'
  })
}

const weekInfo = ['MON', 'TUE', 'WED', 'THU', 'FRI']

const cancelAddActivity = () => {
  addActivityVisible.value = false
  resetForm()
}

const confirmAddActivity = () => {
  // 校验
  addEventRef.value.validate((valid) => {
    if (valid) {
      addAct()
      addActivityVisible.value = false
      if (form.value.weekOrRepeated !== 0) {
        form.value.week = []
      }
      resetForm()
    } else {
      ElMessage.warning('Please input all required fields')
      return false
    }
  })
}
const doBack = () => {
  if (!addActivityVisible.value) {
    router.back()
  } else {
    addActivityVisible.value = false
  }
}
</script>

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

.scrollbar-flex-content {
  display: flex;
}

.scrollbar-flex-content div {
  width: 70px;
}

.act-area div {
  text-align: center;
  border: 1px solid #ebeef5;
  padding: 10px;
}
</style>