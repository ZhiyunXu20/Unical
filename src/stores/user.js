// userStore.js
import {defineStore} from 'pinia'
import {ref} from 'vue'
import {login, updateUserInfo} from "@/service/apis/user.js";
import router from "@/router/index.js";
import {useCourseStore} from "@/stores/course.js";

export const useUserStore = defineStore('user',
    () => {

  
      const state = ref({
        user: null,
          token: null,
        isAuthenticated: false
      })


        const actions = {
            async login(user) {
                const data = await login(user)
                state.value.user = data
                state.value.token = data.token
                state.value.isAuthenticated = true
                // eslint-disable-next-line no-undef
                ElMessage.success('login success')
                useCourseStore().initUserView()
                setTimeout(() => {
                    router.push('/')
                }, 1000);
    },
    logout() {
      state.value.user = null
      state.value.isAuthenticated = false
    },
            async updateInfo(schoolYear, semester) {
                state.value.user.schoolYear = schoolYear
                state.value.user.semester = semester
                const user = state.value.user
                await updateUserInfo({
                    id: user.id,
                    schoolYear: user.schoolYear,
                    semester: user.semester
                });

                // eslint-disable-next-line no-undef
                ElMessage({
                    message: 'Set up successfully',
                    type: 'success'
                })
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
