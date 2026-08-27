# Swap Attendance for AI Help in the bottom nav

Everything else stays exactly as it is.

## Changes

### 1. Bottom navigation
New order: **Home · AI Help · Pay (center FAB) · Insurance · Profile**.
The Attendance tab is removed from the nav; AI Help takes its slot between Home and Pay.

### 2. Attendance moves into Profile
Add an "Attendance" row in the Profile menu (next to "My Transactions") that opens the existing `/attendance` page. The route stays unchanged, so nothing breaks.

Reframe the Attendance page for its narrower purpose: **weekly summaries / reports parents receive from their school**. Instead of a live gate feed, it shows:
- A weekly report card per child (week range, days present / late / absent, attendance %)
- The school that issued the report
- Past weeks list, tappable to see that week's breakdown
- A note that real-time gate signals come from the school's Gate App

### 3. New AI Help page (`/ai-help`)
Shared assistant for students, teachers and parents. Mobile-first chat screen:
- Header: "Eduvest AI" with a short line on what it can do
- Role-aware suggestion chips, e.g.
  - Students: homework help, exam prep, study plan
  - Teachers: lesson plans, quiz generation, report comments
  - Parents: understand fees, savings advice, child progress
- Chat thread with user/assistant bubbles, input box, send button
- Empty state with 3-4 starter prompts

## Technical notes
- `src/components/BottomNav.tsx`: replace the Attendance nav item with AI Help (Sparkles icon), add `nav_ai` keys to `src/lib/i18n.ts` (EN + FR).
- `src/pages/AiHelp.tsx`: new page, route registered in `src/App.tsx`.
- `src/pages/Profile.tsx`: add Attendance menu row (EN/FR strings in the local `T` map).
- `src/pages/Attendance.tsx`: rework content to weekly parent reports (mock data, same styling tokens).
- AI responses: the project rule is no Lovable Cloud, so v1 ships as a working UI with canned/mock replies. Wiring a real model needs a backend endpoint — tell me which provider you want and I'll plan that separately.
