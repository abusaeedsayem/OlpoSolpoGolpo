# Changelog

All notable changes to OlpoSolpoGolpo will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Admin & Moderator Section** (October 2026)
  - Admin dashboard page at `/admin` with statistics and review queue
  - Moderator review queue page at `/moderator` for article moderation
  - Middleware protection for admin/moderator routes (redirects unauthenticated users to `/login`)
  - Conditional masthead navigation showing admin/moderator links based on user role
  - Admin dashboard accessible only to `role: ADMIN` users
  - Moderator queue accessible to `role: ADMIN` or `role: CONTRIBUTOR` users
  - Role-based navigation in masthead: admins see "Dashboard" and "Moderator", contributors see "Write" link
  - Supporting UI components: badge, button, card

### Changed
- **Masthead** (`src/components/masthead/Masthead.tsx`)
  - Updated to conditionally render admin/moderator navigation items
  - Added `USE client` directive for client-side auth checking
  - Integrated admin navigation items (Dashboard, Moderator)
  - Added conditional "Write" link for non-reader users

### New Files
- `src/middleware.ts` - Route protection middleware
- `src/app/admin/page.tsx` - Admin dashboard page
- `src/app/moderator/page.tsx` - Moderator review queue page
- `src/components/ui/badge.tsx` - Badge component
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/card.tsx` - Card component
- `README.md` - Project documentation
- `CHANGELOG.md` - Change tracking

## [Previous Version]

*(No previous versions documented yet)*