<template>
  <div class="flex flex-col px-4">
    <fire-clock />

    <el-form
      label-position="top"
      ref="loginFormRef"
      :model="loginForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="Username" prop="username">
        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <div class="flex justify-between w-full flex-col">
        <el-space>
          <el-checkbox v-model="loginForm.checked1" />
          <el-link type="primary" @click="showPrivacy">Policy and Term of Use</el-link>
        </el-space>
      </div>
      <el-form-item>
        <div class="flex flex-col justify-center items-center gap-1 w-full">
          <el-button type="primary" @click="login">login</el-button>
          <span></span>
          <el-button class="ml-0" link type="primary" @click="router.push('register')"
            >register
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
import {useUserStore} from '@/stores/index.js'
import {useRouter} from 'vue-router'
import {useDbStore} from '@/stores/db.js'
import FireClock from '@/components/FireClock.vue'

const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
  checked1: false,
})

// eslint-disable-next-line no-undef
const loginFormRef = ref(null)
const rules = {
  username: [{ required: true, message: 'please input account', trigger: 'blur' }],
  password: [{ required: true, message: 'please input password', trigger: 'blur' }]
}

const userStore = useUserStore()
const dbStore = useDbStore()
const login = () => {
  if (!loginForm.checked1) {
    // eslint-disable-next-line no-undef
    ElMessage.error('Please agree Policy and Term of Use')
    return
  }
  loginFormRef.value.validate((valid) => {
    if (valid) {
      // 模拟登录
      const user = dbStore.registerUserArr.find((item) => item.username === loginForm.username)
      if (user && user.password === loginForm.password) {
        userStore.actions.login(user)
        router.push('/')
      } else {
        ElMessage.error('username or password error')
      }
    } else {
      ElMessage.error('please input account and password')
      return false
    }
  })
}

const showPrivacy = () => {
  // eslint-disable-next-line no-undef
  ElMessageBox({
    title: 'privacy policy',
    message: h(
      'div',
      {
        style: 'color: teal;height: 200px;overflow-y: auto;overflow-x: hidden;'
      },
      [h('span', null, 'this is privacy policy'), h('i', { style: 'color: teal' }, 'VNode')]
    ),
    confirmButtonText: 'agree'
  })
}
</script>

<style>
.el-form-item__label {
  color: white;
  font-weight: bolder;
}
</style>