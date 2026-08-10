import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function StoriesEditAlias({ params }: Props) {
  const { id } = await params
  redirect(`/dashboard/stories/${id}/edit`)
}
