<script setup>
import router from '@/router'
import {ref} from 'vue'

const selectedType = ref('')
const searchText = ref('')

const searchData = [
  { id: 1, name: 'Result 1', type: 'Type1' },
  { id: 2, name: 'Result 2', type: 'Type2' },
  { id: 3, name: 'Result 3', type: 'Type1' }
  // Add more data as needed
]

const search = () => {
  router.push({
    name: 'search-result',
    query: { searchText: searchText.value, selectedType: selectedType.value }
  })
}
</script>

<template>
  <div class="w-300px flex flex-row ml-auto">
    <el-select class="h-30px my-auto" v-model="selectedType" placeholder="Select Type">
      <el-option label="Code" value="0"></el-option>
      <el-option label="Activity" value="1"></el-option>
      <el-option label="Comment" value="2"></el-option>
      <el-option label="Location" value="3"></el-option>
      <el-option label="Teacher" value="4"></el-option>
    </el-select>
    <el-input
        class="my-auto h-30px"
      v-model="searchText"
      placeholder="Enter Search Text"
      @keyup.enter="search"
    ></el-input>
  </div>
</template>

<style scoped>
el-select {
  width: 200px;
}
</style>