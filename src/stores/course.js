import {ref} from 'vue'
import {v4 as uuidv4} from 'uuid'
import {defineStore} from 'pinia'
import {accValIfExist, addEventToCalendar, convertTermWeek, getDateByTermYearTermWeekAndDay, weekInfoMap} from '@/utils'
import {courseData, grayColor, typeInfoData} from '@/constant/index.js'
import {useDbStore} from '@/stores/db.js'
import {useUserStore} from '@/stores/user.js'
import moment from 'moment'
import {useCalendarStore} from '@/stores/calendar.js'

export const useCourseStore = defineStore(
  'course',
  () => {
    const myTimeTableCourses = ref([])
    const publicTimeTableCourses = ref([])
    const myTimeTableCoursesParseOver = ref([])
    const publicTimeTableCoursesParseOver = ref([])
    const activityTimeTableCourses = ref([])
    const activityTimeTableCoursesParseOver = ref([])
    const db = useDbStore()
    const userStore = useUserStore()
    const calendarStore = useCalendarStore()

    const clearTable = () => {
      myTimeTableCourses.value = []
      publicTimeTableCourses.value = []
      activityTimeTableCourses.value = []
      myTimeTableCoursesParseOver.value = []
      publicTimeTableCoursesParseOver.value = []
      activityTimeTableCoursesParseOver.value = []
      db.trashCourse = []
      calendarStore.getCalInst.calendar.getEvents().forEach(item => {
        item.remove()
      })
    }
    const initColor = () => {
      if (userStore.state.isAuthenticated) {
        if (db.colorStatistics[userStore.state.user.username] !== undefined) {
          return db.colorStatistics[userStore.state.user.username]
        } else {
          return typeInfoData
        }
      } else {
        return typeInfoData
      }
    }
    const typeColorInfo = ref(initColor())

    // store.setColor(courseInfo)
    const setColor = (courseInfo) => {
      typeColorInfo.value = courseInfo
      if (userStore.state.isAuthenticated) {
        db.colorStatistics[userStore.state.user.username] = courseInfo
      }
    }
    // 来自于右键删除重复功能则 sourceType = 0, 其他冲突删除 模拟则删除所有根据code
    const removeRepeatEvent = (info, sourceType) => {
      const deleteEvent = []
      const deleteEventInfo = []
      allCourse().forEach((item) => {
        if (sourceType === 0) {
          if (
            info.type === item.type &&
            item.code === info.code &&
            moment(info.start).format('HH:mm:ss') === moment(item.start).format('HH:mm:ss') &&
            moment(info.end).format('HH:mm:ss') === moment(item.end).format('HH:mm:ss') &&
            info.day === item.day
          ) {
            deleteEvent.push(item.id)
            deleteEventInfo.push(item)
            calendarStore.getCalInst.calendar.getEventById(JSON.stringify(item)).remove()
          }
        }
        if (sourceType === 1) {
          if (item.code === info.code) {
            deleteEvent.push(item.id)
            deleteEventInfo.push(item)
            calendarStore.getCalInst.calendar.getEventById(JSON.stringify(item)).remove()
          }
        }
        if (sourceType === 2) {
          if (
            info.type === item.type &&
            item.code === info.code &&
            info.start === item.start &&
            info.end === item.end
          ) {
            deleteEvent.push(item.id)
            deleteEventInfo.push(item)
            calendarStore.getCalInst.calendar.getEventById(JSON.stringify(item)).remove()
          }
        }
      })
      deletePhyEvent(deleteEvent, deleteEventInfo)
    }

    // 本地db真是删除
    const deletePhyEvent = (deleteEvent, infoArr) => {
      myTimeTableCourses.value = myTimeTableCourses.value.filter(
        (item) => !deleteEvent.includes(item.id)
      )
      publicTimeTableCourses.value = publicTimeTableCourses.value.filter(
        (item) => !deleteEvent.includes(item.id)
      )
      activityTimeTableCourses.value = activityTimeTableCourses.value.filter(
        (item) => !deleteEvent.includes(item.id)
      )
      myTimeTableCoursesParseOver.value = myTimeTableCoursesParseOver.value.filter(
        (item) => !deleteEvent.includes(item.id)
      )
      publicTimeTableCoursesParseOver.value = publicTimeTableCoursesParseOver.value.filter(
        (item) => !deleteEvent.includes(item.id)
      )
      activityTimeTableCoursesParseOver.value = activityTimeTableCoursesParseOver.value.filter(
        (item) => !deleteEvent.includes(item.id)
      )
      if (db.trashCourse[userStore.state.user.username] === undefined) {
        db.trashCourse[userStore.state.user.username] = []
      }
      infoArr.forEach((item) => {
        db.trashCourse[userStore.state.user.username].push(item)
      })
    }
    const reBuildEvents = () => {
      calendarStore.getCalInst.calendar.getEvents().forEach(item => {
        item.remove()
      })
      covCalendarDate().forEach((eventInfo) => {
        const calendar = calendarStore.calendarInstance.calendar
        addEventToCalendar(calendar, eventInfo)
      })
    }

    const allCourse = () => {
      let data = []
      if (myTimeTableCoursesParseOver.value.length != 0) {
        data = [...data, ...myTimeTableCoursesParseOver.value]
      }
      if (publicTimeTableCoursesParseOver.value.length !== 0) {
        data = [...data, ...publicTimeTableCoursesParseOver.value]
      }
      return data
    }
    const courseNoActivity = () => {
      let data = []
      if (myTimeTableCoursesParseOver.value.length != 0) {
        data = [...data, ...myTimeTableCoursesParseOver.value]
      }
      if (publicTimeTableCoursesParseOver.value.length != 0) {
        data = [...data, ...publicTimeTableCoursesParseOver.value]
      }
      if (activityTimeTableCoursesParseOver.value.length != 0) {
        data = [...data, ...activityTimeTableCoursesParseOver.value]
      }
      if (data.length === 0) {
        return courseData
      }
      return data
    }

    const setTimeTable = (arr, type) => {
      const result = []
      if (type === 0) {
        myTimeTableCourses.value = arr
        myTimeTableCoursesParseOver.value = []
        myTimeTableCourses.value.forEach((item) => {
          const dateInfo = convertTermWeek(item.courseWeekInfo)
          for (let index = 0; index < dateInfo.length; index++) {
            const element = dateInfo[index]
            const mdate = getDateByTermYearTermWeekAndDay(
              item.year,
              element.term,
              element.week,
              weekInfoMap.get(item.day.toUpperCase())
            )
            const start = moment(mdate + ' ' + item.timeStart + ':00').format('YYYY-MM-DD HH:mm:ss')
            const end = moment(mdate + ' ' + item.timeEnd + ':00').format('YYYY-MM-DD HH:mm:ss')
            const ele = {
              id: uuidv4(),
              parentId: item.id,
              start: start,
              end: end,
              term: element.term,
              week: String(parseInt(element.week)),
              year: item.year,
              sourceType: 0,
              summary: item.code + ' ' + item.name,
              description: item.teacher,
              location: item.location,
              type: item.type,
              day: item.day,
              code: item.code,
              name: item.name,
              bgColor: typeColorInfo.value[item.type],
              uniCode: `${item.code}-${item.type}-${item.name}-${mdate}-${item.timeStart}-${item.timeEnd}`
            }
            result.push(ele)
            myTimeTableCoursesParseOver.value.push(ele)
          }
        })
      } else if (type === 1) {
        publicTimeTableCourses.value = arr
        publicTimeTableCoursesParseOver.value = []
        // 公共课表转换event时间格式
        publicTimeTableCourses.value.forEach((item) => {
          const dateInfo = convertTermWeek(item.courseWeekInfo)
          for (let index = 0; index < dateInfo.length; index++) {
            const element = dateInfo[index]
            const mdate = getDateByTermYearTermWeekAndDay(
              item.year,
              element.term,
              element.week,
              weekInfoMap.get(item.day.toUpperCase())
            )
            const start = moment(mdate + ' ' + item.timeStart + ':00').format('YYYY-MM-DD HH:mm:ss')
            const end = moment(mdate + ' ' + item.timeEnd + ':00').format('YYYY-MM-DD HH:mm:ss')
            const ele = {
              id: uuidv4(),
              parentId: item.id,
              start: start,
              end: end,
              summary: item.code + ' ' + item.name,
              description: item.teacher,
              location: item.location,
              type: item.type,
              code: item.code,
              day: item.day,
              term: element.term,
              week: String(parseInt(element.week)),
              sourceType: 1,
              year: item.year,
              name: item.name,
              // bgColor: typeColorInfo.value[item.type],
              bgColor: grayColor,
              uniCode: `${item.code}-${item.type}-${item.name}-${mdate}-${item.timeStart}-${item.timeEnd}`
            }
            result.push(ele)
            publicTimeTableCoursesParseOver.value.push(ele)
          }
        })
      } else if (type === 2) {
        activityTimeTableCourses.value = arr
        activityTimeTableCoursesParseOver.value = []
        activityTimeTableCourses.value.forEach((item) => {
          const dateInfo = convertTermWeek(item.courseWeekInfo)
          for (let index = 0; index < dateInfo.length; index++) {
            const element = dateInfo[index]
            const mdate = getDateByTermYearTermWeekAndDay(
              item.year,
              element.term,
              element.week,
              weekInfoMap.get(item.day.toUpperCase())
            )
            const start = moment(mdate + ' ' + item.timeStart + ':00').format('YYYY-MM-DD HH:mm:ss')
            const end = moment(mdate + ' ' + item.timeEnd + ':00').format('YYYY-MM-DD HH:mm:ss')
            const ele = {
              id: uuidv4(),
              parentId: item.id,
              start: start,
              end: end,
              sourceType: 2,
              term: element.term,
              week: String(parseInt(element.week)),
              year: item.year,
              day: item.day,
              summary: item.code + ' ' + item.name,
              description: item.teacher,
              location: item.location,
              type: item.type,
              code: item.code,
              name: item.name,
              bgColor: typeColorInfo.value[item.type],
              uniCode: `${item.code}-${item.type}-${item.name}-${mdate}-${item.timeStart}-${item.timeEnd}`
            }
            result.push(ele)
            activityTimeTableCoursesParseOver.value.push(ele)
          }
        })
      }
      return result
    }
    const covCalendarDate = () => {
      const data = [
        ...myTimeTableCoursesParseOver.value,
        ...publicTimeTableCoursesParseOver.value,
        ...activityTimeTableCoursesParseOver.value
      ]
      return data
    }

    const statisticsCourse = () => {
      const typeSet = new Set()
      const statisticsInfo = new Map()
      courseNoActivity().forEach((item) => {
        typeSet.add(item.type)
        accValIfExist(statisticsInfo, item.type, 1)
      })

      // 给staticsInfo 的课程添加颜色根据类型
      statisticsInfo.forEach((value, key) => {
        let colorKey = key
        if (key.includes('TEST')) {
          colorKey = 'TEST'
        }
        statisticsInfo.set(key, {
          count: value,
          color: typeColorInfo.value[colorKey]
        })
      })
      return statisticsInfo
    }

    // 根据id找到课程
    const getCourseById = (id) => {
      const all = courseNoActivity()
      return all.find((item) => item.id === id)
    }

    // 通过id 查询评论
    const findCourseCommentById = (id) => {
      if (db.commentCourse[id] === undefined) {
        return []
      } else {
        return db.commentCourse[id]
      }
    }
    const getColor = (type) => {
      return typeColorInfo.value[type]
    }

    const createFakeCourse = () => {

      const currentSemesterInfo = db.semesterInfoArr.find(
          (item) => item.username === userStore.state.user.username
      )
      const data = [
        {
          code: 'public activity1',
          id: uuidv4(),
          timeStart: '11:00',
          timeEnd: '12:00',
          term: 1,
          week: 1,
          year: currentSemesterInfo.year,
          sourceType: 0,
          day: 'WED',
          summary: 'fake',
        }, {
          id: uuidv4(),
          code: 'public activity2',
          timeStart: '11:00',
          timeEnd: '12:00',
          term: 1,
          week: 5,
          year: currentSemesterInfo.year,
          sourceType: 0,
          day: 'WED',
          summary: 'fake',
        }]


      try {
        data.forEach(item => {
          const mdate = getDateByTermYearTermWeekAndDay(
              currentSemesterInfo.year,
              "S1",
              item.week,
              weekInfoMap.get(item.day.toUpperCase())
          )

          const start = moment(mdate + ' ' + item.timeStart + ':00').format('YYYY-MM-DD HH:mm:ss')
          const end = moment(mdate + ' ' + item.timeEnd + ':00').format('YYYY-MM-DD HH:mm:ss')
          const ele = {
            id: uuidv4(),
            parentId: item.id,
            start: start,
            end: end,
            summary: item.code + ' ' + item.name,
            description: item.teacher,
            location: item.location,
            type: item.type,
            code: item.code,
            day: item.day,
            term: item.term,
            week: item.week,
            sourceType: 2,
            year: item.year,
            name: item.name,
            // bgColor: typeColorInfo.value[item.type],
            bgColor: grayColor,
            uniCode: `${item.code}-${item.type}-${item.name}-${mdate}-${item.timeStart}-${item.timeEnd}`
          }
          console.log(ele)
          const calendar = calendarStore.calendarInstance.calendar
          console.log(calendar);
          addEventToCalendar(calendar, ele)
        })
      } catch (err) {
        console.log(err)
      }
    }

    return {
      findCourseCommentById,
      allCourse,
      getCourseById,
      clearTable,
      covCalendarDate,
      setTimeTable,
      statisticsCourse,
      setColor,
      initColor,
      courseNoActivity,
      removeRepeatEvent,
      getColor,
      reBuildEvents,
      createFakeCourse,
      myTimeTableCourses,
      publicTimeTableCourses,
      activityTimeTableCourses,
      publicTimeTableCoursesParseOver,
      myTimeTableCoursesParseOver,
      activityTimeTableCoursesParseOver
    }
  },
  {
    persist: true
  }
)
