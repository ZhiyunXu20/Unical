// 控制访问权限 判断是否认证ex

import { useUserStore } from '@/stores/index.js'
import { useDbStore } from '@/stores/db.js'

export const createPermissionGuard = (router) => {
  const store = useUserStore()
  const dbStore = useDbStore()

  router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !store.state.isAuthenticated) {
      next({ name: 'login-view' })
    }

    if (to.meta.requiresAuth && store.state.isAuthenticated && to.name !== 'my-info') {
      const currentSemesterInfo = dbStore.semesterInfoArr.find(
        (item) => item.username === store.state.user.username
      )
      if (currentSemesterInfo === undefined) {
        ElMessage.error('Please set the semester information first')
        // 请先设置学期信息英文提示
        return
      }
    }
    next()
  })
}
