export interface DiaryTemplateDef {
  id: string
  name: string
  emoji: string
  promptQuestions: string[]
  /** Quick-pick sample titles shown when this template is selected. */
  titleSuggestions: string[]
  defaultMoodEmoji?: string
}

/** Built-in quick-write prompts. Not user-editable — just a faster way to start an entry. */
export const DIARY_TEMPLATES: DiaryTemplateDef[] = [
  {
    id: 'morning-reflection',
    name: 'Phản ánh buổi sáng',
    emoji: '🌅',
    promptQuestions: ['Điều bạn biết ơn hôm nay?', 'Mục tiêu hôm nay là gì?', 'Tâm trạng lúc này ra sao?'],
    titleSuggestions: [
      'Hôm nay tôi muốn...',
      'Điều quan trọng nhất hôm nay',
      'Tôi thức dậy với cảm giác...',
      '3 việc tôi muốn hoàn thành',
      'Một ngày mới bắt đầu',
      'Điều tôi mong chờ hôm nay',
    ],
  },
  {
    id: 'evening-review',
    name: 'Tổng kết buổi tối',
    emoji: '🌙',
    promptQuestions: ['Điều gì đã diễn ra tốt đẹp?', 'Điều gì là thử thách?', 'Bạn học được gì hôm nay?'],
    titleSuggestions: [
      'Một ngày của tôi',
      'Hôm nay đã diễn ra thế nào?',
      'Điều tuyệt vời nhất hôm nay',
      'Điều tôi chưa hài lòng hôm nay',
      'Hôm nay tôi đã học được gì?',
      'Nếu được làm lại hôm nay...',
      'Khoảnh khắc đáng nhớ nhất hôm nay',
    ],
  },
  {
    id: 'exercise-log',
    name: 'Nhật ký tập luyện',
    emoji: '🏃',
    promptQuestions: ['Loại bài tập?', 'Thời lượng?', 'Cảm giác sau khi tập?'],
    titleSuggestions: [
      'Buổi tập hôm nay',
      'Hôm nay tôi đã vận động thế nào?',
      'Tiến bộ của tôi hôm nay',
      'Cảm giác sau buổi tập',
      'Mục tiêu tập luyện tiếp theo',
    ],
    defaultMoodEmoji: '😊',
  },
  {
    id: 'travel-journal',
    name: 'Nhật ký du lịch',
    emoji: '✈️',
    promptQuestions: ['Bạn đã đi đâu?', 'Hoạt động nổi bật?', 'Đi cùng ai?', 'Điều muốn nhớ nhất?'],
    titleSuggestions: [
      'Ngày đầu tiên tại...',
      'Một ngày khám phá...',
      'Địa điểm tôi thích nhất hôm nay',
      'Món ăn đáng nhớ',
      'Một nơi tôi muốn quay lại',
      'Những khoảnh khắc trong chuyến đi',
    ],
  },
  {
    id: 'health-check',
    name: 'Theo dõi sức khoẻ',
    emoji: '🩺',
    promptQuestions: ['Giấc ngủ đêm qua thế nào?', 'Mức năng lượng hôm nay?', 'Có triệu chứng gì không?'],
    titleSuggestions: [
      'Hôm nay cơ thể tôi thế nào?',
      'Chất lượng giấc ngủ hôm nay',
      'Năng lượng của tôi hôm nay',
      'Tâm trạng và sức khỏe hôm nay',
      'Điều tôi cần cải thiện',
    ],
  },
  {
    id: 'gratitude',
    name: 'Biết ơn',
    emoji: '🙏',
    promptQuestions: ['3 điều bạn biết ơn hôm nay?', 'Một người bạn muốn cảm ơn?', 'Điều nhỏ nào khiến bạn vui hôm nay?'],
    titleSuggestions: ['3 điều tôi biết ơn hôm nay', 'Một người tôi muốn cảm ơn', 'Một điều nhỏ khiến tôi vui'],
  },
  {
    id: 'reflection',
    name: 'Suy ngẫm',
    emoji: '🧠',
    promptQuestions: [
      'Điều gì đang chiếm lấy suy nghĩ của bạn?',
      'Gần đây bạn nhận ra điều gì?',
      'Điều gì đang khiến bạn lo lắng?',
      'Nếu không sợ thất bại, bạn sẽ làm gì?',
    ],
    titleSuggestions: [
      'Điều đang chiếm lấy suy nghĩ của tôi',
      'Gần đây tôi nhận ra rằng...',
      'Có một điều tôi muốn thay đổi',
      'Điều gì đang khiến tôi lo lắng?',
      'Nếu không sợ thất bại, tôi sẽ...',
    ],
  },
  {
    id: 'goals',
    name: 'Mục tiêu',
    emoji: '🎯',
    promptQuestions: ['Mục tiêu của bạn hôm nay là gì?', 'Điều gì đang cản trở bạn?', 'Bước tiếp theo của bạn là gì?'],
    titleSuggestions: [
      'Mục tiêu của tôi hôm nay',
      'Tuần này tôi muốn...',
      'Tôi đã tiến gần mục tiêu thế nào?',
      'Điều đang cản trở tôi',
      'Bước tiếp theo của tôi',
    ],
  },
]

export function buildTemplateContent(template: DiaryTemplateDef): string {
  return template.promptQuestions.map((question) => `${question}\n`).join('\n')
}
