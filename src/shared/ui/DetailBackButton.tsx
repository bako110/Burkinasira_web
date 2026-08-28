import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import styles from './DetailBackButton.module.css';

interface DetailBackButtonProps {
  fallbackTo: string;
  className?: string;
  iconSize?: number;
  children?: React.ReactNode;
  variant?: 'icon' | 'link';
}

export function DetailBackButton({
  fallbackTo,
  className,
  iconSize = 18,
  children,
  variant = 'icon',
}: DetailBackButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackTo);
    }
  }

  return (
    <button
      type="button"
      className={clsx(variant === 'link' && styles.link, className)}
      onClick={handleClick}
    >
      <ArrowLeft size={iconSize} strokeWidth={2} />
      {children}
    </button>
  );
}
