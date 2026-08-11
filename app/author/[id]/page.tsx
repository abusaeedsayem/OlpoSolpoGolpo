import { redirect } from 'next/navigation'

interface AuthorPageProps {
  params: Promise<{ id: string }>
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { id } = await params
  redirect(`/profile/${id}`)
}
