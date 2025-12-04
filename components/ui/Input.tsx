import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import styles from './Input.module.css';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className={styles.container}>
                {label && (
                    <label className={styles.label}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        styles.input,
                        error && styles.inputError,
                        className
                    )}
                    {...props}
                />
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
