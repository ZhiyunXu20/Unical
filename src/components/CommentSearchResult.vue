<script setup>
import NotFound from '@/components/NotFound.vue'
import router from '@/router/index.js'
import {useDbStore} from '@/stores/db.js'

// eslint-disable-next-line no-undef
const resultArr = ref([])

const dbStore = useDbStore()
// Function to manually refresh the component
const refresh = (val) => {
  // You can perform any necessary refresh logic here
  const comments = []
  for (let commentId in dbStore.commentCourse) {
    for (let commentCourseElementKey in dbStore.commentCourse[commentId]) {
      comments.push(dbStore.commentCourse[commentId][commentCourseElementKey])
    }
  }
  resultArr.value = comments.filter((comment) => comment.content.includes(val))
}

defineExpose({
  refresh
})
</script>

<template>
  <div v-if="resultArr == null || resultArr.length === 0">
    <NotFound />
  </div>
  <div v-else>
    <!-- comments show -->
    <div class="flex gap-4 flex-col comment-container">
      <div v-for="(comment,index) in resultArr" class="comment-elis" :key="comment.courseId"
           @click="router.push({ name: 'course-view', query: { id: comment.courseId } })">
        {{ `${index + 1}.` }} {{ comment.content }}
        </div>
    </div>
  </div>
</template>

<style scoped>
.comment-elis {
  padding: 2px 4px;
  border-radius: 5px;
  color: #ffffff;
  font-size: 16px;
  margin: 18px 0px;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  cursor: pointer;
}

.comment-container {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  padding: 0 12px;
}
</style>
