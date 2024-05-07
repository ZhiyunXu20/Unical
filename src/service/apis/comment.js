import {http} from "@/service/index.js";

export const addComment = (data) => http.post('/api/v1/comment/save', data, {})
export const myComment = () => http.get('/api/v1/comment/myComments')
export const queryComment = (content) => http.get('/api/v1/comment/query?content=' + content)

