<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold /></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">My Info</span>
      </div>
    </el-header>
    <el-main>
      <el-form
        label-position="top"
        ref="myInfoFormRef"
        :model="myInfoForm"
        label-width="120px"
        class="my-info-form"
      >
        <el-form-item label="Username">
          <el-input v-model="myInfoForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="Academic Year">
          <!--          选择框-->
          <el-select v-model="myInfoForm.year" placeholder="Select a year">
            <el-option
              v-for="year in termYearOptions"
              :key="year.value"
              :label="year.label"
              :value="year.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Semester">
          <el-select v-model="myInfoForm.semester" placeholder="Select a semester">
            <el-option
              v-for="semester in semesters"
              :key="semester.value"
              :label="semester.label"
              :value="semester.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="flex flex-col justify-center items-center gap-1 w-full">
        <el-button type="primary" @click="confirmSetup">Set up</el-button>
        <span></span>
        <el-button type="primary" link @click="logout">Log out</el-button>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import {ElButton, ElContainer, ElForm, ElFormItem, ElHeader, ElInput, ElMain} from 'element-plus'
import router from '@/router/index.js'
import {useCourseStore, useUserStore} from '@/stores/index.js'
import {termYearOptions} from '@/utils'
import {useDbStore} from '@/stores/db.js'

const userStore = useUserStore()

const myInfoForm = reactive({
  username: userStore.state.user.username,
  year: '',
  semester: ''
})

// 选择学年选项
const semesters = [
  {
    label: 'Semester1',
    value: 'S1'
  },
  {
    label: 'Semester2',
    value: 'S2'
  }
]

const myInfoFormRef = ref(null)

const goBack = () => {
  // Add go back logic
  router.back()
}
const db = useDbStore()

// eslint-disable-next-line no-undef
onMounted(() => {
  const isExist = db.semesterInfoArr.find((item) => item.username === myInfoForm.username)
  if (isExist) {
    myInfoForm.year = isExist.year
    myInfoForm.semester = isExist.semester
  }
})
const confirmSetup = () => {
  // 查询是否存在该用户配置
  const isExist = db.semesterInfoArr.find((item) => item.username === myInfoForm.username)
  if (isExist) {
    //   修改已存在配置
    db.semesterInfoArr = db.semesterInfoArr.map((item) => {
      if (item.username === myInfoForm.username) {
        item.year = myInfoForm.year
        item.semester = myInfoForm.semester
      }
      return item
    })
    useCourseStore().clearTable()
  } else {
    db.semesterInfoArr.push({
      username: myInfoForm.username,
      year: myInfoForm.year,
      semester: myInfoForm.semester
    })
  }
  ElMessage({
    message: 'Set up successfully',
    type: 'success'
  })
  // //   刷新页面
  // setTimeout(() => {
  //   window.location.reload()
  // }, 1000)
}

const logout = () => {
  userStore.actions.logout()
  router.push('login')
}
</script>

<style scoped>
.logo {
  height: 40px;
  margin-right: 10px;
}
.my-info-form {
  max-width: 400px;
  margin: 0 auto;
}
</style>
