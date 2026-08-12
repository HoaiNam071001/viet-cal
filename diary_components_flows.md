# Diary Calendar — Component Architecture & User Flows

---

## 1️⃣ Component Hierarchy (Detailed)

### 🔓 Auth Components

#### `features/auth/components/AuthGate.tsx`
```typescript
// Wrapper: if not logged in, show login/register options
// if logged in, show children
<AuthGate>
  <MainApp />
</AuthGate>
```

#### `features/auth/components/LoginForm.tsx`
```
┌─────────────────────────────┐
│  Welcome back! 📝           │
├─────────────────────────────┤
│ Email:   [____________]     │
│ Password:[____________]     │
│                             │
│ [🔵 Google Sign-in]         │
│ [Sign in]  [Create account] │
└─────────────────────────────┘
```

#### `features/auth/components/SignupForm.tsx`
```
┌──────────────────────────────┐
│  Create your account 🎉      │
├──────────────────────────────┤
│ Display name: [____________] │
│ Email:        [____________] │
│ Password:     [____________] │
│ Confirm:      [____________] │
│               □ Agree to ToS  │
│ [Create account]             │
└──────────────────────────────┘
```

---

### 📔 Diary Editor Components

#### `features/diary/components/DiaryEditor.tsx` (Main container)
```
┌────────────────────────────────────┐
│ ✏️ Ghi nhật ký - 15 Tháng 1, 2024 │
├────────────────────────────────────┤
│                                    │
│ [Title input field]                │
│                                    │
│ [Rich text editor (markdown)]       │
│ Bold Italic Link | H1 H2 List Quote│
│                                    │
│ [Toolbar below editor]             │
│ [Mood] [Tag] [Category] [Location] │
│ [Weather] [Images] [More...]       │
│                                    │
│        [Save] [Cancel] [Delete]    │
└────────────────────────────────────┘
```

**Sub-components:**
- `RichTextEditor.tsx` — Monaco/CodeMirror or Lexical
- `MoodPicker.tsx` — Emoji picker (😊 😔 😍 😤 😴 🤔)
  - Mood + intensity slider
- `CategoryPicker.tsx` — Dropdown with user categories
- `TagInput.tsx` — Multi-select with autocomplete
- `LocationInput.tsx` — Text input + geolocation
- `WeatherPicker.tsx` — Weather selector + temp
- `ImageUploader.tsx` — Drag & drop, preview
- `TemplatePicker.tsx` — Quick-fill prompts (optional)

---

### 📋 Diary List Components

#### `features/diary/components/DiaryList.tsx`
```
┌───────────────────────────────────┐
│ 📝 Nhật ký của tôi               │
├───────────────────────────────────┤
│ [Search: ___________] [Filters ▼] │
├───────────────────────────────────┤
│                                   │
│ [DiaryCard] 15 Tháng 1 - 😊 Work │
│ Lorem ipsum dolor sit...          │
│ #travel #family · 2 hình ảnh     │
│                                   │
│ [DiaryCard] 14 Tháng 1 - 😍 Life │
│ Summary of today's adventures... │
│ #achievement · 1 hình ảnh        │
│                                   │
│ [DiaryCard] 13 Tháng 1 - 😴 Chill│
│ Just a lazy day today...         │
│                                   │
│ [Load more...]                    │
└───────────────────────────────────┘
```

**Sub-components:**
- `DiaryCard.tsx` — Mini entry preview
  - Date, mood, title preview, tags, image count
  - Click → open detail
  - Swipe → edit/delete (mobile)
- `DiarySearch.tsx` — Search + filter panel
  - By text, date range, category, mood, tags
  - Save search filters
- `SortDropdown.tsx` — Newest, Oldest, Mood, Category

---

### 🔍 Diary Detail Components

#### `features/diary/components/DiaryDetail.tsx`
```
┌──────────────────────────────────────┐
│ 15 Tháng 1, 2024 · Thứ 5           │
│ Lunar: Mùng 6 Tết Giáp Thìn        │
├──────────────────────────────────────┤
│                                      │
│ Title: Một ngày tuyệt vời           │
│ ───────────────────────────────────  │
│                                      │
│ 😊 Intensity: ████░ (4/5)           │
│ 📂 Category: Work                    │
│ 🏷️  Tags: #achievement #team        │
│ 📍 Location: Hà Nội, VN             │
│ ☀️  Weather: Sunny, 25°C             │
│                                      │
│ Content (Markdown rendered):         │
│ ────────────────────────────────────  │
│ Lorem **ipsum** dolor sit amet...    │
│ - Bullet point 1                     │
│ - Bullet point 2                     │
│                                      │
│ [Images gallery - horizontal scroll] │
│ [img1] [img2] [img3]                 │
│                                      │
│ ────────────────────────────────────  │
│ Created: Jan 15, 2024 at 9:30 PM    │
│ Updated: Jan 15, 2024 at 10:00 PM   │
│                                      │
│      [Edit] [Share] [Delete]         │
└──────────────────────────────────────┘
```

**Sub-components:**
- `MarkdownRenderer.tsx` — Render MD to HTML
- `ImageGallery.tsx` — Lightbox + scrollable
- `LunarDateInfo.tsx` — Show lunar date (from lunar feature)
- `ShareButton.tsx` — Generate link, share options
- `EditButton.tsx` → Open DiaryEditor

---

### 📊 Analytics Components

#### `features/analytics/components/AnalyticsDashboard.tsx`
```
┌──────────────────────────────────────┐
│ 📊 Thống kê nhật ký                 │
├──────────────────────────────────────┤
│                                      │
│ [StatsCard - Month]                  │
│ ┌────────┬────────┬────────┐         │
│ │ 22     │ 😊 😔  │ Streak│         │
│ │ Entries│ 3/2    │  7 days│        │
│ └────────┴────────┴────────┘         │
│                                      │
│ [StreakCounter]                      │
│ 🔥 7-day streak! (Longest: 23 days) │
│                                      │
│ [MoodTrendChart - Line chart]        │
│ ┌──────────────────────────────────┐ │
│ │                   ╱╲ ╱             │ │
│ │  Mood score: ╱╲ ╱  ╲ ╱             │ │
│ │ ╱╲╱╲╱╲╱╱╱╱╱╱╱  ╲╱╱  │ │
│ │ 1 ───────────────────┤ 31 days    │ │
│ └──────────────────────────────────┘ │
│                                      │
│ [CategoryChart - Pie chart]          │
│ Work (35%) │ Personal (40%) │ ...   │
│                                      │
│ [HeatmapCalendar - GitHub-style]    │
│ Jan:  ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢           │
│       ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢           │
│       ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢ ▢           │
│       (Legend: No entry | 1 | 2+ >3)│
│                                      │
└──────────────────────────────────────┘
```

**Sub-components:**
- `StatsCard.tsx` — Overview (entries, moods, streak)
- `StreakCounter.tsx` — 🔥 current + longest
- `MoodTrendChart.tsx` — Line chart (last 7/30/90 days)
- `CategoryChart.tsx` — Pie chart breakdown
- `HeatmapCalendar.tsx` — GitHub-style activity map

---

### ⚙️ Settings Components

#### `features/settings/components/SettingsPanel.tsx`
```
┌──────────────────────────────────────┐
│ ⚙️  Cài đặt                          │
├──────────────────────────────────────┤
│                                      │
│ 👤 PROFILE                          │
│ ├─ Avatar: [avatar] [Change]        │
│ ├─ Display name: [John Doe]         │
│ ├─ Email: john@example.com          │
│ └─ Timezone: Asia/Ho_Chi_Minh ▼     │
│                                      │
│ 🎨 APP SETTINGS                     │
│ ├─ Theme: ○ Light ◉ Dark ○ Auto     │
│ ├─ Language: ◉ Tiếng Việt ○ English │
│ └─ Font size: [Small|Normal|Large]  │
│                                      │
│ 📔 DIARY SETTINGS                   │
│ ├─ Default category: [Work] ▼       │
│ ├─ Daily reminder: [ON] at 08:00    │
│ ├─ Show calendar on diary: [ON]     │
│ ├─ Default mood emoji: 😊 ▼         │
│ └─ Sort order: Newest ▼             │
│                                      │
│ 📂 MANAGE                            │
│ ├─ [Categories (edit)]              │
│ ├─ [Templates (edit)]               │
│ ├─ [Export data]                    │
│ └─ [Backup to cloud]                │
│                                      │
│ 🔒 PRIVACY                          │
│ ├─ Data sharing: [Private] ▼        │
│ └─ [Download all data] [Delete acc] │
│                                      │
│ [Logout]                             │
└──────────────────────────────────────┘
```

**Sub-components:**
- `UserProfileEditor.tsx` — Name, avatar, timezone
- `ThemeToggle.tsx` — Light/dark/auto
- `DiaryPreferencesPanel.tsx` — Reminder, category, sort
- `CategoryManager.tsx` — Edit/create categories
- `TemplateManager.tsx` — Edit/create templates
- `DataPrivacy.tsx` — Export, backup, delete

---

### 🗓️ Calendar Integration

#### `features/calendar/components/CalendarMonth.tsx` (Updated)
```
┌──────────────────────────────────────┐
│ Tháng 1, 2024                        │
├──────────────────────────────────────┤
│ CN Thứ 2 Thứ 3 Thứ 4 Thứ 5 Thứ 6 Thứ 7
│                          1    2    3 │
│  4   5   6   7   8   9  10 │
│ 11  12  13  14  15• 16• 17 │ (• = has diary)
│ 18  19  20  21  22  23  24 │
│ 25  26  27  28  29  30  31 │
│                              │
│ (Tap day → Show day detail)   │
│ (Tap date with • → Show diary)│
└──────────────────────────────────────┘
```

**On tap day:**
```
┌─────────────────────────────────────┐
│ Chiều 15 Tháng 1, 2024 (Mùng 6 Tết) │
├─────────────────────────────────────┤
│                                     │
│ 📔 Nhật ký hôm nay:                 │
│ "Một ngày tuyệt vời"                │
│ 😊 Work · #achievement #team        │
│ [Xem chi tiết]                      │
│                                     │
│ 🎂 Holidays:                        │
│ Ngày Giao thừa (Lunar Dec 30)        │
│ Countdown: 5 days                   │
│                                     │
│ 🐉 Can-chi:                         │
│ Giáp Thìn - Mùng 6 Tết              │
│ ☀️ Solar term: Tiểu Tết             │
│                                     │
│ 😴 Auspicious hours:                │
│ Tý (23h-1h), Sửu (1h-3h), ...       │
│                                     │
└─────────────────────────────────────┘
```

---

## 2️⃣ User Flows (Scenarios)

### 🔄 Flow 1: Guest → Calendar View

```
App opens
  ↓
[Not logged in?]
  ↓
Show: Calendar (read-only) + Login banner
  ↓
User can:
  ✅ Browse calendar
  ✅ See lunar info
  ✅ See holidays
  ✅ See auspicious hours
  ❌ Cannot write diary
  ❌ Cannot see diary entries
  ❌ Cannot access Diary tab
  
Click "Đăng nhập"
  ↓
→ LoginForm (Email or Google)
  ↓
Success
  ↓
→ Homepage (now Diary tab)
```

---

### 📝 Flow 2: Write New Diary Entry (Mobile)

```
User logged in, on Diary tab
  ↓
Tap [+] FAB button (bottom right)
  ↓
→ DiaryEditor
  ├─ Date: Today (15 Tháng 1)
  ├─ Title: [empty]
  ├─ Content: [empty rich editor]
  └─ Metadata: (optional)
  
User fills in:
  ├─ Title: "Một ngày tuyệt vời"
  ├─ Content: "Hôm nay tôi có một cuộc họp quan trọng..."
  ├─ Mood: 😊 (intensity: 4/5)
  ├─ Category: Work
  ├─ Tags: achievement, team
  ├─ Weather: ☀️ Sunny, 25°C
  └─ Images: [drag 2 images]
  
Tap [Save]
  ↓
POST /diary/entries
  ↓
Success notification ("Lưu thành công!")
  ↓
→ Back to Diary list
  ↓
New entry appears at top
```

---

### 🔎 Flow 3: Search & Filter Diary Entries

```
On Diary list tab
  ↓
Tap [Search] or [Filters]
  ↓
→ DiarySearch panel opens
  ├─ Text search: "team meeting"
  ├─ Date range: Jan 1-15, 2024
  ├─ Category: Work
  ├─ Mood: Only 😊 (happy)
  ├─ Tags: #achievement
  └─ [Apply]
  
GET /diary/entries?search=team...&category=Work&mood=😊...
  ↓
Results: Filtered entries shown
  ├─ [Entry] Jan 15 - "Team meeting success"
  ├─ [Entry] Jan 12 - "Team building day"
  └─ (2 results)
  
Tap result
  ↓
→ DiaryDetail
```

---

### 📊 Flow 4: View Analytics

```
On Desktop (Phân tích tab) or Mobile (Settings → Analytics)
  ↓
→ AnalyticsDashboard
  
Shows:
  ├─ Stats card: 22 entries this month
  │                Most mood: 😊 (60%)
  │                Streak: 7 days
  │
  ├─ Streak counter: 🔥 7 day streak! (Longest: 23)
  │
  ├─ Mood trend (last 30 days): Line chart
  │   Shows mood score over time
  │
  ├─ Category distribution: Pie chart
  │   Work: 35%, Personal: 40%, Health: 25%
  │
  └─ Heatmap calendar (last 12 months)
      GitHub-style grid showing writing activity
      
Interactions:
  ├─ Tap on mood trend point → See that day's entry
  ├─ Tap on category slice → Filter to that category
  └─ Tap on heatmap date → Jump to that day
```

---

### 🔗 Flow 5: Share Diary Entry

```
On DiaryDetail
  ↓
Tap [Share button]
  ↓
Menu appears:
  ├─ [Share link (create public link)]
  ├─ [Share with user (enter email)]
  ├─ [Share to social: Twitter, Facebook]
  └─ [Copy link]
  
Option 1: Create public share link
  ├─ Click [Create link]
  ├─ POST /diary/entries/:id/share
  ├─ Get back: https://app.com/share/abc123xyz...
  └─ User can [Copy] or [Share via SMS, Email]
  
Option 2: Share with specific user
  ├─ Click [Share with user]
  ├─ Enter email: jane@example.com
  ├─ POST /diary/entries/:id/share-with-user
  ├─ Jane gets notification
  └─ Jane can view when logged in

Public shared view:
  ├─ Anyone with link can see (read-only)
  ├─ Author info hidden unless they want
  ├─ No ability to edit
  └─ Can "Like" or comment (future)
```

---

### 💾 Flow 6: Export & Backup

```
In Settings → Data Management
  ↓
Options:
  ├─ [Export this month as PDF]
  ├─ [Export this year as JSON]
  ├─ [Export all as CSV]
  └─ [Auto-backup to cloud]
  
Export as PDF:
  ├─ Click [Export month]
  ├─ Select month (Jan 2024)
  ├─ System renders all entries for month
  ├─ Generate PDF with pretty layout
  ├─ Download: diary_jan_2024.pdf
  └─ Contains: entries, mood chart, stats

Export as JSON:
  ├─ Click [Export all]
  ├─ Download: diary_full_backup_2024.json
  ├─ Contains: All entries, categories, templates
  └─ User can import to another tool or re-import later

Auto-backup:
  ├─ Toggle [ON]
  ├─ Backs up every night at 2 AM
  ├─ Stored: 30-day rolling backup in cloud
  └─ Can restore: [Click] [Restore date...]
```

---

### 🎯 Flow 7: Use Template for Quick Writing

```
On Diary tab
  ↓
Tap [+] FAB
  ↓
Show template picker:
  ├─ Morning Reflection
  │  Q1: What are you grateful for?
  │  Q2: What's your goal today?
  │  Q3: How do you feel?
  │
  ├─ Evening Review
  │  Q1: What went well?
  │  Q2: What was challenging?
  │  Q3: What did you learn?
  │
  ├─ Exercise Log
  │  Q1: Type of exercise?
  │  Q2: Duration?
  │  Q3: How did you feel?
  │
  └─ Create custom template (user-defined)
  
User selects "Morning Reflection"
  ↓
→ DiaryEditor pre-populated with:
  ├─ Category: Personal (default)
  ├─ Content template:
  │  ## Phản ánh buổi sáng
  │  **Điều tôi biết ơn:**
  │  [user fills]
  │  
  │  **Mục tiêu hôm nay:**
  │  [user fills]
  │  
  │  **Tâm trạng:**
  │  [user fills]
  │
  └─ Default mood: 😊
  
User fills in answers
  ↓
Save
  ↓
Entry created with template structure
  
Analytics update:
  ├─ Template usage count += 1
  └─ User shown: "Template used 23 times this month"
```

---

### 🌙 Flow 8: Calendar View with Diary Integration (Desktop)

```
Desktop user on Calendar tab
  ↓
Split view:
┌──────────────────┬─────────────────────┐
│  Calendar        │  Sidebar            │
│  (Month grid)    │  ├─ Lunar info      │
│                  │  ├─ Holiday info    │
│  Jan 2024        │  ├─ Auspicious hrs  │
│  (with diary •)  │  └─ Quick actions   │
│                  │                     │
│  1  2  3 • 5 •   │  Selected: Jan 15   │
│  8  9 10 • 12    │  Monday             │
│ 15• 16• 17 ...   │  Lunar: Mùng 6 Tết │
│                  │                     │
│ (Tip: • = diary) │  ☀️ Can-chi:        │
└──────────────────┤ Giáp Thìn          │
                   │                     │
                   │ 📔 Diary entry:     │
                   │ "Một ngày tuyệt..." │
                   │ 😊 Work             │
                   │                     │
                   │ [View full] [Edit] │
                   │                     │
                   │ 🎂 Holidays:        │
                   │ Giao thừa (5 days)  │
                   │ Tết Mậu Tý (6 days)│
                   │                     │
                   │ ⭐ Auspicious:      │
                   │ Tý, Sửu, Dần, Mão  │
                   └─────────────────────┘

User interactions:
  ├─ Click on date with • → Show diary preview
  ├─ Click [View full] → Open DiaryDetail
  ├─ Click [Edit] → Open DiaryEditor
  ├─ Click [Next month] → Update calendar
  └─ Click on empty date → Create new diary entry
```

---

## 3️⃣ State Management Pattern

### Using Zustand (lightweight alternative to Redux)

```typescript
// stores/diaryStore.ts
import { create } from 'zustand';

interface DiaryState {
  entries: DiaryEntry[];
  loading: boolean;
  selectedEntry: DiaryEntry | null;
  filters: DiaryFilters;
  
  // Actions
  setEntries: (entries: DiaryEntry[]) => void;
  addEntry: (entry: DiaryEntry) => void;
  updateEntry: (id: string, updates: Partial<DiaryEntry>) => void;
  deleteEntry: (id: string) => void;
  setSelectedEntry: (entry: DiaryEntry | null) => void;
  setFilters: (filters: DiaryFilters) => void;
  fetchEntries: (month?: string) => Promise<void>;
}

export const useDiaryStore = create<DiaryState>((set, get) => ({
  entries: [],
  loading: false,
  selectedEntry: null,
  filters: { category: null, mood: null, tags: [] },
  
  setEntries: (entries) => set({ entries }),
  addEntry: (entry) => set({ entries: [entry, ...get().entries] }),
  updateEntry: (id, updates) =>
    set({
      entries: get().entries.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }),
  deleteEntry: (id) =>
    set({ entries: get().entries.filter((e) => e.id !== id) }),
  
  setSelectedEntry: (entry) => set({ selectedEntry: entry }),
  setFilters: (filters) => set({ filters }),
  
  fetchEntries: async (month) => {
    set({ loading: true });
    try {
      const { data } = await supabase
        .from('diary_entries')
        .select()
        .eq('user_id', userId)
        .order('date', { ascending: false });
      set({ entries: data || [], loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
}));

// Usage in component:
export function DiaryList() {
  const entries = useDiaryStore((s) => s.entries);
  const fetchEntries = useDiaryStore((s) => s.fetchEntries);
  
  useEffect(() => {
    fetchEntries();
  }, []);
  
  return (
    <ul>
      {entries.map((entry) => (
        <DiaryCard key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}
```

---

## 4️⃣ API Call Patterns (with React Query)

```typescript
// hooks/useDiaryEntry.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useDiaryEntry(entryId: string) {
  return useQuery({
    queryKey: ['diary', entryId],
    queryFn: async () => {
      const { data } = await supabase
        .from('diary_entries')
        .select()
        .eq('id', entryId)
        .single();
      return data;
    },
  });
}

export function useDiaryEntries(month: string) {
  return useQuery({
    queryKey: ['diary-entries', month],
    queryFn: async () => {
      const [year, monthNum] = month.split('-');
      const { data } = await supabase
        .from('diary_entries')
        .select()
        .eq('user_id', userId)
        .gte('date', `${year}-${monthNum}-01`)
        .lt('date', `${year}-${parseInt(monthNum) + 1}-01`)
        .order('date', { ascending: false });
      return data || [];
    },
  });
}

export function useCreateDiaryEntry() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entry: Partial<DiaryEntry>) => {
      const { data } = await supabase
        .from('diary_entries')
        .insert([{ ...entry, user_id: userId }])
        .select()
        .single();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] });
      toast.success('Lưu thành công!');
    },
    onError: (error) => {
      toast.error('Lỗi: ' + error.message);
    },
  });
}

export function useUpdateDiaryEntry(entryId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: Partial<DiaryEntry>) => {
      const { data } = await supabase
        .from('diary_entries')
        .update(updates)
        .eq('id', entryId)
        .select()
        .single();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diary', entryId] });
      queryClient.invalidateQueries({ queryKey: ['diary-entries'] });
    },
  });
}
```

---

## 5️⃣ Styling Strategy

### Design System Updates

```typescript
// src/index.css - New tokens

:root {
  /* Diary mood colors */
  --mood-happy: #FFD700;      /* 😊 */
  --mood-sad: #4A90E2;        /* 😔 */
  --mood-love: #FF6B9D;       /* 😍 */
  --mood-angry: #E24A4A;      /* 😤 */
  --mood-sleep: #9B7ECA;      /* 😴 */
  --mood-thinking: #FFA500;   /* 🤔 */
  
  /* Category colors */
  --category-work: #4A90E2;
  --category-personal: #FF6B9D;
  --category-health: #50C878;
  --category-travel: #FFB347;
  --category-family: #DDA0DD;
  
  /* Diary UI */
  --editor-bg: #f5f5f5;
  --editor-border: #ddd;
  --mood-selector-size: 48px;
}

.dark {
  --editor-bg: #1e1e1e;
  --editor-border: #444;
}

/* Rich text editor styling */
.rich-editor {
  @apply min-h-64 p-4 border rounded-lg font-serif text-base;
  background-color: var(--editor-bg);
  border-color: var(--editor-border);
}

/* Mood emoji picker */
.mood-picker {
  @apply flex gap-2 flex-wrap justify-center py-4;
}

.mood-option {
  @apply w-12 h-12 flex items-center justify-center rounded-lg cursor-pointer
         hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors;
  font-size: 32px;
}

.mood-option.selected {
  @apply ring-4 ring-offset-2 ring-blue-500;
}

/* Diary entry card */
.diary-card {
  @apply p-4 border rounded-lg hover:shadow-lg transition-shadow;
}

.diary-card-date {
  @apply text-sm text-gray-500 font-medium;
}

.diary-card-mood {
  @apply text-3xl inline-block;
}

/* Analytics chart styles */
.chart-container {
  @apply p-4 bg-white dark:bg-gray-800 rounded-lg border;
}

.heatmap-cell {
  @apply w-3 h-3 rounded-sm cursor-pointer;
  transition: all 0.2s;
}

.heatmap-cell:hover {
  @apply ring-2 ring-blue-500;
}
```

---

## Summary

- **Auth flow:** Login/signup → Create profile → Access diary
- **Data model:** User > Diary entries > Metadata (mood, category, tags, etc)
- **Components:** Editor, List, Detail, Analytics, Settings
- **State management:** Zustand for global state + React Query for server state
- **Mobile nav:** 3 tabs (Diary, Calendar, Settings) when logged in
- **Desktop:** Multiple tabs + split views
- **Styling:** Tailwind + CSS variables for theming

**Next: Start implementing Phase 1 (auth + basic CRUD)!**
