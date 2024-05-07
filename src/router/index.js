import { createRouter, createWebHistory } from 'vue-router'
import MainView from '../views/MainView.vue'
import CourseStatistics from '../views/StatisticsView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MyInfo from '../views/MyInfo.vue'
import ImportView from '../views/ImportView.vue'
import AddEventView from '../views/AddEventView.vue'
import CourseView from '../views/CourseView.vue'
import SearchResultView from '../views/SearchResultView.vue'
import MyComments from '../views/MyComments.vue'
import ActivityMarket from '../views/ActivityMarket.vue'
import ConflictView from '../views/ConflictView.vue'
import TrashView from '../views/TrashView.vue'

export * from './guard'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main-view',
      component: MainView
    },
    {
      path: '/info',
      name: 'my-info',
      component: MyInfo,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login-view',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register-view',
      component: RegisterView
    },
    {
      path: '/statistics-view',
      name: 'statistics-view',
      component: CourseStatistics,
      meta: { requiresAuth: true }
    },
    {
      path: '/import-view',
      name: 'import-view',
      component: ImportView,
      meta: { requiresAuth: true }
    },
    {
      path: '/activity-market',
      name: 'activity-market',
      component: ActivityMarket,
      meta: { requiresAuth: true }
    },
    {
      path: '/add-event',
      name: 'add-event',
      component: AddEventView,
      meta: { requiresAuth: true }
    },
    {
      path: '/course-view',
      name: 'course-view',
      component: CourseView,
      meta: { requiresAuth: true }
    },
    {
      path: '/conflict-view',
      name: 'conflict-view',
      component: ConflictView,
      meta: { requiresAuth: true }
    },
    {
      path: '/trash-view',
      name: 'trash-view',
      component: TrashView,
      meta: { requiresAuth: true }
    },
    {
      path: '/search-result',
      name: 'search-result',
      component: SearchResultView,
      meta: { requiresAuth: true }
    },
    {
      path: '/my-comments',
      name: 'my-comments',
      component: MyComments,
      meta: { requiresAuth: true }
    }
  ]
})

export default router
