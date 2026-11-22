// UI strings. English and Simplified Chinese.
export const messages = {
  en: {
    title: 'Timetable → Calendar',
    tagline: 'Turn a saved university timetable page into an .ics file for Outlook, Google Calendar or Apple Calendar.',
    privacy: 'Everything runs in your browser. Your timetable file is never uploaded anywhere.',
    from: 'Revived from Unical, a 2024 student group project.',
    step1: 'Choose your university',
    step2: 'Settings',
    step3: 'Upload your timetable',
    step4: 'Preview',
    step5: 'Add to your calendar',
    tz: 'Time zone',
    academicYear: 'Academic year',
    termDates: 'Teaching weeks',
    easterNote: 'Breaks and exam weeks have no classes, so the weeks after Easter continue the numbering.',
    autoYear: 'Detected from your file',
    week1: 'Monday of teaching week 1',
    week1Help: 'e-Bridge timetables only show week numbers, so tell us when week 1 starts (see the XJTLU academic calendar).',
    notMonday: 'This date is not a Monday.',
    reminder: 'Reminder',
    none: 'None',
    minutesBefore: (n) => `${n} min before`,
    titleStyle: 'Event title',
    titleCodeName: 'Code + name',
    titleName: 'Name only',
    types: 'Include',
    howToSave: {
      liverpool: 'On timetables.liverpool.ac.uk open "My Timetable", switch to the Semester view, then save the page (Ctrl/Cmd + S, "Webpage, HTML only").',
      xjtlu: 'In e-Bridge open your Student Timetable, then save the page (Ctrl/Cmd + S).'
    },
    drop: 'Drop the .html file here, or',
    browse: 'choose a file',
    trySample: 'No file? Try the sample timetable',
    sampleNote: 'Sample data: made-up modules and rooms.',
    wrongSchool: (s) => `This looks like a ${s} timetable.`,
    switchTo: (s) => `Switch to ${s}`,
    notTimetable: 'No timetable found in this file. Make sure you saved the page that shows the timetable grid.',
    loaded: (name, n) => `${name}: ${n} weekly classes`,
    summary: (o, f, l) => `${o} sessions from ${f} to ${l}`,
    missing: (w) => `No term dates for ${w}; those sessions were skipped.`,
    needWeek1: 'Enter the Monday of week 1 to see dates.',
    week: 'Week',
    noClassesThisWeek: 'No classes this week (break or exams).',
    prev: 'Previous week',
    next: 'Next week',
    download: 'Download .ics',
    downloadHint: (n) => `${n} events. Import this file once; importing it again updates the same events instead of duplicating them in most apps.`,
    google: 'Google Calendar',
    googleSteps: [
      'Tip: first create a new calendar (e.g. "Timetable") so you can remove it in one go later.',
      'Open Google Calendar settings → "Import & export".',
      'Select the .ics file, choose the calendar, then Import.'
    ],
    outlook: 'Outlook',
    outlookSteps: [
      'Outlook on the web / Outlook.com: Calendar → "Add calendar" → "Upload from file".',
      'Choose the .ics file and the calendar to add it to, then Import.',
      'Outlook for Windows/Mac: open the .ics file, or File → Open & Export → Import.'
    ],
    apple: 'Apple Calendar',
    appleSteps: [
      'Mac: double-click the .ics file, or Calendar → File → Import.',
      'iPhone/iPad: open the file from Files, Mail or AirDrop and tap "Add All".'
    ],
    open: 'Open',
    source: 'Source code',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  zh: {
    title: '课表 → 日历',
    tagline: '把另存的大学课表网页转换成 .ics 文件，导入 Outlook、Google 日历或苹果日历。',
    privacy: '全部在你的浏览器里完成，课表文件不会上传到任何地方。',
    from: '源自 2024 年的学生小组项目 Unical。',
    step1: '选择学校',
    step2: '设置',
    step3: '上传课表',
    step4: '预览',
    step5: '导入日历',
    tz: '时区',
    academicYear: '学年',
    termDates: '教学周',
    easterNote: '假期和考试周不排课，复活节后的周次接着往下数。',
    autoYear: '已从文件识别',
    week1: '第 1 教学周的周一',
    week1Help: 'e-Bridge 课表只有周次没有日期，请填写第 1 周从哪天开始（见西浦校历）。',
    notMonday: '这一天不是周一。',
    reminder: '提醒',
    none: '不提醒',
    minutesBefore: (n) => `提前 ${n} 分钟`,
    titleStyle: '日程标题',
    titleCodeName: '课程代码 + 名称',
    titleName: '仅名称',
    types: '包含类型',
    howToSave: {
      liverpool: '在 timetables.liverpool.ac.uk 打开 "My Timetable"，切换到 Semester 视图，然后保存网页（Ctrl/Cmd + S，选"仅 HTML"）。',
      xjtlu: '在 e-Bridge 打开 Student Timetable，然后保存网页（Ctrl/Cmd + S）。'
    },
    drop: '把 .html 文件拖到这里，或',
    browse: '选择文件',
    trySample: '没有文件？试试示例课表',
    sampleNote: '示例数据：课程和教室均为虚构。',
    wrongSchool: (s) => `这看起来是 ${s} 的课表。`,
    switchTo: (s) => `切换到 ${s}`,
    notTimetable: '文件里没有找到课表。请确认保存的是显示课表格子的那个页面。',
    loaded: (name, n) => `${name}：每周 ${n} 节课`,
    summary: (o, f, l) => `共 ${o} 次课，${f} 至 ${l}`,
    missing: (w) => `没有 ${w} 的学期日期，这些课已跳过。`,
    needWeek1: '填写第 1 周的周一后即可看到日期。',
    week: '第',
    noClassesThisWeek: '这周没有课（假期或考试周）。',
    prev: '上一周',
    next: '下一周',
    download: '下载 .ics',
    downloadHint: (n) => `共 ${n} 个日程。大多数日历应用重复导入同一文件会更新而不是重复添加。`,
    google: 'Google 日历',
    googleSteps: [
      '建议先新建一个日历（如"课表"），以后可以一键删除。',
      '打开 Google 日历设置 →「导入和导出」。',
      '选择 .ics 文件和目标日历，点击导入。'
    ],
    outlook: 'Outlook',
    outlookSteps: [
      '网页版 Outlook / Outlook.com：日历 →「添加日历」→「从文件上传」。',
      '选择 .ics 文件和目标日历，点击导入。',
      'Windows/Mac 版 Outlook：直接打开 .ics 文件，或 文件 → 打开和导出 → 导入。'
    ],
    apple: '苹果日历',
    appleSteps: [
      'Mac：双击 .ics 文件，或在日历中选 文件 → 导入。',
      'iPhone/iPad：从"文件"、邮件或隔空投送打开文件，点「全部添加」。'
    ],
    open: '打开',
    source: '源代码',
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  }
}

export function defaultLang() {
  try {
    const saved = localStorage.getItem('unical-lang')
    if (saved === 'en' || saved === 'zh') return saved
  } catch {
    /* storage unavailable */
  }
  return (navigator.language || '').toLowerCase().startsWith('zh') ? 'zh' : 'en'
}
