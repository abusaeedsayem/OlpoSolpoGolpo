var _a;
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Hind_Siliguri, Noto_Serif_Bengali } from 'next/font/google';
import './globals.css';
import { Masthead } from '@/components/masthead/Masthead';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
// ─── Font Loading ─────────────────────────────────────────────────────────────
const hindSiliguri = Hind_Siliguri({
    subsets: ['bengali', 'latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-hind-siliguri',
    display: 'swap',
    preload: true,
});
const notoSerifBengali = Noto_Serif_Bengali({
    subsets: ['bengali'],
    weight: ['400', '500', '700'],
    variable: '--font-noto-serif-bengali',
    display: 'swap',
    preload: true,
});
// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata = {
    title: {
        default: 'অল্প স্বল্প গল্প | বাংলা সাহিত্য পত্রিকা',
        template: '%s | অল্প স্বল্প গল্প',
    },
    description: 'অল্প স্বল্প গল্প — বাংলা ছোট গল্প, কবিতা, উপন্যাস, ধারাবাহিক ও মুক্ত গদ্যের অনলাইন পত্রিকা। পরতে পরশে বাঙালিয়ানা।',
    keywords: ['বাংলা গল্প', 'Bengali literature', 'Bengali poetry', 'বাংলা কবিতা', 'অল্প স্বল্প গল্প'],
    authors: [{ name: 'অল্প স্বল্প গল্প সম্পাদনা দল' }],
    openGraph: {
        type: 'website',
        locale: 'bn_BD',
        siteName: 'অল্প স্বল্প গল্প',
    },
    metadataBase: new URL((_a = process.env.NEXT_PUBLIC_SITE_URL) !== null && _a !== void 0 ? _a : 'http://localhost:3000'),
};
// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "bn", "data-scroll-behavior": "smooth", className: `${hindSiliguri.variable} ${notoSerifBengali.variable}`, suppressHydrationWarning: true, children: _jsx("body", { className: "min-h-screen antialiased", suppressHydrationWarning: true, children: _jsxs(ThemeProvider, { children: [_jsx("a", { href: "#main", className: "skip-link", children: "\u09AE\u09C2\u09B2 \u0995\u09A8\u099F\u09C7\u09A8\u09CD\u099F\u09C7 \u09AF\u09BE\u09A8" }), _jsx(Masthead, {}), _jsx("main", { id: "main", children: children }), _jsx(Footer, {})] }) }) }));
}
