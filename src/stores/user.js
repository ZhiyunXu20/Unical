// userStore.js
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useUserStore = defineStore('user',
    () => {

  
      const state = ref({
        user: null,
        isAuthenticated: false
      })

  const actions = {
    login(user) {
      // 模拟登录逻辑
      state.value.user = user
      state.value.isAuthenticated = true
    },
    logout() {
      // 模拟登出逻辑
      state.value.user = null
      state.value.isAuthenticated = false
    }
  }

  return {
    state,
    actions
  }
    },
    {
      persist: true
    }
)
