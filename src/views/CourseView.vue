<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold/></span>
      </el-button>
      <div class="flex my-auto w-full">
        <div class="text-base mx-auto text-[#555A8B] font-bold">
          {{ course.start !== undefined ? course.start.split(' ')[0] : "" }}
        </div>
      </div>
    </el-header>
    <div class="course-info" v-if="course !== undefined && course!=={}">
      <div class="info">
        <div class="bg-[#627BDB] header-1">{{ `${course.code} ${course.type}` }}</div>
        <div><span>Start time</span> :{{ course.start !== undefined ? course.start.split(' ')[1] : "" }}</div>
        <div><span>End time</span>:{{ course.start !== undefined ? course.end.split(' ')[1] : "" }}</div>
      </div>

      <div class="info">
        <div><span class="header">Location</span></div>
        <div class="content">{{ course.location }}</div>
      </div>
      <div class="info">
        <div><span class="header">Announcement</span></div>
        <div v-for="comment in teacherAnno" :key="comment.id" class="content">
          {{ comment.content }}
        </div>
      </div>

      <div class="info">
        <div><span class="header">Comments</span></div>
        <div class="content">
          <div v-for="comment in studentComments" :key="comment.id" class="comment">
            <div class="comment-info">
              <span class="commenter">{{ comment.username }}</span>
              <span class="comment-time">{{ comment.createTime }}</span>
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
          <el-radio-group v-if="isTeacher" v-model="commentType" class="mt-4">
            <el-radio label="0">Comment</el-radio>
            <el-radio label="1">Announcement</el-radio>
          </el-radio-group>
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
import moment from 'moment'
import {addComment} from "@/service/apis/comment.js";

const route = useRoute()
const commentType = ref('0')

const courseId = computed(() => route.query.id)
const courseStore = useCourseStore()
const course = ref({})
courseStore.getCourseById(courseId.value).then(res => {
  course.value = res
})


const comments = computed(() =>
    course.value.commentList !== undefined ? [...course.value.commentList, ...newComments.value] : []
)
const studentComments = computed(() =>
    comments.value.filter(comment => comment.typeDic === '0')
)
const teacherAnno = computed(() =>
    comments.value.filter(comment => comment.typeDic === '1')
)
const newComments = ref([])

const newComment = ref('')
const userStore = useUserStore()

const isTeacher = computed(() => {
      if (course.value.teacher === undefined || course.value.teacher === null ||
          course.value.teacher === '' || course.value.teacher.length === 0) {
        return false
      }
      course.value.teacher.split('/').forEach(teacher => {
        if (teacher === userStore.state.user.username) {
          return true
        }
      })
      return false;
    }
)
const startComment = () => {
  if (userStore.state.isAuthenticated !== true) {
    // 提示请先登录
    // eslint-disable-next-line no-undef
    ElMessage.error('Please login first')
    // 跳转到登录页面 3秒后
    setTimeout(() => {
      router.push('login')
    }, 1000)
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
    username: userStore.state.user.username,
    createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    content: newComment.value,
    courseId: courseId.value,
    typeDic: commentType.value,
  }
  addComment(newCommentData)
  newComments.value.push(newCommentData)
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
