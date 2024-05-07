export const courseData = [
  {
    id: '1',
    code: 'COMP1',
    teacher: 'Doll Wang',
    name: 'Computer Science',
    day: 'Monday',
    week: 'Week 1',
    startTime: '14:00',
    endTime: '15:00',
    location: 'Comp-UU',
    type: 'Lecture'
    , date: "2024-01-05"
  },
  {
    id: '2',
    code: 'MATH2',
    teacher: 'John Doe',
    name: 'Mathematics',
    day: 'Tuesday',
    week: 'Week 2',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Math Building',
    type: 'Tutorial'
    , date: "2024-01-05"
  },
  {
    id: '3',
    code: 'PHY3',
    teacher: 'Jane Smith',
    name: 'Physics',
    day: 'Wednesday',
    week: 'Week 3',
    startTime: '13:00',
    endTime: '15:00',
    location: 'Physics Lab',
    type: 'Lab'
    , date: "2024-01-05"
  },
  {
    id: '4',
    code: 'BIO4',
    teacher: 'Alice Johnson',
    name: 'Biology',
    day: 'Thursday',
    week: 'Week 4',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Biology Building',
    type: 'Test'
    , date: "2024-01-05"
  },
  {
    id: '5',
    code: 'CHEM5',
    teacher: 'Bob Lee',
    name: 'Chemistry',
    day: 'Friday',
    week: 'Week 5',
    startTime: '11:00',
    endTime: '13:00',
    location: 'Chemistry Lab',
    type: 'Exam'
    , date: "2024-01-05"
  },
  {
    id: '6',
    code: 'ENG6',
    teacher: 'Emily Brown',
    name: 'English',
    day: 'Monday',
    week: 'Week 6',
    startTime: '08:00',
    endTime: '10:00',
    location: 'Language Building',
    type: 'Office Hour'
    , date: "2024-01-05"
  },
  {
    id: '7',
    code: 'HIS7',
    teacher: 'David Clark',
    name: 'History',
    day: 'Tuesday',
    week: 'Week 7',
    startTime: '15:00',
    endTime: '17:00',
    location: 'History Department',
    type: 'Other Event'
    , date: "2024-01-05"
  },
  {
    id: '8',
    code: 'ART8',
    teacher: 'Sophia White',
    name: 'Art',
    day: 'Wednesday',
    week: 'Week 8',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Art Studio',
    type: 'Activity'
    , date: "2024-01-05"
  },
  {
    id: '9',
    code: 'MUS9',
    teacher: 'Michael Garcia',
    name: 'Music',
    day: 'Thursday',
    week: 'Week 9',
    startTime: '12:00',
    endTime: '14:00',
    location: 'Music Room',
    type: 'Lecture'
    , date: "2024-01-05"
  },
  {
    id: '10',
    code: 'PHYS10',
    teacher: 'Olivia Martinez',
    name: 'Physical Education',
    day: 'Friday',
    week: 'Week 10',
    startTime: '09:00',
    endTime: '11:00',
    location: 'Gymnasium',
    type: 'Tutorial'
    , date: "2024-01-05"
  }
]
export const typeInfoData =
    {
      LECTURE: '#FF0000',
      TUTORIAL: '#00FF00',
      LAB: '#0000FF',
      TEST: '#FFFF00',
      EXAM: '#00FFFF',
      'OFFICE HOUR': '#FF00FF',
      'OTHER EVENT': '#C0C0C0',
      ACTIVITY: '#808080'
    }

//生成一个评论的数组，包含这个文件上面的课程id 已经评论的信息
export const commentMockData =
    [
      {
        "courseId": "1",
        "comment": "The Computer Science lecture with Doll Wang was fantastic. I learned a lot!",
        "rating": 5,
        "difficulty": 3,
        "attendance": "mandatory"
      },
      {
        "courseId": "2",
        "comment": "The Mathematics tutorial with John Doe was very helpful in understanding complex concepts.",
        "rating": 4,
        "difficulty": 4,
        "attendance": "optional"
      },
      {
        "courseId": "3",
        "comment": "The Physics lab with Jane Smith was engaging and informative. Hands-on experiments were really fun.",
        "rating": 5,
        "difficulty": 3,
        "attendance": "mandatory"
      },
      {
        "courseId": "4",
        "comment": "The Biology test with Alice Johnson was challenging but fair. It really tested my understanding of the subject.",
        "rating": 4,
        "difficulty": 5,
        "attendance": "mandatory"
      },
      {
        "courseId": "5",
        "comment": "The Chemistry exam with Bob Lee was comprehensive. Covered a wide range of topics.",
        "rating": 5,
        "difficulty": 4,
        "attendance": "mandatory"
      },
      {
        "courseId": "6",
        "comment": "Attended Emily Brown's English office hour. She provided great feedback on my writing.",
        "rating": 5,
        "difficulty": 2,
        "attendance": "optional"
      },
      {
        "courseId": "7",
        "comment": "The History other event with David Clark was intriguing. Guest speaker brought a fresh perspective.",
        "rating": 4,
        "difficulty": 1,
        "attendance": "optional"
      },
      {
        "courseId": "8",
        "comment": "Participated in Sophia White's Art activity. Enjoyed experimenting with different mediums.",
        "rating": 5,
        "difficulty": 2,
        "attendance": "optional"
      },
      {
        "courseId": "9",
        "comment": "Michael Garcia's Music lecture was enjoyable. His passion for the subject really shines through.",
        "rating": 4,
        "difficulty": 3,
        "attendance": "mandatory"
      },
      {
        "courseId": "10",
        "comment": "Olivia Martinez's Physical Education tutorial was a great workout. Learned some new exercises.",
        "rating": 5,
        "difficulty": 4,
        "attendance": "mandatory"
      }
    ]
