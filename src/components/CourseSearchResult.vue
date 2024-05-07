<script setup>
import NotFound from '@/components/NotFound.vue'
import {ref} from 'vue'
import router from '@/router/index.js'
import {useCourseStore} from '@/stores/index.js'

// eslint-disable-next-line no-undef
const resultArr = ref([])
const courseStore = useCourseStore()

// Function to manually refresh the component
const refresh = async (val) => {
  // MOCK data，后端开启时候代替
  const courses = await courseStore.allCourse();
  resultArr.value = courses.filter((course) => course.code === val)
  console.log(resultArr.value)
  // 初始化再次查询时候的变量值
  selectedType.value = ''
  selectedWeek.value = ''
  dayStartTimes.value = []
  selectedCourse.value = null
  currentShowRef.value = 0
}

// eslint-disable-next-line no-undef
const types = computed(() => Array.from(new Set(resultArr.value.map((course) => course.type))))
const selectedType = ref('')
const weeks = ref([])
const selectedWeek = ref('')
const dayStartTimes = ref([])
const selectedCourse = ref(null)

const onTypeChange = (item) => {
  const filteredWeeks = Array.from(
      new Set(resultArr.value.filter((course) => course.type === item).map((course) => course.week).sort((a, b) => a - b))
  )
  weeks.value = filteredWeeks
  selectedType.value = item
  currentShowRef.value += 1
}

const onWeekChange = (item) => {
  const filteredDayStartTimes = resultArr.value
    .filter((course) => course.type === selectedType.value && course.week === item)
    .map((course) => ({
      id: `${course.day}-${course.start}`,
      day: course.day,
      start: course.start
    }))
  selectedWeek.value = item
  dayStartTimes.value = filteredDayStartTimes
  currentShowRef.value += 1
}

const onDayStartTimeChange = (item) => {
  selectedCourse.value = resultArr.value.find(
    (course) =>
      `${course.day}-${course.start}` === `${item.day}-${item.start}` &&
      course.type === selectedType.value &&
      course.week === selectedWeek.value
  )

  router.push({name: 'course-view', query: {id: selectedCourse.value.courseId}})
}

defineExpose({
  refresh
})

const currentShowRef = ref(0)
</script>

<template>
  <div class="w-full flex">
    <FireClock class="mx-auto" />
  </div>

  <div v-if="resultArr == null || resultArr.length === 0">
    <NotFound />
  </div>
  <div v-else>
    <div class="course-selection">
      <el-space direction="vertical" alignment="center" v-if="currentShowRef === 0" class="flex">
        <el-button
          color="white"
          v-for="type in types"
          :key="type"
          @click="onTypeChange(type)"
        >
          {{ type }}
        </el-button>
      </el-space>
      <el-space direction="vertical" v-if="currentShowRef === 1" lass="flex">
        <el-button
            color="white"
          v-for="week in weeks"
          :key="week"
          @click="onWeekChange(week)"
        >
          week{{ week }}
        </el-button>
      </el-space>
      <el-space direction="vertical" v-if="currentShowRef === 2" class="flex">
        <el-button

            color="white"
          v-for="dayStartTime in dayStartTimes"
          :key="dayStartTime.id"
          @click="onDayStartTimeChange(dayStartTime)"
        >
          {{ `${dayStartTime.day} - ${dayStartTime.start}` }}
        </el-button>
      </el-space>
    </div>
  </div>
</template>

<style scoped>
.course-selection .el-space {
  width: 100%;
}
</style>
