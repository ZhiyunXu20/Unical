<script setup>
import NotFound from '@/components/NotFound.vue'
import {courseData} from '@/constant/index.js'
import {ref} from 'vue'
import router from '@/router/index.js'

const resultArr = ref([])
// 查询课程根据楼宇

const currentShowRef = ref(0)
// eslint-disable-next-line no-undef
const buildings = computed(() =>
  Array.from(new Set(resultArr.value.map((course) => course.location)))
)
const selectedType = ref('')
const selectedBuilding = ref('')
const weeks = ref([])
const selectedWeek = ref('')
const dayStartTimes = ref([])
const courseTypes = ref([])
const selectedCourse = ref(null)

// Function to manually refresh the component
const refresh = (val) => {
  // MOCK data，后端开启时候代替
  resultArr.value = courseData
  // 初始化再次查询时候的变量值
  selectedType.value = ''
  selectedWeek.value = ''
  dayStartTimes.value = []
  selectedCourse.value = null
  currentShowRef.value = 0
}
const onTypeChange = (item) => {
  const filteredWeeks = Array.from(
    new Set(
      resultArr.value
        .filter((course) => course.type === item && course.location === selectedBuilding.value)
        .map((course) => course.week)
    )
  )
  weeks.value = filteredWeeks
  selectedType.value = item
  currentShowRef.value += 1
}

const onBuildingChange = (item) => {
  const types = Array.from(
    new Set(
      resultArr.value.filter((course) => course.location === item).map((course) => course.type)
    )
  )
  courseTypes.value = types
  selectedBuilding.value = item
  currentShowRef.value += 1
}

const onWeekChange = (item) => {
  const filteredDayStartTimes = resultArr.value
    .filter(
      (course) =>
        course.type === selectedType.value &&
        course.week === item &&
        course.location === selectedBuilding.value
    )
    .map((course) => ({
      id: `${course.day}-${course.startTime}`,
      day: course.day,
      startTime: course.startTime
    }))
  selectedWeek.value = item
  dayStartTimes.value = filteredDayStartTimes
  currentShowRef.value += 1
}

const onDayStartTimeChange = (item) => {
  selectedCourse.value = resultArr.value.find(
    (course) =>
      (`${course.day}-${course.startTime}` === `${item.day}-${item.startTime}`) &
      (course.location === selectedBuilding.value) &
      (course.type === selectedType.value) &
      (course.week === selectedWeek.value)
  )
  router.push({ name: 'course-view', query: { id: selectedCourse.value.id } })
}

defineExpose({
  refresh
})
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

            link
          color="white"
          v-for="building in buildings"
          :key="building"
          @click="onBuildingChange(building)"
        >
          {{ building }}
        </el-button>
      </el-space>
      <el-space direction="vertical" alignment="center" v-if="currentShowRef === 1" class="flex">
        <el-button

            link
          color="white"
          v-for="type in courseTypes"
          :key="type"
          @click="onTypeChange(type)"
        >
          {{ type }}
        </el-button>
      </el-space>
      <el-space direction="vertical" v-if="currentShowRef === 2" lass="flex">
        <el-button

            link
          color="white"
          v-for="week in weeks"
          :key="week"
          @click="onWeekChange(week)"
        >
          {{ week }}
        </el-button>
      </el-space>
      <el-space direction="vertical" v-if="currentShowRef === 3" class="flex">
        <el-button

            link
          color="white"
          v-for="dayStartTime in dayStartTimes"
          :key="dayStartTime.id"
          @click="onDayStartTimeChange(dayStartTime)"
        >
          {{ `${dayStartTime.day} - ${dayStartTime.startTime}` }}
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