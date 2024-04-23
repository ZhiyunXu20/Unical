<script setup>
import {reactive} from 'vue'
import {useCourseStore} from '@/stores'
import router from '@/router/index.js'
import {ElButton, ElHeader} from 'element-plus'

const store = useCourseStore()

const courseInfo = reactive({})
// map转对象
store.statisticsCourse().forEach((value, key) => {
  courseInfo[key] = value
})

const applyColorSetting = () => {
  const ob = {}
  //便利courseInfo对象 对象转成颜色对象
  for (const value of Object.entries(courseInfo)) {
    ob[value[0]] = value[1].color
  }
  store.setColor(ob)
  store.reBuildEvents()
  // 重新绘制页面
  // eslint-disable-next-line no-undef
  ElMessage.success('Color setting applied successfully')
  // 3秒后刷新页面
  // setTimeout(() => {
  //   window.location.reload()
  // }, 1000)
}
</script>
<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">Statistics</span>
      </div>
    </el-header>
    <el-main>
      <div class="flex flex-col justify-end gap-4 h-full">
        <div class="grid grid-cols-3 gap-y-2 statistics">
          <span class="font-900">Type</span>
          <span class="font-900">Count</span>
          <span class="font-900">Color</span>
          <!--    template  遍历courseInfo-->
          <template v-for="value in Object.entries(courseInfo)" :key="value">
            <span class="">{{ value[0] }}</span>
            <span>{{ value[1].count }}</span>
            <!--        span 动态设置背景颜色 根据value[1].color-->
            <!--        :style="{backgroundColor: value[1].color}" class="block w-4 h-4 mx-auto"-->
            <span>
              <el-color-picker v-model="value[1].color" />
            </span>
          </template>
        </div>
      </div>
    </el-main>

    <el-footer>
      <div class="flex mt-5 w-full">
        <el-button class="mx-auto" type="primary" @click="applyColorSetting">Apply Color</el-button>
      </div>
    </el-footer>
  </el-container>
</template>
<style scoped>
.statistics span {
  text-align: center;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>