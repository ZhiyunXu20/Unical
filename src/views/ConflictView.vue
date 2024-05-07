<template>
  <el-container>
    <el-header class="flex">
      <el-button class="absolute top-4.8" link type="primary" @click="back()">
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">Conflict Management</span>
      </div>
    </el-header>
    <el-main>
      <div v-if="showWhichView === 0">
        <el-space direction="vertical" class="w-full main-button">
          <el-button @click="myTimeTableFirst()"> My Timetable First</el-button>
          <el-button @click="selfDefinedPriority()"> Self-defined Priority</el-button>
        </el-space>
      </div>
      <div v-if="showWhichView === 1">
        <el-scrollbar height="400px">
          <draggable
            v-model="myArray"
            group="people"
            @start="drag = true"
            @end="drag = false"
            item-key="id"
          >
            <template #item="{ element }">
              <div
                class="border-1 border-solid hover:cursor-pointer border-white bg-white text-black border rounded p-2 mx-2 my-1"
              >
                {{ element.name }}
              </div>
            </template>
          </draggable>
        </el-scrollbar>
        <div class="flex justify-center my-2">
          <el-button type="primary" @click="applyOrder"> Apply</el-button>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script setup>
import {ref} from 'vue'
import draggable from 'vuedraggable'
import {useCourseStore} from '@/stores/index.js'
import router from '@/router/index.js'
import {ElButton, ElContainer, ElHeader, ElMain} from 'element-plus'
import {useDbStore} from '@/stores/db.js'

const myTimeTableFirst = () => {
  ElMessage.success('Conflict resolved!')
}
const selfDefinedPriority = () => {
  showWhichView.value = 1
}

const store = useCourseStore()
const showWhichView = ref(0)

const back = () => {
  if (showWhichView.value === 0) {
    router.back()
  } else {
    showWhichView.value = 0
  }
}
const myArray = ref([])

onMounted(async () => {
  const events = await store.covCalendarDate()

  myArray.value = Array.from(
      new Set(
          events
              .filter((item) => {
                return item.code !== undefined
              })
              .map((item) => {
                return `${item.code}-${item.type}`
              })
      )
  ).map((item, index) => {
    return {id: index, name: item}
  })
})


const drag = ref(false)
const dbStore = useDbStore()
const courseStore = useCourseStore()
const applyOrder = () => {
  dbStore.sortOrderInfo =
    myArray.value.map((item, index) => {
      return {
        info: item.name,
        order: index
      }
    })

  courseStore.removeRepeatEvent({
    code: 'COMP219',
    start: "2020-10-22 09:00:00",
    end: '2020-10-22 10:00:00',
    day: 'Wed',
    type: 'LECTURE'
  }, 0)
  courseStore.removeRepeatEvent({
    code: 'COMP219',
    start: "2020-10-22 11:00:00",
    end: '2020-10-22 12:00:00',
    day: 'Tue',
    type: 'LECTURE'
  }, 0)

  ElMessage.success('Conflict resolved!')
}
</script>
