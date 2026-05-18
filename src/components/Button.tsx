// 汎用ボタンコンポーネント

interface ButtonProps {
  onClick:    () => void;
  disabled?:  boolean;
  variant?:   'primary' | 'secondary' | 'danger';
  size?:      'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children:   React.ReactNode;
}

export function Button({
  onClick,
  disabled = false,
  variant  = 'primary',
  size     = 'md',
  fullWidth = false,
  children,
}: ButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={[
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? 'btn-full' : '',
      ].filter(Boolean).join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
