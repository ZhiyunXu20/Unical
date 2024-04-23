<script setup>
import NotFound from '@/components/NotFound.vue'
import {ref} from 'vue'
import router from '@/router/index.js'
import {useCourseStore} from '@/stores/index.js'

const resultArr = ref([])
const currentShowRef = ref(0)

const courseStore = useCourseStore()
// Function to manually refresh the component
const refresh = (val) => {
  // MOCK data，后端开启时候代替
  console.log(courseStore.activityTimeTableCoursesParseOver)
  resultArr.value = courseStore.activityTimeTableCoursesParseOver.filter((course) =>
    course.name.includes(val)
  )
  currentShowRef.value = 0
}

const detail = (act) => {
  router.push({ name: 'course-view', query: { id: act.id } })
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
          v-for="act in resultArr"
          :key="act.id"
          @click="detail(act)"
        >
          {{ week }}
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
