import Image from 'next/image';
import Link from 'next/link';

/**
 * Site footer — matches thehellotesting.com's structure:
 * black band (logo, tagline, address, phone, email, visitor counter)
 * followed by a red copyright bar.
 */
export function Footer() {
  return (
    <footer className="mt-16">
      {/* Black band */}
      <div className="bg-[#0B0B0B] text-white py-14 px-4">
        <div className="max-w-[1000px] mx-auto text-center">
          <div className="inline-flex items-center justify-center bg-white rounded-xl px-5 py-3">
            <Image
              src="/OlpoSolpoGolpo_Logo.png"
              alt="অল্প স্বল্প গল্প"
              width={1983}
              height={793}
              className="h-[52px] w-auto object-contain"
            />
          </div>

          <p className="mt-4 font-prose text-lg text-white/85">পরতে পরশে বাঙালিয়ানা</p>

          <div className="mt-8 space-y-3 text-[15px] sm:text-base text-white/75 font-ui leading-relaxed">
            <p>
              অল্প স্বল্প গল্প, লেখকপল্লী ১২/এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ
            </p>
            <p>ফোন: +৮৮০ ১৭১১ ০০০০০০</p>
            <p>
              ইমেইল:{' '}
              <a
                href="mailto:hello@olposolpogolpo.test"
                className="text-white hover:text-crimson transition-colors"
              >
                hello@olposolpogolpo.test
              </a>
            </p>
            <p className="font-prose text-white/60">
              দর্শক: <span className="tabular-nums">১,৪০,১৮৩</span>
            </p>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-ui text-white/55">
            <Link href="/contribute" className="hover:text-crimson transition-colors">
              লিখুন
            </Link>
            <Link href="/?category=golpo" className="hover:text-crimson transition-colors">
              গল্পসমূহ
            </Link>
            <Link href="/?category=kobita" className="hover:text-crimson transition-colors">
              কবিতা
            </Link>
            <Link href="/?category=uponyas" className="hover:text-crimson transition-colors">
              উপন্যাস
            </Link>
          </div>
        </div>
      </div>

      {/* Red copyright bar */}
      <div className="bg-crimson text-white text-center py-3 px-4 text-[13px] sm:text-sm font-ui">
        © ২০২৬ অল্প স্বল্প গল্প। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
