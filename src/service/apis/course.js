import {http} from '@/service/index.js'

export const batchAddCourseMeta = (data) =>
    http.post('/api/v1/course/batchAddCourseMeta', data, {})

export const myCourse = () => http.get('/api/v1/course/myCourse')

export const removeCourse = (id) =>
    http.delete(`/api/v1/course/remove?id=${id}`)


export const getCourse = (id) => http.get(`/api/v1/course/detail?id=${id}`)

export const getColorSettings = () => http.get('/api/v1/course/color')
export const saveColorSettings = (data) => http.post('/api/v1/course/color/save', data)