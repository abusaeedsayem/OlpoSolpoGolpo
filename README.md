# অল্প স্বল্প গল্প (Olpo Solpo Golpo)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Production-000000?style=for-the-badge&logo=vercel)](https://OlpoSolpoGolpo.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma_7-PostgreSQL-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon-Serverless_PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)

> **অল্প স্বল্প গল্প** is an ad-free, distraction-free, Bengali digital self-publishing and reading platform. Modeled after the structural mechanics of Pratilipi, the platform is localized for optimal Bengali typography, clean reading real estate, and separated Reader/Author workflows.

---

## 🌐 Live Production Environment

- **Primary Domain**: [https://OlpoSolpoGolpo.vercel.app](https://OlpoSolpoGolpo.vercel.app)
- **Production Alias**: [https://olposolpogolpo.vercel.app](https://olposolpogolpo.vercel.app)
- **Source Code**: [https://github.com/abusaeedsayem/OlpoSolpoGolpo](https://github.com/abusaeedsayem/OlpoSolpoGolpo)

---

## 👨‍💻 Developer Reference & Architecture

### Tech Stack Breakdown
| System Layer | Technology | Architecture Details |
|--------------|------------|----------------------|
| **Frontend Framework** | Next.js 16 (App Router) | React Server Components, Turbopack, App Router conventions |
| **Type Safety** | TypeScript 5 | Strict mode, Zod runtime validation for API contracts |
| **Styling & Theme** | Tailwind CSS v4 + CSS Variables | 3-Theme System (Light ☀️, Dark 🌙, Sepia 📖) with `localStorage` persistence |
| **Bengali Typography** | `next/font/google` | `Hind Siliguri` (UI/Nav), `Noto Serif Bengali` (Prose Reading with 1.9 line-height) |
| **Database ORM** | Prisma 7 | `@prisma/adapter-pg` connection driver, typed client generation |
| **Database Host** | Neon PostgreSQL | Serverless PostgreSQL with connection pooling |
| **Authentication** | NextAuth.js v5 (Auth.js) | `Credentials` provider, JWT session strategy, `bcryptjs` password hashing |
| **CI/CD & Hosting** | Vercel | Automatic deployments triggered on push to `main` |

---

### Key Directory Structure

```
OlpoSolpoGolpo/
├── app/
│   ├── layout.tsx                # Root layout with fonts, AuthProvider, ThemeProvider
│   ├── page.tsx                  # Homepage feed (dynamic Prisma query)
│   ├── globals.css               # Bengali typography & 3-theme design tokens
│   ├── (auth)/                   # Authentication routes (Login / Register)
│   ├── (author)/                 # Protected author workspace (/dashboard, /stories/new, /edit)
│   ├── explore/page.tsx          # Search & genre filter feed
│   ├── categories/page.tsx       # Genre overview page
│   ├── category/[slug]/page.tsx  # Category-filtered story list
│   ├── profile/[username]/       # Public author/reader profile
│   ├── read/[slug]/[chapter]/    # Immersive typographic reader
│   ├── story/[slug]/             # Story metadata & chapter index
│   └── api/                      # REST API endpoints (auth, stories, chapters, bookmarks)
├── components/
│   ├── ui/                       # Reusable primitives (Button, Badge, Avatar, Input, Textarea)
│   ├── layout/                   # Navbar, Footer, ThemeToggle
│   ├── story/                    # StoryCard, ReadingProgress, ChapterList
│   └── author/                   # AnalyticsCard, StoryForm, ChapterEditor
├── contexts/                     # ThemeContext (light/dark/sepia), AuthContext
├── hooks/                        # useReadingProgress, useBookmark
├── lib/                          # prisma singleton, auth config, utils, site constants
├── prisma/                       # schema.prisma, migrations, seed.ts
└── middleware.ts                 # Auth session cookie guard for protected routes
```

---

### Database Schema (6 Relational Models)

```
User (id, name, username, email, passwordHash, role, bio, avatarUrl)
  ├── Story (id, title, slug, description, status, language, readCount, isMature, tags)
  │    ├── Chapter (id, title, content, chapterNumber, status, wordCount)
  │    ├── Bookmark (id, userId, storyId)
  │    └── Review (id, userId, storyId, rating, body)
  └── Category (id, name, slug, description, iconEmoji)
```

---

## 🧪 QA Testing & Quality Assurance Guide

### Environment & Test Credentials

- **Target URL**: [https://OlpoSolpoGolpo.vercel.app](https://OlpoSolpoGolpo.vercel.app)
- **Pre-Seeded Author Account**:
  - **Email**: `sumaiya@example.com`
  - **Password**: `password123`
  - **Role**: `AUTHOR`
- **Reader Account**: Register a new user via `/register` with role `READER`.

---

### Test Matrix & Verification Scenarios

#### 1. Authentication & Role Separation
| Test ID | Test Scenario | Expected Result | Pass Criteria |
|---------|---------------|-----------------|---------------|
| `TC-AUTH-01` | Reader Registration | Create account with Reader role at `/register` | User is redirected to `/login?registered=1` with confirmation banner |
| `TC-AUTH-02` | Author Registration | Create account with Author role at `/register` | Account created in DB with role `AUTHOR` |
| `TC-AUTH-03` | Invalid Credentials | Attempt login with wrong password | Inline error displayed: *"ইমেইল বা পাসওয়ার্ড সঠিক নয়।"* |
| `TC-AUTH-04` | Protected Route Guard | Unauthenticated user navigates to `/dashboard` | Redirected to `/login?callbackUrl=/dashboard` |
| `TC-AUTH-05` | Login Callback | Log in successfully after guard redirect | Redirected back to `/dashboard` with session cookie set |
| `TC-AUTH-06` | Sign Out | Click *"প্রস্থান"* in Navbar | Session cleared, redirected to homepage |

#### 2. Reading Experience & Typography
| Test ID | Test Scenario | Expected Result | Pass Criteria |
|---------|---------------|-----------------|---------------|
| `TC-READ-01` | Theme Toggle | Switch between Light, Dark, and Sepia | `data-theme` attribute updates on `<html>`; styles update immediately without flash |
| `TC-READ-02` | Theme Persistence | Refresh page after selecting Sepia | Theme choice restored from `localStorage` |
| `TC-READ-03` | Reading Progress Bar | Scroll down chapter text at `/read/nil-joler-gaan/1` | Top amber progress bar advances from 0% to 100% |
| `TC-READ-04` | Bengali Glyph Rendering | Inspect chapter text font family | Computed font uses `Noto Serif Bengali` with `line-height: 1.9` |
| `TC-READ-05` | Chapter Navigation | Click *"পরের অধ্যায় →"* | Navigates to Chapter 2 smoothly |

#### 3. Author Publishing Workflow
| Test ID | Test Scenario | Expected Result | Pass Criteria |
|---------|---------------|-----------------|---------------|
| `TC-PUB-01` | Story Creation | Submit new story at `/dashboard/stories/new` | Story created in database; redirected to editor |
| `TC-PUB-02` | Word Counter | Type text into ChapterEditor | Word count updates dynamically in real-time |
| `TC-PUB-03` | Draft Auto-Save | Edit chapter content and wait 30 seconds | Status updates to *"শেষ সংরক্ষণ: [Time]"* |
| `TC-PUB-04` | Publish Chapter | Click *"প্রকাশ করুন"* in ChapterEditor | Chapter status changes to `PUBLISHED` and appears in public TOC |

#### 4. Discovery & Search
| Test ID | Test Scenario | Expected Result | Pass Criteria |
|---------|---------------|-----------------|---------------|
| `TC-DISC-01` | Category Filter | Click *"রোমান্স"* pill on homepage or `/explore` | Filtered feed returns only Romance stories |
| `TC-DISC-02` | Keyword Search | Search for *"নীল"* on `/explore` | Matches story title and description |
| `TC-DISC-03` | Public Profile | Navigate to `/profile/sumaiya` | Renders author bio, badge, and published stories grid |

---

### Automated Validation Commands (CI Verification)

```bash
# Verify TypeScript compile check
npx tsc --noEmit

# Validate Prisma ORM Schema
npx prisma validate

# Run full Next.js production build check
npm run build
```

---

## 🔒 Security & Privacy Commitments

1. **Ad-Free Guarantee**: Zero third-party ad network scripts, tracking pixels, or banner placements.
2. **Data Protection**: Passwords hashed with `bcrypt` (12 rounds). Session tokens encrypted using JWT strategy with strong `NEXTAUTH_SECRET`.
3. **Database Security**: SSL connections enforced on Neon PostgreSQL (`sslmode=require`).
