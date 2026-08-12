import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const deleted = await prisma.story.deleteMany({
    where: { slug: { in: ['nil-joler-gaan', 'rater-shohore'] } },
  })
  console.log(`Deleted ${deleted.count} placeholder story/stories`)

  const remaining = await prisma.story.findMany({
    select: { title: true, slug: true, status: true },
  })
  console.log('Remaining stories:', JSON.stringify(remaining, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
