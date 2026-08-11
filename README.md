# Lịch Việt — Lịch Dương & Lịch Âm Việt Nam

Ứng dụng lịch mobile-first cho người Việt: xem lịch Dương/Âm, ngày lễ, can chi, tiết khí,
đổi ngày Âm ↔ Dương, đếm ngược ngày lễ, chia sẻ ngày dưới dạng ảnh, chạy được offline (PWA).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm test         # vitest (lunar engine + app smoke tests)
npm run lint     # oxlint
```

## Tech stack

| Thành phần | Lựa chọn | Lý do |
| --- | --- | --- |
| Framework | React 19 + TypeScript + Vite 8 | có sẵn trong project |
| Styling | Tailwind CSS v4 (`@theme inline` + CSS variables) | dark mode đổi tức thì, không cần re-render |
| Routing | React Router 7 | mọi màn hình đều linkable |
| State | Context + URL params | không cần thêm state library |
| Icons | lucide-react | tree-shakable |
| Âm lịch | thuật toán riêng (Hồ Ngọc Đức / Meeus) | không lệ thuộc API, chạy offline, có test |
| Calendar grid | tự xây | FullCalendar không cho phép tùy biến ô lịch Âm thoải mái (đã gỡ khỏi dependencies) |
| Ngày lễ (nguồn phụ) | [Nager.Date](https://date.nager.at) | miễn phí, không cần API key, có CORS |

## Kiến trúc

Feature-based, business logic **không** nằm trong component:

```
src/
├── app/                    # config, providers, router, layout (shell/header/bottom nav)
├── features/
│   ├── lunar/              # thuật toán âm lịch: astronomy → convert → can-chi/tiết khí/giờ hoàng đạo
│   ├── holidays/           # rules (VN + quốc tế) → service (API + cache + fallback) → hooks
│   ├── calendar/           # grid builder, useCalendarState, Month/Day/Year view, DayDetail
│   ├── date-converter/     # useDateConverter (toàn bộ validate) + UI
│   ├── search/             # parse-query (text → ngày) + useSearch + SearchDialog
│   ├── countdown/          # getDaysUntil / formatCountdown + CountdownCard
│   ├── share/              # render ảnh ngày bằng canvas + Web Share API
│   └── settings/           # panel cài đặt
├── shared/                 # UI kit (Button, Card, Sheet, Segmented…), hooks, utils, types
├── widgets/                # TodayCard, LunarInfoCard, UpcomingHolidaysCard, MiniCalendarCard
├── pages/                  # Calendar / Converter / Holidays / Settings
└── index.css               # design tokens (light + dark) + base layer
```

### Múi giờ

Một "ngày" trong app là `CivilDate { year, month, day }` — không có giờ, không có timezone.
Mọi phép tính ngày chạy trên `Date` neo ở UTC (`src/shared/utils/date.ts`), còn "hôm nay" được
lấy qua `Intl` với `Asia/Ho_Chi_Minh`, nên timezone của trình duyệt không bao giờ làm lệch ngày.
Thuật toán âm lịch dùng cố định UTC+7 (`VN_UTC_OFFSET`).

### Âm lịch

`features/lunar` là module thuần, không phụ thuộc React:

- `utils/astronomy.ts` — julian day, new moon, sun longitude
- `utils/convert.ts` — `solarToLunar`, `lunarToSolar`, `getLunarMonthLength`, `getLeapMonthOfYear`
- `utils/can-chi.ts`, `utils/solar-term.ts`, `utils/auspicious.ts`
- `utils/day-info.ts` — gộp + memo hóa (grid tháng hỏi lại cùng một ngày rất nhiều lần)

Test: `src/features/lunar/__tests__/lunar.test.ts` — đối chiếu ngày Tết 2023–2027, tháng nhuận
2020/2023/2025, can chi (mốc 1/1/2000 = Mậu Ngọ), tiết khí, và round-trip Dương↔Âm mỗi 7 ngày
trong 40 năm.

### Ngày lễ

```
useHolidays* → HolidayProvider → holiday.service
                                   ├── holiday-rules  (local, luôn có, tính động theo năm)
                                   ├── holiday-api    (Nager.Date, timeout 6s)
                                   └── holiday-cache  (localStorage, TTL 30 ngày)
```

Ngày lễ Âm lịch (Tết, Giao thừa, Giỗ Tổ, Trung Thu, Ông Táo…) khai báo dưới dạng **rule** âm lịch
rồi quy đổi theo từng năm — không hard-code ngày Dương. Nếu API lỗi/offline, app vẫn đủ dữ liệu.
UI không bao giờ gọi API trực tiếp.

### Mở rộng sau này (Event / Reminder / Google Calendar)

`features/calendar/types/event.ts` + `hooks/useEvents.ts` là điểm cắm sẵn: Day View và Day Detail
đã render theo dữ liệu trả về từ `useEventsForDate`, nên chỉ cần thay phần nguồn dữ liệu.

## PWA

`public/manifest.webmanifest` + `public/sw.js` (cache-first cho app shell, network-first cho API
ngày lễ). Service worker chỉ đăng ký ở bản production (`src/pwa.ts`). Offline vẫn xem được lịch,
âm lịch và toàn bộ ngày lễ tính tại máy.
