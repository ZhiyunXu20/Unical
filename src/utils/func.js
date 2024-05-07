import moment from 'moment'
import ical, {ICalCalendarMethod} from 'ical-generator'

export const parseTableHtml = (row, courses, day, addC = 0) => {
  let timeSpan = 0
  // eslint-disable-next-line no-multiple-empty-lines
  const timeArr = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00'
  ]
  for (let index = 0; index < row.cells.length; index++) {
    const cell = row.cells[index]
    if (cell.classList.contains('sm-event')) {
      // 解析课程信息
      const course = {}
      course.day = day
      if (addC !== 0) {
        addC = 1
      }
      course.timeStart = timeArr[index - 1 + timeSpan + addC]
      timeSpan = timeSpan + parseInt(cell.getAttribute('colspan') - 1)
      course.timeEnd = timeArr[index - 1 + timeSpan + addC]
      course.timeEnd = moment('2020-10-10' + ' ' + course.timeEnd + ':00')
        .add(30, 'm')
        .format('HH:mm')
      const desc = cell.querySelector('.emp').textContent.trim()
      const pattern = /^(.*?) - (.*?) \[(.*?) (.*?)\]$/
      // 使用正则表达式匹配字符串
      const matches = desc.match(pattern)
      // 提取匹配的信息
      if (matches) {
        course.code = matches[1].trim()
        course.name = matches[2].trim()
        course.mode = matches[3].trim()
        course.type = matches[4].trim()

        if (course.type.startsWith('CAMPUS')) {
          course.type = course.type.split('CAMPUS ')[1]
        }
        if (eventType.indexOf(course.type.toUpperCase()) === -1) {
          course.type = 'OTHER EVENT'
        }
        if (course.type.toUpperCase().includes('TEST')) {
          course.type = 'TEST'
        }

        if (course.type.toUpperCase().includes('LAB')) {
          course.type = 'LAB'
        }
        if (course.type.toUpperCase().includes('TUTORIAL')) {
          course.type = 'TUTORIAL'
        }
      } else {
        console.log('未匹配到任何信息。')
      }

      const termStr = cell.querySelectorAll('p')[5].textContent.trim()
      course.courseWeekInfo = termStr
      const link = cell.querySelector('p:nth-child(3) a')
      if (link) {
        course.link = link.getAttribute('href')
      }
      course.teacher = cell.querySelectorAll('p')[3].textContent.trim()
      course.location = cell.querySelectorAll('p')[4].textContent.trim()

      // 将课程信息添加到数组中
      courses.push(course)
    }
  }
}


export const accValIfExist = (dataMap, key, defaultVal) => {
  if (dataMap.has(key)) {
    const val = dataMap.get(key)
    dataMap.set(key, 1 + val)
  } else {
    dataMap.set(key, defaultVal)
  }
}

export const exportCalendar = (arr) => {
  const calendar = ical({ name: 'my timetable ics' })

  // A method is required for outlook to display event as an invitation
  calendar.method(ICalCalendarMethod.REQUEST)

  arr.forEach((item) => {
    try {
      calendar.createEvent(item)
    } catch (err) {
      console.log(err)
    }
  })

  downloadFile(calendar.toString(), 'timeTable.ics', 'text/calendar; charset=utf-8')
}




function downloadFile(data, filename, type) {
  const blob = new Blob([data], { type: type });

  // 创建下载链接
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;

  // 确保链接在点击后可以被移除
  link.onclick = function() {
      setTimeout(function() {
          window.URL.revokeObjectURL(link.href);
      }, 1500);
  };

  // 添加链接到 DOM 并触发点击
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export const timeAreaArr = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00'
]

export const eventType = [
  'LECTURE',
  'TUTORIAL',
  'LAB',
  'EXAM',
  'OFFICE HOUR',
  'CLASS TEST',
  'TEST',
  'ACTIVITY',
  'DROP-IN',
  'OTHER EVENT'
]


export const termStudyWeekInfo = [
  {
    formDate: '2022-09-26',
    toDate: '2022-12-16',
    formWeek: 1,
    toWeek: 12,
    term: 'S1',
    termYear: '2023',
    label: '2022/23'
  },
  {
    formDate: '2023-01-30',
    toDate: '2023-03-24',
    formWeek: 1,
    toWeek: 8,
    term: 'S2',
    termYear: '2023',
    label: '2022/23'
  },
  {
    formDate: '2023-04-17',
    toDate: '2023-05-12',
    formWeek: 9,
    toWeek: 12,
    term: 'S2',
    termYear: '2023',
    label: '2022/23'
  },
  {
    formDate: '2023-09-25',
    toDate: '2023-12-15',
    formWeek: 1,
    toWeek: 12,
    term: 'S1',
    termYear: '2024',
    label: '2023/24'
  },
  {
    formDate: '2024-01-29',
    toDate: '2024-03-22',
    formWeek: 1,
    toWeek: 8,
    term: 'S2',
    termYear: '2024',
    label: '2023/24'
  },
  {
    formDate: '2024-04-15',
    toDate: '2024-05-10',
    formWeek: 9,
    toWeek: 12,
    term: 'S2',
    termYear: '2024',
    label: '2023/24'
  },
  {
    formDate: '2024-09-23',
    toDate: '2024-12-13',
    formWeek: 1,
    toWeek: 12,
    term: 'S1',
    termYear: '2025',
    label: '2024/25'
  },
  {
    formDate: '2025-01-27',
    toDate: '2025-04-04',
    formWeek: 1,
    toWeek: 10,
    term: 'S2',
    termYear: '2025',
    label: '2024/25'
  },
  {
    formDate: '2025-04-28',
    toDate: '2025-05-09',
    formWeek: 11,
    toWeek: 12,
    term: 'S2',
    termYear: '2025',
    label: '2024/25'
  },
  {
    formDate: '2025-09-22',
    toDate: '2025-12-12',
    formWeek: 1,
    toWeek: 12,
    term: 'S1',
    termYear: '2026',
    label: '2025/26'
  },
  {
    formDate: '2026-01-26',
    toDate: '2026-03-20',
    formWeek: 1,
    toWeek: 8,
    term: 'S2',
    termYear: '2026',
    label: '2025/26'
  },
  {
    formDate: '2026-04-13',
    toDate: '2025-05-08',
    formWeek: 9,
    toWeek: 12,
    term: 'S2',
    termYear: '2026',
    label: '2025/26'
  },
  {
    formDate: '2026-09-28',
    toDate: '2026-12-18',
    formWeek: 1,
    toWeek: 12,
    term: 'S1',
    termYear: '2027',
    label: '2026/27'
  },
  {
    formDate: '2027-02-01',
    toDate: '2027-03-19',
    formWeek: 1,
    toWeek: 7,
    term: 'S2',
    termYear: '2027',
    label: '2026/27'
  },
  {
    formDate: '2027-04-12',
    toDate: '2027-05-14',
    formWeek: 8,
    toWeek: 12,
    term: 'S2',
    termYear: '2027',
    label: '2026/27'
  }
]

// 获取所有termYear 的选择项 {label:2023,value:2023}，不重复
export const termYearOptions = Array.from(
  new Set(termStudyWeekInfo.map((info) => `${info.termYear}-${info.label}`)).values()
).map((year) => ({
  label: year.split('-')[1],
  value: year.split('-')[0]
}))



export function getDateByTermYearTermWeekAndDay(termYear, term, week, dayOfWeek) {
  const termInfos = termStudyWeekInfo.filter(info => info.termYear === termYear && info.term === term);
  if (termInfos.length === 0) {
      return null; // 如果找不到对应的学期信息，返回 null
  }

  for (const termInfo of termInfos) {
      if (week >= termInfo.formWeek && week <= termInfo.toWeek) {
          const startDate = new Date(termInfo.formDate);
          const targetDate = new Date(startDate.getTime() + (week - termInfo.formWeek) * 7 * 24 * 60 * 60 * 1000); // 计算目标周的起始日期

          // 根据目标周的起始日期和星期几，计算出对应的日期
          const diff = dayOfWeek - targetDate.getDay();
          targetDate.setDate(targetDate.getDate() + diff);
        return moment(targetDate).format('YYYY-MM-DD') // 返回日期字符串，格式为 YYYY-MM-DD
      }
  }

  return null; // 如果找不到包含目标周的学期信息，返回 null
}

export function  convertTermWeek(weekString) {
  const result = []
  const parts = weekString.split(',')
  const newParts = []
  parts.forEach((part) => {
    newParts.push(part.trim())
  })

  newParts.forEach((part) => {
    if (part.indexOf('-') !== -1) {
      part = part.trim()
      const [startI, endI] = part.split('-')
      const [start, end] = [startI.split(' ')[1], endI.split(' ')[1]]
      const termValue = startI.split(' ')[0].trim()
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        result.push({ term: termValue, week: String(i) })
      }
    } else {
      result.push({ term: part.split(' ')[0], week: part.split(' ')[1] })
    }
  })

  return result
}
// 创建一个新的映射对象
export const weekInfoMap = new Map();

// 向映射对象中添加键值对
weekInfoMap.set('MON', 1);
weekInfoMap.set('TUE', 2);
weekInfoMap.set('WED', 3);
weekInfoMap.set('THU', 4);
weekInfoMap.set('FRI', 5);
weekInfoMap.set('SAT', 6);
weekInfoMap.set('SUN', 7);

  