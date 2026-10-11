'use client';

import { useState } from 'react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';

export default function ContributePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('golpo');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    // In a real app, we'd submit this to our API
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setTitle('');
      setContent('');
      setCategory('golpo');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8 text-center">
        <span className="text-4xl mb-4 block">✍️</span>
        <h1 className="text-3xl font-bold font-ui text-[var(--text-primary)] mb-2">গল্প লিখুন</h1>
        <p className="text-ink/60 font-prose text-lg">আপনার ভাবনা, আপনার গল্প শেয়ার করুন পাঠকদের সাথে</p>
      </header>

      {submitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-12 rounded-2xl text-center">
          <span className="text-5xl block mb-4">🎉</span>
          <h2 className="text-2xl font-bold font-ui mb-2">আপনার লেখাটি সফলভাবে জমা দেওয়া হয়েছে!</h2>
          <p className="font-prose">আমাদের সম্পাদকীয় দল লেখাটি পর্যালোচনা করে শীঘ্রই প্রকাশ করবে।</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-bold font-ui text-[var(--text-primary)]">
              শিরোনাম
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="গল্পের সুন্দর একটি নাম দিন..."
              className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface text-xl font-prose focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-bold font-ui text-[var(--text-primary)]">
              বিভাগ
            </label>
<select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-surface font-ui focus:outline-none focus:border-crimson/50 focus:ring-1 focus:ring-crimson/50 transition-colors appearance-none"
            >
              <option value="golpo">ছোট গল্প</option>
              <option value="dharabahik">ধারাবাহিক</option>
              <option value="kobita">কবITA</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold font-ui text-[var(--text-primary)]">
              মূল লেখা
            </label>
            <TiptapEditor
              content={content}
              onChange={setContent}
              placeholder="আপনার গল্প এখানে লিখুন..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="px-8 py-3 bg-crimson text-white rounded-full font-bold font-ui shadow-md hover:bg-crimson-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              জমা দিন
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
