'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { SITE_NAME } from '@/lib/constants'

interface UserItem {
  id: string
  name: string
  username: string
  email: string
  role: 'READER' | 'AUTHOR' | 'ADMIN'
  avatarUrl: string | null
  createdAt: string
  _count: { stories: number; reviews: number; bookmarks: number }
}

interface StoryItem {
  id: string
  title: string
  slug: string
  description: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  readCount: number
  createdAt: string
  author: { id: string; name: string; username: string; email: string }
  category: { id: string; name: string; slug: string }
  _count: { chapters: number; reviews: number; bookmarks: number }
}

interface StatsData {
  totalUsers: number
  totalReaders: number
  totalAuthors: number
  totalAdmins: number
  totalStories: number
  totalPublished: number
  totalDrafts: number
}

export default function SuperAdminPage() {
  const { data: session, status: sessionStatus } = useSession()

  // Login form state
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stories'>('overview')

  // Stats State
  const [stats, setStats] = useState<StatsData | null>(null)

  // Users State
  const [users, setUsers] = useState<UserItem[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL')

  // Stories State
  const [stories, setStories] = useState<StoryItem[]>([])
  const [storySearch, setStorySearch] = useState('')
  const [storyStatusFilter, setStoryStatusFilter] = useState<string>('ALL')

  // Loading States
  const [loadingData, setLoadingData] = useState(false)

  // Modal States
  const [editUserModal, setEditUserModal] = useState<UserItem | null>(null)
  const [newPasswordInput, setNewPasswordInput] = useState('')
  const [editUserRole, setEditUserRole] = useState<'READER' | 'AUTHOR' | 'ADMIN'>('READER')
  const [editUserName, setEditUserName] = useState('')
  const [actionSuccess, setActionSuccess] = useState('')

  const [editStoryModal, setEditStoryModal] = useState<StoryItem | null>(null)
  const [editStoryTitle, setEditStoryTitle] = useState('')
  const [editStoryDesc, setEditStoryDesc] = useState('')
  const [editStoryStatus, setEditStoryStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT')

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'user' | 'story'; id: string; name: string } | null>(null)

  const isSuperAdmin = session?.user && (session.user as any).role === 'ADMIN'

  // Fetch Data when authenticated as SuperAdmin
  const fetchAllData = async () => {
    setLoadingData(true)
    try {
      const [resStats, resUsers, resStories] = await Promise.all([
        fetch('/api/superadmin/stats'),
        fetch('/api/superadmin/users'),
        fetch('/api/superadmin/stories'),
      ])

      if (resStats.ok) setStats(await resStats.json())
      if (resUsers.ok) {
        const d = await resUsers.json()
        setUsers(d.users || [])
      }
      if (resStories.ok) {
        const d = await resStories.json()
        setStories(d.stories || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllData()
    }
  }, [isSuperAdmin])

  // Login Handler for Super Admin
  const handleSuperAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    try {
      const res = await signIn('credentials', {
        email: usernameInput.trim(),
        password: passwordInput,
        redirect: false,
      })

      if (res?.error) {
        setLoginError('সুপার অ্যাডমিন ইউজারনেম বা পাসওয়ার্ড সঠিক নয়।')
      } else {
        window.location.reload()
      }
    } catch {
      setLoginError('লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Update User Handler
  const handleSaveUser = async () => {
    if (!editUserModal) return
    setActionSuccess('')
    try {
      const res = await fetch('/api/superadmin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editUserModal.id,
          role: editUserRole,
          name: editUserName,
          newPassword: newPasswordInput || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setActionSuccess('ব্যবহারকারীর তথ্য সফলভাবে আপডেট করা হয়েছে।')
        setEditUserModal(null)
        setNewPasswordInput('')
        fetchAllData()
      } else {
        alert(data.error || 'আপডেট ব্যর্থ হয়েছে')
      }
    } catch {
      alert('সার্ভার সমস্যা')
    }
  }

  // Quick Role Change
  const handleQuickRoleChange = async (userId: string, newRole: 'READER' | 'AUTHOR' | 'ADMIN') => {
    try {
      const res = await fetch('/api/superadmin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (res.ok) {
        fetchAllData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Delete User
  const handleDeleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/superadmin/users?userId=${userId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok) {
        setDeleteConfirm(null)
        fetchAllData()
      } else {
        alert(data.error || 'মুছে ফেলা ব্যর্থ হয়েছে')
      }
    } catch {
      alert('সার্ভার সমস্যা')
    }
  }

  // Update Story Handler
  const handleSaveStory = async () => {
    if (!editStoryModal) return
    try {
      const res = await fetch('/api/superadmin/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyId: editStoryModal.id,
          title: editStoryTitle,
          description: editStoryDesc,
          status: editStoryStatus,
        }),
      })

      if (res.ok) {
        setEditStoryModal(null)
        fetchAllData()
      } else {
        const d = await res.json()
        alert(d.error || 'গল্প আপডেট ব্যর্থ')
      }
    } catch {
      alert('সার্ভার সমস্যা')
    }
  }

  // Quick Story Status Change
  const handleQuickStoryStatus = async (storyId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
    try {
      const res = await fetch('/api/superadmin/stories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId, status: newStatus }),
      })
      if (res.ok) {
        fetchAllData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Delete Story
  const handleDeleteStory = async (storyId: string) => {
    try {
      const res = await fetch(`/api/superadmin/stories?storyId=${storyId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setDeleteConfirm(null)
        fetchAllData()
      } else {
        const d = await res.json()
        alert(d.error || 'গল্প মোছা ব্যর্থ')
      }
    } catch {
      alert('সার্ভার সমস্যা')
    }
  }

  // Filtering Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  // Filtering Stories
  const filteredStories = stories.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(storySearch.toLowerCase()) ||
      s.author.name.toLowerCase().includes(storySearch.toLowerCase()) ||
      s.author.username.toLowerCase().includes(storySearch.toLowerCase())
    const matchesStatus = storyStatusFilter === 'ALL' || s.status === storyStatusFilter
    return matchesSearch && matchesStatus
  })

  // 1. Show Super Admin Login Form if not logged in as ADMIN
  if (sessionStatus !== 'loading' && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center p-4 font-bengali">
        <div className="w-full max-w-md bg-stone-900 border border-teal-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative h-20 w-44 mb-2">
              <Image src="/logo.png" alt={SITE_NAME} fill className="object-contain" priority />
            </div>
            <div className="inline-block bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold mb-2">
              👑 সুপার অ্যাডমিন পোর্টাল (Super Admin Portal)
            </div>
            <h1 className="text-2xl font-bold text-white">মাস্টার এক্সেস লগইন</h1>
            <p className="text-xs text-stone-400 mt-1">প্লাটফর্মের পূর্ণ নিয়ন্ত্রণ পেতে আপনার ইউজারনেম ও পাসওয়ার্ড দিন</p>
          </div>

          {loginError && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-950/50 p-3.5 text-xs text-red-300">
              ⚠️ {loginError}
            </div>
          )}

          <form onSubmit={handleSuperAdminLogin} className="space-y-4">
            <Input
              id="admin-username"
              type="text"
              label="সুপার অ্যাডমিন ইউজারনেম (Username)"
              placeholder="Username লিখুন"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />

            <Input
              id="admin-password"
              type="password"
              label="সুপার অ্যাডমিন পাসওয়ার্ড (Password)"
              placeholder="Password লিখুন"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoggingIn}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3"
            >
              🔐 প্রবেশ করুন (Super Admin Access)
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800 text-center text-xs text-stone-500">
            {SITE_NAME} — Supreme Administrative Dashboard
          </div>
        </div>
      </div>
    )
  }

  // 2. Render Full Super Admin Dashboard
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-bengali">
      {/* Top Super Admin Navbar */}
      <header className="sticky top-0 z-40 border-b border-teal-900/40 bg-stone-900/90 backdrop-blur-md px-4 sm:px-8 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-28">
              <Image src="/logo.png" alt={SITE_NAME} fill className="object-contain" />
            </div>
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              👑 Super Admin Panel
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-stone-300 hidden sm:inline-block">
              স্বাগতম, <strong className="text-amber-400">{session?.user?.name || 'Sayem'}</strong>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="border-red-500/40 text-red-400 hover:bg-red-950/40 text-xs font-bold"
            >
              প্রস্থান (Logout)
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-3 border-b border-stone-800 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/40'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850'
            }`}
          >
            📊 প্ল্যাটফর্ম ওভারভিউ (Overview)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/40'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850'
            }`}
          >
            👥 ব্যবহারকারী ব্যবস্থাপনা (Users & Roles)
            {users.length > 0 && (
              <span className="bg-stone-800 text-teal-300 text-xs px-2 py-0.5 rounded-full">{users.length}</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('stories')}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
              activeTab === 'stories'
                ? 'bg-teal-700 text-white shadow-lg shadow-teal-900/40'
                : 'bg-stone-900 text-stone-400 hover:text-white hover:bg-stone-850'
            }`}
          >
            📖 গল্প ব্যবস্থাপনা (All Stories)
            {stories.length > 0 && (
              <span className="bg-stone-800 text-amber-300 text-xs px-2 py-0.5 rounded-full">{stories.length}</span>
            )}
          </button>
        </div>

        {/* Global Action Banner */}
        {actionSuccess && (
          <div className="mb-6 rounded-xl border border-green-500/40 bg-green-950/40 p-4 text-sm text-green-300 flex items-center justify-between font-bengali">
            <span>✅ {actionSuccess}</span>
            <button onClick={() => setActionSuccess('')} className="text-green-400 hover:text-white">✕</button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">মোট রেজিস্টার্ড ইউজার</div>
                <div className="text-3xl font-bold text-white">{stats?.totalUsers ?? '...'}</div>
                <div className="text-xs text-teal-400 mt-2 font-medium">সকল ব্যবহারকারী</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">পাঠক সংখ্যা (Readers)</div>
                <div className="text-3xl font-bold text-teal-300">{stats?.totalReaders ?? '...'}</div>
                <div className="text-xs text-stone-400 mt-2">সাধারণ পাঠক</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">লেখক সংখ্যা (Writers/Authors)</div>
                <div className="text-3xl font-bold text-amber-400">{stats?.totalAuthors ?? '...'}</div>
                <div className="text-xs text-stone-400 mt-2">গল্প রচয়িতা</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">সুপার অ্যাডমিন (Admins)</div>
                <div className="text-3xl font-bold text-purple-400">{stats?.totalAdmins ?? '...'}</div>
                <div className="text-xs text-stone-400 mt-2">সর্বোচ্চ ক্ষমতা সম্পন্ন</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">মোট গল্প (Total Stories)</div>
                <div className="text-3xl font-bold text-white">{stats?.totalStories ?? '...'}</div>
                <div className="text-xs text-stone-400 mt-2">প্ল্যাটফর্মের গল্পসমূহ</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">প্রকাশিত গল্প (Published)</div>
                <div className="text-3xl font-bold text-green-400">{stats?.totalPublished ?? '...'}</div>
                <div className="text-xs text-stone-400 mt-2">পাঠকদের জন্য উন্মুক্ত</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <div className="text-xs text-stone-400 font-bold mb-1">খসড়া গল্প (Drafts)</div>
                <div className="text-3xl font-bold text-stone-400">{stats?.totalDrafts ?? '...'}</div>
                <div className="text-xs text-stone-400 mt-2">অপ্রকাশিত অবস্থায় আছে</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-4">⚡ দ্রুত সুপার অ্যাডমিন অ্যাকশন</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="bg-teal-800 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  👥 ব্যবহারকারীদের রোল (Reader / Writer) পরিচালনা করুন
                </button>
                <button
                  onClick={() => setActiveTab('stories')}
                  className="bg-amber-700 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md"
                >
                  📖 গল্প বা ড্রাফট সংশোধন / ডিলিট করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <div className="flex-1">
                <Input
                  id="user-search"
                  placeholder="নাম, ইউজারনেম বা ইমেইল দিয়ে খুঁজুন..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {['ALL', 'READER', 'AUTHOR', 'ADMIN'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setUserRoleFilter(r)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      userRoleFilter === r
                        ? 'bg-teal-700 text-white'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {r === 'ALL' ? 'সকল' : r === 'READER' ? 'পাঠক' : r === 'AUTHOR' ? 'লেখক' : 'অ্যাডমিন'}
                  </button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-800/80 text-stone-300 text-xs font-bold border-b border-stone-700">
                    <tr>
                      <th className="p-4">ব্যবহারকারী</th>
                      <th className="p-4">ইমেইল</th>
                      <th className="p-4">বর্তমান রোল (Role)</th>
                      <th className="p-4">গল্প সংখ্যা</th>
                      <th className="p-4 text-right">সুপার অ্যাডমিন অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-stone-850/50 transition-colors">
                        <td className="p-4 font-medium">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-teal-900/60 border border-teal-500/30 flex items-center justify-center font-bold text-teal-300 text-sm">
                              {u.name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-white font-bold">{u.name}</div>
                              <div className="text-xs text-stone-400">@{u.username}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-stone-300">{u.email}</td>

                        {/* Role Change Selector */}
                        <td className="p-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleQuickRoleChange(u.id, e.target.value as any)}
                            className="bg-stone-800 text-white border border-stone-700 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-teal-500"
                          >
                            <option value="READER">📖 পাঠক (Reader)</option>
                            <option value="AUTHOR">✍️ লেখক (Writer/Author)</option>
                            <option value="ADMIN">👑 সুপার অ্যাডমিন (Admin)</option>
                          </select>
                        </td>

                        <td className="p-4 text-stone-300 font-bold">{u._count.stories} টি</td>

                        {/* Actions: Edit Password / Edit Details / Delete */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditUserModal(u)
                                setEditUserName(u.name)
                                setEditUserRole(u.role)
                                setNewPasswordInput('')
                              }}
                              className="px-3 py-1.5 rounded-lg bg-teal-800/80 hover:bg-teal-700 text-teal-200 text-xs font-bold transition-all"
                            >
                              🔑 পাসওয়ার্ড ও তথ্য পরিবর্তন
                            </button>

                            <button
                              onClick={() => setDeleteConfirm({ type: 'user', id: u.id, name: u.name })}
                              className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800/40 text-red-300 text-xs font-bold transition-all"
                            >
                              🗑️ ডিলিট
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-stone-500">
                          কোনো ব্যবহারকারী পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STORY MANAGEMENT */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-stone-900 border border-stone-800 p-4 rounded-2xl">
              <div className="flex-1">
                <Input
                  id="story-search"
                  placeholder="গল্পের শিরোনাম বা লেখকের নাম দিয়ে খুঁজুন..."
                  value={storySearch}
                  onChange={(e) => setStorySearch(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {['ALL', 'DRAFT', 'PUBLISHED', 'ARCHIVED'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStoryStatusFilter(s)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      storyStatusFilter === s
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-800 text-stone-400 hover:text-white'
                    }`}
                  >
                    {s === 'ALL' ? 'সকল' : s === 'DRAFT' ? 'ড্রাফট (Draft)' : s === 'PUBLISHED' ? 'প্রকাশিত' : 'আর্কাইভ'}
                  </button>
                ))}
              </div>
            </div>

            {/* Stories Table */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-800/80 text-stone-300 text-xs font-bold border-b border-stone-700">
                    <tr>
                      <th className="p-4">গল্পের শিরোনাম</th>
                      <th className="p-4">লেখক</th>
                      <th className="p-4">ক্যাটাগরি</th>
                      <th className="p-4">অবস্থা (Status)</th>
                      <th className="p-4">পড়াশোনা (Reads)</th>
                      <th className="p-4 text-right">সুপার অ্যাডমিন অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredStories.map((st) => (
                      <tr key={st.id} className="hover:bg-stone-850/50 transition-colors">
                        <td className="p-4 font-bold text-white max-w-xs truncate">
                          <Link href={`/story/${st.slug}`} target="_blank" className="hover:text-teal-400">
                            {st.title}
                          </Link>
                          <div className="text-xs text-stone-500 font-normal truncate">{st.description}</div>
                        </td>

                        <td className="p-4 text-stone-300">
                          <div className="font-bold">{st.author.name}</div>
                          <div className="text-xs text-stone-500">@{st.author.username}</div>
                        </td>

                        <td className="p-4 text-teal-300 font-medium">{st.category?.name || 'সাধারণ'}</td>

                        {/* Status Dropdown */}
                        <td className="p-4">
                          <select
                            value={st.status}
                            onChange={(e) => handleQuickStoryStatus(st.id, e.target.value as any)}
                            className={`border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none ${
                              st.status === 'PUBLISHED'
                                ? 'bg-green-950/60 border-green-700 text-green-300'
                                : st.status === 'DRAFT'
                                ? 'bg-amber-950/60 border-amber-700 text-amber-300'
                                : 'bg-stone-800 border-stone-700 text-stone-400'
                            }`}
                          >
                            <option value="DRAFT">📝 ড্রাফট (Draft)</option>
                            <option value="PUBLISHED">🚀 প্রকাশিত (Published)</option>
                            <option value="ARCHIVED">📦 আর্কাইভ (Archived)</option>
                          </select>
                        </td>

                        <td className="p-4 text-stone-300 font-bold">{st.readCount} বার</td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditStoryModal(st)
                                setEditStoryTitle(st.title)
                                setEditStoryDesc(st.description)
                                setEditStoryStatus(st.status)
                              }}
                              className="px-3 py-1.5 rounded-lg bg-amber-800/80 hover:bg-amber-700 text-amber-200 text-xs font-bold transition-all"
                            >
                              ✏️ সম্পাদন (Edit)
                            </button>

                            <button
                              onClick={() => setDeleteConfirm({ type: 'story', id: st.id, name: st.title })}
                              className="px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800/40 text-red-300 text-xs font-bold transition-all"
                            >
                              🗑️ ডিলিট
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredStories.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-500">
                          কোনো গল্প পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* EDIT USER MODAL (Includes Password Change Option) */}
      {editUserModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-teal-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔑 ব্যবহারকারী সম্পাদনা & পাসওয়ার্ড পরিবর্তন
            </h2>
            <div className="p-3 bg-stone-800 rounded-xl text-xs text-stone-300">
              ইউজার: <strong>{editUserModal.name}</strong> (@{editUserModal.username})
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">নাম (Name)</label>
              <Input
                id="edit-user-name"
                value={editUserName}
                onChange={(e) => setEditUserName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">রোল (Role Permission)</label>
              <select
                value={editUserRole}
                onChange={(e) => setEditUserRole(e.target.value as any)}
                className="w-full bg-stone-800 text-white border border-stone-700 rounded-lg p-2.5 text-sm font-bold"
              >
                <option value="READER">📖 পাঠক (Reader)</option>
                <option value="AUTHOR">✍️ লেখক (Writer/Author)</option>
                <option value="ADMIN">👑 সুপার অ্যাডমিন (Super Admin)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-amber-400 block mb-1">
                🔐 নতুন পাসওয়ার্ড সেট করুন (Super Admin Password Override)
              </label>
              <Input
                id="edit-user-password"
                type="password"
                placeholder="নতুন পাসওয়ার্ড দিন (যদি পরিবর্তন করতে চান)"
                value={newPasswordInput}
                onChange={(e) => setNewPasswordInput(e.target.value)}
              />
              <p className="text-[10px] text-stone-500 mt-1">
                ফাঁকা রাখলে বর্তমান পাসওয়ার্ড অপরিবর্তিত থাকবে।
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 border-stone-700 text-stone-300"
                onClick={() => setEditUserModal(null)}
              >
                বাতিল (Cancel)
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold"
                onClick={handleSaveUser}
              >
                সংরক্ষণ করুন (Save Changes)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STORY MODAL */}
      {editStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ✏️ গল্প সম্পাদনা (Edit Story Details)
            </h2>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">গল্পের শিরোনাম</label>
              <Input
                id="edit-story-title"
                value={editStoryTitle}
                onChange={(e) => setEditStoryTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">গল্পের বিবরণ (Summary)</label>
              <textarea
                rows={4}
                value={editStoryDesc}
                onChange={(e) => setEditStoryDesc(e.target.value)}
                className="w-full bg-stone-800 text-white border border-stone-700 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-400 block mb-1">প্রকাশের অবস্থা (Status)</label>
              <select
                value={editStoryStatus}
                onChange={(e) => setEditStoryStatus(e.target.value as any)}
                className="w-full bg-stone-800 text-white border border-stone-700 rounded-lg p-2.5 text-sm font-bold"
              >
                <option value="DRAFT">📝 ড্রাফট (Draft)</option>
                <option value="PUBLISHED">🚀 প্রকাশিত (Published)</option>
                <option value="ARCHIVED">📦 আর্কাইভ (Archived)</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 border-stone-700 text-stone-300"
                onClick={() => setEditStoryModal(null)}
              >
                বাতিল (Cancel)
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold"
                onClick={handleSaveStory}
              >
                সংরক্ষণ করুন (Save)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="text-5xl">⚠️</div>
            <h2 className="text-xl font-bold text-white">আপনি কি নিশ্চিত?</h2>
            <p className="text-xs text-stone-300">
              আপনি <strong className="text-red-400">{deleteConfirm.name}</strong>{' '}
              {deleteConfirm.type === 'user' ? 'ব্যবহারকারী অ্যাকাউন্টটি' : 'গল্পটি'} প্ল্যাটফর্ম থেকে স্থায়ীভাবে মুছে ফেলতে যাচ্ছেন!
            </p>

            <div className="flex gap-3 pt-2">
              <Button
                variant="ghost"
                className="flex-1 border-stone-700 text-stone-300"
                onClick={() => setDeleteConfirm(null)}
              >
                না, বাতিল করুন
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold"
                onClick={() => {
                  if (deleteConfirm.type === 'user') handleDeleteUser(deleteConfirm.id)
                  else handleDeleteStory(deleteConfirm.id)
                }}
              >
                হ্যাঁ, স্থায়ীভাবে মুছুন
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
