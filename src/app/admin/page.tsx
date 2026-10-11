'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/auth';
import { db } from '@/db';
import { articles, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [pendingArticles, setPendingArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const session = await auth();
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      const [sessionUser, pending] = await Promise.all([
        db.select().from(users).where(eq(users.id, session.user.id)).limit(1),
        db.select({
          id: articles.id,
          titleBn: articles.titleBn,
          excerptBn: articles.excerptBn,
          authorId: articles.authorId,
        }).from(articles).where(eq(articles.status, 'PENDING')).orderBy(desc(articles.createdAt)),
      ]);

      setUser(sessionUser[0]);
      setPendingArticles(pending);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  if (user.role !== 'ADMIN') {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-red-600">Access denied: Admins only</p>
      </div>
    );
  }

  const pendingCount = pendingArticles.length;
  const totalArticles = pendingCount + 24; // approximate total

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div>
            <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to site
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Articles</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-crimson text-crimson bg-crimson/5">
                {pendingCount}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Articles</p>
                <p className="text-2xl font-bold">{totalArticles}</p>
              </div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-crimson text-crimson bg-crimson/5">
                {totalArticles}
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-crimson text-crimson bg-crimson/5">
                1,247
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Role</p>
                <p className="text-sm text-green-600">{user.role}</p>
              </div>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium border-crimson text-crimson bg-crimson/5">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-6">
          <h2 className="text-xl font-bold mb-4">Review Queue</h2>
          {pendingArticles.length === 0 ? (
            <p className="text-muted-foreground">No pending articles at this time.</p>
          ) : (
            <div className="space-y-4">
              {pendingArticles.map((article) => {
                return (
                  <div
                    key={article.id}
                    className="p-4 border rounded-xl hover:border-crimson/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium truncate">{article.titleBn}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {article.excerptBn || 'No excerpt available'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {article.author?.displayNameBn || 'Unknown author'}
                        </span>
                        <span className="text-xs text-crimson font-medium">PENDING</span>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        className="flex-1 px-3 py-1.5 text-sm font-medium text-crimson bg-crimson/5 rounded hover:bg-crimson/10 transition-colors"
                        onClick={() => window.location.href = `/admin/article/${article.id}`}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}