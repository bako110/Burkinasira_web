import { type InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

import inputStyles from './Input.module.css';
import styles from './PasswordInput.module.css';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showLabel?: string;
  hideLabel?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, className, showLabel = 'Afficher le mot de passe', hideLabel = 'Masquer le mot de passe', ...props }, ref) => {
    const inputId = id ?? props.name;
    const [visible, setVisible] = useState(false);

    return (
      <div className={inputStyles.field}>
        {label && (
          <label htmlFor={inputId} className={inputStyles.label}>
            {label}
          </label>
        )}
        <div className={styles.wrap}>
          <input
            ref={ref}
            id={inputId}
            type={visible ? 'text' : 'password'}
            className={clsx(inputStyles.input, styles.input, error && inputStyles.inputError, className)}
            aria-invalid={Boolean(error)}
            {...props}
          />
          <button
            type="button"
            className={styles.toggle}
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? hideLabel : showLabel}
            tabIndex={-1}
          >
            {visible ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
          </button>
        </div>
        {error && <span className={inputStyles.error}>{error}</span>}
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';
