<template>
  <el-container>
    <el-header class="flex">
      <el-button link type="primary" class="absolute top-5" @click="router.back()">
        <span><i-ep-arrow-left-bold/></span>
      </el-button>
      <div class="flex my-auto w-full">
        <span class="mx-auto">My Comments</span>
      </div>
    </el-header>
    <el-main>
      <el-scrollbar height="400px">
        <div class="flex gap-4 flex-col comment-container">
          <div v-for="(comment, index) in resultArr" class="comment-elis" :key="comment.courseId"
               @click="router.push({ name: 'course-view', query: { id: comment.courseId } })">
            {{ `${index + 1}.` }} {{ comment.content }}
          </div>
        </div>
      </el-scrollbar>
    </el-main>

  </el-container>
</template>
<script setup lang="jsx">
import router from '@/router/index.js'
import {ElButton, ElContainer, ElHeader, ElMain} from "element-plus";
import {myComment} from "@/service/apis/comment.js";

// eslint-disable-next-line no-undef
const resultArr = ref([])

myComment().then(res => {
  resultArr.value = res
})
</script>
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