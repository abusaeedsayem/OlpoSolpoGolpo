import Link from 'next/link';

/**
 * Placeholder promo card in the lead column (mirrors the publisher banner on
 * the reference site) — points readers at the contribute page.
 */
export function PromoCard() {
  return (
    <div className="mt-6 rounded-2xl overflow-hidden bg-crimson text-white p-6 text-center shadow-[0_1px_3px_rgba(0,0,0,0.12)]">
      <p className="font-prose text-2xl leading-snug">আপনার গল্প, আপনার কণ্ঠ</p>
      <p className="mt-2 font-ui text-sm text-white/80 leading-relaxed">
        অল্প স্বল্প গল্পে লেখা প্রকাশ করুন — সম্পাদনা দল পর্যালোচনা করে শীঘ্রই
        প্রকাশ করবে।
      </p>
      <Link
        href="/contribute"
        className="mt-4 inline-block bg-white text-crimson font-ui text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/90 transition-colors"
      >
        লেখা পাঠান →
      </Link>
    </div>
  );
}
