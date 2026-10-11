import { sqliteTable, text, integer, real, uniqueIndex, index, primaryKey } from 'drizzle-orm/sqlite-core';
// ─── Users ────────────────────────────────────────────────────────────────────
export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    name: text('name'),
    email: text('email').unique(),
    phone: text('phone'),
    displayNameBn: text('display_name_bn'),
    role: text('role', { enum: ['READER', 'CONTRIBUTOR', 'ADMIN'] })
        .default('READER')
        .notNull(),
    subscriptionStatus: text('subscription_status').default('FREE').notNull(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    image: text('image'),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
});
// ─── NextAuth Required Tables ─────────────────────────────────────────────────
export const accounts = sqliteTable('accounts', {
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
}, (account) => ({
    compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));
export const sessions = sqliteTable('sessions', {
    sessionToken: text('sessionToken').primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
});
export const verificationTokens = sqliteTable('verificationToken', {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
}, (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));
// ─── Categories ───────────────────────────────────────────────────────────────
export const categories = sqliteTable('categories', {
    id: text('id').primaryKey(),
    nameBn: text('name_bn').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    sortOrder: integer('sort_order').default(0),
    // Artwork for the homepage category tile strip
    imageUrl: text('image_url'),
    // Shows the category as one of the large image tiles on the homepage
    isTile: integer('is_tile', { mode: 'boolean' }).default(false).notNull(),
});
// ─── Books (নতুন বই — book showcase with prices) ──────────────────────────────
export const books = sqliteTable('books', {
    id: text('id').primaryKey(),
    titleBn: text('title_bn').notNull(),
    authorBn: text('author_bn').notNull(),
    coverUrl: text('cover_url').notNull(),
    priceLabel: text('price_label').notNull(), // e.g. "২০০/-"
    sortOrder: integer('sort_order').default(0),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
});
// ─── Articles ─────────────────────────────────────────────────────────────────
export const articles = sqliteTable('articles', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull(),
    titleBn: text('title_bn').notNull(),
    contentBn: text('content_bn').notNull().default(''),
    excerptBn: text('excerpt_bn'),
    coverImageUrl: text('cover_image_url'),
    categoryId: text('category_id').references(() => categories.id),
    authorId: text('author_id').references(() => users.id),
    // Status workflow: DRAFT → PENDING → PUBLISHED (or SCHEDULED)
    status: text('status', {
        enum: ['DRAFT', 'PENDING', 'SCHEDULED', 'PUBLISHED'],
    })
        .default('DRAFT')
        .notNull(),
    // Monetization hooks (Phase 2 — currently all false)
    isPaywalled: integer('is_paywalled', { mode: 'boolean' })
        .default(false)
        .notNull(),
    requiredTier: text('required_tier'),
    // Serial article support
    seriesId: text('series_id'),
    chapterNumber: integer('chapter_number'),
    // View count for trending
    viewCount: integer('view_count').default(0).notNull(),
    // Timestamps
    publishedAt: integer('published_at', { mode: 'timestamp' }),
    scheduledFor: integer('scheduled_for', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
}, (t) => ({
    slugIdx: uniqueIndex('articles_slug_idx').on(t.slug),
    statusIdx: index('articles_status_idx').on(t.status),
    categoryIdx: index('articles_category_idx').on(t.categoryId),
    authorIdx: index('articles_author_idx').on(t.authorId),
    seriesIdx: index('articles_series_idx').on(t.seriesId),
}));
// ─── Audio Tracks ─────────────────────────────────────────────────────────────
export const audioTracks = sqliteTable('audio_tracks', {
    id: text('id').primaryKey(),
    articleId: text('article_id').references(() => articles.id, {
        onDelete: 'cascade',
    }),
    narratorBn: text('narrator_bn'),
    audioUrl: text('audio_url').notNull(),
    durationSec: integer('duration_sec'),
    mimeType: text('mime_type').default('audio/mpeg'),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
});
// ─── MFS Transactions ─────────────────────────────────────────────────────────
export const mfsTransactions = sqliteTable('mfs_transactions', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => users.id),
    trxId: text('trx_id').notNull(),
    gateway: text('gateway', { enum: ['bkash', 'nagad'] }).notNull(),
    amountBdt: real('amount_bdt').notNull(),
    status: text('status', { enum: ['PENDING', 'SUCCESS', 'FAILED'] })
        .default('PENDING')
        .notNull(),
    metadata: text('metadata'), // JSON string for gateway-specific data
    createdAt: integer('created_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .$defaultFn(() => new Date()),
});
