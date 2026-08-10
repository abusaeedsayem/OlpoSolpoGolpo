import type { Metadata } from 'next'
import NewPublishStoryPage from '../dashboard/stories/new/page'

export const metadata: Metadata = {
  title: 'নতুন লেখা — অল্প স্বল্প গল্প',
  description: 'নতুন গল্প বা অধ্যায় লিখুন ও প্রকাশ করুন',
}

export default function PublicWritePage() {
  return <NewPublishStoryPage />
}
