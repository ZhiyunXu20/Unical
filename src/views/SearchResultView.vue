<template>
  <el-header class="flex">
    <el-button link type="primary" class="absolute top-5" @click="router.back()">
      <span><i-ep-arrow-left-bold/></span>
    </el-button>
    <div class="flex my-auto w-full">
      <span class="mx-auto">Search Result</span>
    </div>
  </el-header>
  <div>
    <div v-show="type === '0'">
      <CourseSearchResult ref="courseRef" />
    </div>
    <div v-show="type === '1'">
      <ActivitySearchResult ref="activityRef" />
    </div>
    <div v-show="type === '2'">
      <CommentSearchResult ref="commentRef" />
    </div>
    <div v-show="type === '3'">
      <LocationSearchResult ref="locationRef" />
    </div>
    <div v-show="type === '4'">
      <TeacherSearchResult ref="teacherRef"/>
    </div>
  </div>
</template>

<script setup>
import {ref, unref} from 'vue'
import {useRoute} from 'vue-router'
import CourseSearchResult from '@/components/CourseSearchResult.vue'
import router from "@/router/index.js";
import {ElButton, ElHeader} from "element-plus";

const type = computed(() => {
  return route.query.selectedType
})
const searchText = computed(() => {
  return route.query.searchText
})
const route = useRoute()

const commentRef = ref(null)
const locationRef = ref(null)
const teacherRef = ref(null)
const courseRef = ref(null)
const activityRef = ref(null)

// eslint-disable-next-line no-undef
watch(
  () => route.query.searchText,
  () => {
    init()
  }
)
// eslint-disable-next-line no-undef
onMounted(() => {
  init()
})

const init = () => {
  if (route.query.selectedType === '0') unref(courseRef).refresh(route.query.searchText)
  if (route.query.selectedType === '1') unref(activityRef).refresh(route.query.searchText)
  if (route.query.selectedType === '2') unref(commentRef).refresh(route.query.searchText)
  if (route.query.selectedType === '3') unref(locationRef).refresh(route.query.searchText)
  if (route.query.selectedType === '4') unref(teacherRef).refresh(route.query.searchText)
}
// eslint-disable-next-line no-undef
// onUpdated(() => {
//   type.value = route.query.selectedType
//   searchText.value = route.query.searchText
// })
console.log(type.value)
</script>
