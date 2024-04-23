<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold/></span>
      </el-button>
      <div class="flex my-auto w-full">
        <div class="text-base mx-auto text-[#555A8B] font-bold">{{ course.start.split(' ')[0] }}</div>
      </div>
    </el-header>
    <div class="course-info" v-if="course !== undefined">
      <div class="info">
        <div class="bg-[#627BDB] header-1">{{ `${course.code} ${course.type}` }}</div>
        <div><span>Start time</span> :{{ course.start.split(' ')[1] }}</div>
        <div><span>End time</span>:{{ course.end.split(' ')[1] }}</div>
      </div>

      <div class="info">
        <div><span class="header">Location</span></div>
        <div class="content">{{ course.location }}</div>
      </div>
      <div class="info">
        <div><span class="header">Announcement</span></div>
        <div class="content">Announcement wait for dev</div>
      </div>

      <div class="info">
        <div><span class="header">Comments</span></div>
        <div class="content">

          <div v-if="course.term == 'S1'
        && course.week == '2'
        && course.day == 'Tue'
        && course.code == 'COMP207'
        && course.type == 'LECTURE'" v-for="comment in commentsFake" :key="comment.id" class="comment">
            <div class="comment-info">
              <span class="commenter">{{ comment.name }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
          <div v-for="comment in comments" :key="comment.id" class="comment">
            <div class="comment-info">
              <span class="commenter">{{ comment.name }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="content flex flex-col">
          <el-input
            v-model="newComment"
            type="textarea"
            clearable
            rows="5"
            placeholder="Enter your comment"
          ></el-input>
          <el-button class="mt-4 ml-auto" link type="primary" @click="startComment"
          >Submit
          </el-button>
        </div>
      </div>
    </div>
  </el-container>
</template>

<script setup>
import {ref} from 'vue'
import {ElButton, ElContainer, ElHeader, ElInput} from 'element-plus'
import {useRoute} from 'vue-router'
import router from '@/router/index.js'
import {useCourseStore, useUserStore} from '@/stores/index.js'
import {useDbStore} from '@/stores/db.js'
import moment from 'moment'
import {v4 as uuidv4} from 'uuid'

const db = useDbStore()
const route = useRoute()

const courseId = computed(() => route.query.id)
const courseStore = useCourseStore()
const course = computed(() => courseStore.getCourseById(courseId.value))
console.log(course.value)

const comments = computed(() => courseStore.findCourseCommentById(courseId.value))

const commentsFake = [
  {
    id: '1',
    name: 'Tom',
    time: '2024-04-15 12:11:35',
    content: 'This Lecture discussed the basic principles of databases.',
    courseId: '1'
  },
  {
    id: '2',
    name: 'Alice',
    time: '2024-04-17 22:12:33',
    content: 'I learned a lot from this Lecture.😄',
    courseId: '1'
  },
  {
    id: '3',
    name: 'Bob',
    time: '2024-04-16 14:12:17',
    content: 'I am still confused about the slide 5, can someone help me explain it？',
    courseId: '1'
  }
]
const newComment = ref('')
const userStore = useUserStore()
const startComment = () => {
  if (userStore.state.isAuthenticated !== true) {
    // 提示请先登录
    // eslint-disable-next-line no-undef
    ElMessage.error('Please login first')
    // 跳转到登录页面 3秒后
    setTimeout(() => {
      router.push('login')
    }, 3000)
    return
  }
  // 校验评论内容是否为空
  if (newComment.value.trim() === '') {
    // eslint-disable-next-line no-undef
    ElMessage.error('Comment content cannot be empty')
    return
  }
  newComment.value = newComment.value.trim()
  const newCommentData = {
    id: uuidv4(),
    name: userStore.state.user.username,
    time: moment().format('YYYY-MM-DD HH:mm:ss'),
    content: newComment.value,
    courseId: courseId.value
  }
  const temp = comments.value
  db.commentCourse[courseId.value] = [...temp, newCommentData]
  newComment.value = ''
}

</script>

<style scoped>
.course-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info {
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 6px;
}

.header {
  font-size: 16px;
  background-color: #8a2be2;
  color: white;
  padding: 4px 6px;
  border-radius: 5px;
}

.header-1 {
  font-size: 16px;
  color: white;
  padding: 4px 6px;
  border-radius: 5px;
}

.content {
  margin-top: 5px;
}

.comment {
  margin-bottom: 10px;
}

.comment-info {
  margin-bottom: 5px;
}

.commenter {
  font-weight: bold;
  color: #64636a;
}

.comment-time {
  margin-left: 10px;
  color: #64636a;
}

.comment-content {
  margin-left: 20px;
  color: #ffffff;
}
</style>
