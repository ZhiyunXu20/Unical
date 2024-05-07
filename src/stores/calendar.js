import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCalendarStore = defineStore('calendar', () => {
  const calendarInstance = ref(null)
  const viewTitle = ref('')

  // eslint-disable-next-line no-undef
  const isCalendarInit = computed(() => {
    return calendarInstance.value != null
  })
  // eslint-disable-next-line no-unused-vars,no-undef
  const currentView = computed(() => {
    return calendarInstance.value.calendar.view
  })

  const calCurDate = ref(new Date())

  const setCalendarRef = (ref) => {
    calendarInstance.value = ref
  }
  // eslint-disable-next-line no-undef
  const getCalInst = computed(() => {
    return calendarInstance.value
  })

  const doPrevUni = () => {
    getCalInst.value.calendar.prev()
  }

  const doNextUni = () => {
    console.log(getCalInst.value)
    getCalInst.value.calendar.next()
  }
  const gotoDate = (date, type) => {
    getCalInst.value.calendar.changeView(type, date)
  }
  return {
    setCalendarRef,
    getCalInst,
    doPrevUni,
    doNextUni,
    calCurDate,
    gotoDate,
    calendarInstance,
    currentView,
    viewTitle,
    isCalendarInit
  }
})
