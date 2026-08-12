# Diary Calendar — Implementation Checklist & Quick Start

---

## 🚀 Phase 1: Setup & Authentication (Week 1)

### 1. Supabase Project Setup
- [ ] Create Supabase project at supabase.com
- [ ] Get API URL and Anon Key
- [ ] Enable Auth (Email + Google OAuth)
- [ ] Configure redirect URLs:
  - Development: `http://localhost:5173/auth/callback`
  - Production: `https://yourdomain.com/auth/callback`

### 2. Database Schema
- [ ] Run SQL migration:

```sql
-- Create users table (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
  theme TEXT DEFAULT 'auto',
  language TEXT DEFAULT 'vi',
  default_mood_emoji VARCHAR(10) DEFAULT '😊',
  show_calendar_on_diary BOOLEAN DEFAULT true,
  diary_sort_order TEXT DEFAULT 'newest',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create diary_categories table
CREATE TABLE diary_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(20),
  emoji VARCHAR(10),
  icon_name VARCHAR(50),
  "order" INT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create diary_entries table
CREATE TABLE diary_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title VARCHAR(200),
  content TEXT,
  mood_emoji VARCHAR(10),
  mood_intensity INT DEFAULT 3,
  color_tag VARCHAR(20),
  location VARCHAR(150),
  weather VARCHAR(50),
  temperature INT,
  category_id UUID REFERENCES diary_categories(id),
  tags TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]',
  is_private BOOLEAN DEFAULT true,
  shared_with UUID[] DEFAULT '{}',
  share_link TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Create diary_templates table
CREATE TABLE diary_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  prompt_questions TEXT[] DEFAULT '{}',
  default_category_id UUID REFERENCES diary_categories(id),
  default_mood_emoji VARCHAR(10),
  is_favorite BOOLEAN DEFAULT false,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create diary_stats table
CREATE TABLE diary_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  year INT,
  month INT,
  total_entries INT DEFAULT 0,
  avg_mood_score DECIMAL(3, 2),
  most_common_mood VARCHAR(10),
  most_active_category_id UUID,
  streak_current INT DEFAULT 0,
  streak_longest INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, year, month)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_stats ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users see own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users see own diary entries"
  ON diary_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own diary entries"
  ON diary_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own diary entries"
  ON diary_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own diary entries"
  ON diary_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Same for categories, templates, stats...
```

- [ ] Create indexes for performance:
```sql
CREATE INDEX idx_diary_user_date ON diary_entries(user_id, date);
CREATE INDEX idx_diary_user_created ON diary_entries(user_id, created_at DESC);
CREATE INDEX idx_categories_user ON diary_categories(user_id);
CREATE INDEX idx_templates_user ON diary_templates(user_id);
```

### 3. Frontend Setup
- [ ] Install dependencies:
```bash
npm install @supabase/supabase-js @tanstack/react-query zustand
npm install -D @supabase/auth-helpers-react
```

- [ ] Create `.env.local`:
```env
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

- [ ] Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] Create `src/features/auth/context/AuthContext.tsx`:
```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### 4. Create Auth Pages
- [ ] `src/pages/Auth/LoginPage.tsx` — Email/Google login form
- [ ] `src/pages/Auth/SignupPage.tsx` — Create account form
- [ ] `src/features/auth/components/LoginForm.tsx`
- [ ] `src/features/auth/components/SignupForm.tsx`
- [ ] Test: Sign up → Create user → Login → Redirect to home

### 5. Protected Routes
- [ ] Create `ProtectedRoute.tsx` component
- [ ] Update router to guard diary routes (only logged in)
- [ ] Test: Unauthenticated user → Redirect to login

---

## 📔 Phase 2: Core Diary Features (Week 2)

### 1. Diary Service Layer
- [ ] Create `src/features/diary/services/diary.service.ts`:
```typescript
import { supabase } from '@/lib/supabase';
import type { DiaryEntry } from '../types/diary';

export const diaryService = {
  async getEntry(entryId: string) {
    const { data } = await supabase
      .from('diary_entries')
      .select()
      .eq('id', entryId)
      .single();
    return data as DiaryEntry;
  },

  async listEntries(month: string, userId: string) {
    const [year, monthNum] = month.split('-');
    const { data } = await supabase
      .from('diary_entries')
      .select()
      .eq('user_id', userId)
      .gte('date', `${year}-${monthNum}-01`)
      .lt('date', `${year}-${parseInt(monthNum) + 1}-01`)
      .order('date', { ascending: false });
    return data as DiaryEntry[];
  },

  async createEntry(entry: Partial<DiaryEntry>, userId: string) {
    const { data } = await supabase
      .from('diary_entries')
      .insert([{ ...entry, user_id: userId }])
      .select()
      .single();
    return data as DiaryEntry;
  },

  async updateEntry(entryId: string, updates: Partial<DiaryEntry>) {
    const { data } = await supabase
      .from('diary_entries')
      .update(updates)
      .eq('id', entryId)
      .select()
      .single();
    return data as DiaryEntry;
  },

  async deleteEntry(entryId: string) {
    return await supabase
      .from('diary_entries')
      .update({ deleted_at: new Date() })
      .eq('id', entryId);
  },
};
```

### 2. React Hooks for Diary
- [ ] `src/features/diary/hooks/useDiaryEntry.ts` — Get single entry
- [ ] `src/features/diary/hooks/useDiaryEntries.ts` — List entries by month
- [ ] `src/features/diary/hooks/useCreateDiaryEntry.ts` — Create (mutation)
- [ ] `src/features/diary/hooks/useUpdateDiaryEntry.ts` — Update (mutation)
- [ ] `src/features/diary/hooks/useDeleteDiaryEntry.ts` — Delete (mutation)

### 3. Diary Editor Component
- [ ] Create `src/features/diary/components/DiaryEditor.tsx`
  - Title input
  - Rich text editor (use `react-markdown` or `slate`)
  - Mood picker
  - Category picker
  - Tag input
  - Location input
  - Weather selector
  - Image upload
  - Save/Cancel buttons

- [ ] Create sub-components:
  - [ ] `MoodPicker.tsx` — Emoji selector + intensity
  - [ ] `CategoryPicker.tsx` — Dropdown
  - [ ] `TagInput.tsx` — Multi-select with autocomplete
  - [ ] `ImageUploader.tsx` — Drag & drop
  - [ ] `RichTextEditor.tsx` — Markdown or WYSIWYG

### 4. Diary List Component
- [ ] Create `src/features/diary/components/DiaryList.tsx`
  - List of entries
  - Infinite scroll or pagination
  - Each entry shows: date, mood, title preview, tags

- [ ] Create `src/features/diary/components/DiaryCard.tsx`
  - Compact display of one entry
  - Click to view detail
  - Swipe actions (mobile)

### 5. Diary Detail Component
- [ ] Create `src/features/diary/components/DiaryDetail.tsx`
  - Full entry display
  - Markdown renderer
  - Image gallery
  - Edit/Delete buttons
  - Share button

- [ ] Create `MarkdownRenderer.tsx` — Render markdown to HTML

### 6. Pages
- [ ] Create `src/pages/Diary/DiaryListPage.tsx`
- [ ] Create `src/pages/Diary/DiaryDetailPage.tsx`
- [ ] Create `src/pages/Diary/DiaryEditorPage.tsx`

### 7. Mobile Navigation
- [ ] Update `src/app/layout/MobileLayout.tsx` to show 3 tabs when logged in
  - Tab 1: Diary (DiaryListPage)
  - Tab 2: Calendar (existing)
  - Tab 3: Settings (Settings page)
- [ ] Show only Calendar + Settings when not logged in

### 8. Test
- [ ] Create a diary entry
- [ ] View entry list
- [ ] View entry detail
- [ ] Edit entry
- [ ] Delete entry
- [ ] Verify diary appears in calendar view

---

## 🎨 Phase 3: Analytics & Polish (Week 3)

### 1. Analytics Components
- [ ] Create `StatsCard.tsx` — Shows entry count, mood stats, streak
- [ ] Create `StreakCounter.tsx` — Current + longest streak
- [ ] Create `MoodTrendChart.tsx` — Line chart (last 30 days)
- [ ] Create `CategoryChart.tsx` — Pie chart
- [ ] Create `HeatmapCalendar.tsx` — GitHub-style activity map

### 2. Analytics Service
- [ ] Create `diary-analytics.service.ts`
  - Calculate streak
  - Calculate mood average
  - Generate trend data
  - Generate category breakdown

### 3. Analytics Page
- [ ] Create `src/pages/Diary/DiaryAnalyticsPage.tsx`
- [ ] Combine all analytics components
- [ ] Add date range selector

### 4. Settings Enhancements
- [ ] User profile editor (avatar, name, timezone)
- [ ] Diary preferences (reminder time, default category, sort order)
- [ ] Category manager (CRUD)
- [ ] Theme/language toggle
- [ ] Export options

### 5. Calendar Integration
- [ ] Update calendar to show diary dots (●)
- [ ] On tap day: Show diary preview + lunar info
- [ ] On tap diary entry: Open detail view

### 6. Search & Filtering
- [ ] Create `DiarySearch.tsx`
  - Text search
  - Date range
  - Category filter
  - Mood filter
  - Tag filter

### 7. Testing
- [ ] Test analytics calculations
- [ ] Test search/filters
- [ ] Test calendar integration
- [ ] Test responsive design (mobile/desktop)

---

## 💾 Phase 4: Storage & Sharing (Week 4)

### 1. Image Upload
- [ ] Setup Supabase Storage bucket: `diary-images`
- [ ] Create upload handler in `DiaryEditor`
- [ ] Compress images before upload
- [ ] Show upload progress
- [ ] Handle errors gracefully

### 2. Sharing Feature
- [ ] Create share service (`diary-sharing.service.ts`)
  - Generate share token
  - Share with specific user
- [ ] Create share modal
  - Copy link
  - Share to social
  - Share with user email
- [ ] Create public share page (read-only view)

### 3. Export Feature
- [ ] Export as PDF (use `html2pdf`)
- [ ] Export as JSON
- [ ] Export as CSV
- [ ] Add to Settings page

### 4. Offline Support
- [ ] Cache diary entries locally (IndexedDB)
- [ ] Service worker setup
- [ ] Allow read when offline
- [ ] Queue writes when offline, sync on reconnect

### 5. Real-time Sync
- [ ] Setup Supabase Realtime subscriptions
- [ ] Update UI when entry changes (multi-tab)
- [ ] Handle conflicts gracefully

---

## 🎯 Phase 5: Polish & Launch (Week 5)

### 1. Performance
- [ ] Optimize images
- [ ] Lazy load images
- [ ] Memoize components
- [ ] Code splitting for lazy routes
- [ ] Lighthouse audit (target 90+)

### 2. UX Polish
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Error boundaries
- [ ] Toast notifications
- [ ] Confirmation dialogs

### 3. Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Color contrast checks
- [ ] Screen reader testing

### 4. SEO (if public)
- [ ] Meta tags
- [ ] Open Graph tags
- [ ] Sitemap
- [ ] robots.txt

### 5. Security
- [ ] CSRF protection
- [ ] XSS prevention
- [ ] SQL injection prevention (Supabase handles)
- [ ] Rate limiting (RLS)
- [ ] Audit auth logs

### 6. Testing
- [ ] Unit tests (logic)
- [ ] Integration tests (API)
- [ ] E2E tests (full flow)
- [ ] Manual QA

### 7. Deployment
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Deploy to Vercel/Netlify
- [ ] Setup custom domain
- [ ] SSL certificate
- [ ] Monitor errors (Sentry)

---

## 📋 Quick Reference: File Structure After Phase 1

```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   ├── router/
│   │   └── routes.tsx
│   └── layout/
│       ├── MobileLayout.tsx
│       └── DesktopLayout.tsx
│
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── types/
│   │       └── auth.ts
│   │
│   ├── diary/
│   │   ├── components/
│   │   │   ├── DiaryEditor.tsx
│   │   │   ├── DiaryList.tsx
│   │   │   ├── DiaryDetail.tsx
│   │   │   ├── MoodPicker.tsx
│   │   │   ├── CategoryPicker.tsx
│   │   │   └── RichTextEditor.tsx
│   │   ├── hooks/
│   │   │   ├── useDiaryEntry.ts
│   │   │   ├── useDiaryEntries.ts
│   │   │   ├── useCreateDiaryEntry.ts
│   │   │   └── useUpdateDiaryEntry.ts
│   │   ├── services/
│   │   │   └── diary.service.ts
│   │   └── types/
│   │       └── diary.ts
│   │
│   ├── calendar/ (updated)
│   │   └── ... existing code ...
│   │
│   └── lunar/ (unchanged)
│
├── pages/
│   ├── Auth/
│   │   ├── LoginPage.tsx
│   │   └── SignupPage.tsx
│   ├── Diary/
│   │   ├── DiaryListPage.tsx
│   │   ├── DiaryDetailPage.tsx
│   │   └── DiaryEditorPage.tsx
│   ├── Calendar.tsx
│   └── Settings.tsx
│
├── lib/
│   ├── supabase.ts
│   └── ... utilities ...
│
└── index.css
```

---

## 🔑 Key Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: For later phases
VITE_API_URL=https://api.yourdomain.com
```

---

## 💡 Implementation Tips

1. **Start with Auth:** Get login/signup working first. Everything depends on it.

2. **Use Zustand + React Query:** Zustand for UI state, React Query for server state. Keep them separate.

3. **Test as you build:** Don't wait until the end. Write tests for each feature.

4. **Supabase RLS is key:** Get RLS policies right from the start. Much safer than app-level auth.

5. **Optimize images immediately:** 50% of app size will be images. Compress before upload.

6. **Cache aggressively:** Users have slow connections. Cache everything possible locally.

7. **Error handling:** Always wrap API calls in try-catch. Show user-friendly error messages.

8. **Mobile first:** Design for mobile, then enhance for desktop. Users expect mobile experience.

---

## 🚨 Common Pitfalls to Avoid

- ❌ Forgetting to enable RLS policies
- ❌ Hardcoding Supabase URLs/keys
- ❌ Not validating user input on backend
- ❌ Uploading huge uncompressed images
- ❌ Not handling loading/error states
- ❌ Making too many API calls (use pagination)
- ❌ Not testing RLS policies properly
- ❌ Forgetting to handle offline scenarios

---

## 📞 Next Steps

1. ✅ Read all three design docs
2. ✅ Approve project structure & naming
3. ✅ Create Supabase project
4. ✅ Run SQL migrations
5. ✅ Start Phase 1 implementation

Ready? Let's build! 🚀
