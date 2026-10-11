/**
 * Idempotent placeholder-content seeder for the OlpoSolpoGolpo Turso database.
 *
 *   node scripts/seed.mjs
 *
 * Every row it writes carries a `seed-` prefixed id, so a re-run only ever
 * replaces its own rows and never touches content created by the app.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

// ─── Env ─────────────────────────────────────────────────────────────────────
const env = {};
for (const line of fs.readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split(/\r?\n/)) {
  const i = line.indexOf('=');
  if (i > 0 && !line.trim().startsWith('#')) env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}
if (!env.TURSO_DATABASE_URL) {
  console.error('TURSO_DATABASE_URL missing from .env.local');
  process.exit(1);
}
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

async function run(sql, args = []) {
  await db.execute({ sql, args });
}

// ─── Authors (fictional — placeholder by design) ─────────────────────────────
const AUTHORS = [
  'অনিরুদ্ধ সেন', 'রূপালী দত্ত', 'তন্ময় ভট্টাচার্য', 'সায়ন্তনী ঘোষ',
  'কবির আনাম', 'নীলাঞ্জনা সরকার', 'অরিন্দম পাল', 'শাওন মিত্র',
  'জনান্দা রায়', 'ফারহানা ইসলাম', 'দেবজ্যোতি সেনগুপ্ত', 'মৃণাল কর্মকার',
];

// ─── Categories ──────────────────────────────────────────────────────────────
// isTile → the six large image tiles under the masthead, in `sort` order.
const CATEGORIES = [
  { slug: 'feature',       name: 'ফিচার স্টোরি',        sort: 1,  tile: 0 },
  { slug: 'dharabahik',    name: 'ধারাবাহিক',            sort: 2,  tile: 0 },
  { slug: 'sakkhatkar',    name: 'সাক্ষাৎকার',           sort: 3,  tile: 0 },
  { slug: 'uponyas',       name: 'উপন্যাস',              sort: 4,  tile: 1 },
  { slug: 'golpo',         name: 'গল্প',                  sort: 5,  tile: 1 },
  { slug: 'kobita',        name: 'কবিতা',                sort: 6,  tile: 1 },
{ slug: 'mukto-godyo',   name: 'মুক্ত গদ্য',           sort: 7,  tile: 0 },
  { slug: 'anubad-kobita', name: 'অনুবাদ কবITA',        sort: 8,  tile: 0 },
  { slug: 'ketabi-kotha',  name: 'কেতাবি কথা',           sort: 9,  tile: 0 },
  { slug: 'chitro-kala',   name: 'চিত্রকলা',             sort: 10, tile: 0 },
  { slug: 'shasthya',      name: 'স্বাস্থ্য',             sort: 11, tile: 0 },
  { slug: 'khela',         name: 'খেলা',                 sort: 12, tile: 0 },
  { slug: 'cine-duniya',   name: 'সিনে দুনিয়া',         sort: 13, tile: 0 },
  { slug: 'fashion',       name: 'ফ্যাশন',               sort: 14, tile: 0 },
  { slug: 'jibe-jol',      name: 'জিভে জল',              sort: 15, tile: 0 },
  { slug: 'bhromon',       name: 'ভ্রমণ',                 sort: 16, tile: 0 },
  { slug: 'chorobeti',     name: 'চরৈবেতি',              sort: 17, tile: 0 },
  { slug: 'shraddha',      name: 'শ্রদ্ধা জ্ঞাপন',       sort: 18, tile: 0 },
  { slug: 'moner-kotha',   name: 'মনের কথা',             sort: 19, tile: 0 },
  { slug: 'rupkotha',      name: 'রূপকথা',               sort: 20, tile: 0 },
];

// ─── Placeholder prose pool ──────────────────────────────────────────────────
const PARAGRAPHS = [
  'ভোরের আলো ফুটার ঠিক আগে শহরটা এক অদ্ভুত নীরবতায় ডুবে থাকে। রাস্তার ল্যাম্পগুলো ক্লান্ত চোখে জ্বলে ওঠে, আর দূরের মাঠ ঘেঁষা ট্রেনটি ধীরে ধীরে কাঁপাড়ে সারা জগৎকে। এই সময়টুকু কেউ কাউকে জাগানো রীতি নেই, তবু কেউ কেউ জেগে থাকে — যেন রাতের শেষ পর্যন্ত তার কথা শোনার দায়িত্ব তার।',
  'সে দরজার কাজ টানলে চেনা শব্দটা এসে দাঁড়ায়। অনেক দিন পরেও ঘরটা একই জায়গায়, একই গন্ধে আছে — দেউড়িতে রাখা শুকনো ফুল, জানালার ধারে অসমাপ্ত বই, কোণে ভাঁজ করা একটা চিঠি। সময় নিজেকে বদলায় না, বদলায় শুধু তাকে দেখার চোখ।',
  'মাঠের ওপারে মেলার আওয়াজ ভেসে আসছিল সন্ধ্যার পর। রঙিন বাতাসবেলুন, লাঠি ছাড়া সার্কাস, কাঠের তৈরি ছোট খেলনা — সবই যেন কোনো পুরনো আমন্ত্রণের প্রতীক। বাচ্চারা হাত ধরে হাঁটছিল, আর বড়রা পেছনে হেঁটে যেতে যেতে নিজেদেরই হারানো বছরগুলো খুঁজে পাচ্ছিল।',
  'নদীর জলে সূর্য নেমে আসতে লাগল সোনালি কণায়। নৌকার মাঝি বলল, "জল বদলে যায় প্রতিটি মাসে, কিন্তু নদী কখনও তার পথ ভুলে না।" সে কথাটা তখন অদ্ভুত লেগেছিল, অনেক পরে বুঝলাম মানুষের সঙ্গে নদীর সমতুল্যতার কথাই সে বলতে চেয়েছিল।',
  'বইয়ের পাতা উল্টে দিলে দেখা গল একটা ভেজা দাগ — সম্ভবত চা-এর, অথবা সেদিনের বৃষ্টির। কোনোটাই জানা যায় না। তবু সে দাগটুকু বইটাকে কেউ আপন করে নিয়েছে, যেন বইটা আর কারো মতো অচেনা নেই।',
  'চা পান করার সময় সে বলল, "লেখা শুরু করতে সাহস লাগে, শেষ করতে ধৈর্য।" খিদে নিয়ে হেসে দিয়ে জিজ্ঞেস করল, "আর ভুলে যেতে?" সে কিছুক্ষণ চুপ থেকে বলল, "ভুলে যাওয়াটাই তো আসল লেখা।"',
  'তার ঘড়ি সবসময় পাঁচ মিনিট পেছনে চলত — ইচ্ছাকৃতভাবে, বলেছিল সে, যাতে কেউ তাকে অপেক্ষা না করে। অথচ বাস্তবে সে সবার আগে দাঁড়াত, শুধু দেখাত না। অদৃশ্য থেকেই সে উপস্থিতির এক নিজস্ব ভাষা গড়ে তুলেছিল।',
  'শহরের মাঝখানে একটা ছোট্ট চা-কল আছে, যেটাকে কেউ মানচিত্রে চিহ্নিত করেনি। দরজাটা সবসময় খোলা, দেয়ালে পুরনো ছবি, টেবিলে অসমাপ্ত দুটি গল্প। মালিক জানেন প্রতিটি অতিথির পছন্দ, তবু প্রতিবারই জিজ্ঞেস করেন — কারণ গল্প শুনতে এসেছেন যারা, তাদের পছন্দও প্রতিদিন বদলায়।',
  'সেদিন ঝড় এসেছিল বিকেলেই। শিশুরা জানালার কাছে জড়ো হয়ে বসেছিল, আর বড়রা ছাদের টানা দড়ি শক্ত করছিল। কেউ ভয় পেয়েছিল, কেউ উত্তেজিত — কিন্তু সবাই একসঙ্গে সেদিনটা মনে রাখল। পরের দিন সকালে রাস্তায় ভাঙা ডাল, ভেজা কাগজ আর একটা হারানো স্যান্ডেল ছাড়া আর কোনো চিহ্ন ছিল না।',
  'পুরনো কারখানার সেই হলঘরে এখনও পুরনো যন্ত্রপাতি কাঁপছে, যদিও কেউ চালায় না। দেয়ালে লেখা স্লোগানগুলো মলিন হয়ে গেছে, তবু পড়া যায়: "সময়ই একমাত্র মুদ্রা।" প্রতি সন্ধ্যায় একজন প্রহরী ঘুরে বেরিয়ে আসেন, দরজায় তালা দেন, আর নিশ্চিত হন যে গল্পগুলো এখনও শোনা যায়।',
];

const STANZAS = [
  'সন্ধ্যা নামে ধীরে,\nকুয়াশা জমে দারে,\nযে কথা বলা হয়নি\nতারই নাম সে ধরে।',
  'শিখা ভেজে যায় কিন্তু\nঅন্ধকার মানে না,\nজানালায় ভিজে থাকা\nচাঁদ একটু থাকে।',
  'কত নাম রাখা আছে\nনামহীন রাস্তায়,\nআমি হেঁটেছি সবগুলো\nনিঃশব্দে একসাথে।',
  'সময় কাটে না, গড়ে —\nপাতায় পাতায় মাপা,\nযেটুকু বেঁচে থাকি\nসেটুকুই আমার লেখা।',
  'বৃষ্টি এলে মাটি ধরে\nযা ছিল অদৃশ্য,\nআমি তখন দেখি নিজেকে\nএকটু বেশি সত্য।',
  'ফিরে আসার পথ আছে\nযাওয়ার পথ নেই,\nতবু হাতটা এগিয়ে দেয়\nজানে না কে কেই।',
  'ভাষা টুকরো টুকরো,\nঅর্থ জমে ভেজা,\nএকটি শব্দ দাঁড়িয়ে আছে\nপুরো রাতের জেয়া।',
  'যা বলা হয়নি কোনোদিন\nতা কবিতা হয়ে ওঠে,\nনিঃশব্দে গাওয়া গানই\nসবচেয়ে বেশি থাকে।',
];

// ─── Articles ────────────────────────────────────────────────────────────────
const ARTICLES = [
  // feature
  ['feature', 'শহরের নাম বদলে যায় যখন', 'nagorir-naam-bodle', 0, 3, 0],
  ['feature', 'বৃষ্টির রাতে ফিরে আসা চিঠি', 'bristi-rate-fire-awa-chithi', 4, 3, 0],
  ['feature', 'মাটির ঘরে সাজানো স্মৃতি', 'matir-ghore-sajano-smriti', 8, 3, 0],
  // dharabahik — serial 1 (3 chapters), serial 2 (3), serial 3 (3)
  ['dharabahik', 'নদীর ওপারের ঘর: পর্ব ১', 'nodir-oparer-ghor-1', 1, 3, 1],
  ['dharabahik', 'নদীর ওপারের ঘর: পর্ব ২', 'nodir-oparer-ghor-2', 4, 3, 1],
  ['dharabahik', 'নদীর ওপারের ঘর: পর্ব ৩', 'nodir-oparer-ghor-3', 7, 3, 1],
  ['dharabahik', 'আঁধার সুরেলা রাত: পর্ব ১', 'andhar-surela-rat-1', 2, 3, 2],
  ['dharabahik', 'আঁধার সুরেলা রাত: পর্ব ২', 'andhar-surela-rat-2', 5, 3, 2],
  ['dharabahik', 'আঁধার সুরেলা রাত: পর্ব ৩', 'andhar-surela-rat-3', 9, 3, 2],
  ['dharabahik', 'চিলেকোঠার চাবি: পর্ব ১', 'chilekothar-chabi-1', 3, 3, 3],
  ['dharabahik', 'চিলেকোঠার চাবি: পর্ব ২', 'chilekothar-chabi-2', 6, 3, 3],
  ['dharabahik', 'চিলেকোঠার চাবি: পর্ব ৩', 'chilekothar-chabi-3', 10, 3, 3],
  // sakkhatkar
  ['sakkhatkar', 'সাক্ষাৎকার: লেখার বিষয়ে একাত্তর প্রশ্ন', 'sakkhatkar-lekhar-bishoy', 0, 3, 0],
  // uponyas
  ['uponyas', 'শেষ ট্রেনের অপেক্ষায়', 'ses-trainer-oprekhay', 1, 4, 0],
  ['uponyas', 'মাটির হাতঘড়ি', 'matir-hatghori', 5, 4, 0],
  ['uponyas', 'যে মেঘ বাড়ি ফিরে আসে', 'je megh bari fire-ase', 9, 4, 0],
  // golpo
  ['golpo', 'নীল খামের চিঠি', 'nil-khame-chithi', 2, 3, 0],
  ['golpo', 'লাল মাটির দোকান', 'lal-matir-dokan', 6, 3, 0],
  ['golpo', 'পড়োশীর বারান্দা', 'puroshir-baranada', 10, 3, 0],
  ['golpo', 'একটি চা-চাহিকার ইতিহাস', 'ekti-cha-chahikar-itihash', 3, 3, 0],
  // kobita
  ['kobita', 'সেই ব্যথাটা', 'sei-byathata', 0, 4, 0],
  ['kobita', 'পতন', 'paton', 1, 4, 0],
  ['kobita', 'অন্ধকারে প্রজাপতি', 'ondhokare-projapoti', 2, 4, 0],
  ['kobita', 'শেষ থেকে যার শুরু', 'ses-thake-jar shuru', 3, 4, 0],
  ['kobita', 'বৃক্ষ', 'briksha', 4, 4, 0],
  ['kobita', 'গল্পহীন গল্প', 'golpohin-golpo', 5, 4, 0],
  // mukto-godyo
  ['mukto-godyo', 'হারায়ে খুঁজি', 'haraye-khunji', 0, 3, 0],
  ['mukto-godyo', 'নিজের সঙ্গে এক দিন', 'nijer-sange-ek-din', 3, 3, 0],
  ['mukto-godyo', 'অমুখ কথা', 'omukh-kotha', 6, 3, 0],
  // anubad-kobita
  ['anubad-kobita', 'অনুবাদ: পাহাড়ের কবিতা', 'anubad-paharer-kobita', 1, 4, 0],
  ['anubad-kobita', 'অনুবাদ: সমুদ্রের চিঠি', 'anubad-somudrer-chithi', 5, 4, 0],
  // ketabi-kotha
  ['ketabi-kotha', 'সোমনাথের গল্প: নতুন কথাসাহিত্যের তারুণ্য', 'ketabi-somnather-golpo', 0, 3, 0],
  ['ketabi-kotha', 'যবনিকা পতনের পরেও হাজারবার', 'ketabi-jabonika', 4, 3, 0],
  ['ketabi-kotha', 'তরুণ কবির অমোঘ উচ্চারণ', 'ketabi-torun-kobir', 7, 3, 0],
  ['ketabi-kotha', 'অসমাপ্ত পাণ্ডুলিপির ডায়েরি', 'ketabi-osomapto-pandulipi', 10, 3, 0],
  // chitro-kala
  ['chitro-kala', 'প্রাচ্য-পাশ্চাত্যের ম্যুরাল শিল্প', 'chitrokala-mural-shilpo', 2, 3, 0],
  ['chitro-kala', 'রঙের ঘরে এক অপরিচিত', 'chitrokala-ronger-ghore', 6, 3, 0],
  // shasthya
  ['shasthya', 'বড়দের টিকা টিপ্পনি: পর্ব ১', 'shasthya-tika-tipponi', 1, 3, 0],
  ['shasthya', 'ঘুমের গল্প, স্বাস্থ্যের কথা', 'shasthya-ghumer-golpo', 5, 3, 0],
  // khela
  ['khela', 'মাঠ ফিরে আসে সন্ধ্যায়', 'khela-mat-fire-ase', 3, 3, 0],
  ['khela', 'শেষ ওভারের জুয়া', 'khela-shes-overer-jua', 7, 3, 0],
  // cine-duniya
  ['cine-duniya', '‘বাকিটা ব্যক্তিগত’: ঘ্রাণে ও স্মরণে', 'cine-bakita-byaktigato', 0, 3, 0],
  ['cine-duniya', 'পর্দার পেছনের সুর', 'cine-pordar-pachhoner-sur', 4, 3, 0],
  ['cine-duniya', 'যে দৃশ্য কাটা হয়নি', 'cine-je-drishyo-kata-hoini', 8, 3, 0],
  // fashion
  ['fashion', 'দেশজ উপাদানে হাতে তৈরি গয়না', 'fashion-desho-upadane', 2, 3, 0],
  ['fashion', 'সাজের পোশাক, নিজের গল্প', 'fashion-sajer-poshak', 6, 3, 0],
  // jibe-jol
  ['jibe-jol', 'রুই মাছের দুটি চটজলদি রেসিপি', 'jibe-jol-rui-macher', 1, 3, 0],
  ['jibe-jol', 'পাড়ার ভাপা ভাতের দোকান', 'jibe-jol-bhater-dokan', 5, 3, 0],
  ['jibe-jol', 'শীতের গুড়ের পিঠা', 'jibe-jol-gurer-pitha', 9, 3, 0],
  // bhromon
  ['bhromon', 'পাহাড়ের কুঁড়িতে এক সকাল', 'bhromon-paharer-kurite', 3, 3, 0],
  ['bhromon', 'নদীবর্তী গ্রামের তিন দিন', 'bhromon-nadiborti-grame', 7, 3, 0],
  // chorobeti
  ['chorobeti', 'শাহী গোলাপের বাগান', 'chorobeti-shahi-golaper', 0, 3, 0],
  ['chorobeti', 'পুরনো বাজারের সকাল', 'chorobeti-purono-bazar', 4, 3, 0],
  // shraddha
  ['shraddha', 'এক প্রাজ্ঞ প্রাণের চিরপ্রস্থান', 'shraddha-ek-pragya-praner', 2, 3, 0],
  ['shraddha', 'লিটল ম্যাগাজিনের পুরোধার শ্রদ্ধা', 'shraddha-little-magazine', 6, 3, 0],
  // moner-kotha
  ['moner-kotha', 'ইতিহাস ও বর্তমানের আলোকে কবিতার প্রতিবাদ', 'moner-kotha-kobitar-protibad', 1, 3, 0],
  ['moner-kotha', 'নিভৃতে কবিতা পাঠের সময়', 'moner-kotha-nibrite', 5, 3, 0],
  // rupkotha
  ['rupkotha', 'ফ্যাশনের সঙ্গে দেশজ উপাদান', 'rupkotha-fashion-deshoj', 3, 3, 0],
  ['rupkotha', 'পুরনো কাহিনির নতুন পোশাক', 'rupkotha-purono-kahini', 7, 3, 0],
];

// ─── Books ───────────────────────────────────────────────────────────────────
const BOOKS = [
  ['গ্রাম্য দারোগা', 'অনিরুদ্ধ সেন', '180/-'],
  ['যে কাহিনির আজ আছে', 'রূপালী দত্ত', '200/-'],
  ['অসমাপ্ত কবির চিঠি', 'তন্ময় ভট্টাচার্য', '350/-'],
  ['নীল জানালার মানচিত্র', 'সায়ন্তনী ঘোষ', '180/-'],
  ['শতদ্রু ও অন্যান্য গল্প', 'কবির আনাম', '200/-'],
  ['ডিজিটাল ভ্রমণ', 'নীলাঞ্জনা সরকার', '200/-'],
  ['প্রতিদিনের কবিতা, অক্ষিণ প্রতীক্ষা', 'অরিন্দম পাল', '150/-'],
  ['সপ্তাহের ডাকঘর', 'শাওন মিত্র', '250/-'],
];

const AUDIO = [
  ['nodir-oparer-ghor-1', 'জনান্দা রায়', 372, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'],
  ['nil-khame-chithi', 'ফারহানা ইসলাম', 288, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'],
  ['sei-byathata', 'দেবজ্যোতি সেনগুপ্ত', 195, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'],
  ['ses-trainer-oprekhay', 'মৃণাল কর্মকার', 426, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'],
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const slugId = (s) => `seed-${s}`;
const cover = (seed) => `https://picsum.photos/seed/osg-${seed}/900/650`;
const pick = (arr, n) => arr[n % arr.length];

function articleBody(offset, isPoem, paraCount) {
  if (isPoem) {
    const lines = [];
    for (let i = 0; i < 4; i++) lines.push(pick(STANZAS, offset + i));
    return lines
      .map((s) => `<p class="poem-stanza">${s.replace(/\n/g, '<br />')}</p>`)
      .join('\n');
  }
  const body = [];
  const paragraphs = Math.max(3, paraCount || 3);
  for (let i = 0; i < paragraphs; i++) body.push(`<p>${pick(PARAGRAPHS, offset + i)}</p>`);
  return body.join('\n');
}

function excerptOf(offset, isPoem) {
  if (isPoem) {
    return pick(STANZAS, offset).replace(/\n/g, ' / ').slice(0, 120);
  }
  return pick(PARAGRAPHS, offset).slice(0, 150) + '…';
}

// Drizzle's `{ mode: 'timestamp' }` columns are epoch milliseconds (integers);
// storing an ISO string here makes `new Date(value)` invalid when reading back.
const daysAgo = (n) => Date.now() - n * 86400000;

// ─── Seed ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('Cleaning previous seed rows…');
  await run('DELETE FROM audio_tracks WHERE id LIKE ?', ['seed-%']);
  await run('DELETE FROM articles WHERE id LIKE ?', ['seed-%']);
  await run('DELETE FROM books WHERE id LIKE ?', ['seed-%']);
  await run('DELETE FROM categories WHERE id LIKE ?', ['seed-%']);
  await run('DELETE FROM users WHERE id LIKE ?', ['seed-%']);

  // Users
  for (let i = 0; i < AUTHORS.length; i++) {
    const id = slugId(`user-${i + 1}`);
    await run(
      `INSERT INTO users (id, name, email, display_name_bn, role, subscription_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'CONTRIBUTOR', 'FREE', ?, ?)`,
      [id, AUTHORS[i], `author${i + 1}@olposolpogolpo.test`, AUTHORS[i], Date.now(), Date.now()]
    );
  }
  console.log(`  users: ${AUTHORS.length}`);

  // Categories
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await run(
      `INSERT INTO categories (id, name_bn, slug, description, sort_order, image_url, is_tile)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        slugId(`cat-${c.slug}`),
        c.name,
        c.slug,
        `‘${c.name}’ বিভাগের নতুন লেখা`,
        c.sort,
        c.tile ? cover(`tile-${c.slug}`) : null,
        c.tile ? 1 : 0,
      ]
    );
  }
  console.log(`  categories: ${CATEGORIES.length}`);

  // Articles
  const catIndex = Object.fromEntries(CATEGORIES.map((c, i) => [c.slug, i]));
  let n = 0;
  for (const [slug, title, articleSlug, offset, paraCount, seriesNum] of ARTICLES) {
    n += 1;
    const id = slugId(`art-${articleSlug}`);
    const isPoem = slug === 'kobita' || slug === 'anubad-kobita';
    const authorIdx = (n * 3 + catIndex[slug]) % AUTHORS.length;
    const chapterNumber = seriesNum
      ? Number(articleSlug.split('-').pop())
      : null;
    await run(
      `INSERT INTO articles
        (id, slug, title_bn, content_bn, excerpt_bn, cover_image_url, category_id, author_id,
         status, is_paywalled, required_tier, series_id, chapter_number, view_count,
         published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'PUBLISHED', 0, NULL, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        articleSlug,
        title,
        articleBody(offset, isPoem, paraCount),
        excerptOf(offset, isPoem),
        cover(articleSlug),
        slugId(`cat-${slug}`),
        slugId(`user-${authorIdx + 1}`),
        seriesNum ? slugId(`series-${seriesNum}`) : null,
        chapterNumber,
        60 + ((n * 137) % 4800),
        daysAgo((n * 2) % 90),
        Date.now(),
        Date.now(),
      ]
    );
  }
  console.log(`  articles: ${n}`);

  // Books
  for (let i = 0; i < BOOKS.length; i++) {
    const [title, author, price] = BOOKS[i];
    await run(
      `INSERT INTO books (id, title_bn, author_bn, cover_url, price_label, sort_order, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [slugId(`book-${i + 1}`), title, author, cover(`book-${i + 1}`), price, i + 1, Date.now()]
    );
  }
  console.log(`  books: ${BOOKS.length}`);

  // Audio tracks
  const artId = (s) => slugId(`art-${s}`);
  for (let i = 0; i < AUDIO.length; i++) {
    const [articleSlug, narrator, dur, url] = AUDIO[i];
    await run(
      `INSERT INTO audio_tracks (id, article_id, narrator_bn, audio_url, duration_sec, mime_type, created_at)
       VALUES (?, ?, ?, ?, ?, 'audio/mpeg', ?)`,
      [slugId(`audio-${i + 1}`), artId(articleSlug), narrator, url, dur, Date.now()]
    );
  }
  console.log(`  audio tracks: ${AUDIO.length}`);

  const total = await db.execute('SELECT COUNT(*) n FROM articles');
  console.log(`Done. articles in database: ${total.rows[0].n}`);
}

main().catch((err) => {
  console.error('SEED FAILED:', err);
  process.exit(1);
});
