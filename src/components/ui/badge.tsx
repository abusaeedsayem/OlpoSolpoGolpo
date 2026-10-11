export function badge(_props: { variant?: 'default' | 'secondary' | 'destructive'; children?: React.ReactNode }) {
  const variant = _props.variant || 'default';
  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium
        ${variant === 'secondary'
          ? 'border-crimson text-crimson bg-crimson/5'
          : variant === 'destructive'
          ? 'border-destructive text-destructive bg-destructive/5'
          : 'border-default text-default bg-default/5'}
      `}
    >
      {_props.children}
    </span>
  );
}