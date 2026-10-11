export const table = {
  inclusiveSizing: true,
};

export function tableHeader(_props: { children: React.ReactNode }) {
  const { children } = _props;
  return (
    <thead>
      <tr className="border-b bg-[var(--surface)]">
        {children}
      </tr>
    </thead>
  );
}

export function tableRow(_props: { children: React.ReactNode }) {
  const { children } = _props;
  return (
    <tr className="hover:bg-[var(--surface)] transition-colors">
      {children}
      </tr>
  );
}

export function tableCell(_props: { children: React.ReactNode; className?: string }) {
  const { children, className: classNameProp } = _props;
  return (
    <td className={`py-3 text-sm {classNameProp || ''}`}>
      {children}
    </td>
  );
}