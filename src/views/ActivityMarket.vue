<script setup>
import router from '@/router/index.js'
import {ElButton} from 'element-plus'
import {useDbStore} from '@/stores/db.js'
import {useMagicKeys} from "@vueuse/core";
import {useCourseStore} from "@/stores/index.js";

// eslint-disable-next-line no-undef
const checkBoxArr = ref([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false,])
const handleTake = () => {
  const checkedCount = checkBoxArr.value.filter((item) => {
    return item
  }).length
  if (checkedCount >= 3) {
    ElMessage.error('No More Seats！Check it again！')
  } else {
    if (countDown.value === 1) {
      dbStore.publicActs[0].remainingCount = 1
      dbStore.publicActs[0].schedule[0].remainTable = 1
      dbStore.publicActs[0].schedule[1].remainTable = 0
      dbStore.publicActs[0].schedule[2].remainTable = 1
      courseStore.createFakeCourse()
      console.log("add event succ")
      ElMessage.success('Finish Successfully！')
    }
  }

}
const dbStore = useDbStore()
// eslint-disable-next-line no-undef
const tableData = computed(() => {
  return dbStore.publicActs
})

// eslint-disable-next-line no-undef
const isShowSetInfo = ref(false)


// eslint-disable-next-line no-undef
const countDown = ref(0)

const {Space, Shift_T /* ... */} = useMagicKeys()

const courseStore = useCourseStore();


// eslint-disable-next-line no-undef
watch(Space, (v) => {
  if (v) {
    if (countDown.value === 0) {
      isShowSetInfo.value = true
      countDown.value = countDown.value + 1
    }
  }
})
// eslint-disable-next-line no-undef
watch(Shift_T, (v) => {
  if (v) {
    countDown.value = 0
    dbStore.publicActs[0].schedule[0].remainTable = 1
    dbStore.publicActs[0].schedule[1].remainTable = 2
    dbStore.publicActs[0].schedule[2].remainTable = 1
  }
})

</script>

<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">Activity Market</span>
      </div>
    </el-header>
    <el-main>
      <el-scrollbar height="450px" class="w-full">
        <NotFound v-if="tableData.length === 0" />
        <el-collapse class="w-97% my-collapse">
          <el-collapse-item
            class="w-full pl-1 w-168px"
            :name="index"
            v-for="(item, index) in tableData"
            :key="item"
          >
            <template #title>
              <div class="flex flex-row items-center justify-center gap-2 h-30">
                <div>{{ item.name }}</div>
              </div>
            </template>
            <div class="text-gray mb-2">
              {{ item.description }}
            </div>
            <div class="text-white mb-2">
              <span>Seats Available: Yes</span>
            </div>
            <template v-for="(it, index) in item.schedule" :key="index">
              <div class="border-1 border-white border-solid p-1">
                <div class="flex gap-4">
                  <el-checkbox v-model="checkBoxArr[index]" class="my-auto">
                  </el-checkbox>
                </div>
                <div class="flex gap-1">
                  <span>Week:</span>
                  <span>{{ `week${it.week}` }}</span>
                </div>
                <div class="flex gap-1">
                  <span>Day:</span>
                  <span>{{ it.day }}</span>
                </div>
                <div class="flex gap-1">
                  <span>Start Time:</span>
                  <span>{{ it.start }}</span>
                </div>
                <div class="flex gap-1">
                  <span>End Time:</span>
                  <span>{{ it.end }}</span>
                </div>
                <div class="flex gap-1">
                  <span>Seats Available:</span>
                  <span v-if="isShowSetInfo">{{ it.remainTable }}</span>
                </div>
              </div>
            </template>
            <div class="mt-2 flex justify-center">
              <ElButton type="primary" @click="handleTake(item)">Finish</ElButton>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>
.tableInfo span {
  text-align: center;
}

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
</style>