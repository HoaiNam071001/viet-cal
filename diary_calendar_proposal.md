# Lịch Việt + Nhật Ký — Thiết kế tổng thể

## 1️⃣ Tên App & Branding Mới

### Đề xuất tên:
- **Nhật Ký Lịch** (Diary Calendar)
- **Lịch Sống** (Life Calendar)
- **Ghi Lịch** (Record Calendar)
- **Nhật Ký Việt** (Vietnamese Diary)

**Chọn:** `Nhật Ký Lịch` (intuitive, SEO-friendly)

### Tagline:
- "Xem lịch Việt • Ghi lại mỗi ngày"
- "Lịch âm dương • Nhật ký cá nhân"
- "Lịch Việt + Nhật ký • Sống trọn vẹn mỗi ngày"

---

## 2️⃣ Cấu trúc Dữ liệu (Supabase)

### Schema PostgreSQL

#### `users` (Profiles)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  theme 'light' | 'dark' | 'auto' DEFAULT 'auto',
  language 'vi' | 'en' DEFAULT 'vi',
  
  -- Diary preferences
  default_mood_emoji TEXT DEFAULT '😊',
  show_calendar_on_diary BOOLEAN DEFAULT true,
  diary_sort_order 'newest' | 'oldest' DEFAULT 'newest',
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(id)
);
```

#### `diary_entries` (Nhật ký chính)
```sql
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Core fields
  date DATE NOT NULL,  -- Date being written about (not creation time)
  title VARCHAR(200),
  content TEXT,  -- Markdown support
  
  -- Metadata
  mood_emoji VARCHAR(10),  -- 😊 😔 😍 😤 😴 🤔 etc
  mood_intensity 1 | 2 | 3 | 4 | 5 DEFAULT 3,  -- intensity 1-5
  color_tag VARCHAR(20),  -- 'red' | 'blue' | 'green' | 'yellow' | 'purple' | etc
  location VARCHAR(150),  -- Where were you
  weather VARCHAR(50),  -- ☀️ ☁️ 🌧️ ❄️
  temperature INT,  -- in Celsius
  
  -- Relationships
  category_id UUID REFERENCES diary_categories(id),  -- Work, Personal, Health, etc
  tags TEXT[],  -- ['travel', 'family', 'achievement']
  linked_date_lunar TEXT,  -- "2024-01-15 Mùng 6 Tết" for context
  
  -- Media
  images JSON,  -- [{url: "...", caption: "..."}, ...]
  
  -- Privacy & sharing
  is_private BOOLEAN DEFAULT true,
  shared_with UUID[],  -- List of user_ids with access
  share_link TEXT UNIQUE,  -- public share token
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,  -- soft delete
  
  INDEX(user_id, date),
  INDEX(user_id, created_at DESC)
);
```

#### `diary_categories` (Phân loại nhật ký)
```sql
CREATE TABLE diary_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,  -- Work, Personal, Health, Travel, Family
  color VARCHAR(20),  -- Tailwind color: 'blue', 'red', 'green', etc
  emoji VARCHAR(10),  -- 📚 💼 🏥 ✈️ ❤️
  icon_name VARCHAR(50),  -- lucide icon name
  order INT,  -- Display order
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  INDEX(user_id),
  UNIQUE(user_id, name)
);
```

#### `diary_templates` (Templates for quick entry)
```sql
CREATE TABLE diary_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(100),  -- "Morning Reflection", "Exercise Log", "Gratitude"
  prompt_questions TEXT[],  -- [
                            --   "What are you grateful for?",
                            --   "What challenged you today?",
                            --   "What did you learn?"
                            -- ]
  default_category_id UUID REFERENCES diary_categories(id),
  default_mood_emoji VARCHAR(10),
  is_favorite BOOLEAN DEFAULT false,
  usage_count INT DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  
  INDEX(user_id)
);
```

#### `diary_stats` (Analytics - cached)
```sql
CREATE TABLE diary_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  year INT,
  month INT,
  
  total_entries INT DEFAULT 0,
  avg_mood_score DECIMAL(3,2),
  most_common_mood VARCHAR(10),
  most_active_category_id UUID,
  streak_current INT,  -- Consecutive days with entry
  streak_longest INT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, year, month)
);
```

---

## 3️⃣ Tính năng Nhật ký (Feature List)

### 🎯 Core Features (MVP)

#### 1. **Ghi nhật ký (Diary Entry)**
- ✅ Write/Edit/Delete entry cho mỗi ngày
- ✅ Rich text editor (bold, italic, lists, links)
- ✅ Title + Content
- ✅ Mood emoji + intensity (1-5 scale)
- ✅ Category (Work, Personal, Health, Travel, Family...)
- ✅ Tags (searchable, autocomplete)
- ✅ Location tag (nhập text hoặc auto detect)
- ✅ Weather + temperature
- ✅ Color label (visually organize)
- ✅ Upload images (up to 5 MB each, limit 10/entry)

#### 2. **View & Browse Diary**
- ✅ List view (với filters & sorts)
- ✅ Calendar view (xem điểm mỗi ngày có diary hay không)
- ✅ Day detail view (calendar + diary side-by-side)
- ✅ Timeline view (infinite scroll entries)
- ✅ Search by text, date, category, mood, tags

#### 3. **Templates (Quick Writing)**
- ✅ Pre-made templates:
  - Morning Reflection (What are you grateful for?, Goals for today, Mindset)
  - Evening Review (Achievements, Challenges, Learning, Gratitude)
  - Exercise Log (Duration, Type, How you felt, Calories)
  - Travel Journal (Place, Activities, People, Favorites, Next time)
  - Health Check (Sleep, Mood, Energy, Physical symptoms)
- ✅ User-created custom templates
- ✅ Quick-fill with prompts

#### 4. **Analytics & Insights**
- ✅ Mood trend (last 7/30/90 days - line chart)
- ✅ Streak counter (consecutive days with entry)
- ✅ Stats card:
  - Total entries (month/year)
  - Most common mood
  - Most active category
  - Writing streak
- ✅ Heatmap (GitHub-style) - show active days
- ✅ Category distribution (pie chart)

#### 5. **Sharing & Privacy**
- ✅ Private by default (only visible to user)
- ✅ Share single entry with link (encrypted token)
- ✅ Share with specific users
- ✅ Public diary option (if user wants)
- ✅ Read-only access

### 🌟 Advanced Features (Phase 2+)

#### 6. **Export & Backup**
- ✅ Export month/year as PDF
- ✅ Export all entries as JSON/CSV
- ✅ One-click backup to cloud
- ✅ Print diary entry

#### 7. **Memories & Reflections**
- ✅ "On this day" - show entries from 1/5/10 years ago
- ✅ Memory cards (random entry each day)
- ✅ Yearly review (best moments, growth, lessons)
- ✅ Decade review (if user has data)

#### 8. **Smart Features**
- ✅ Voice-to-text (speech recognition)
- ✅ AI mood analysis (NLP on text to auto-suggest mood)
- ✅ Smart tags (suggest tags based on content)
- ✅ Lunar date context ("Mùng 6 Tết" shown auto)
- ✅ Sync with calendar events (one-way, FYI)

#### 9. **Notifications & Reminders**
- ✅ Daily reminder to write (customizable time)
- ✅ Streak reminder ("You're on a 7-day streak!")
- ✅ Push notifications (mobile)

#### 10. **Social & Discovery** (Optional)
- ✅ Follow other users (if they share)
- ✅ Browse public diaries (tag-based discovery)
- ✅ Reaction system (hearts/emojis on shared entries)

---

## 4️⃣ Kiến trúc Frontend (Project Structure)

### New structure:
```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx      (Supabase auth + session)
│   │   ├── DiaryProvider.tsx     (Diary context)
│   │   └── AnalyticsProvider.tsx (Stats context)
│   ├── router/
│   │   └── routes.tsx            (Define all routes)
│   └── layout/
│       ├── MobileLayout.tsx      (3-tab mobile nav)
│       ├── DesktopLayout.tsx     (Multi-tab desktop)
│       └── NavBar.tsx
│
├── features/
│   ├── lunar/                    (existing, unchanged)
│   ├── holidays/                 (existing, unchanged)
│   ├── calendar/                 (update: link to diary)
│   ├── diary/                    (NEW - main feature)
│   │   ├── components/
│   │   │   ├── DiaryEditor.tsx
│   │   │   ├── DiaryList.tsx
│   │   │   ├── DiaryCard.tsx
│   │   │   ├── DiaryDetail.tsx
│   │   │   ├── MoodPicker.tsx
│   │   │   ├── CategoryPicker.tsx
│   │   │   ├── TemplatePicker.tsx
│   │   │   └── DiarySearch.tsx
│   │   ├── hooks/
│   │   │   ├── useDiaryEntry.ts
│   │   │   ├── useDiaryList.ts
│   │   │   ├── useDiaryStats.ts
│   │   │   ├── useTemplates.ts
│   │   │   └── useDiarySync.ts  (real-time sync)
│   │   ├── services/
│   │   │   ├── diary.service.ts
│   │   │   ├── diary-analytics.service.ts
│   │   │   └── diary-storage.service.ts (local cache)
│   │   ├── types/
│   │   │   ├── diary.ts
│   │   │   └── stats.ts
│   │   └── utils/
│   │       ├── diary-parser.ts
│   │       ├── mood-utils.ts
│   │       └── export.ts (PDF, JSON export)
│   ├── auth/                     (NEW - auth feature)
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── AuthGate.tsx
│   │   │   └── ProfileEditor.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useAuthModal.ts
│   │   ├── services/
│   │   │   └── auth.service.ts (Supabase wrapper)
│   │   └── types/
│   │       └── auth.ts
│   └── analytics/               (NEW - diary stats)
│       ├── components/
│       │   ├── MoodTrendChart.tsx
│       │   ├── StatsCard.tsx
│       │   ├── StreakCounter.tsx
│       │   ├── HeatmapCalendar.tsx
│       │   └── CategoryChart.tsx
│       └── hooks/
│           └── useAnalytics.ts
│
├── shared/                       (existing, extend)
│   ├── ui/
│   │   └── (add new: RichTextEditor, MoodSelector, etc)
│   └── utils/
│       └── markdown.ts (MD parsing)
│
├── pages/
│   ├── Home.tsx                  (login → diary, or guest → calendar)
│   ├── Diary/
│   │   ├── DiaryListPage.tsx
│   │   ├── DiaryDetailPage.tsx
│   │   ├── DiaryEditorPage.tsx
│   │   └── DiaryAnalyticsPage.tsx
│   ├── Calendar.tsx              (existing)
│   ├── Settings.tsx              (update: add user + diary settings)
│   ├── NotFound.tsx
│   └── Auth/
│       ├── LoginPage.tsx
│       └── SignupPage.tsx
│
└── index.css (update: add diary tokens)
```

---

## 5️⃣ Navigation Layout (Mobile vs Desktop)

### 📱 Mobile Navigation

#### **BEFORE Login:**
```
┌─────────────────────┐
│  Nhật Ký Lịch 📅     │ (header)
├─────────────────────┤
│                     │
│   Calendar View     │ (main content)
│   (read-only)       │
│                     │
├─────────────────────┤
│ [Lịch] [Cài đặt]   │ (2 tabs only)
└─────────────────────┘
```

#### **AFTER Login:**
```
┌─────────────────────┐
│  Nhật Ký Lịch 📅     │
├─────────────────────┤
│                     │
│   Current Tab       │
│   Content           │
│                     │
├─────────────────────┤
│ [Nhật Ký] [Lịch] [Cài đặt] │ (3 tabs)
└─────────────────────┘
```

**Tabs:**
1. **Nhật Ký** (Diary)
   - Timeline of entries
   - Quick write button (FAB)
   - Filters (category, mood, date range)
   - Search

2. **Lịch** (Calendar)
   - Month view (calendar + diary dots)
   - Solar + Lunar info
   - Holiday countdown
   - Tap day → See diary entry (if exists) + calendar info

3. **Cài đặt** (Settings)
   - User settings (avatar, name, timezone, language)
   - App settings (theme, dark mode)
   - Diary settings (notification time, default category)
   - Manage categories
   - Manage templates
   - Data & privacy (export, backup)
   - Logout

---

### 🖥️ Desktop Navigation (Multi-tab Interface)

**Top nav bar / sidebar tabs:**
```
┌────────────────────────────────────────────┐
│ Nhật Ký Lịch      | [Nhật Ký] [Lịch] [Phân tích] [Cài đặt]
└────────────────────────────────────────────┘
```

**Available tabs:**
1. **Nhật Ký** (Diary List)
   - Full-width diary timeline + sidebar filters
   - or split view: Diary list (left) + Editor (right)

2. **Lịch** (Calendar)
   - Calendar (left) + Lunar info (right)
   - or Calendar + Diary side-by-side

3. **Phân tích** (Analytics)
   - Stats dashboard
   - Mood trends, streaks, heatmap
   - Category breakdown

4. **Cài đặt** (Settings)
   - Same as mobile

---

## 6️⃣ Auth Flow & Data Sync

### Login/Signup Flow
```
┌─────────────────┐
│  Guest User     │
│  (can only see  │
│   calendar)     │
└────────┬────────┘
         │ Click "Đăng nhập"
         ▼
┌──────────────────────────┐
│  Auth Modal              │
│  ├─ Email + Password     │
│  ├─ OR Google Sign-in    │
│  └─ Create account link  │
└────────┬─────────────────┘
         │ Success
         ▼
┌──────────────────────────┐
│  Create User Profile     │
│  ├─ Display name         │
│  ├─ Avatar (optional)    │
│  └─ Timezone             │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Logged In User          │
│  ├─ Full app access      │
│  ├─ Diary enabled        │
│  └─ Settings available   │
└──────────────────────────┘
```

### Real-time Sync
- Supabase Realtime subscriptions for:
  - Diary entries (if user has multiple tabs open)
  - Categories (if user adds new category)
  - Stats (update when new entry added)

### Offline Support
- Service worker caches:
  - App shell (calendar, UI)
  - Recent diary entries (IndexedDB)
  - Lunar/holiday data
- When offline: can read cached data, **cannot write**
- When back online: sync pending writes to Supabase

---

## 7️⃣ Data Models & Types (TypeScript)

### Core Types

```typescript
// User types
type User = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  timezone: string; // 'Asia/Ho_Chi_Minh'
  theme: 'light' | 'dark' | 'auto';
  language: 'vi' | 'en';
  createdAt: Date;
};

// Diary entry
type DiaryEntry = {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD (the date being written about)
  title?: string;
  content: string; // Markdown
  moodEmoji?: string; // '😊' | '😔' | '😍' etc
  moodIntensity?: 1 | 2 | 3 | 4 | 5;
  colorTag?: string; // 'red' | 'blue' | 'green'
  location?: string;
  weather?: string; // '☀️' | '☁️' | '🌧️'
  temperature?: number; // Celsius
  categoryId?: string;
  tags: string[]; // ['travel', 'family']
  images?: Array<{ url: string; caption?: string }>;
  isPrivate: boolean;
  sharedWith?: string[]; // user IDs
  shareLink?: string; // public share token
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

// Category
type DiaryCategory = {
  id: string;
  userId: string;
  name: string; // 'Work', 'Personal', 'Health'
  color: string; // Tailwind color
  emoji?: string;
  order: number;
};

// Template
type DiaryTemplate = {
  id: string;
  userId: string;
  name: string; // 'Morning Reflection'
  promptQuestions: string[];
  defaultCategoryId?: string;
  defaultMoodEmoji?: string;
  isFavorite: boolean;
  usageCount: number;
};

// Stats (cached)
type DiaryStats = {
  userId: string;
  year: number;
  month: number;
  totalEntries: number;
  avgMoodScore: number;
  mostCommonMood: string;
  streakCurrent: number;
  streakLongest: number;
};

// Mood data for charts
type MoodData = {
  date: string;
  moodScore: number; // 1-5
  emoji: string;
};
```

---

## 8️⃣ API Endpoints (Supabase Functions / REST)

### Authentication
- `POST /auth/signup` — Create account
- `POST /auth/login` — Login
- `POST /auth/logout` — Logout
- `POST /auth/reset-password` — Send reset email

### Diary Entries
- `GET /diary/entries?date=2024-01-15` — Get entry for date
- `GET /diary/entries?month=2024-01` — Get month entries
- `GET /diary/entries?search=travel` — Search entries
- `POST /diary/entries` — Create entry
- `PATCH /diary/entries/:id` — Update entry
- `DELETE /diary/entries/:id` — Soft delete

### Categories
- `GET /diary/categories` — List user categories
- `POST /diary/categories` — Create category
- `PATCH /diary/categories/:id` — Update
- `DELETE /diary/categories/:id` — Delete

### Templates
- `GET /diary/templates` — List templates
- `POST /diary/templates` — Create template
- `PATCH /diary/templates/:id` — Update
- `DELETE /diary/templates/:id` — Delete

### Analytics
- `GET /diary/stats?month=2024-01` — Get month stats
- `GET /diary/stats/mood-trend?days=30` — Get mood trend data
- `GET /diary/stats/heatmap?year=2024` — Get year heatmap data

### Sharing
- `POST /diary/entries/:id/share` — Generate share link
- `GET /diary/share/:token` — Get shared entry (public)
- `POST /diary/entries/:id/share-with-user` — Share with user

---

## 9️⃣ Security & Privacy

### RLS (Row Level Security) on Supabase

```sql
-- Users can only read/write their own diary
CREATE POLICY "Users see own diary entries"
  ON diary_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own diary entries"
  ON diary_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- But can read shared entries
CREATE POLICY "Users can read shared entries"
  ON diary_entries
  FOR SELECT
  USING (
    auth.uid() = user_id OR
    auth.uid() = ANY(shared_with) OR
    share_link IS NOT NULL  -- public share
  );
```

### Password Security
- Hash with bcrypt (Supabase auth does this)
- Min 8 chars, mix of upper/lower/numbers/special chars (enforced on signup)

### Data Privacy
- Private by default
- User controls who can see entries
- GDPR-compliant: users can export/delete all data

---

## 🔟 Development Roadmap

### Phase 1 (MVP - 2-3 weeks)
- [x] Setup Supabase project
- [x] Auth (signup/login/logout)
- [x] Diary CRUD (create/read/update/delete)
- [x] Categories (CRUD)
- [x] Basic UI (list, editor, detail)
- [x] Calendar integration (show diary dots)
- [x] Mobile nav (3 tabs)
- [x] Settings (user + app)

### Phase 2 (Core Features - 2-3 weeks)
- [ ] Rich text editor (markdown support)
- [ ] Templates (pre-made + custom)
- [ ] Images upload
- [ ] Search & filters
- [ ] Analytics (mood trend, streak, stats)
- [ ] Heatmap calendar
- [ ] Share link (public view)
- [ ] Export (PDF, JSON)

### Phase 3 (Polish - 1-2 weeks)
- [ ] Offline support (service worker + IndexedDB)
- [ ] Real-time sync (Supabase Realtime)
- [ ] Daily notification reminders
- [ ] Mobile app (iOS/Android via PWA)
- [ ] Performance optimization
- [ ] SEO optimization

### Phase 4+ (Advanced)
- [ ] AI mood analysis
- [ ] Voice-to-text
- [ ] Social discovery
- [ ] Yearly review (memories)
- [ ] Sync with calendar events
- [ ] Multi-language support (full i18n)

---

## 🔗 Summary of Changes

### What stays the same:
✅ Lunar calendar logic
✅ Holiday management
✅ Solar↔Lunar conversion
✅ Can-chi, Solar term calculation
✅ Vietnamese cultural context
✅ Responsive design

### What's new:
✨ Supabase auth + database
✨ Diary entry system
✨ Mood tracking + analytics
✨ Templates for quick writing
✨ Share & privacy controls
✨ Export functionality
✨ Redesigned navigation (3-tab mobile)
✨ User profiles
✨ Real-time sync
✨ Offline support

### What changes:
🔄 App branding (name, tagline)
🔄 Homepage (now login-first or guest calendar)
🔄 Navigation structure (mobile: 3 tabs)
🔄 Settings panel (expanded with diary prefs)
🔄 Calendar view (can show diary preview on day click)

---

## 📋 Next Steps

1. **Approve structure** ← You here
2. **Setup Supabase**:
   - Create tables (run SQL above)
   - Setup auth (email + Google OAuth)
   - Configure RLS policies
3. **Create Supabase types**: `npm install @supabase/supabase-js`
4. **Build auth flow**: LoginForm, AuthProvider, ProtectedRoutes
5. **Build diary CRUD**: DiaryEditor, DiaryList, DiaryDetail
6. **Integrate calendar**: Add diary preview, link to entries
7. **Add analytics**: Charts, streaks, heatmap
8. **Polish & test**: Accessibility, performance, PWA

---

**Questions?** I can elaborate on any section! 🚀
