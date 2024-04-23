import {termStudyWeekInfo} from "@/utils/func.js";
import {termDurColorEnd, termDurColorStart} from "@/utils/constant.js";

let eventGuid = 0

// 初始化S1.S2学期开始和学期结束的的时间时间
export const termStudyWeekInfoInit =
    () => {
        const initEvents = []
        termStudyWeekInfo.forEach(
            item => {
                const start = new Date(item.formDate).toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
                const end = new Date(item.toDate).toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today
                if (item.formWeek === 1) {
                    initEvents.push({
                        id: createEventId(),
                        title: `${item.term} Start`,
                        start: start,
                        borderColor: termDurColorStart,
                        backgroundColor: termDurColorStart
                    })
                }
                if (item.toWeek === 12) {
                    initEvents.push({
                        id: createEventId(),
                        title: `${item.term} End`,
                        start: end,
                        borderColor: termDurColorEnd,
                        backgroundColor: termDurColorEnd
                    })
                }
            }
        )
        return initEvents
    }
export const INITIAL_EVENTS = termStudyWeekInfoInit()

export function createEventId() {
  return String(eventGuid++)
}