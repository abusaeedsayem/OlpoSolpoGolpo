export function button(_props: { 
  variant?: 'default' | 'primary' | 'secondary' | 'link'; 
  asChild?: boolean; 
  children?: React.ReactNode 
}) {
  const variant = _props.variant || 'default';
  const { asChild, children, ...rest } = _props;
  
  const baseClasses = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    primary: 'bg-crimson text-white hover:bg-crimson/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    link: 'underline underline-offset-2 text-crimson hover:text-crimson/90',
  };
  
  const classes = ` ${baseClasses} ${variantClasses[variant] || variantClasses.default}`;
  
  if (asChild && typeof children === 'string') {
    return <span className={classes}>{children}</span>;
  }
  
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}