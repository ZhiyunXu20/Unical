// main.js
import axios from 'axios';

// 将实例添加到 Vue 原型中，以便在组件中使用

export const http = axios.create({
    baseURL: 'https://www.baidu.com', // 设置基本 URL
    timeout: 5000, // 设置请求超时时间
    headers: {
      'Content-Type': 'application/json', // 设置请求头
    },
});