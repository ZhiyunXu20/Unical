import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useDbStore = defineStore(
  'db',
  () => {
    const registerUserArr = ref([])
    const semesterInfoArr = ref([])
    const courseInfoMap = ref({})
    const colorStatistics = ref({})
    const activityInfoArr = ref({})
    const commentCourse = ref({})
    const sortOrderInfo = ref({})
    const trashCourse = ref({})
    const publicActs = ref([
      {
        id: 1,
        name: 'Public Activity1',
        remainingCount: 3,
        description: 'Running for health, 5km',
        schedule: [
          {
            week: 1,
            day: 'WED',
            start: '11:00',
            end: '12:00',
            //   剩余座位
            remainTable: 1
          },
          {
            week: 3,
            day: 'WED',
            start: '15:00',
            end: '16:00',
            //   剩余座位
            remainTable: 2
          },
          {
            week: 5,
            day: 'WED',
            start: '11:00',
            end: '12:00',
            //   剩余座位
            remainTable: 1
          },
          {
            week: 7,
            day: 'WED',
            start: '10:00',
            end: '11:00',
            //   剩余座位
            remainTable: 0
          },
          {
            week: 9,
            day: 'WED',
            start: '11:00',
            end: '12:00',
            //   剩余座位
            remainTable: 0
          },
        ]
      },
      {
        id: 2,
        name: 'Public Activity2',
        remainingCount: 8,
        description: 'running for health, 5km',
        schedule: [{
          week: 2,
          day: 'Thu',
          start: '11:00',
          end: '12:00',
          //   剩余座位
          remainTable: 3
        }, {
          week: 3,
          day: 'Wed',
          start: '9:30',
          end: '9:30',
          //   剩余座位
          remainTable: 2
        },
          {
            week: 3,
            day: 'Thu',
            start: '8:00',
            end: '9:30',
            //   剩余座位
            remainTable: 1
          },
          {
            week: 6,
            day: 'Wed',
            start: '16:00',
            end: '17:30',
            //   剩余座位
            remainTable: 3
          },
          {
            week: 2,
            day: 'Wed',
            start: '19:00',
            end: '20:30',
            //   剩余座位
            remainTable: 0
          },


        ]
      }
    ])
    return {
      commentCourse,
      trashCourse,
      registerUserArr,
      sortOrderInfo,
      semesterInfoArr,
      courseInfoMap,
      colorStatistics,
      activityInfoArr,
      publicActs
    }
  },
  {
    persist: true
  }
)