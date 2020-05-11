import React, { ChangeEvent } from 'react';
import classNames from 'classnames';
import styles from './input.module.css';

type InputProps = {
  name?: string;
  error?: boolean;
  placeholder?: string;
  value?: string;
} & (
  | { type?: 'text' | 'password'; onChange?(value: string): void }
  | { type: 'file'; onChange?(value?: File): void }
);

export const Input = (props: InputProps) => {
  const { type, error, name, placeholder, value } = props;
  const change = React.useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (props.type === 'file') {
        const file = e.target.files?.[0];
        props.onChange?.(file);
        return;
      }
      const value = e.currentTarget.value;
      props.onChange?.(value);
    },
    [props.onChange, props.type],
  );
  return (
    <input
      name={name}
      type={type || 'text'}
      onChange={change}
      className={classNames(styles.input, { [styles.errored]: error })}
      placeholder={placeholder}
      value={value}
    />
  );
};
