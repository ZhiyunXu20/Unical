import {ref} from 'vue'
import {v4 as uuidv4} from 'uuid'
import {defineStore} from 'pinia'
import {accValIfExist, addEventToCalendar, convertTermWeek, getDateByTermYearTermWeekAndDay, weekInfoMap} from '@/utils'
import {grayColor, typeInfoData} from '@/constant/index.js'
import {useDbStore} from '@/stores/db.js'
import {useUserStore} from '@/stores/user.js'
import moment from 'moment'
import {useCalendarStore} from '@/stores/calendar.js'
import {getColorSettings, getCourse, myCourse, removeCourse} from "@/service/apis/course.js";

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

    const courseData = ref([])

    const clearTable = () => {
      myTimeTableCourses.value = []
      publicTimeTableCourses.value = []
      activityTimeTableCourses.value = []
      myTimeTableCoursesParseOver.value = []
      publicTimeTableCoursesParseOver.value = []
      activityTimeTableCoursesParseOver.value = []
      db.trashCourse = []
      calendarStore.getCalInst.calendar.getEvents().forEach((item) => {
        item.remove()
      })
    }
    const initColor = async () => {
      if (userStore.state.isAuthenticated) {
        const colorSettings = await getColorSettings()
        if (colorSettings === undefined || colorSettings === null || colorSettings === '{}') {
          return typeInfoData
        }
        typeColorInfo.value = JSON.parse(colorSettings)
        return JSON.parse(colorSettings)
      } else {
        return typeInfoData
      }
    }
    const typeColorInfo = ref(typeInfoData)

    // store.setColor(courseInfo)
    const setColor = (courseInfo) => {
      typeColorInfo.value = courseInfo
    }
    // 来自于右键删除重复功能则 sourceType = 0, 其他冲突删除 模拟则删除所有根据code
    const removeRepeatEvent = async (info, sourceType) => {
      const deleteEvent = []
      const deleteEventInfo = []
      const events = await allCourse()
      events.forEach((item) => {
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
      if (db.trashCourse[userStore.state.user.username] === undefined) {
        db.trashCourse[userStore.state.user.username] = []
      }
      infoArr.forEach((item) => {
        db.trashCourse[userStore.state.user.username].push(item)
        removeCourse(item.courseId)
      })
    }
    const reBuildEvents = async () => {
      calendarStore.getCalInst.calendar.getEvents().forEach((item) => {
        item.remove()
      })
      const events = await covCalendarDate();
      events.forEach((eventInfo) => {
        const calendar = calendarStore.calendarInstance.calendar
        addEventToCalendar(calendar, eventInfo)
      })
    }

    const allCourse = async () => {
      return await covCalendarDate()
    }

    const setTimeTable = async (arr, type) => {
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
              sourceType: 0, teacher: item.teacher,
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
              teacher: item.teacher,
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
              teacher: item.teacher,
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
    const covCalendarDate = async () => {
      if (userStore.state.isAuthenticated) {
        return await myCourse()
      }
      return []
    }


    const initUserView = async () => {
      await initColor()
      const events = await covCalendarDate()
      events.forEach((eventInfo) => {
        const calendar = calendarStore.calendarInstance.calendar
        addEventToCalendar(calendar, eventInfo)
      })
    }

    const statisticsCourse = async () => {
      const typeSet = new Set()
      const statisticsInfo = new Map()
      const courses = await covCalendarDate()
      courses.forEach((item) => {
        typeSet.add(item.type)
        accValIfExist(statisticsInfo, item.type, 1)
      })
      console.log(typeColorInfo.value)

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
    const getCourseById = async (id) => {
      return await getCourse(id)
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
          summary: 'fake'
        },
        {
          id: uuidv4(),
          code: 'public activity1',
          timeStart: '11:00',
          timeEnd: '12:00',
          term: 1,
          week: 5,
          year: currentSemesterInfo.year,
          sourceType: 0,
          day: 'WED',
          summary: 'fake'
        }
      ]

      try {
        data.forEach((item) => {
          const mdate = getDateByTermYearTermWeekAndDay(
            currentSemesterInfo.year,
            'S1',
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
          console.log(calendar)
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
      initUserView,
      removeRepeatEvent,
      getColor,
      reBuildEvents,
      createFakeCourse,
      myTimeTableCourses,
      publicTimeTableCourses,
      activityTimeTableCourses,
      publicTimeTableCoursesParseOver,
      myTimeTableCoursesParseOver,
      activityTimeTableCoursesParseOver,
      courseData
    }
  },
  {
    persist: true
  }
)
