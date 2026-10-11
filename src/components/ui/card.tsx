export function card(_props: { className?: string; children?: React.ReactNode }) {
  const { className, children } = _props;
  return (
    <div className={`rounded-xl bg-[var(--surface)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${className || ''}`}>
      {children}
    </div>
  );
}