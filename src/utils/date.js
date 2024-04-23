import {isNull, isUndefined} from '@/utils/common.js'
import {termStudyWeekInfo} from '@/utils/func.js'
import moment from 'moment'

export const getDateWeekInfo = (now) => {
  // 创建一个新的 Date 对象，代表当前日期和时间
  let today = new Date()
  if (!isUndefined(now) && !isNull(now)) {
    today = now
  }

  // 创建一个数组来存储最近七天的日期
  const recentWeekDates = []

  // 获取当前日期是星期几（0 表示星期日，1 表示星期一，以此类推）
  const todayDayOfWeek = today.getDay()

  // 计算最近七天的偏移量，以确保今天在结果中是第一天
  const offset = -todayDayOfWeek

  // 循环生成最近七天的日期
  for (let i = offset; i < offset + 7; i++) {
    // 创建一个新的 Date 对象，表示偏移后的日期
    const date = new Date(today)
    date.setDate(today.getDate() + i)

    // 将日期添加到数组中
    recentWeekDates.push(date)
  }

  // 打印最近七天的日期
  return recentWeekDates
}


export const dateOfMonthArr = (currentYear, currentMonth) => {
  // 获取当前日期
  const currentDate = new Date()

  if (currentYear === null)
    // 获取当前年份
    currentYear = currentDate.getFullYear()

  if (currentMonth === null)
    // 获取当前月份
    currentMonth = currentDate.getMonth()

  // 获取当前月份的第一天
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)

  // 获取当前月份的最后一天
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)

  // 创建一个数组来存储日期和对应星期的信息
  const datesWithWeekdays = []

  // 循环遍历当前月份的每一天
  for (let day = firstDayOfMonth; day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
    const date = new Date(day)
    const dayOfMonth = date.getDate()
    const weekday = date.getDay() // 获取星期几

    datesWithWeekdays.push({ date: dayOfMonth, weekday: weekday, dateInfo: date })
  }
  return datesWithWeekdays
}

export const weekOfMonthArr = (day) => {
  // 获取今天的日期
  const today = day !== undefined ? day : new Date()
  const todayDateString = today.toISOString().split('T')[0]

  // 初始化变量存储结果
  let currentTermYear = ''
  let currentWeek = ''

  // 遍历每个学期
  for (const term of termStudyWeekInfo) {
    // 判断今天是否在该学期的时间范围内
    if (
      today.valueOf() >=
        moment(term.formDate + ' ' + '00:00:00')
          .date()
          .valueOf() &&
      today.valueOf() <=
        moment(term.toDate + ' ' + '00:00:00')
          .date()
          .valueOf()
    ) {
      // 计算今天是该学期的第几周
      const startDate = new Date(term.formDate)
      const todayDate = new Date(todayDateString)
      const daysDiff = Math.floor((todayDate - startDate) / (1000 * 60 * 60 * 24))
      const currentWeekNumber = Math.ceil((daysDiff + 1) / 7)

      // 存储结果
      currentTermYear = term.termYear
      currentWeek = currentWeekNumber
      break
    }
  }

  // 输出结果
  //   console.log(`今天是第 ${currentWeek} 周，学年为 ${currentTermYear}`);
  return { currentWeek, currentTermYear }
}