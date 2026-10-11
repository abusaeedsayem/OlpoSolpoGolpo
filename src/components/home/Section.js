import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/cn';
/** A titled column inside a homepage band. */
export function Section({ title, children, className }) {
    return (_jsxs("section", { className: cn('min-w-0', className), children: [_jsx("h2", { className: "section-heading", children: title }), children] }));
}
