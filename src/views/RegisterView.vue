<template>
  <div class="flex flex-col px-4">
    <fire-clock/>
    <el-form
      label-position="top"
      ref="registerFormRef"
      :model="registerForm"
      :rules="rules"
      label-width="120px"
      @submit.prevent="register"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="registerForm.username" placeholder="Enter username"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input
          type="password"
          v-model="registerForm.password"
          placeholder="Enter password"
        ></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="registerForm.email" placeholder="Enter email"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="flex flex-col justify-center items-center gap-1 w-full">
          <el-button type="primary" native-type="submit">Register</el-button>
          <span></span>
          <el-button link type="primary" @click="router.push('login')">Back</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {ElButton, ElForm, ElFormItem, ElInput} from 'element-plus'
import router from '@/router/index.js'
import {useDbStore} from '@/stores/db.js'
import FireClock from "@/components/FireClock.vue";

const registerForm = ref({
  username: '',
  password: '',
  email: ''
})

const registerFormRef = ref(null)

// 模拟存储
const dbStore = useDbStore()

const validateEmail = (rule, value, callback) => {
  if (value.endsWith('@liverpool.ac.uk')) {
    //  判断是否存在当前邮箱
    dbStore.registerUserArr.find((item) => item.email === value)
        ? callback(new Error('Email already exists'))
        : callback()
  } else {
    callback(new Error('Please enter a valid email address'))
  }
}
const rules = ref({
  username: [{ required: true, message: 'Please enter username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please enter password', trigger: 'blur' }],
  email: [
    { required: true, message: 'Please enter email', trigger: 'blur' },
    { type: 'email', message: 'Please enter a valid email address', trigger: ['blur', 'change'] },
    //   邮箱校验以@liverpool.ac.uk结尾
    { validator: validateEmail, trigger: 'blur' }
  ]
})
const register = () => {
  registerFormRef.value.validate((valid) => {
    if (valid) {
      // 在这里实现注册逻辑，例如向后端发送注册请求等
      // 校验是否已存在username
      if (dbStore.registerUserArr.find((item) => item.username === registerForm.value.username)) {
        ElMessage.warning('Username already exists')
        return
      }

      dbStore.registerUserArr.push({
        username: registerForm.value.username,
        password: registerForm.value.password,
        email: registerForm.value.email
      })
      ElMessage.success('Register successfully')
      // 延时跳转登录
      setTimeout(() => {
        router.push('login')
      }, 1000)
    }
  })
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
