# অল্প স্বল্প গল্প | OlpoSolpoGolpo

 বাংলা ছোট গল্প, কবিতা, উপন্যাস, ধারাবাহিক ও মুক্ত গদরের অনলাইন পত্রিকা।

## Project Overview

**OlpoSolpoGolpo** (অল্প স্বল্প গল্প) is a Bengali literary magazine website featuring:
- Short stories (গল্প)
- Poetry (কবিতা)
- Novels (উপন्यास)
- Serial stories (ধারাবাহিক)
- Book reviews (নতুন বই)

## Features

### Public Features
- **Homepage**: Magazine layout with categorized story bands
- **Category Filtering**: Feature, Dhara-bahik, Upanyas, Golpo, Kobita
- **Story Submission**: Anyone can submit stories via the contribute page
- **Reading Experience**: Full-screen reading with Bengali font support
- **Theme Support**: Parchment, Sepia, and Night themes
- **Search**: Search through stories and content

### Admin & Moderator Features (New)

#### Admin Dashboard
- Accessible only to users with `role: ADMIN`
- Statistics: Pending articles, total articles, total users
- Review queue showing pending articles awaiting approval
- "Review" action links to article review page

#### Moderator Review Queue
- Accessible to users with `role: ADMIN` or `role: CONTRIBUTOR`
- Shows pending articles awaiting review
- "Review Article" action for moderation

#### Masthead Conditional Links
- Admin users see "Dashboard" and "Moderator" navigation items
- Non-readers see "Write" (✍ লিখুন) link to contribute page
- Role-based navigation checked via `auth()` client-side

### Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI**: React 19, TailwindCSS v4
- **Database**: Drizzle ORM with SQLite
- **Authentication**: NextAuth v5 with Resend email provider
- **Role System**: READER / CONTRIBUTOR / ADMIN enum

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server (`next dev`) |
| `build` | Build production version (`next build`) |
| `start` | Start production server (`next start`) |
| `lint` | Run ESLint (`eslint .`) |
| `db:push` | Push database schema (`drizzle-kit push`) |
| `db:studio` | Open Drizzle Studio (`drizzle-kit studio`) |
| `db:generate` | Generate schema migrations (`drizzle-kit generate`) |

## User Roles

- **READER**: Default role, can read stories
- **CONTRIBUTOR**: Can submit stories for review
- **ADMIN**: Can access admin dashboard and moderator queue

## License

MIT License - অল্প স্বল্প গল্প সম্পাদনা দল