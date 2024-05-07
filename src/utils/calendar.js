import moment from 'moment/moment.js'
import {useCourseStore} from '@/stores/index.js'

export const addEventToCalendar = (calendar, eventInfo) => {
  const courseStore = useCourseStore()
  if (eventInfo !== undefined) {
    // 校验日期是否Invalid date
    if (!moment(eventInfo.start).isValid() || !moment(eventInfo.end).isValid()) {
      console.log('Invalid date')
      console.log(eventInfo)
      return
    }

    // 校验日期是否合规
    if (moment(eventInfo.start).isAfter(moment(eventInfo.end))) {
      console.log('start date is after end date')
      console.log(eventInfo)
      return
    }
    calendar.addEvent({
      id: JSON.stringify(eventInfo),
      title: eventInfo.code,
      start: moment(eventInfo.start).format('YYYY-MM-DD HH:mm:ss'),
      end: moment(eventInfo.end).format('YYYY-MM-DD HH:mm:ss'),
      allDay: false,
      backgroundColor: courseStore.getColor(eventInfo.type)
    })
  } else {
    console.log('eventInfo is undefined')
    console.log(eventInfo)
  }
}
