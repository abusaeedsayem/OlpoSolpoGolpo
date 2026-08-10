import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const CATEGORIES = [
  { name: 'রোমান্স', slug: 'romance', emoji: '💕', description: 'প্রেম, আবেগ ও হৃদয়ের স্পর্শময় কাহিনী' },
  { name: 'রহস্য', slug: 'mystery', emoji: '🔍', description: 'রহস্য, গোয়েন্দা ও রোমাঞ্চকর অন্বেষণ' },
  { name: 'ভৌতিক', slug: 'horror', emoji: '👻', description: 'অদৃশ্য রূপকথা, আতঙ্ক ও আলৌকিক উপাখ্যান' },
  { name: 'সামাজিক', slug: 'social', emoji: '🏘️', description: 'সমাজ, পরিবার ও জীবনের বাস্তব প্রতিচ্ছবি' },
  { name: 'অ্যাডভেঞ্চার', slug: 'adventure', emoji: '⚔️', description: 'অভিযান, সংগ্রাম ও অসমসাহসী যাত্রা' },
  { name: 'বিজ্ঞান কল্পকাহিনী', slug: 'sci-fi', emoji: '🚀', description: 'মহাকাশ, ভবিষ্যৎ ও প্রযুক্তির অদেখা জগৎ' },
  { name: 'হাস্যরস', slug: 'comedy', emoji: '😄', description: 'হাসি, আনন্দ ও জীবনের মজার মুহূর্ত' },
]

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Seed Categories
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, iconEmoji: cat.emoji, description: cat.description },
      create: { name: cat.name, slug: cat.slug, iconEmoji: cat.emoji, description: cat.description },
    })
  }
  console.log('✅ Categories seeded.')

  // 2. Seed Sample Author User
  const passwordHash = await bcrypt.hash('password123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'sumaiya@example.com' },
    update: {},
    create: {
      name: 'সুমাইয়া হক',
      username: 'sumaiya',
      email: 'sumaiya@example.com',
      passwordHash,
      role: 'AUTHOR',
      bio: 'গল্প লিখতে ভালোবাসি। প্রকৃতির সৌন্দর্য আর মানুষের সম্পর্কের নানা টানাপোড়েন আমার লেখার মূল উৎস।',
    },
  })
  console.log('✅ Sample Author seeded.')

  // 3. Seed Sample Story
  const socialCategory = await prisma.category.findUnique({ where: { slug: 'social' } })
  if (socialCategory) {
    const story = await prisma.story.upsert({
      where: { slug: 'nil-joler-gaan' },
      update: {},
      create: {
        title: 'নীল জলের গান',
        slug: 'nil-joler-gaan',
        description: 'একটি ছোট মেয়ে এবং তার হারানো স্বপ্নের গল্প। সমুদ্রের নীল জলে খুঁজে পায় সে তার হারানো শৈশব। এটি একটি মর্মস্পর্শী উপাখ্যান যা আমাদের মনে করিয়ে দেয় শৈশবের স্বপ্নগুলো কখনও মরে না।',
        status: 'PUBLISHED',
        readCount: 12340,
        tags: ['শৈশব', 'স্বপ্ন', 'সমুদ্র'],
        authorId: user.id,
        categoryId: socialCategory.id,
      },
    })

    // Seed Chapters for story
    await prisma.chapter.upsert({
      where: { storyId_chapterNumber: { storyId: story.id, chapterNumber: 1 } },
      update: {},
      create: {
        storyId: story.id,
        chapterNumber: 1,
        title: 'প্রথম ঢেউ',
        status: 'PUBLISHED',
        wordCount: 1240,
        content: `সমুদ্রের ধারে বসে মেয়েটি দেখছিল ঢেউগুলো একে একে আসছে আর যাচ্ছে। প্রতিটি ঢেউ যেন একটি গল্প বয়ে আনছে দূর থেকে — হয়তো অন্য কোনো দেশ থেকে, হয়তো অন্য কোনো জীবন থেকে।

তার নাম ছিল রাহেলা। বয়স মাত্র বারো। কিন্তু তার চোখে ছিল এক অদ্ভুত গভীরতা — যেন সে অনেক কিছু দেখেছে, অনেক কিছু জানে।

"মা বলতেন," সে নিজেই নিজেকে বলল, "সমুদ্র কখনো মিথ্যে বলে না।"

ঢেউটা এসে তার পায়ের কাছে ভেঙে পড়ল। ঠান্ডা জলের স্পর্শে সে শিউরে উঠল। কিন্তু সরে গেল না।

দূরে একটি নৌকা দেখা যাচ্ছিল। সাদা পালতোলা নৌকা। বাতাসে পাল ফুলে উঠেছে। রাহেলা ভাবল — যদি সে ওই নৌকায় চড়ে চলে যেতে পারত? যদি পেরত সব ছেড়ে দিয়ে চলে যেতে?

কিন্তু সে জানত, পালানো সমাধান নয়।

সে আবার সমুদ্রের দিকে তাকাল। নীল জল, নীল আকাশ। মাঝে শুধু একটি সরু দিগন্তরেখা।

সেখানেই যেন লুকিয়ে আছে তার সব উত্তর।`,
      },
    })

    await prisma.chapter.upsert({
      where: { storyId_chapterNumber: { storyId: story.id, chapterNumber: 2 } },
      update: {},
      create: {
        storyId: story.id,
        chapterNumber: 2,
        title: 'বালির ঘর',
        status: 'PUBLISHED',
        wordCount: 1580,
        content: `পরদিন সকালে সুর্য ওঠার আগেই রাহেলা আবার সৈকতে এসে দাঁড়াল। বাতাসের সাথে নোনা জলের গন্ধ মিশে এক অপার্থিব অনুভূতি তৈরি করেছিল।

সে ভিজে বালিতে হাত দিয়ে একটি ছোট ঘর বানাতে শুরু করল। ছোট দরজা, চার কোণে চারটি ছোট স্তম্ভ।

"কী বানাচ্ছো তুমি?" পিছন থেকে একটি পরিচিত কণ্ঠ ভেসে এল।

রাহেলা ফিরে তাকাল। তার মামা দাঁড়িয়ে আছেন, হাতে একটা পুরনো কাঠের বাক্স।

"আমার স্বপ্নের ঘর, মামা," রাহেলা জবাব দিল।

মামা মৃদু হাসলেন। "যে ঘর জোয়ারের জলে ভেসে যাবে, সেটা আবার স্বপ্নের ঘর হয় কীভাবে?"

রাহেলা বালির ঘরের দিকে তাকিয়ে রইল। এক মুহূর্ত চুপ থেকে বলল, "ভেসে যাবে জেনেও যা আমরা গড়ে তুলি, সেটাই তো স্বপ্ন, তাই না?"`,
      },
    })

    console.log('✅ Sample Story & Chapters seeded.')
  }

  console.log('🚀 Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
