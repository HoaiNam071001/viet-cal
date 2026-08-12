export interface DiaryTemplateDef {
  id: string
  name: string
  emoji: string
  promptQuestions: string[]
  defaultMoodEmoji?: string
}

/** Built-in quick-write prompts. Not user-editable — just a faster way to start an entry. */
export const DIARY_TEMPLATES: DiaryTemplateDef[] = [
  {
    id: 'morning-reflection',
    name: 'Phản ánh buổi sáng',
    emoji: '🌅',
    promptQuestions: ['Điều bạn biết ơn hôm nay?', 'Mục tiêu hôm nay là gì?', 'Tâm trạng lúc này ra sao?'],
  },
  {
    id: 'evening-review',
    name: 'Tổng kết buổi tối',
    emoji: '🌙',
    promptQuestions: ['Điều gì đã diễn ra tốt đẹp?', 'Điều gì là thử thách?', 'Bạn học được gì hôm nay?'],
  },
  {
    id: 'exercise-log',
    name: 'Nhật ký tập luyện',
    emoji: '🏃',
    promptQuestions: ['Loại bài tập?', 'Thời lượng?', 'Cảm giác sau khi tập?'],
    defaultMoodEmoji: '😊',
  },
  {
    id: 'travel-journal',
    name: 'Nhật ký du lịch',
    emoji: '✈️',
    promptQuestions: ['Bạn đã đi đâu?', 'Hoạt động nổi bật?', 'Đi cùng ai?', 'Điều muốn nhớ nhất?'],
  },
  {
    id: 'health-check',
    name: 'Theo dõi sức khoẻ',
    emoji: '🩺',
    promptQuestions: ['Giấc ngủ đêm qua thế nào?', 'Mức năng lượng hôm nay?', 'Có triệu chứng gì không?'],
  },
]

export function buildTemplateContent(template: DiaryTemplateDef): string {
  return template.promptQuestions.map((question) => `${question}\n`).join('\n')
}
